from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
import json
from decimal import Decimal

class DREService:
    
    @staticmethod
    def gerar_dre(periodo, versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera a Demonstração do Resultado do Exercício (DRE) para um período específico
        """
        try:
            # Obter receitas
            receitas = DREService._obter_grupo_contas('receita', periodo, versao_balancete, versao_plano_contas)
            
            # Obter custos
            custos = DREService._obter_grupo_contas('custo', periodo, versao_balancete, versao_plano_contas)
            
            # Obter despesas
            despesas = DREService._obter_grupo_contas('despesa', periodo, versao_balancete, versao_plano_contas)
            
            # Calcular totais
            total_receitas = DREService._calcular_total_grupo(receitas)
            total_custos = DREService._calcular_total_grupo(custos)
            total_despesas = DREService._calcular_total_grupo(despesas)
            
            # Calcular indicadores da DRE
            receita_bruta = total_receitas
            lucro_bruto = receita_bruta - total_custos
            lucro_operacional = lucro_bruto - total_despesas
            lucro_liquido = lucro_operacional  # Simplificado - sem impostos/participações
            
            # Estruturar dados da DRE
            dre_data = {
                'receitas': {
                    'grupos': receitas,
                    'total': float(total_receitas)
                },
                'custos': {
                    'grupos': custos,
                    'total': float(total_custos)
                },
                'despesas': {
                    'grupos': despesas,
                    'total': float(total_despesas)
                },
                'indicadores': {
                    'receita_bruta': float(receita_bruta),
                    'lucro_bruto': float(lucro_bruto),
                    'lucro_operacional': float(lucro_operacional),
                    'lucro_liquido': float(lucro_liquido)
                },
                'estrutura_dre': DREService._estruturar_dre_completa(
                    receitas, custos, despesas, 
                    receita_bruta, lucro_bruto, lucro_operacional, lucro_liquido
                )
            }
            
            # Salvar demonstração no banco
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('DRE', periodo, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(dre_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='DRE',
                    periodo=periodo,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(dre_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': dre_data,
                'message': 'DRE gerada com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar DRE: {str(e)}'
            }
    
    @staticmethod
    def _obter_grupo_contas(elemento_conta, periodo, versao_balancete, versao_plano_contas):
        """
        Obtém as contas de um elemento específico (receita, custo, despesa)
        """
        # Obter contas do plano de contas para o elemento
        contas_plano = PlanoContas.get_contas_por_elemento(elemento_conta, versao_plano_contas)
        
        # Organizar por níveis hierárquicos
        grupos = {}
        
        for conta in contas_plano:
            # Obter saldo da conta no balancete
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            
            # Para contas de resultado, considerar o valor absoluto se necessário
            # Receitas normalmente têm saldo credor (negativo no balancete)
            # Custos e despesas normalmente têm saldo devedor (positivo no balancete)
            if elemento_conta == 'receita':
                saldo = abs(saldo)  # Converter para positivo para exibição
            
            # Pular contas com saldo zero
            if abs(saldo) < 0.01:
                continue
            
            # Organizar hierarquicamente
            if conta.nivel == 1:
                if conta.codigo not in grupos:
                    grupos[conta.codigo] = {
                        'codigo': conta.codigo,
                        'nome': conta.nome,
                        'saldo': 0.0,
                        'subgrupos': {}
                    }
                grupos[conta.codigo]['saldo'] += saldo
            
            elif conta.nivel == 2 and conta.conta_pai:
                pai_codigo = conta.conta_pai.codigo
                if pai_codigo not in grupos:
                    grupos[pai_codigo] = {
                        'codigo': pai_codigo,
                        'nome': conta.conta_pai.nome,
                        'saldo': 0.0,
                        'subgrupos': {}
                    }
                
                if conta.codigo not in grupos[pai_codigo]['subgrupos']:
                    grupos[pai_codigo]['subgrupos'][conta.codigo] = {
                        'codigo': conta.codigo,
                        'nome': conta.nome,
                        'saldo': 0.0,
                        'contas': {}
                    }
                grupos[pai_codigo]['subgrupos'][conta.codigo]['saldo'] += saldo
                grupos[pai_codigo]['saldo'] += saldo
            
            # Para contas analíticas (níveis 3, 4, 5)
            elif conta.eh_analitica:
                # Encontrar o grupo pai (nível 1 ou 2)
                conta_atual = conta
                while conta_atual.conta_pai and conta_atual.conta_pai.nivel > 2:
                    conta_atual = conta_atual.conta_pai
                
                if conta_atual.conta_pai:
                    pai_nivel2 = conta_atual.conta_pai
                    if pai_nivel2.conta_pai:
                        pai_nivel1 = pai_nivel2.conta_pai
                        
                        # Garantir estrutura do grupo nível 1
                        if pai_nivel1.codigo not in grupos:
                            grupos[pai_nivel1.codigo] = {
                                'codigo': pai_nivel1.codigo,
                                'nome': pai_nivel1.nome,
                                'saldo': 0.0,
                                'subgrupos': {}
                            }
                        
                        # Garantir estrutura do subgrupo nível 2
                        if pai_nivel2.codigo not in grupos[pai_nivel1.codigo]['subgrupos']:
                            grupos[pai_nivel1.codigo]['subgrupos'][pai_nivel2.codigo] = {
                                'codigo': pai_nivel2.codigo,
                                'nome': pai_nivel2.nome,
                                'saldo': 0.0,
                                'contas': {}
                            }
                        
                        # Adicionar conta analítica
                        grupos[pai_nivel1.codigo]['subgrupos'][pai_nivel2.codigo]['contas'][conta.codigo] = {
                            'codigo': conta.codigo,
                            'nome': conta.nome,
                            'saldo': saldo
                        }
                        
                        # Atualizar saldos dos pais
                        grupos[pai_nivel1.codigo]['subgrupos'][pai_nivel2.codigo]['saldo'] += saldo
                        grupos[pai_nivel1.codigo]['saldo'] += saldo
        
        return list(grupos.values())
    
    @staticmethod
    def _calcular_total_grupo(grupos):
        """
        Calcula o total de um grupo de contas
        """
        total = Decimal('0.00')
        for grupo in grupos:
            total += Decimal(str(grupo['saldo']))
        return total
    
    @staticmethod
    def _estruturar_dre_completa(receitas, custos, despesas, receita_bruta, lucro_bruto, lucro_operacional, lucro_liquido):
        """
        Estrutura a DRE no formato tradicional
        """
        return {
            'linhas': [
                {
                    'tipo': 'titulo',
                    'descricao': 'RECEITA BRUTA',
                    'valor': float(receita_bruta),
                    'nivel': 1
                },
                {
                    'tipo': 'grupo',
                    'descricao': 'Receitas de Vendas',
                    'grupos': receitas,
                    'nivel': 2
                },
                {
                    'tipo': 'subtotal',
                    'descricao': '(-) CUSTOS DOS PRODUTOS/SERVIÇOS VENDIDOS',
                    'valor': float(-custos[0]['saldo']) if custos else 0.0,
                    'nivel': 1
                },
                {
                    'tipo': 'grupo',
                    'descricao': 'Custos',
                    'grupos': custos,
                    'nivel': 2
                },
                {
                    'tipo': 'resultado',
                    'descricao': 'LUCRO BRUTO',
                    'valor': float(lucro_bruto),
                    'nivel': 1
                },
                {
                    'tipo': 'subtotal',
                    'descricao': '(-) DESPESAS OPERACIONAIS',
                    'valor': float(-sum(grupo['saldo'] for grupo in despesas)),
                    'nivel': 1
                },
                {
                    'tipo': 'grupo',
                    'descricao': 'Despesas',
                    'grupos': despesas,
                    'nivel': 2
                },
                {
                    'tipo': 'resultado',
                    'descricao': 'LUCRO OPERACIONAL',
                    'valor': float(lucro_operacional),
                    'nivel': 1
                },
                {
                    'tipo': 'resultado_final',
                    'descricao': 'LUCRO LÍQUIDO DO EXERCÍCIO',
                    'valor': float(lucro_liquido),
                    'nivel': 1
                }
            ]
        }
    
    @staticmethod
    def obter_dre(periodo, versao_balancete='1.0'):
        """
        Obtém a DRE já gerada para um período
        """
        demonstracao = DemonstracaoFinanceira.get_demonstracao('DRE', periodo, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'DRE não encontrada para o período especificado'
            }

