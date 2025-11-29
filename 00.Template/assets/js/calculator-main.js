/**
 * CALCULATOR MAIN - Estrutura Principal Modular
 * Orquestra e injeta todas as seções da calculadora
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const CalculatorMain = {
    /**
     * Configuração padrão da calculadora
     */
    defaultConfig: {
        showBreadcrumb: true,
        showUnitConverter: false, // Movido para aba Configurações
        showMetasSeguranca: true, // Exibido após cálculo
        show9Acertos: true, // Exibido após cálculo
        showAuditoria: true, // Exibido após cálculo
        showNANDASearch: true, // Exibido após cálculo
        showReferencias: false, // Movido para dentro da aba "O que é?"
        showRelatedTools: true, // Tags e Ferramentas Relacionadas
        layoutType: 'two-columns' // 'two-columns' ou 'three-columns'
    },
    
    /**
     * Inicializa a calculadora com configuração específica
     * @param {Object} config - Configuração da calculadora
     */
    init(config) {
        this.config = { ...this.defaultConfig, ...config };
        
        console.log('🚀 Inicializando Calculator Main:', this.config.name);
        
        // Injeta estrutura base
        this.injectMainStructure();
        
        // Injeta seções modulares
        if (this.config.showBreadcrumb) this.injectBreadcrumb();
        
        // Injeta abas informativas
        this.injectTabs();
        
        // Inicializa CalculatorActions
        if (typeof CalculatorActions !== 'undefined') {
            CalculatorActions.init(this.config);
        }
        
        console.log('✓ Calculator Main inicializado com sucesso');
    },
    
    /**
     * Injeta estrutura MAIN completa
     */
    injectMainStructure() {
        const mainContainer = document.getElementById('calculator-main-content');
        if (!mainContainer) {
            console.error('❌ Container #calculator-main-content não encontrado');
            return;
        }
        
        const layoutClass = this.config.layoutType === 'three-columns' 
            ? 'lg:grid-cols-3' 
            : 'lg:grid-cols-3';
        
        mainContainer.innerHTML = `
            <div class="min-h-screen bg-gray-100 p-4 sm:p-8">
                
                <!-- Breadcrumb -->
                <div id="breadcrumb-container"></div>
                
                <!-- Botão Voltar -->
                <div class="mb-4">
                    <button id="btn-voltar" class="flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 bg-[#1A3E74] hover:bg-[#2a5a9e] px-4 py-2 text-sm rounded-lg text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                        Voltar
                    </button>
                </div>
                
                <!-- Cabeçalho -->
                <div class="mb-6">
                    <div class="bg-[#1A3E74] text-white p-6 rounded-xl flex items-center justify-between shadow-lg">
                        <h1 class="text-2xl md:text-3xl font-bold text-white">${this.config.title || 'Calculadora'}</h1>
                    </div>
                </div>
                
                <!-- Abas Informativas (abaixo do título) -->
                <div id="calculator-tabs-container" class="mb-6"></div>

                <div class="grid grid-cols-1 ${layoutClass} gap-8">
                    
                    <!-- Coluna Principal (Formulário e Resultados) -->
                    <div class="lg:col-span-2 space-y-6">
                        
                        <!-- Descrição -->
                        ${this.renderDescricao()}
                        
                        <!-- Formulário da Calculadora -->
                        <div id="calculator-form-container" class="bg-white rounded-xl shadow-md p-6">
                            <div id="calculator-form-content">
                                <!-- Conteúdo do formulário será injetado aqui -->
                            </div>
                        </div>
                        
                        <!-- Resultados (inicialmente oculto) -->
                        <div id="calculator-result-container" class="hidden bg-white rounded-xl shadow-md p-6">
                            <h2 class="text-xl font-semibold mb-4" style="color: #1A3E74;">
                                Resultados
                            </h2>
                            <div id="calculator-result-content">
                                <div class="text-center py-8 text-gray-400">
                                    Preencha os dados para calcular
                                </div>
                            </div>
                            
                            <!-- Botões de Ação -->
                            <div id="action-buttons" class="hidden mt-6 flex flex-wrap gap-3">
                                <button 
                                    onclick="CalculatorActions.copiarResultado()"
                                    class="flex-1 min-w-[140px] bg-[#1A3E74] text-white py-3 px-6 rounded-lg hover:bg-[#2a5a9e] transition duration-300 flex items-center justify-center gap-2 font-semibold shadow-md"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                    Copiar
                                </button>
                                <button 
                                    onclick="CalculatorActions.exportarPDF()"
                                    class="flex-1 min-w-[140px] bg-[#1A3E74] text-white py-3 px-6 rounded-lg hover:bg-[#2a5a9e] transition duration-300 flex items-center justify-center gap-2 font-semibold shadow-md"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Exportar PDF
                                </button>
                            </div>
                        </div>
                        
                        <!-- Auditoria do Cálculo (exibida após cálculo) -->
                        ${this.config.showAuditoria ? '<div id="auditoria-container"></div>' : ''}
                        
                        <!-- Busca NANDA/NIC/NOC (exibida após cálculo) -->
                        ${this.config.showNANDASearch ? '<div id="nanda-search-container"></div>' : ''}
                        
                    </div>

                    <!-- Coluna Lateral (Sidebar) -->
                    <aside class="space-y-6">
                        
                        <!-- Informações Específicas da Calculadora -->
                        <div id="calculator-sidebar-content">
                            <!-- Conteúdo específico da calculadora (fórmulas, valores de referência, etc) -->
                        </div>
                        
                    </aside>
                </div>
                
                <!-- Checklist de Segurança do Paciente em Serviços de Saúde -->
                ${this.config.showMetasSeguranca || this.config.show9Acertos ? '<div id="checklist-seguranca-container"></div>' : ''}
                
                <!-- Tags e Ferramentas Relacionadas -->
                ${this.config.showRelatedTools ? '<div id="related-tools-container"></div>' : ''}
                
            </div>
        `;
        
        // Configura botão voltar
        this.setupBotaoVoltar();
        
        console.log('✓ Estrutura MAIN injetada');
    },
    
    /**
     * Renderiza descrição da calculadora
     * @returns {String} HTML da descrição
     */
    renderDescricao() {
        if (!this.config.description) return '';
        
        return `
            <div class="bg-white rounded-xl shadow-md p-6">
                <p class="text-gray-700 leading-relaxed">
                    ${this.config.description}
                </p>
            </div>
        `;
    },
    
    /**
     * Injeta breadcrumb (modular de template - components.js)
     */
    injectBreadcrumb() {
        if (typeof insertBreadcrumb !== 'undefined') {
            insertBreadcrumb('breadcrumb-container', this.config);
        } else if (typeof Breadcrumb !== 'undefined') {
            // Fallback para breadcrumb.js standalone (se disponível)
            Breadcrumb.inserirComSchema('breadcrumb-container', this.config);
        }
    },
    
    /**
     * Injeta abas informativas
     */
    injectTabs() {
        if (typeof CalculatorTabs !== 'undefined' && this.config.tabsConfig) {
            CalculatorTabs.inserir('calculator-tabs-container', this.config.tabsConfig);
        }
    },
    

    
    /**
     * Configura botão voltar - retorna para a página anterior de navegação
     */
    setupBotaoVoltar() {
        const btnVoltar = document.getElementById('btn-voltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                window.history.back();
            });
        }
    },
    
    /**
     * Injeta conteúdo do formulário
     * @param {String|Function} content - HTML ou função que retorna HTML
     */
    injectFormContent(content) {
        const container = document.getElementById('calculator-form-content');
        if (!container) return;
        
        if (typeof content === 'function') {
            container.innerHTML = content();
        } else {
            container.innerHTML = content;
        }
        
        console.log('✓ Conteúdo do formulário injetado');
    },
    
    /**
     * Injeta conteúdo da sidebar
     * @param {String|Function} content - HTML ou função que retorna HTML
     */
    injectSidebarContent(content) {
        const container = document.getElementById('calculator-sidebar-content');
        if (!container) return;
        
        if (typeof content === 'function') {
            container.innerHTML = content();
        } else {
            container.innerHTML = content;
        }
        
        console.log('✓ Conteúdo da sidebar injetado');
    },
    
    /**
     * Injeta todas as seções modulares após cálculo
     * @param {Object} resultadoData - Dados do resultado para contexto
     */
    injectModularSections(resultadoData = {}) {
        // Checklist de Segurança do Paciente em Serviços de Saúde
        if (this.config.showMetasSeguranca || this.config.show9Acertos) {
            const checklistContainer = document.getElementById('checklist-seguranca-container');
            if (checklistContainer) {
                // Renderiza título e container
                checklistContainer.innerHTML = `
                    <div class="mt-6">
                        <div class="bg-white rounded-t-lg shadow-md border border-gray-200 overflow-hidden">
                            <h4 class="bg-[#1A3E74] text-white p-3 font-semibold text-lg">
                                Checklist de Segurança do Paciente em Serviços de Saúde
                            </h4>
                        </div>
                        <div id="metas-seguranca-container"></div>
                        <div id="9-acertos-container"></div>
                    </div>
                `;
                
                // Metas de Segurança (após cálculo)
                if (this.config.showMetasSeguranca && typeof MetasSeguranca !== 'undefined') {
                    MetasSeguranca.inserir('metas-seguranca-container');
                }
                
                // 9 Acertos (após cálculo) - Modo checklist
                if (this.config.show9Acertos && typeof NoveAcertosMedicamentos !== 'undefined') {
                    NoveAcertosMedicamentos.inserir('9-acertos-container', true);
                }
            }
        }
        
        // Auditoria (após cálculo) - Modo simplificado
        if (this.config.showAuditoria && typeof AuditoriaCalculo !== 'undefined' && resultadoData.registro) {
            // Prepara dados para modo simplificado
            const dadosAuditoria = {
                paciente: resultadoData.registro.paciente || {},
                parametros: resultadoData.registro.inputs || {},
                formula: 'Superfície Corporal (m²) = √[(Peso × Altura) / 3600]'
            };
            AuditoriaCalculo.inserir('auditoria-container', dadosAuditoria, true);
        }
        
        // Busca NANDA/NIC/NOC (após cálculo)
        if (this.config.showNANDASearch && typeof NANDANICNOCSearch !== 'undefined' && resultadoData.contextoClinico) {
            NANDANICNOCSearch.inserirBotoes('nanda-search-container', resultadoData.contextoClinico);
        }
        
        // Tags e Ferramentas Relacionadas (sempre visível)
        if (this.config.showRelatedTools && typeof RelatedTools !== 'undefined') {
            RelatedTools.inserir('related-tools-container', this.config.relatedToolsData);
        }
        
        console.log('✓ Seções modulares injetadas');
    },
    
    /**
     * Mostra área de resultados
     */
    showResults() {
        const resultContainer = document.getElementById('calculator-result-container');
        const actionButtons = document.getElementById('action-buttons');
        
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }
        
        if (actionButtons) {
            actionButtons.classList.remove('hidden');
        }
    },
    
    /**
     * Esconde área de resultados
     */
    hideResults() {
        const resultContainer = document.getElementById('calculator-result-container');
        const actionButtons = document.getElementById('action-buttons');
        
        if (resultContainer) {
            resultContainer.classList.add('hidden');
        }
        
        if (actionButtons) {
            actionButtons.classList.add('hidden');
        }
    }
};

// Exporta para uso global
window.CalculatorMain = CalculatorMain;

console.log('✓ Módulo Calculator Main carregado');
