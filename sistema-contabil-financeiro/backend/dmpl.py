from src.models.balancete import Balancete
from src.models.plano_contas import PlanoContas
from src.models.demonstracoes import DemonstracaoFinanceira
from src.models.user import db
import json
from decimal import Decimal

class DMPLService:
    
    @staticmethod
    def gerar_dmpl(periodo_inicial, periodo_final, versao_balancete='1.0', versao_plano_contas='1.0'):
        """
        Gera a Demonstração das Mutações do Patrimônio Líquido (DMPL) 
        comparando dois períodos
        """
        try:
            # Obter contas do patrimônio líquido
            contas_pl = PlanoContas.get_contas_por_elemento('patrimonio_liquido', versao_plano_contas)
            
            # Estruturar colunas da DMPL
            colunas = DMPLService._definir_colunas_dmpl(contas_pl)
            
            # Obter saldos iniciais
            saldos_iniciais = DMPLService._obter_saldos_periodo(
                periodo_inicial, contas_pl, versao_balancete
            )
            
            # Obter saldos finais
            saldos_finais = DMPLService._obter_saldos_periodo(
                periodo_final, contas_pl, versao_balancete
            )
            
            # Calcular movimentações
            movimentacoes = DMPLService._calcular_movimentacoes(
                saldos_iniciais, saldos_finais, periodo_inicial, periodo_final, versao_balancete
            )
            
            # Estruturar dados da DMPL
            dmpl_data = {
                'periodo_inicial': periodo_inicial,
                'periodo_final': periodo_final,
                'colunas': colunas,
                'saldos_iniciais': saldos_iniciais,
                'movimentacoes': movimentacoes,
                'saldos_finais': saldos_finais,
                'estrutura_dmpl': DMPLService._estruturar_dmpl_completa(
                    colunas, saldos_iniciais, movimentacoes, saldos_finais
                )
            }
            
            # Salvar demonstração no banco
            periodo_chave = f"{periodo_inicial}_{periodo_final}"
            demonstracao_existente = DemonstracaoFinanceira.get_demonstracao('DMPL', periodo_chave, versao_balancete)
            
            if demonstracao_existente:
                demonstracao_existente.dados_json = json.dumps(dmpl_data)
                demonstracao_existente.data_geracao = db.func.now()
            else:
                nova_demonstracao = DemonstracaoFinanceira(
                    tipo_demonstracao='DMPL',
                    periodo=periodo_chave,
                    versao_balancete=versao_balancete,
                    versao_plano_contas=versao_plano_contas,
                    dados_json=json.dumps(dmpl_data)
                )
                db.session.add(nova_demonstracao)
            
            db.session.commit()
            
            return {
                'success': True,
                'data': dmpl_data,
                'message': 'DMPL gerada com sucesso'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': f'Erro ao gerar DMPL: {str(e)}'
            }
    
    @staticmethod
    def _definir_colunas_dmpl(contas_pl):
        """
        Define as colunas da DMPL baseadas nas contas do patrimônio líquido
        """
        colunas = []
        
        # Colunas padrão
        colunas_padrao = [
            {'codigo': 'capital_social', 'nome': 'Capital Social'},
            {'codigo': 'reservas_capital', 'nome': 'Reservas de Capital'},
            {'codigo': 'reservas_lucros', 'nome': 'Reservas de Lucros'},
            {'codigo': 'lucros_acumulados', 'nome': 'Lucros/Prejuízos Acumulados'},
            {'codigo': 'ajustes_avaliacao', 'nome': 'Ajustes de Avaliação Patrimonial'},
            {'codigo': 'total', 'nome': 'Total do PL'}
        ]
        
        # Mapear contas do plano para as colunas
        for coluna in colunas_padrao:
            contas_relacionadas = []
            for conta in contas_pl:
                if DMPLService._mapear_conta_para_coluna(conta.nome, coluna['codigo']):
                    contas_relacionadas.append({
                        'codigo': conta.codigo,
                        'nome': conta.nome
                    })
            
            colunas.append({
                'codigo': coluna['codigo'],
                'nome': coluna['nome'],
                'contas': contas_relacionadas
            })
        
        return colunas
    
    @staticmethod
    def _mapear_conta_para_coluna(nome_conta, codigo_coluna):
        """
        Mapeia uma conta do plano para uma coluna da DMPL
        """
        nome_lower = nome_conta.lower()
        
        mapeamentos = {
            'capital_social': ['capital', 'social'],
            'reservas_capital': ['reserva', 'capital', 'ágio', 'agio'],
            'reservas_lucros': ['reserva', 'lucro', 'legal', 'estatutária'],
            'lucros_acumulados': ['lucro', 'acumulado', 'prejuízo'],
            'ajustes_avaliacao': ['ajuste', 'avaliação', 'patrimonial']
        }
        
        if codigo_coluna in mapeamentos:
            palavras_chave = mapeamentos[codigo_coluna]
            return any(palavra in nome_lower for palavra in palavras_chave)
        
        return False
    
    @staticmethod
    def _obter_saldos_periodo(periodo, contas_pl, versao_balancete):
        """
        Obtém os saldos das contas do PL para um período específico
        """
        saldos = {}
        
        for conta in contas_pl:
            saldo = Balancete.get_saldo_por_conta(conta.codigo, periodo, versao_balancete)
            saldos[conta.codigo] = {
                'codigo': conta.codigo,
                'nome': conta.nome,
                'saldo': saldo
            }
        
        return saldos
    
    @staticmethod
    def _calcular_movimentacoes(saldos_iniciais, saldos_finais, periodo_inicial, periodo_final, versao_balancete):
        """
        Calcula as movimentações entre os períodos
        """
        movimentacoes = {
            'aumentos_capital': {},
            'reducoes_capital': {},
            'lucro_exercicio': {},
            'dividendos_distribuidos': {},
            'constituicao_reservas': {},
            'reversao_reservas': {},
            'outras_movimentacoes': {}
        }
        
        # Para cada conta, calcular a variação
        for codigo_conta in saldos_iniciais:
            if codigo_conta in saldos_finais:
                saldo_inicial = saldos_iniciais[codigo_conta]['saldo']
                saldo_final = saldos_finais[codigo_conta]['saldo']
                variacao = saldo_final - saldo_inicial
                
                if abs(variacao) > 0.01:  # Só considerar variações significativas
                    # Classificar o tipo de movimentação baseado no nome da conta
                    tipo_movimentacao = DMPLService._classificar_movimentacao(
                        saldos_iniciais[codigo_conta]['nome'], variacao
                    )
                    
                    movimentacoes[tipo_movimentacao][codigo_conta] = {
                        'codigo': codigo_conta,
                        'nome': saldos_iniciais[codigo_conta]['nome'],
                        'valor': variacao
                    }
        
        return movimentacoes
    
    @staticmethod
    def _classificar_movimentacao(nome_conta, variacao):
        """
        Classifica o tipo de movimentação baseado no nome da conta e valor
        """
        nome_lower = nome_conta.lower()
        
        if 'capital' in nome_lower:
            return 'aumentos_capital' if variacao > 0 else 'reducoes_capital'
        elif 'lucro' in nome_lower and 'acumulado' in nome_lower:
            return 'lucro_exercicio' if variacao > 0 else 'dividendos_distribuidos'
        elif 'reserva' in nome_lower:
            return 'constituicao_reservas' if variacao > 0 else 'reversao_reservas'
        else:
            return 'outras_movimentacoes'
    
    @staticmethod
    def _estruturar_dmpl_completa(colunas, saldos_iniciais, movimentacoes, saldos_finais):
        """
        Estrutura a DMPL no formato de tabela
        """
        linhas = []
        
        # Linha de saldos iniciais
        linha_inicial = {'tipo': 'saldo_inicial', 'descricao': 'Saldos em 31/12 do exercício anterior'}
        for coluna in colunas:
            if coluna['codigo'] == 'total':
                total_inicial = sum(
                    saldo['saldo'] for saldo in saldos_iniciais.values()
                )
                linha_inicial[coluna['codigo']] = total_inicial
            else:
                valor_coluna = sum(
                    saldos_iniciais.get(conta['codigo'], {}).get('saldo', 0)
                    for conta in coluna['contas']
                )
                linha_inicial[coluna['codigo']] = valor_coluna
        linhas.append(linha_inicial)
        
        # Linhas de movimentações
        tipos_movimentacao = [
            ('aumentos_capital', 'Aumentos de Capital'),
            ('lucro_exercicio', 'Lucro Líquido do Exercício'),
            ('constituicao_reservas', 'Constituição de Reservas'),
            ('dividendos_distribuidos', 'Dividendos Distribuídos'),
            ('outras_movimentacoes', 'Outras Movimentações')
        ]
        
        for tipo_codigo, tipo_nome in tipos_movimentacao:
            if movimentacoes[tipo_codigo]:
                linha_mov = {'tipo': 'movimentacao', 'descricao': tipo_nome}
                for coluna in colunas:
                    if coluna['codigo'] == 'total':
                        total_mov = sum(
                            mov['valor'] for mov in movimentacoes[tipo_codigo].values()
                        )
                        linha_mov[coluna['codigo']] = total_mov
                    else:
                        valor_coluna = sum(
                            movimentacoes[tipo_codigo].get(conta['codigo'], {}).get('valor', 0)
                            for conta in coluna['contas']
                        )
                        linha_mov[coluna['codigo']] = valor_coluna
                linhas.append(linha_mov)
        
        # Linha de saldos finais
        linha_final = {'tipo': 'saldo_final', 'descricao': 'Saldos em 31/12 do exercício atual'}
        for coluna in colunas:
            if coluna['codigo'] == 'total':
                total_final = sum(
                    saldo['saldo'] for saldo in saldos_finais.values()
                )
                linha_final[coluna['codigo']] = total_final
            else:
                valor_coluna = sum(
                    saldos_finais.get(conta['codigo'], {}).get('saldo', 0)
                    for conta in coluna['contas']
                )
                linha_final[coluna['codigo']] = valor_coluna
        linhas.append(linha_final)
        
        return {'linhas': linhas}
    
    @staticmethod
    def obter_dmpl(periodo_inicial, periodo_final, versao_balancete='1.0'):
        """
        Obtém a DMPL já gerada para um período
        """
        periodo_chave = f"{periodo_inicial}_{periodo_final}"
        demonstracao = DemonstracaoFinanceira.get_demonstracao('DMPL', periodo_chave, versao_balancete)
        
        if demonstracao:
            return {
                'success': True,
                'data': json.loads(demonstracao.dados_json),
                'data_geracao': demonstracao.data_geracao.isoformat()
            }
        else:
            return {
                'success': False,
                'message': 'DMPL não encontrada para o período especificado'
            }

