from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
from src.services.dre import DREService
import json
from decimal import Decimal

class DFCService:
    
    @staticmethod
    def gerar_dfc(periodo_inicial, periodo_final, metodo='indireto', versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera a Demonstração do Fluxo de Caixa (DFC) pelo método indireto ou direto
        """
        try:
            if metodo == 'indireto':
                resultado = DFCService._gerar_dfc_indireto(
                    periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
                )
            else:
                resultado = DFCService._gerar_dfc_direto(
                    periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
                )
            
            if not resultado['success']:
                return resultado
            
            dfc_data = resultado['data']
            
            # Salvar demonstração no banco
            periodo_chave = f"{periodo_inicial}_{periodo_final}"
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('DFC', periodo_chave, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(dfc_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='DFC',
                    periodo=periodo_chave,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(dfc_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': dfc_data,
                'message': 'DFC gerada com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar DFC: {str(e)}'
            }
    
    @staticmethod
    def _gerar_dfc_indireto(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Gera DFC pelo método indireto (partindo do lucro líquido)
        """
        try:
            # Obter lucro líquido da DRE
            dre_resultado = DREService.gerar_dre(periodo_final, versao_balancete, versao_plano_contas)
            if not dre_resultado['success']:
                return {
                    'success': False,
                    'message': f'Erro ao obter DRE para DFC: {dre_resultado["message"]}'
                }
            
            lucro_liquido = dre_resultado['data']['indicadores']['lucro_liquido']
            
            # Calcular ajustes ao lucro líquido
            ajustes = DFCService._calcular_ajustes_lucro_liquido(
                periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
            )
            
            # Calcular variações no capital de giro
            variacoes_capital_giro = DFCService._calcular_variacoes_capital_giro(
                periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
            )
            
            # Calcular fluxo de caixa operacional
            fluxo_operacional = lucro_liquido + sum(ajuste['valor'] for ajuste in ajustes) + variacoes_capital_giro['total']
            
            # Calcular fluxo de caixa de investimento
            fluxo_investimento = DFCService._calcular_fluxo_investimento(
                periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
            )
            
            # Calcular fluxo de caixa de financiamento
            fluxo_financiamento = DFCService._calcular_fluxo_financiamento(
                periodo_inicial, periodo_final, versao_balancete, versao_plano_contas
            )
            
            # Calcular variação líquida de caixa
            variacao_caixa = fluxo_operacional + fluxo_investimento['total'] + fluxo_financiamento['total']
            
            # Obter saldos de caixa
            saldo_inicial_caixa = DFCService._obter_saldo_caixa(periodo_inicial, versao_balancete, versao_plano_contas)
            saldo_final_caixa = DFCService._obter_saldo_caixa(periodo_final, versao_balancete, versao_plano_contas)
            
            dfc_data = {
                'metodo': 'indireto',
                'periodo_inicial': periodo_inicial,
                'periodo_final': periodo_final,
                'fluxo_operacional': {
                    'lucro_liquido': lucro_liquido,
                    'ajustes': ajustes,
                    'variacoes_capital_giro': variacoes_capital_giro,
                    'total': fluxo_operacional
                },
                'fluxo_investimento': fluxo_investimento,
                'fluxo_financiamento': fluxo_financiamento,
                'variacao_caixa': variacao_caixa,
                'saldo_inicial_caixa': saldo_inicial_caixa,
                'saldo_final_caixa': saldo_final_caixa,
                'estrutura_dfc': DFCService._estruturar_dfc_indireto(
                    lucro_liquido, ajustes, variacoes_capital_giro, fluxo_operacional,
                    fluxo_investimento, fluxo_financiamento, variacao_caixa,
                    saldo_inicial_caixa, saldo_final_caixa
                )
            }
            
            return {'success': True, 'data': dfc_data}
            
        except Exception as e:
            return {'success': False, 'message': f'Erro no método indireto: {str(e)}'}
    
    @staticmethod
    def _calcular_ajustes_lucro_liquido(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Calcula ajustes ao lucro líquido para itens que não afetam o caixa
        """
        ajustes = []
        
        # Buscar contas de depreciação, amortização e exaustão
        contas_deprec = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.nome.ilike('%depreciação%')
        ).all()
        
        for conta in contas_deprec:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
            if abs(saldo) > 0.01:
                ajustes.append({
                    'codigo': conta.codigo,
                    'descricao': f'Depreciação - {conta.nome}',
                    'valor': abs(saldo),  # Depreciação é somada de volta
                    'tipo': 'depreciacao'
                })
        
        # Buscar outras contas que não afetam o caixa
        contas_nao_caixa = ['amortização', 'exaustão', 'provisão']
        for termo in contas_nao_caixa:
            contas = PlanoContas.query.filter(
                PlanoContas.versao == versao_plano_contas,
                PlanoContas.ativo == True,
                PlanoContas.nome.ilike(f'%{termo}%')
            ).all()
            
            for conta in contas:
                saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
                if abs(saldo) > 0.01:
                    ajustes.append({
                        'codigo': conta.codigo,
                        'descricao': f'{termo.title()} - {conta.nome}',
                        'valor': abs(saldo),
                        'tipo': termo
                    })
        
        return ajustes
    
    @staticmethod
    def _calcular_variacoes_capital_giro(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Calcula as variações no capital de giro circulante
        """
        # Contas do ativo circulante (exceto caixa)
        contas_ac = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'ativo',
            PlanoContas.nome.ilike('%circulante%'),
            ~PlanoContas.nome.ilike('%caixa%'),
            ~PlanoContas.nome.ilike('%banco%')
        ).all()
        
        variacao_ac = 0
        for conta in contas_ac:
            saldo_inicial = Balancete.get_saldo_por_conta(conta.codigo, periodo_inicial, versao_balancete)
            saldo_final = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
            variacao = saldo_final - saldo_inicial
            variacao_ac += variacao
        
        # Contas do passivo circulante
        contas_pc = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'passivo',
            PlanoContas.nome.ilike('%circulante%')
        ).all()
        
        variacao_pc = 0
        for conta in contas_pc:
            saldo_inicial = Balancete.get_saldo_por_conta(conta.codigo, periodo_inicial, versao_balancete)
            saldo_final = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
            variacao = saldo_final - saldo_inicial
            variacao_pc += variacao
        
        # Variação líquida do capital de giro (diminuição do AC ou aumento do PC gera caixa)
        variacao_liquida = -variacao_ac + variacao_pc
        
        return {
            'variacao_ativo_circulante': -variacao_ac,
            'variacao_passivo_circulante': variacao_pc,
            'total': variacao_liquida
        }
    
    @staticmethod
    def _calcular_fluxo_investimento(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Calcula o fluxo de caixa das atividades de investimento
        """
        investimentos = []
        
        # Buscar contas do ativo não circulante
        contas_anc = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta == 'ativo',
            PlanoContas.nome.ilike('%não circulante%')
        ).all()
        
        total_investimento = 0
        for conta in contas_anc:
            saldo_inicial = Balancete.get_saldo_por_conta(conta.codigo, periodo_inicial, versao_balancete)
            saldo_final = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
            variacao = saldo_final - saldo_inicial
            
            if abs(variacao) > 0.01:
                investimentos.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': -variacao,  # Aumento do ativo = saída de caixa
                    'tipo': 'investimento'
                })
                total_investimento += -variacao
        
        return {
            'itens': investimentos,
            'total': total_investimento
        }
    
    @staticmethod
    def _calcular_fluxo_financiamento(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Calcula o fluxo de caixa das atividades de financiamento
        """
        financiamentos = []
        
        # Buscar contas do passivo não circulante e patrimônio líquido
        contas_financ = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.elemento_conta.in_(['passivo', 'patrimonio_liquido'])
        ).all()
        
        total_financiamento = 0
        for conta in contas_financ:
            saldo_inicial = Balancete.get_saldo_por_conta(conta.codigo, periodo_inicial, versao_balancete)
            saldo_final = Balancete.get_saldo_por_conta(conta.codigo, periodo_final, versao_balancete)
            variacao = saldo_final - saldo_inicial
            
            if abs(variacao) > 0.01:
                # Classificar tipo de financiamento
                tipo_financ = DFCService._classificar_financiamento(conta.nome)
                
                financiamentos.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': variacao,  # Aumento do passivo/PL = entrada de caixa
                    'tipo': tipo_financ
                })
                total_financiamento += variacao
        
        return {
            'itens': financiamentos,
            'total': total_financiamento
        }
    
    @staticmethod
    def _classificar_financiamento(nome_conta):
        """
        Classifica o tipo de financiamento baseado no nome da conta
        """
        nome_lower = nome_conta.lower()
        
        if 'empréstimo' in nome_lower or 'financiamento' in nome_lower:
            return 'emprestimo'
        elif 'capital' in nome_lower:
            return 'capital'
        elif 'dividendo' in nome_lower:
            return 'dividendo'
        else:
            return 'outros'
    
    @staticmethod
    def _obter_saldo_caixa(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém o saldo de caixa e equivalentes para um período
        """
        contas_caixa = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.nome.ilike('%caixa%') | PlanoContas.nome.ilike('%banco%')
        ).all()
        
        total_caixa = 0
        for conta in contas_caixa:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            total_caixa += saldo
        
        return total_caixa
    
    @staticmethod
    def _estruturar_dfc_indireto(lucro_liquido, ajustes, variacoes_capital_giro, fluxo_operacional,
                                fluxo_investimento, fluxo_financiamento, variacao_caixa,
                                saldo_inicial_caixa, saldo_final_caixa):
        """
        Estrutura a DFC pelo método indireto
        """
        linhas = [
            {
                'tipo': 'titulo_secao',
                'descricao': 'FLUXO DE CAIXA DAS ATIVIDADES OPERACIONAIS',
                'valor': None,
                'nivel': 1
            },
            {
                'tipo': 'item',
                'descricao': 'Lucro Líquido do Exercício',
                'valor': lucro_liquido,
                'nivel': 2
            }
        ]
        
        # Adicionar ajustes
        if ajustes:
            linhas.append({
                'tipo': 'subtitulo',
                'descricao': 'Ajustes por itens que não afetam o caixa:',
                'valor': None,
                'nivel': 2
            })
            
            for ajuste in ajustes:
                linhas.append({
                    'tipo': 'item',
                    'descricao': ajuste['descricao'],
                    'valor': ajuste['valor'],
                    'nivel': 3
                })
        
        # Adicionar variações do capital de giro
        linhas.extend([
            {
                'tipo': 'subtitulo',
                'descricao': 'Variações nos ativos e passivos operacionais:',
                'valor': None,
                'nivel': 2
            },
            {
                'tipo': 'item',
                'descricao': 'Variação no Ativo Circulante',
                'valor': variacoes_capital_giro['variacao_ativo_circulante'],
                'nivel': 3
            },
            {
                'tipo': 'item',
                'descricao': 'Variação no Passivo Circulante',
                'valor': variacoes_capital_giro['variacao_passivo_circulante'],
                'nivel': 3
            },
            {
                'tipo': 'total_secao',
                'descricao': 'Caixa Líquido das Atividades Operacionais',
                'valor': fluxo_operacional,
                'nivel': 1
            }
        ])
        
        # Seção de investimentos
        linhas.append({
            'tipo': 'titulo_secao',
            'descricao': 'FLUXO DE CAIXA DAS ATIVIDADES DE INVESTIMENTO',
            'valor': None,
            'nivel': 1
        })
        
        for item in fluxo_investimento['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 2
            })
        
        linhas.append({
            'tipo': 'total_secao',
            'descricao': 'Caixa Líquido das Atividades de Investimento',
            'valor': fluxo_investimento['total'],
            'nivel': 1
        })
        
        # Seção de financiamentos
        linhas.append({
            'tipo': 'titulo_secao',
            'descricao': 'FLUXO DE CAIXA DAS ATIVIDADES DE FINANCIAMENTO',
            'valor': None,
            'nivel': 1
        })
        
        for item in fluxo_financiamento['itens']:
            linhas.append({
                'tipo': 'item',
                'descricao': item['descricao'],
                'valor': item['valor'],
                'nivel': 2
            })
        
        linhas.extend([
            {
                'tipo': 'total_secao',
                'descricao': 'Caixa Líquido das Atividades de Financiamento',
                'valor': fluxo_financiamento['total'],
                'nivel': 1
            },
            {
                'tipo': 'resultado',
                'descricao': 'VARIAÇÃO LÍQUIDA DE CAIXA E EQUIVALENTES',
                'valor': variacao_caixa,
                'nivel': 1
            },
            {
                'tipo': 'saldo',
                'descricao': 'Saldo Inicial de Caixa e Equivalentes',
                'valor': saldo_inicial_caixa,
                'nivel': 1
            },
            {
                'tipo': 'saldo',
                'descricao': 'Saldo Final de Caixa e Equivalentes',
                'valor': saldo_final_caixa,
                'nivel': 1
            }
        ])
        
        return {'linhas': linhas}
    
    @staticmethod
    def _gerar_dfc_direto(periodo_inicial, periodo_final, versao_balancete, versao_plano_contas):
        """
        Gera DFC pelo método direto (recebimentos e pagamentos)
        Implementação simplificada - pode ser expandida conforme necessário
        """
        return {
            'success': False,
            'message': 'Método direto ainda não implementado. Use o método indireto.'
        }
    
    @staticmethod
    def obter_dfc(periodo_inicial, periodo_final, versao_balancete='1.0'):
        """
        Obtém a DFC já gerada para um período
        """
        periodo_chave = f"{periodo_inicial}_{periodo_final}"
        demonstracao = DemonstracaoFinanceira.get_demonstracao('DFC', periodo_chave, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'DFC não encontrada para o período especificado'
            }

