from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
import json
from decimal import Decimal

class BalancoPatrimonialService:
    
    @staticmethod
    def gerar_balanco_patrimonial(periodo, versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera o Balanço Patrimonial para um período específico
        """
        try:
            # Verificar se o totalizador está zerado
            if not Balancete.verificar_totalizador_zero(periodo, versao_balancete):
                return {
                    'success': False,
                    'message': 'Erro: O balancete não está balanceado (totalizador não é zero)'
                }
            
            # Obter contas do ativo
            ativo = BalancoPatrimonialService._obter_grupo_contas('ativo', periodo, versao_balancete, versao_plano_contas)
            
            # Obter contas do passivo
            passivo = BalancoPatrimonialService._obter_grupo_contas('passivo', periodo, versao_balancete, versao_plano_contas)
            
            # Obter contas do patrimônio líquido
            patrimonio_liquido = BalancoPatrimonialService._obter_grupo_contas('patrimonio_liquido', periodo, versao_balancete, versao_plano_contas)
            
            # Calcular totais
            total_ativo = BalancoPatrimonialService._calcular_total_grupo(ativo)
            total_passivo = BalancoPatrimonialService._calcular_total_grupo(passivo)
            total_patrimonio_liquido = BalancoPatrimonialService._calcular_total_grupo(patrimonio_liquido)
            
            # Verificar se Ativo = Passivo + PL
            diferenca = abs(total_ativo - (total_passivo + total_patrimonio_liquido))
            if diferenca > 0.01:  # Tolerância para arredondamentos
                return {
                    'success': False,
                    'message': f'Erro: Balanço não está equilibrado. Diferença: {diferenca:.2f}'
                }
            
            # Estruturar dados do balanço
            balanco_data = {
                'ativo': {
                    'grupos': ativo,
                    'total': float(total_ativo)
                },
                'passivo': {
                    'grupos': passivo,
                    'total': float(total_passivo)
                },
                'patrimonio_liquido': {
                    'grupos': patrimonio_liquido,
                    'total': float(total_patrimonio_liquido)
                },
                'total_passivo_pl': float(total_passivo + total_patrimonio_liquido),
                'equilibrado': True
            }
            
            # Salvar demonstração no banco
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('BP', periodo, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(balanco_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='BP',
                    periodo=periodo,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(balanco_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': balanco_data,
                'message': 'Balanço Patrimonial gerado com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar Balanço Patrimonial: {str(e)}'
            }
    
    @staticmethod
    def _obter_grupo_contas(elemento_conta, periodo, versao_balancete, versao_plano_contas):
        """
        Obtém as contas de um elemento específico (ativo, passivo, patrimonio_liquido)
        """
        # Mapear elemento_conta para o valor correto no banco
        elemento_map = {
            'ativo': 'ativo',
            'passivo': 'passivo',
            'patrimonio_liquido': 'patrimonio_liquido'
        }
        
        elemento_db = elemento_map.get(elemento_conta, elemento_conta)
        
        # Obter contas do plano de contas para o elemento
        contas_plano = PlanoContas.get_contas_por_elemento(elemento_db, versao_plano_contas)
        
        # Organizar por níveis hierárquicos
        grupos = {}
        
        for conta in contas_plano:
            # Obter saldo da conta no balancete
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            
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
    def obter_balanco_patrimonial(periodo, versao_balancete='1.0'):
        """
        Obtém o Balanço Patrimonial já gerado para um período
        """
        demonstracao = DemonstracaoFinanceira.get_demonstracao('BP', periodo, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'Balanço Patrimonial não encontrado para o período especificado'
            }

