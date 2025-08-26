from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
import json
from decimal import Decimal
from datetime import datetime

class AnaliseFinanceiraService:
    
    @staticmethod
    def calcular_analise_horizontal(periodo_base, periodo_comparacao, versao_balancete='1.0'):
        """
        Calcula a análise horizontal comparando dois períodos
        """
        try:
            # Obter balancetes dos dois períodos
            balancete_base = Balancete.get_by_periodo(periodo_base, versao_balancete)
            balancete_comparacao = Balancete.get_by_periodo(periodo_comparacao, versao_balancete)
            
            if not balancete_base or not balancete_comparacao:
                return {
                    'success': False,
                    'message': 'Balancetes não encontrados para os períodos especificados'
                }
            
            # Criar dicionários para facilitar comparação
            saldos_base = {b.codigo_conta: float(b.saldo_final) for b in balancete_base}
            saldos_comparacao = {b.codigo_conta: float(b.saldo_final) for b in balancete_comparacao}
            
            # Calcular variações
            analise_horizontal = []
            
            # Obter todas as contas únicas
            todas_contas = set(saldos_base.keys()) | set(saldos_comparacao.keys())
            
            for codigo_conta in todas_contas:
                saldo_base = saldos_base.get(codigo_conta, 0.0)
                saldo_comparacao = saldos_comparacao.get(codigo_conta, 0.0)
                
                # Calcular variação absoluta e percentual
                variacao_absoluta = saldo_comparacao - saldo_base
                
                if saldo_base != 0:
                    variacao_percentual = (variacao_absoluta / abs(saldo_base)) * 100
                else:
                    variacao_percentual = 100.0 if saldo_comparacao != 0 else 0.0
                
                # Obter nome da conta
                conta = Balancete.query.filter_by(codigo_conta=codigo_conta).first()
                nome_conta = conta.nome_conta if conta else codigo_conta
                
                analise_horizontal.append({
                    'codigo_conta': codigo_conta,
                    'nome_conta': nome_conta,
                    'saldo_base': saldo_base,
                    'saldo_comparacao': saldo_comparacao,
                    'variacao_absoluta': variacao_absoluta,
                    'variacao_percentual': variacao_percentual,
                    'tendencia': AnaliseFinanceiraService._classificar_tendencia(variacao_percentual)
                })
            
            # Ordenar por variação percentual (maior para menor)
            analise_horizontal.sort(key=lambda x: abs(x['variacao_percentual']), reverse=True)
            
            return {
                'success': True,
                'data': {
                    'periodo_base': periodo_base,
                    'periodo_comparacao': periodo_comparacao,
                    'analise_horizontal': analise_horizontal,
                    'resumo': AnaliseFinanceiraService._gerar_resumo_horizontal(analise_horizontal)
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro ao calcular análise horizontal: {str(e)}'
            }
    
    @staticmethod
    def calcular_analise_vertical(periodo, versao_balancete='1.0'):
        """
        Calcula a análise vertical para um período específico
        """
        try:
            # Obter balancete do período
            balancete = Balancete.get_by_periodo(periodo, versao_balancete)
            
            if not balancete:
                return {
                    'success': False,
                    'message': 'Balancete não encontrado para o período especificado'
                }
            
            # Separar contas por tipo (ativo, passivo, receita, etc.)
            contas_por_tipo = {}
            totais_por_tipo = {}
            
            for conta in balancete:
                # Obter informações do plano de contas
                plano_conta = PlanoContas.get_by_codigo(conta.codigo_conta)
                
                if plano_conta:
                    elemento = plano_conta.elemento_conta
                    saldo = float(conta.saldo_final)
                    
                    if elemento not in contas_por_tipo:
                        contas_por_tipo[elemento] = []
                        totais_por_tipo[elemento] = 0.0
                    
                    contas_por_tipo[elemento].append({
                        'codigo_conta': conta.codigo_conta,
                        'nome_conta': conta.nome_conta,
                        'saldo': saldo
                    })
                    
                    totais_por_tipo[elemento] += abs(saldo)
            
            # Calcular percentuais
            analise_vertical = {}
            
            for elemento, contas in contas_por_tipo.items():
                total_elemento = totais_por_tipo[elemento]
                
                contas_com_percentual = []
                for conta in contas:
                    if total_elemento != 0:
                        percentual = (abs(conta['saldo']) / total_elemento) * 100
                    else:
                        percentual = 0.0
                    
                    contas_com_percentual.append({
                        **conta,
                        'percentual': percentual,
                        'classificacao': AnaliseFinanceiraService._classificar_relevancia(percentual)
                    })
                
                # Ordenar por percentual (maior para menor)
                contas_com_percentual.sort(key=lambda x: x['percentual'], reverse=True)
                
                analise_vertical[elemento] = {
                    'contas': contas_com_percentual,
                    'total': total_elemento
                }
            
            return {
                'success': True,
                'data': {
                    'periodo': periodo,
                    'analise_vertical': analise_vertical,
                    'resumo': AnaliseFinanceiraService._gerar_resumo_vertical(analise_vertical)
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro ao calcular análise vertical: {str(e)}'
            }
    
    @staticmethod
    def calcular_indicadores_financeiros(periodo, versao_balancete='1.0'):
        """
        Calcula indicadores financeiros para um período
        """
        try:
            # Obter demonstrações necessárias
            bp = DemonstracaoFinanceira.get_demonstracao('BP', periodo, versao_balancete)
            dre = DemonstracaoFinanceira.get_demonstracao('DRE', periodo, versao_balancete)
            
            if not bp or not dre:
                return {
                    'success': False,
                    'message': 'Demonstrações necessárias não encontradas. Gere o BP e DRE primeiro.'
                }
            
            dados_bp = json.loads(bp.dados_json)
            dados_dre = json.loads(dre.dados_json)
            
            # Extrair valores necessários
            ativo_total = dados_bp['ativo']['total']
            ativo_circulante = AnaliseFinanceiraService._obter_ativo_circulante(dados_bp)
            passivo_circulante = AnaliseFinanceiraService._obter_passivo_circulante(dados_bp)
            patrimonio_liquido = dados_bp['patrimonio_liquido']['total']
            receita_liquida = dados_dre['indicadores']['receita_bruta']
            lucro_liquido = dados_dre['indicadores']['lucro_liquido']
            lucro_bruto = dados_dre['indicadores']['lucro_bruto']
            
            # Calcular indicadores
            indicadores = {
                'liquidez': AnaliseFinanceiraService._calcular_indicadores_liquidez(
                    ativo_circulante, passivo_circulante, ativo_total
                ),
                'rentabilidade': AnaliseFinanceiraService._calcular_indicadores_rentabilidade(
                    lucro_liquido, lucro_bruto, receita_liquida, ativo_total, patrimonio_liquido
                ),
                'endividamento': AnaliseFinanceiraService._calcular_indicadores_endividamento(
                    dados_bp['passivo']['total'], ativo_total, patrimonio_liquido
                ),
                'atividade': AnaliseFinanceiraService._calcular_indicadores_atividade(
                    receita_liquida, ativo_total, ativo_circulante
                )
            }
            
            return {
                'success': True,
                'data': {
                    'periodo': periodo,
                    'indicadores': indicadores,
                    'interpretacao': AnaliseFinanceiraService._gerar_interpretacao_indicadores(indicadores)
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro ao calcular indicadores financeiros: {str(e)}'
            }
    
    @staticmethod
    def _classificar_tendencia(variacao_percentual):
        """Classifica a tendência baseada na variação percentual"""
        if variacao_percentual > 10:
            return 'crescimento_forte'
        elif variacao_percentual > 0:
            return 'crescimento_moderado'
        elif variacao_percentual > -10:
            return 'decrescimo_moderado'
        else:
            return 'decrescimo_forte'
    
    @staticmethod
    def _classificar_relevancia(percentual):
        """Classifica a relevância baseada no percentual"""
        if percentual > 20:
            return 'muito_relevante'
        elif percentual > 10:
            return 'relevante'
        elif percentual > 5:
            return 'moderadamente_relevante'
        else:
            return 'pouco_relevante'
    
    @staticmethod
    def _gerar_resumo_horizontal(analise_horizontal):
        """Gera resumo da análise horizontal"""
        total_contas = len(analise_horizontal)
        crescimento = len([a for a in analise_horizontal if a['variacao_percentual'] > 0])
        decrescimo = len([a for a in analise_horizontal if a['variacao_percentual'] < 0])
        
        # Maiores variações
        maiores_crescimentos = [a for a in analise_horizontal if a['variacao_percentual'] > 0][:5]
        maiores_decrescimos = [a for a in analise_horizontal if a['variacao_percentual'] < 0][:5]
        
        return {
            'total_contas': total_contas,
            'contas_crescimento': crescimento,
            'contas_decrescimo': decrescimo,
            'maiores_crescimentos': maiores_crescimentos,
            'maiores_decrescimos': maiores_decrescimos
        }
    
    @staticmethod
    def _gerar_resumo_vertical(analise_vertical):
        """Gera resumo da análise vertical"""
        resumo = {}
        
        for elemento, dados in analise_vertical.items():
            contas_relevantes = [c for c in dados['contas'] if c['percentual'] > 10]
            
            resumo[elemento] = {
                'total_contas': len(dados['contas']),
                'contas_relevantes': len(contas_relevantes),
                'maior_conta': dados['contas'][0] if dados['contas'] else None,
                'concentracao_top3': sum(c['percentual'] for c in dados['contas'][:3])
            }
        
        return resumo
    
    @staticmethod
    def _obter_ativo_circulante(dados_bp):
        """Extrai o valor do ativo circulante do BP"""
        for grupo in dados_bp['ativo']['grupos']:
            if 'circulante' in grupo['nome'].lower():
                return grupo['saldo']
        return 0.0
    
    @staticmethod
    def _obter_passivo_circulante(dados_bp):
        """Extrai o valor do passivo circulante do BP"""
        for grupo in dados_bp['passivo']['grupos']:
            if 'circulante' in grupo['nome'].lower():
                return grupo['saldo']
        return 0.0
    
    @staticmethod
    def _calcular_indicadores_liquidez(ativo_circulante, passivo_circulante, ativo_total):
        """Calcula indicadores de liquidez"""
        liquidez_corrente = ativo_circulante / passivo_circulante if passivo_circulante != 0 else 0
        liquidez_geral = ativo_total / passivo_circulante if passivo_circulante != 0 else 0
        
        return {
            'liquidez_corrente': {
                'valor': round(liquidez_corrente, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_liquidez_corrente(liquidez_corrente)
            },
            'liquidez_geral': {
                'valor': round(liquidez_geral, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_liquidez_geral(liquidez_geral)
            }
        }
    
    @staticmethod
    def _calcular_indicadores_rentabilidade(lucro_liquido, lucro_bruto, receita_liquida, ativo_total, patrimonio_liquido):
        """Calcula indicadores de rentabilidade"""
        margem_liquida = (lucro_liquido / receita_liquida * 100) if receita_liquida != 0 else 0
        margem_bruta = (lucro_bruto / receita_liquida * 100) if receita_liquida != 0 else 0
        roa = (lucro_liquido / ativo_total * 100) if ativo_total != 0 else 0
        roe = (lucro_liquido / patrimonio_liquido * 100) if patrimonio_liquido != 0 else 0
        
        return {
            'margem_liquida': {
                'valor': round(margem_liquida, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_margem_liquida(margem_liquida)
            },
            'margem_bruta': {
                'valor': round(margem_bruta, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_margem_bruta(margem_bruta)
            },
            'roa': {
                'valor': round(roa, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_roa(roa)
            },
            'roe': {
                'valor': round(roe, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_roe(roe)
            }
        }
    
    @staticmethod
    def _calcular_indicadores_endividamento(passivo_total, ativo_total, patrimonio_liquido):
        """Calcula indicadores de endividamento"""
        endividamento_geral = (passivo_total / ativo_total * 100) if ativo_total != 0 else 0
        composicao_endividamento = (passivo_total / patrimonio_liquido * 100) if patrimonio_liquido != 0 else 0
        
        return {
            'endividamento_geral': {
                'valor': round(endividamento_geral, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_endividamento_geral(endividamento_geral)
            },
            'composicao_endividamento': {
                'valor': round(composicao_endividamento, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_composicao_endividamento(composicao_endividamento)
            }
        }
    
    @staticmethod
    def _calcular_indicadores_atividade(receita_liquida, ativo_total, ativo_circulante):
        """Calcula indicadores de atividade"""
        giro_ativo = receita_liquida / ativo_total if ativo_total != 0 else 0
        giro_ativo_circulante = receita_liquida / ativo_circulante if ativo_circulante != 0 else 0
        
        return {
            'giro_ativo': {
                'valor': round(giro_ativo, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_giro_ativo(giro_ativo)
            },
            'giro_ativo_circulante': {
                'valor': round(giro_ativo_circulante, 2),
                'interpretacao': AnaliseFinanceiraService._interpretar_giro_ativo_circulante(giro_ativo_circulante)
            }
        }
    
    @staticmethod
    def _interpretar_liquidez_corrente(valor):
        if valor >= 2.0:
            return 'Excelente capacidade de pagamento de curto prazo'
        elif valor >= 1.5:
            return 'Boa capacidade de pagamento de curto prazo'
        elif valor >= 1.0:
            return 'Capacidade adequada de pagamento de curto prazo'
        else:
            return 'Dificuldades de pagamento de curto prazo'
    
    @staticmethod
    def _interpretar_liquidez_geral(valor):
        if valor >= 1.5:
            return 'Excelente liquidez geral'
        elif valor >= 1.0:
            return 'Liquidez geral adequada'
        else:
            return 'Liquidez geral comprometida'
    
    @staticmethod
    def _interpretar_margem_liquida(valor):
        if valor >= 15:
            return 'Margem líquida excelente'
        elif valor >= 10:
            return 'Margem líquida boa'
        elif valor >= 5:
            return 'Margem líquida adequada'
        else:
            return 'Margem líquida baixa'
    
    @staticmethod
    def _interpretar_margem_bruta(valor):
        if valor >= 40:
            return 'Margem bruta excelente'
        elif valor >= 30:
            return 'Margem bruta boa'
        elif valor >= 20:
            return 'Margem bruta adequada'
        else:
            return 'Margem bruta baixa'
    
    @staticmethod
    def _interpretar_roa(valor):
        if valor >= 15:
            return 'Retorno sobre ativos excelente'
        elif valor >= 10:
            return 'Retorno sobre ativos bom'
        elif valor >= 5:
            return 'Retorno sobre ativos adequado'
        else:
            return 'Retorno sobre ativos baixo'
    
    @staticmethod
    def _interpretar_roe(valor):
        if valor >= 20:
            return 'Retorno sobre patrimônio excelente'
        elif valor >= 15:
            return 'Retorno sobre patrimônio bom'
        elif valor >= 10:
            return 'Retorno sobre patrimônio adequado'
        else:
            return 'Retorno sobre patrimônio baixo'
    
    @staticmethod
    def _interpretar_endividamento_geral(valor):
        if valor <= 30:
            return 'Endividamento baixo e saudável'
        elif valor <= 50:
            return 'Endividamento moderado'
        elif valor <= 70:
            return 'Endividamento alto'
        else:
            return 'Endividamento muito alto - atenção'
    
    @staticmethod
    def _interpretar_composicao_endividamento(valor):
        if valor <= 50:
            return 'Composição de endividamento saudável'
        elif valor <= 100:
            return 'Composição de endividamento moderada'
        else:
            return 'Composição de endividamento alta'
    
    @staticmethod
    def _interpretar_giro_ativo(valor):
        if valor >= 2.0:
            return 'Excelente eficiência no uso dos ativos'
        elif valor >= 1.5:
            return 'Boa eficiência no uso dos ativos'
        elif valor >= 1.0:
            return 'Eficiência adequada no uso dos ativos'
        else:
            return 'Baixa eficiência no uso dos ativos'
    
    @staticmethod
    def _interpretar_giro_ativo_circulante(valor):
        if valor >= 4.0:
            return 'Excelente rotação do ativo circulante'
        elif valor >= 3.0:
            return 'Boa rotação do ativo circulante'
        elif valor >= 2.0:
            return 'Rotação adequada do ativo circulante'
        else:
            return 'Baixa rotação do ativo circulante'
    
    @staticmethod
    def _gerar_interpretacao_indicadores(indicadores):
        """Gera interpretação geral dos indicadores"""
        interpretacao = {
            'situacao_geral': 'Análise dos indicadores financeiros',
            'pontos_fortes': [],
            'pontos_atencao': [],
            'recomendacoes': []
        }
        
        # Analisar liquidez
        liquidez_corrente = indicadores['liquidez']['liquidez_corrente']['valor']
        if liquidez_corrente >= 1.5:
            interpretacao['pontos_fortes'].append('Boa liquidez corrente')
        elif liquidez_corrente < 1.0:
            interpretacao['pontos_atencao'].append('Liquidez corrente baixa')
            interpretacao['recomendacoes'].append('Melhorar gestão do capital de giro')
        
        # Analisar rentabilidade
        margem_liquida = indicadores['rentabilidade']['margem_liquida']['valor']
        if margem_liquida >= 10:
            interpretacao['pontos_fortes'].append('Boa margem de lucro')
        elif margem_liquida < 5:
            interpretacao['pontos_atencao'].append('Margem de lucro baixa')
            interpretacao['recomendacoes'].append('Revisar estrutura de custos e preços')
        
        # Analisar endividamento
        endividamento = indicadores['endividamento']['endividamento_geral']['valor']
        if endividamento <= 30:
            interpretacao['pontos_fortes'].append('Baixo endividamento')
        elif endividamento > 70:
            interpretacao['pontos_atencao'].append('Alto endividamento')
            interpretacao['recomendacoes'].append('Reduzir níveis de endividamento')
        
        return interpretacao

