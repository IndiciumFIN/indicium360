from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
from src.services.dre import DREService
import json
from decimal import Decimal

class DVAService:
    
    @staticmethod
    def gerar_dva(periodo, versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera a Demonstração do Valor Adicionado (DVA) para um período específico
        """
        try:
            # Obter dados da DRE para base de cálculo
            dre_resultado = DREService.gerar_dre(periodo, versao_balancete, versao_plano_contas)
            if not dre_resultado['success']:
                return {
                    'success': False,
                    'message': f'Erro ao obter DRE para DVA: {dre_resultado["message"]}'
                }
            
            # 1. GERAÇÃO DO VALOR ADICIONADO
            receitas = DVAService._obter_receitas_dva(periodo, versao_balancete, versao_plano_contas)
            insumos_adquiridos = DVAService._obter_insumos_adquiridos(periodo, versao_balancete, versao_plano_contas)
            valor_adicionado_bruto = receitas['total'] - insumos_adquiridos['total']
            
            # Depreciação, amortização e exaustão
            depreciacoes = DVAService._obter_depreciacoes(periodo, versao_balancete, versao_plano_contas)
            valor_adicionado_liquido = valor_adicionado_bruto - depreciacoes['total']
            
            # Valor adicionado recebido em transferência
            transferencias = DVAService._obter_transferencias_recebidas(periodo, versao_balancete, versao_plano_contas)
            valor_adicionado_total = valor_adicionado_liquido + transferencias['total']
            
            # 2. DISTRIBUIÇÃO DO VALOR ADICIONADO
            distribuicao = DVAService._calcular_distribuicao_valor_adicionado(
                periodo, versao_balancete, versao_plano_contas, dre_resultado['data']
            )
            
            # Verificar se a distribuição está balanceada
            total_distribuido = sum(item['valor'] for item in distribuicao.values())
            diferenca = abs(valor_adicionado_total - total_distribuido)
            
            # Estruturar dados da DVA
            dva_data = {
                'periodo': periodo,
                'geracao_valor_adicionado': {
                    'receitas': receitas,
                    'insumos_adquiridos': insumos_adquiridos,
                    'valor_adicionado_bruto': valor_adicionado_bruto,
                    'depreciacoes': depreciacoes,
                    'valor_adicionado_liquido': valor_adicionado_liquido,
                    'transferencias': transferencias,
                    'valor_adicionado_total': valor_adicionado_total
                },
                'distribuicao_valor_adicionado': distribuicao,
                'total_distribuido': total_distribuido,
                'diferenca_balanceamento': diferenca,
                'balanceado': diferenca < 0.01,
                'estrutura_dva': DVAService._estruturar_dva_completa(
                    receitas, insumos_adquiridos, valor_adicionado_bruto,
                    depreciacoes, valor_adicionado_liquido, transferencias,
                    valor_adicionado_total, distribuicao
                )
            }
            
            # Salvar demonstração no banco
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('DVA', periodo, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(dva_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='DVA',
                    periodo=periodo,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(dva_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': dva_data,
                'message': 'DVA gerada com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar DVA: {str(e)}'
            }
    
    @staticmethod
    def _obter_receitas_dva(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém as receitas para a DVA (vendas de mercadorias, produtos e serviços)
        """
        receitas = []
        total_receitas = 0
        
        # Buscar contas de receita
        contas_receita = PlanoContas.get_contas_por_elemento('receita', versao_plano_contas)
        
        for conta in contas_receita:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            saldo_abs = abs(saldo)  # Receitas normalmente têm saldo credor
            
            if saldo_abs > 0.01:
                tipo_receita = DVAService._classificar_receita_dva(conta.nome)
                receitas.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': saldo_abs,
                    'tipo': tipo_receita
                })
                total_receitas += saldo_abs
        
        return {
            'itens': receitas,
            'total': total_receitas
        }
    
    @staticmethod
    def _obter_insumos_adquiridos(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém os insumos adquiridos de terceiros (custos e algumas despesas)
        """
        insumos = []
        total_insumos = 0
        
        # Buscar contas de custo
        contas_custo = PlanoContas.get_contas_por_elemento('custo', versao_plano_contas)
        
        for conta in contas_custo:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            
            if abs(saldo) > 0.01:
                insumos.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': abs(saldo),
                    'tipo': 'custo'
                })
                total_insumos += abs(saldo)
        
        # Buscar algumas despesas que são insumos (materiais, energia, etc.)
        contas_despesa = PlanoContas.get_contas_por_elemento('despesa', versao_plano_contas)
        
        for conta in contas_despesa:
            if DVAService._eh_insumo_terceiros(conta.nome):
                saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
                
                if abs(saldo) > 0.01:
                    insumos.append({
                        'codigo': conta.codigo,
                        'descricao': conta.nome,
                        'valor': abs(saldo),
                        'tipo': 'insumo'
                    })
                    total_insumos += abs(saldo)
        
        return {
            'itens': insumos,
            'total': total_insumos
        }
    
    @staticmethod
    def _obter_depreciacoes(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém depreciação, amortização e exaustão
        """
        depreciacoes = []
        total_depreciacoes = 0
        
        termos_busca = ['depreciação', 'amortização', 'exaustão']
        
        for termo in termos_busca:
            contas = PlanoContas.query.filter(
                PlanoContas.versao == versao_plano_contas,
                PlanoContas.ativo == True,
                PlanoContas.nome.ilike(f'%{termo}%')
            ).all()
            
            for conta in contas:
                saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
                
                if abs(saldo) > 0.01:
                    depreciacoes.append({
                        'codigo': conta.codigo,
                        'descricao': conta.nome,
                        'valor': abs(saldo),
                        'tipo': termo
                    })
                    total_depreciacoes += abs(saldo)
        
        return {
            'itens': depreciacoes,
            'total': total_depreciacoes
        }
    
    @staticmethod
    def _obter_transferencias_recebidas(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém valor adicionado recebido em transferência (receitas financeiras, etc.)
        """
        transferencias = []
        total_transferencias = 0
        
        # Buscar receitas financeiras
        contas_financeiras = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'receita',
            PlanoContas.nome.ilike('%financeira%')
        ).all()
        
        for conta in contas_financeiras:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            saldo_abs = abs(saldo)
            
            if saldo_abs > 0.01:
                transferencias.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': saldo_abs,
                    'tipo': 'receita_financeira'
                })
                total_transferencias += saldo_abs
        
        return {
            'itens': transferencias,
            'total': total_transferencias
        }
    
    @staticmethod
    def _calcular_distribuicao_valor_adicionado(periodo, versao_balancete, versao_plano_contas, dados_dre):
        """
        Calcula a distribuição do valor adicionado
        """
        distribuicao = {
            'pessoal': {'valor': 0, 'itens': []},
            'impostos': {'valor': 0, 'itens': []},
            'remuneracao_capital_terceiros': {'valor': 0, 'itens': []},
            'remuneracao_capital_proprio': {'valor': 0, 'itens': []}
        }
        
        # 1. Pessoal (salários, encargos, benefícios)
        contas_pessoal = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'despesa',
            PlanoContas.nome.ilike('%salário%') | 
            PlanoContas.nome.ilike('%encargo%') |
            PlanoContas.nome.ilike('%benefício%') |
            PlanoContas.nome.ilike('%férias%') |
            PlanoContas.nome.ilike('%13º%')
        ).all()
        
        for conta in contas_pessoal:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            if abs(saldo) > 0.01:
                distribuicao['pessoal']['itens'].append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': abs(saldo)
                })
                distribuicao['pessoal']['valor'] += abs(saldo)
        
        # 2. Impostos, taxas e contribuições
        contas_impostos = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'despesa',
            PlanoContas.nome.ilike('%imposto%') |
            PlanoContas.nome.ilike('%taxa%') |
            PlanoContas.nome.ilike('%contribuição%') |
            PlanoContas.nome.ilike('%tributo%')
        ).all()
        
        for conta in contas_impostos:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            if abs(saldo) > 0.01:
                distribuicao['impostos']['itens'].append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': abs(saldo)
                })
                distribuicao['impostos']['valor'] += abs(saldo)
        
        # 3. Remuneração de capital de terceiros (juros, aluguéis)
        contas_terceiros = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'despesa',
            PlanoContas.nome.ilike('%juro%') |
            PlanoContas.nome.ilike('%aluguel%') |
            PlanoContas.nome.ilike('%financeira%')
        ).all()
        
        for conta in contas_terceiros:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            if abs(saldo) > 0.01:
                distribuicao['remuneracao_capital_terceiros']['itens'].append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': abs(saldo)
                })
                distribuicao['remuneracao_capital_terceiros']['valor'] += abs(saldo)
        
        # 4. Remuneração de capital próprio (lucros retidos, dividendos)
        lucro_liquido = dados_dre['indicadores']['lucro_liquido']
        if lucro_liquido > 0:
            distribuicao['remuneracao_capital_proprio']['itens'].append({
                'codigo': 'LUCRO',
                'descricao': 'Lucros Retidos / Prejuízo do Exercício',
                'valor': lucro_liquido
            })
            distribuicao['remuneracao_capital_proprio']['valor'] = lucro_liquido
        
        return distribuicao
    
    @staticmethod
    def _classificar_receita_dva(nome_conta):
        """
        Classifica o tipo de receita para a DVA
        """
        nome_lower = nome_conta.lower()
        
        if 'venda' in nome_lower or 'produto' in nome_lower:
            return 'venda_produtos'
        elif 'serviço' in nome_lower:
            return 'prestacao_servicos'
        elif 'mercadoria' in nome_lower:
            return 'venda_mercadorias'
        else:
            return 'outras_receitas'
    
    @staticmethod
    def _eh_insumo_terceiros(nome_conta):
        """
        Verifica se uma conta de despesa representa insumo adquirido de terceiros
        """
        nome_lower = nome_conta.lower()
        
        insumos_terceiros = [
            'material', 'energia', 'telefone', 'água', 'combustível',
            'manutenção', 'terceirizado', 'consultoria', 'auditoria'
        ]
        
        return any(termo in nome_lower for termo in insumos_terceiros)
    
    @staticmethod
    def _estruturar_dva_completa(receitas, insumos_adquiridos, valor_adicionado_bruto,
                                depreciacoes, valor_adicionado_liquido, transferencias,
                                valor_adicionado_total, distribuicao):
        """
        Estrutura a DVA no formato padrão
        """
        linhas = [
            # GERAÇÃO DO VALOR ADICIONADO
            {
                'tipo': 'titulo_principal',
                'descricao': '1 - GERAÇÃO DO VALOR ADICIONADO',
                'valor': None,
                'nivel': 1
            },
            {
                'tipo': 'titulo_secao',
                'descricao': '1.1) Receitas',
                'valor': receitas['total'],
                'nivel': 2
            }
        ]
        
        # Adicionar itens de receitas
        for item in receitas['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        linhas.extend([
            {
                'tipo': 'titulo_secao',
                'descricao': '1.2) Insumos adquiridos de terceiros',
                'valor': -insumos_adquiridos['total'],
                'nivel': 2
            }
        ])
        
        # Adicionar itens de insumos
        for item in insumos_adquiridos['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': -item['valor'],
                'nivel': 3
            })
        
        linhas.extend([
            {
                'tipo': 'subtotal',
                'descricao': '1.3) Valor adicionado bruto',
                'valor': valor_adicionado_bruto,
                'nivel': 2
            },
            {
                'tipo': 'titulo_secao',
                'descricao': '1.4) Depreciação, amortização e exaustão',
                'valor': -depreciacoes['total'],
                'nivel': 2
            }
        ])
        
        # Adicionar itens de depreciação
        for item in depreciacoes['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': -item['valor'],
                'nivel': 3
            })
        
        linhas.extend([
            {
                'tipo': 'subtotal',
                'descricao': '1.5) Valor adicionado líquido produzido',
                'valor': valor_adicionado_liquido,
                'nivel': 2
            },
            {
                'tipo': 'titulo_secao',
                'descricao': '1.6) Valor adicionado recebido em transferência',
                'valor': transferencias['total'],
                'nivel': 2
            }
        ])
        
        # Adicionar itens de transferências
        for item in transferencias['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        linhas.extend([
            {
                'tipo': 'total_principal',
                'descricao': '1.7) VALOR ADICIONADO TOTAL A DISTRIBUIR',
                'valor': valor_adicionado_total,
                'nivel': 1
            },
            # DISTRIBUIÇÃO DO VALOR ADICIONADO
            {
                'tipo': 'titulo_principal',
                'descricao': '2 - DISTRIBUIÇÃO DO VALOR ADICIONADO',
                'valor': valor_adicionado_total,
                'nivel': 1
            },
            {
                'tipo': 'titulo_secao',
                'descricao': '2.1) Pessoal',
                'valor': distribuicao['pessoal']['valor'],
                'nivel': 2
            }
        ])
        
        # Adicionar itens de pessoal
        for item in distribuicao['pessoal']['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        linhas.append({
            'tipo': 'titulo_secao',
            'descricao': '2.2) Impostos, taxas e contribuições',
            'valor': distribuicao['impostos']['valor'],
            'nivel': 2
        })
        
        # Adicionar itens de impostos
        for item in distribuicao['impostos']['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        linhas.append({
            'tipo': 'titulo_secao',
            'descricao': '2.3) Remuneração de capital de terceiros',
            'valor': distribuicao['remuneracao_capital_terceiros']['valor'],
            'nivel': 2
        })
        
        # Adicionar itens de capital de terceiros
        for item in distribuicao['remuneracao_capital_terceiros']['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        linhas.append({
            'tipo': 'titulo_secao',
            'descricao': '2.4) Remuneração de capital próprio',
            'valor': distribuicao['remuneracao_capital_proprio']['valor'],
            'nivel': 2
        })
        
        # Adicionar itens de capital próprio
        for item in distribuicao['remuneracao_capital_proprio']['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 3
            })
        
        return {'linhas': linhas}
    
    @staticmethod
    def obter_dva(periodo, versao_balancete='1.0'):
        """
        Obtém a DVA já gerada para um período
        """
        demonstracao = DemonstracaoFinanceira.get_demonstracao('DVA', periodo, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'DVA não encontrada para o período especificado'
            }

