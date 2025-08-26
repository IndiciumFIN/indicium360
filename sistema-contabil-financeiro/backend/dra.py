from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
from src.services.dre import DREService
import json
from decimal import Decimal

class DRAService:
    
    @staticmethod
    def gerar_dra(periodo, versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera a Demonstração do Resultado Abrangente (DRA) para um período específico
        A DRA inclui o resultado líquido da DRE mais outros resultados abrangentes
        """
        try:
            # Primeiro, obter os dados da DRE
            dre_resultado = DREService.gerar_dre(periodo, versao_balancete, versao_plano_contas)
            
            if not dre_resultado['success']:
                return {
                    'success': False,
                    'message': f'Erro ao gerar DRE para DRA: {dre_resultado["message"]}'
                }
            
            lucro_liquido = dre_resultado['data']['indicadores']['lucro_liquido']
            
            # Obter outros resultados abrangentes
            outros_resultados = DRAService._obter_outros_resultados_abrangentes(
                periodo, versao_balancete, versao_plano_contas
            )
            
            # Calcular resultado abrangente total
            total_outros_resultados = sum(item['valor'] for item in outros_resultados)
            resultado_abrangente_total = lucro_liquido + total_outros_resultados
            
            # Estruturar dados da DRA
            dra_data = {
                'lucro_liquido': lucro_liquido,
                'outros_resultados_abrangentes': outros_resultados,
                'total_outros_resultados': total_outros_resultados,
                'resultado_abrangente_total': resultado_abrangente_total,
                'estrutura_dra': DRAService._estruturar_dra_completa(
                    lucro_liquido, outros_resultados, total_outros_resultados, resultado_abrangente_total
                ),
                'dre_base': dre_resultado['data']  # Incluir dados da DRE para referência
            }
            
            # Salvar demonstração no banco
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('DRA', periodo, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(dra_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='DRA',
                    periodo=periodo,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(dra_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': dra_data,
                'message': 'DRA gerada com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar DRA: {str(e)}'
            }
    
    @staticmethod
    def _obter_outros_resultados_abrangentes(periodo, versao_balancete, versao_plano_contas):
        """
        Obtém outros resultados abrangentes que não passam pelo resultado
        Exemplos: ajustes de conversão, ganhos/perdas atuariais, etc.
        """
        outros_resultados = []
        
        # Buscar contas específicas de outros resultados abrangentes
        # Estas contas devem estar marcadas no plano de contas como tal
        contas_ora = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.nome.ilike('%ajuste%conversão%')  # Exemplo de busca
        ).all()
        
        for conta in contas_ora:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            if abs(saldo) > 0.01:
                outros_resultados.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': saldo,
                    'tipo': 'ajuste_conversao'
                })
        
        # Buscar ajustes de avaliação patrimonial
        contas_avaliacao = PlanoContas.query.filter(
            PlanoContas.versao == versao_plano_contas,
            PlanoContas.ativo == True,
            PlanoContas.nome.ilike('%ajuste%avaliação%')
        ).all()
        
        for conta in contas_avaliacao:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            if abs(saldo) > 0.01:
                outros_resultados.append({
                    'codigo': conta.codigo,
                    'descricao': conta.nome,
                    'valor': saldo,
                    'tipo': 'ajuste_avaliacao'
                })
        
        # Se não houver contas específicas, retornar lista vazia
        if not outros_resultados:
            outros_resultados.append({
                'codigo': 'N/A',
                'descricao': 'Não há outros resultados abrangentes no período',
                'valor': 0.0,
                'tipo': 'nenhum'
            })
        
        return outros_resultados
    
    @staticmethod
    def _estruturar_dra_completa(lucro_liquido, outros_resultados, total_outros_resultados, resultado_abrangente_total):
        """
        Estrutura a DRA no formato padrão
        """
        linhas = [
            {
                'tipo': 'resultado_base',
                'descricao': 'LUCRO LÍQUIDO DO EXERCÍCIO',
                'valor': lucro_liquido,
                'nivel': 1
            },
            {
                'tipo': 'titulo_secao',
                'descricao': 'OUTROS RESULTADOS ABRANGENTES',
                'valor': None,
                'nivel': 1
            }
        ]
        
        # Adicionar cada item de outros resultados abrangentes
        for item in outros_resultados:
            if item['valor'] != 0:
                linhas.append({
                    'tipo': 'item_ora',
                    'descricao': item['descricao'],
                    'valor': item['valor'],
                    'codigo': item['codigo'],
                    'tipo_ora': item['tipo'],
                    'nivel': 2
                })
        
        # Adicionar total de outros resultados abrangentes
        linhas.extend([
            {
                'tipo': 'subtotal',
                'descricao': 'TOTAL DE OUTROS RESULTADOS ABRANGENTES',
                'valor': total_outros_resultados,
                'nivel': 1
            },
            {
                'tipo': 'resultado_final',
                'descricao': 'RESULTADO ABRANGENTE TOTAL DO EXERCÍCIO',
                'valor': resultado_abrangente_total,
                'nivel': 1
            }
        ])
        
        return {'linhas': linhas}
    
    @staticmethod
    def obter_dra(periodo, versao_balancete='1.0'):
        """
        Obtém a DRA já gerada para um período
        """
        demonstracao = DemonstracaoFinanceira.get_demonstracao('DRA', periodo, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'DRA não encontrada para o período especificado'
            }

