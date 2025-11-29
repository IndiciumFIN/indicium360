/**
 * CALCULATOR TABS - Sistema de Abas para Calculadoras
 * Gerencia abas expansíveis: O que é?, Como Utilizar?, Referência Técnica, Configurações
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

// Injeta CSS do Toggle Switch e Tabs (caso não esteja carregado via cookie-consent.css)
(function injectToggleSwitchCSS() {
    const cssId = 'calculator-tabs-toggle-css';
    if (!document.getElementById(cssId)) {
        const style = document.createElement('style');
        style.id = cssId;
        style.textContent = `
            /* Toggle Switch Styles */
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
                flex-shrink: 0;
            }
            
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.4s;
                border-radius: 34px;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            input:checked + .slider {
                background-color: #1A3E74;
            }
            
            input:disabled:checked + .slider {
                background-color: #555;
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            input:checked + .slider:before {
                transform: translateX(24px);
            }
            
            input:focus-visible + .slider {
                outline: 2px solid #3CACD5;
                outline-offset: 2px;
            }
            
            /* Tabs Styles */
            .tabs-nav {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .tab-button {
                flex: 1;
                min-width: 200px;
                padding: 12px 16px;
                background: linear-gradient(135deg, #1A3E74 0%, #2B5C97 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .tab-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .tab-button.active {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                color: #1A3E74;
                border: 2px solid #3CACD5;
            }
            
            .tab-button.active .chevron-icon {
                color: #1A3E74;
            }
            
            .tab-panel {
                display: none;
                padding: 20px;
                background: white;
                border-radius: 8px;
                margin-top: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            
            .tab-panel.active {
                display: block;
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
})();

const CalculatorTabs = {
    /**
     * Configuração das abas
     */
    config: null,
    
    /**
     * Estado atual (qual aba está aberta)
     */
    currentOpenTab: null,
    
    /**
     * Injeta abas no container especificado
     * @param {String} containerId - ID do container onde as abas serão injetadas
     * @param {Object} tabsConfig - Configuração das abas
     */
    inserir(containerId, tabsConfig) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} não encontrado`);
            return;
        }
        
        this.config = tabsConfig;
        
        container.innerHTML = `
            <div class="calculator-tabs-container">
                <!-- Navegação das Abas (sempre visível) -->
                <div class="tabs-nav" role="tablist" id="tabs-nav-bar">
                    <button 
                        class="tab-button" 
                        data-tab="oque-e"
                        role="tab"
                        aria-expanded="false"
                        aria-controls="tab-oque-e"
                        tabindex="0"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        O que é?
                        <svg class="chevron-icon w-4 h-4 ml-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <button 
                        class="tab-button" 
                        data-tab="como-utilizar"
                        role="tab"
                        aria-expanded="false"
                        aria-controls="tab-como-utilizar"
                        tabindex="-1"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        Como Utilizar?
                        <svg class="chevron-icon w-4 h-4 ml-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <button 
                        class="tab-button" 
                        data-tab="referencia-tecnica"
                        role="tab"
                        aria-expanded="false"
                        aria-controls="tab-referencia-tecnica"
                        tabindex="-1"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        Referência Técnica
                        <svg class="chevron-icon w-4 h-4 ml-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <button 
                        class="tab-button" 
                        data-tab="configuracoes"
                        role="tab"
                        aria-expanded="false"
                        aria-controls="tab-configuracoes"
                        tabindex="-1"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Configurações
                        <svg class="chevron-icon w-4 h-4 ml-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Conteúdo das Abas (inicialmente oculto) -->
                <div class="tabs-content-wrapper">
                    <!-- Aba: O que é? -->
                    <div 
                        id="tab-oque-e" 
                        class="tab-panel"
                        role="tabpanel"
                        aria-labelledby="tab-oque-e"
                    >
                        ${this.renderOQueE()}
                    </div>
                    
                    <!-- Aba: Como Utilizar? -->
                    <div 
                        id="tab-como-utilizar" 
                        class="tab-panel"
                        role="tabpanel"
                        aria-labelledby="tab-como-utilizar"
                    >
                        ${this.renderComoUtilizar()}
                    </div>
                    
                    <!-- Aba: Referência Técnica -->
                    <div 
                        id="tab-referencia-tecnica" 
                        class="tab-panel"
                        role="tabpanel"
                        aria-labelledby="tab-referencia-tecnica"
                    >
                        ${this.renderReferenciaTecnica()}
                    </div>
                    
                    <!-- Aba: Configurações -->
                    <div 
                        id="tab-configuracoes" 
                        class="tab-panel"
                        role="tabpanel"
                        aria-labelledby="tab-configuracoes"
                    >
                        ${this.renderConfiguracoes()}
                    </div>
                </div>
            </div>
        `;
        
        // Adiciona event listeners
        this.setupEventListeners();
        
        console.log('✓ Abas da calculadora injetadas (modo colapsável)');
    },
    
    /**
     * Renderiza conteúdo da aba "O que é?"
     */
    renderOQueE() {
        const { descricao, formula, aplicacaoQuimioterapia, valoresReferencia, consideracoes, referencias } = this.config;
        
        return `
            <div class="tab-section">
                <!-- Descrição -->
                ${descricao ? `
                    <div class="mb-6">
                        <p class="text-gray-700 leading-relaxed">
                            ${descricao}
                        </p>
                    </div>
                ` : ''}
                
                <!-- Fórmula -->
                ${formula ? `
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                        <h3 class="text-lg font-semibold mb-3" style="color: #1A3E74;">
                            ${formula.titulo}
                        </h3>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-sm text-gray-600 mb-2">${formula.label}</p>
                            <p class="text-lg font-semibold mb-2" style="color: #1A3E74;">
                                ${formula.equacao}
                            </p>
                            ${formula.observacao ? `
                                <p class="text-xs text-gray-500 mt-2">
                                    ${formula.observacao}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Aplicação em Quimioterapia -->
                ${aplicacaoQuimioterapia ? `
                    <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
                        <h3 class="text-lg font-semibold mb-3" style="color: #1A3E74;">
                            ${aplicacaoQuimioterapia.titulo}
                        </h3>
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-700 mb-4">
                                ${aplicacaoQuimioterapia.descricao}
                            </p>
                            <div class="p-3 bg-teal-50 rounded-lg mb-3">
                                <p class="text-sm font-semibold text-teal-900 mb-2">Fórmula:</p>
                                <p class="text-base font-bold" style="color: #1A3E74;">
                                    ${aplicacaoQuimioterapia.formula}
                                </p>
                            </div>
                            <div class="p-3 bg-cyan-50 rounded-lg">
                                <p class="text-sm text-gray-700">
                                    ${aplicacaoQuimioterapia.exemplo}
                                </p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Valores de Referência -->
                ${valoresReferencia && valoresReferencia.length > 0 ? `
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                        <h3 class="text-lg font-semibold mb-3" style="color: #1A3E74;">
                            Valores de Referência
                        </h3>
                        <div class="space-y-2">
                            ${valoresReferencia.map(ref => `
                                <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span class="font-medium text-gray-800">${ref.label}</span>
                                    <span class="text-gray-600 font-semibold">${ref.valor}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Considerações Importantes -->
                ${consideracoes && consideracoes.length > 0 ? `
                    <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 mb-6">
                        <h3 class="text-lg font-semibold mb-3" style="color: #1A3E74;">
                            Considerações Importantes
                        </h3>
                        <ul class="space-y-2">
                            ${consideracoes.map(item => `
                                <li class="flex items-start text-gray-700">
                                    <span class="text-amber-600 mr-2 mt-0.5">•</span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Referências Bibliográficas -->
                ${referencias && referencias.length > 0 ? `
                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-3" style="color: #1A3E74;">
                            Referências Bibliográficas
                        </h3>
                        <div class="space-y-3 text-sm text-gray-700">
                            ${referencias.map((ref, index) => `
                                <div class="p-3 bg-white rounded-lg">
                                    <p class="font-medium">
                                        ${index + 1}. ${ref.autores}. ${ref.titulo}. 
                                        <em>${ref.publicacao}</em>. ${ref.ano}${ref.detalhes ? '; ' + ref.detalhes : ''}.
                                        ${ref.doi ? ` DOI: ${ref.doi}` : ''}
                                    </p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    /**
     * Renderiza conteúdo da aba "Como Utilizar?"
     */
    renderComoUtilizar() {
        const { comoUtilizar } = this.config;
        
        if (!comoUtilizar) {
            return `
                <div class="tab-section">
                    <div class="bg-blue-50 p-4 rounded">
                        <p class="text-gray-700">
                            <strong>Instruções de Uso:</strong>
                        </p>
                        <ol class="mt-3 space-y-2 text-gray-700 list-decimal list-inside">
                            <li>Preencha os <strong>Dados do Paciente</strong> (opcional, mas recomendado para rastreabilidade)</li>
                            <li>Insira os <strong>Parâmetros</strong> necessários para o cálculo</li>
                            <li>Clique no botão <strong>"Calcular"</strong></li>
                            <li>Visualize os resultados e interpretações clínicas</li>
                            <li>Utilize os botões <strong>"Copiar"</strong> ou <strong>"Exportar PDF"</strong> para registrar os resultados</li>
                            <li>Use o botão <strong>"Limpar"</strong> para realizar um novo cálculo</li>
                        </ol>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="tab-section">
                ${comoUtilizar}
            </div>
        `;
    },
    
    /**
     * Renderiza conteúdo da aba "Referência Técnica"
     */
    renderReferenciaTecnica() {
        const { versao, ultimaAtualizacao, desenvolvedor } = this.config;
        
        const dataAtual = new Date();
        const dataFormatada = `${String(dataAtual.getDate()).padStart(2, '0')}/${String(dataAtual.getMonth() + 1).padStart(2, '0')}/${dataAtual.getFullYear()}`;
        
        return `
            <div class="tab-section">
                <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6">
                    <h3 class="text-lg font-semibold mb-4" style="color: #1A3E74;">
                        Informações Técnicas da Ferramenta
                    </h3>
                    
                    <div class="space-y-4">
                        <div class="p-4 bg-white rounded-lg">
                            <p class="text-sm text-gray-600">Versão</p>
                            <p class="text-lg font-semibold text-gray-800">${versao || '1.0.0'}</p>
                        </div>
                        
                        <div class="p-4 bg-white rounded-lg">
                            <p class="text-sm text-gray-600">Última Atualização</p>
                            <p class="text-lg font-semibold text-gray-800">${ultimaAtualizacao || dataFormatada}</p>
                        </div>
                        
                        <div class="p-4 bg-white rounded-lg">
                            <p class="text-sm text-gray-600">Desenvolvedor</p>
                            <p class="text-lg font-semibold text-gray-800">${desenvolvedor || 'Calculadoras de Enfermagem'}</p>
                        </div>
                        
                        <div class="p-4 bg-white rounded-lg">
                            <p class="text-sm text-gray-600">Plataforma</p>
                            <p class="text-lg font-semibold text-gray-800">Web Application</p>
                        </div>
                        
                        <div class="p-4 bg-blue-50 rounded-lg mt-4">
                            <p class="text-xs text-gray-600 leading-relaxed">
                                <strong>Nota:</strong> Esta calculadora foi desenvolvida com base em evidências científicas e 
                                diretrizes clínicas atualizadas. Recomenda-se sempre verificar os protocolos institucionais 
                                e consultar profissionais de saúde qualificados antes de aplicar os resultados na prática clínica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza conteúdo da aba "Configurações"
     */
    renderConfiguracoes() {
        return `
            <div class="tab-section">
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 class="text-lg font-semibold mb-4" style="color: #1A3E74;">
                        Preferências de Configuração
                    </h3>
                    
                    <!-- Dados do Profissional -->
                    <div class="mb-6">
                        <h4 class="font-semibold text-gray-800 mb-3">
                            Dados do Profissional
                        </h4>
                        <div class="space-y-3 bg-white p-4 rounded-lg border-2 border-blue-200">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">Nome do Profissional (nome completo)</label>
                                <input 
                                    type="text" 
                                    id="config-nome-profissional" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Maria Silva Santos"
                                >
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">COREN</label>
                                <input 
                                    type="text" 
                                    id="config-coren" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: COREN-SP 123456"
                                >
                            </div>
                            
                            <!-- Botões de Ação -->
                            <div class="flex gap-2 mt-4">
                                <button 
                                    onclick="CalculatorTabs.salvarDadosProfissional()" 
                                    class="flex-1 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
                                    style="background: linear-gradient(135deg, #1A3E74 0%, #2B5C97 100%);"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                    </svg>
                                    Salvar
                                </button>
                                <button 
                                    onclick="CalculatorTabs.limparDadosProfissional()" 
                                    class="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Limpar
                                </button>
                                <button 
                                    onclick="CalculatorTabs.editarDadosProfissional()" 
                                    class="flex-1 bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-200 flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Editar
                                </button>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div class="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <p class="text-xs text-gray-600">
                                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <strong>Informação:</strong> Seus dados são armazenados localmente no seu navegador e nunca são enviados para servidores externos.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Configurações de PDF -->
                    <div class="mb-6">
                        <h4 class="font-semibold text-gray-800 mb-3">
                            Exportação PDF
                        </h4>
                        <p class="text-sm text-gray-600 mb-4">
                            Customize as informações que você gostaria que sua impressão em PDF tenha:
                        </p>
                        
                        <!-- Campos Obrigatórios -->
                        <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                            <h5 class="text-sm font-bold text-red-700 mb-3 flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                Campos Obrigatórios
                            </h5>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <span class="text-gray-700">• Logotipo</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-gray-700">• Resultado</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-gray-700">• Data, Hora (local) e IP do computador que gerou o cálculo</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-gray-700">• Aviso Legal e Ciência (Recomendado para Cálculos Críticos)</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Campos Opcionais (Altamente recomendável) -->
                        <div class="bg-white border-2 border-green-200 rounded-lg p-4">
                            <h5 class="text-sm font-bold text-green-700 mb-3 flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Campos Opcionais (Altamente recomendável)
                            </h5>
                            <div class="space-y-3">
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Dados do Paciente</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-paciente" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Parâmetros</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-parametros" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Metas Internacionais de Segurança do Paciente</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-metas-seguranca" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">9 Acertos de Medicamentos</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-9-acertos" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Auditoria do Cálculo</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-auditoria" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Campo de Observações</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-observacoes" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">QR Code</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-qrcode" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                                <label class="flex items-center justify-between cursor-pointer">
                                    <span class="text-gray-700">Dados do Profissional</span>
                                    <div class="switch">
                                        <input type="checkbox" id="config-pdf-profissional" checked>
                                        <span class="slider"></span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Conversor de Unidades -->
                    <div class="mb-6">
                        <h4 class="font-semibold text-gray-800 mb-3">
                            Conversor de Unidades
                        </h4>
                        <div class="bg-white p-4 rounded-lg border-2 border-gray-200">
                            <div class="mb-3">
                                <label class="text-sm font-semibold text-gray-800 mb-2 block">Preferência de Sistema de Unidades</label>
                                <select 
                                    id="config-sistema-unidades" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="internacional">Sistema Internacional (kg, cm, °C, mL)</option>
                                    <option value="americana">Sistema Americano (lb, in, °F, oz)</option>
                                </select>
                                <p class="text-xs text-gray-600 mt-2">
                                    Esta preferência será aplicada automaticamente nos campos da calculadora
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Configurações de Interface -->
                    <div class="mb-6">
                        <h4 class="font-semibold text-gray-800 mb-3">
                            Interface
                        </h4>
                        <div class="space-y-3 bg-white p-4 rounded-lg border-2 border-gray-200">
                            <label class="flex items-center justify-between cursor-pointer">
                                <span class="text-gray-700">Modo Compacto (menos espaçamento)</span>
                                <div class="switch">
                                    <input type="checkbox" id="config-modo-compacto">
                                    <span class="slider"></span>
                                </div>
                            </label>
                            <label class="flex items-center justify-between cursor-pointer">
                                <span class="text-gray-700">Auto-foco no primeiro campo</span>
                                <div class="switch">
                                    <input type="checkbox" id="config-auto-focus" checked>
                                    <span class="slider"></span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Botões de Ação -->
                    <div class="flex gap-3 mt-6">
                        <button 
                            onclick="CalculatorTabs.salvarConfiguracoes()" 
                            class="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
                            style="background: linear-gradient(135deg, #1A3E74 0%, #2B5C97 100%);"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                            Salvar Preferências
                        </button>
                        <button 
                            onclick="CalculatorTabs.restaurarPadroes()" 
                            class="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Restaurar Padrões
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Configura event listeners para as abas
     */
    setupEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        // Click em botões de abas
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.toggleTab(tabName);
            });
        });
        
        // Navegação por teclado (setas e Enter)
        document.getElementById('tabs-nav-bar')?.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            this.handleClickOutside(e);
        });
        
        // Fechar ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentOpenTab) {
                this.closeTab(this.currentOpenTab);
            }
        });
        
        // Carrega configurações salvas
        this.carregarConfiguracoes();
    },
    
    /**
     * Alterna aba (abre se fechada, fecha se aberta)
     * @param {String} tabName - Nome da aba
     */
    toggleTab(tabName) {
        if (this.currentOpenTab === tabName) {
            // Se a aba já está aberta, fecha
            this.closeTab(tabName);
        } else {
            // Fecha qualquer aba aberta e abre a nova
            if (this.currentOpenTab) {
                this.closeTab(this.currentOpenTab);
            }
            this.openTab(tabName);
        }
    },
    
    /**
     * Abre uma aba específica
     * @param {String} tabName - Nome da aba
     */
    openTab(tabName) {
        const button = document.querySelector(`[data-tab="${tabName}"]`);
        const panel = document.getElementById(`tab-${tabName}`);
        
        if (button && panel) {
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
            
            // Rotaciona chevron
            const chevron = button.querySelector('.chevron-icon');
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
            }
            
            panel.classList.add('active');
            this.currentOpenTab = tabName;
        }
    },
    
    /**
     * Fecha uma aba específica
     * @param {String} tabName - Nome da aba
     */
    closeTab(tabName) {
        const button = document.querySelector(`[data-tab="${tabName}"]`);
        const panel = document.getElementById(`tab-${tabName}`);
        
        if (button && panel) {
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
            
            // Rotaciona chevron de volta
            const chevron = button.querySelector('.chevron-icon');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
            
            panel.classList.remove('active');
            this.currentOpenTab = null;
        }
    },
    
    /**
     * Gerencia navegação por teclado
     * @param {Event} e - Evento de teclado
     */
    handleKeyboardNavigation(e) {
        const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = tabButtons.findIndex(btn => btn === document.activeElement);
        
        let nextIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % tabButtons.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (currentIndex >= 0) {
                    const tabName = tabButtons[currentIndex].dataset.tab;
                    this.toggleTab(tabName);
                }
                return;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = tabButtons.length - 1;
                break;
            default:
                return;
        }
        
        // Foca no próximo botão
        if (nextIndex !== currentIndex) {
            tabButtons[nextIndex].focus();
            // Atualiza tabindex
            tabButtons.forEach((btn, idx) => {
                btn.setAttribute('tabindex', idx === nextIndex ? '0' : '-1');
            });
        }
    },
    
    /**
     * Fecha aba ao clicar fora
     * @param {Event} e - Evento de clique
     */
    handleClickOutside(e) {
        if (!this.currentOpenTab) return;
        
        const tabsContainer = document.querySelector('.calculator-tabs-container');
        if (tabsContainer && !tabsContainer.contains(e.target)) {
            this.closeTab(this.currentOpenTab);
        }
    },
    
    /**
     * Salva configurações no localStorage
     */
    salvarConfiguracoes() {
        const config = {
            // PDF
            pdfPaciente: document.getElementById('config-pdf-paciente')?.checked || true,
            pdfParametros: document.getElementById('config-pdf-parametros')?.checked || true,
            pdfProfissional: document.getElementById('config-pdf-profissional')?.checked || true,
            pdfResultado: true, // Sempre true (obrigatório)
            pdfMetasSeguranca: document.getElementById('config-pdf-metas-seguranca')?.checked || true,
            pdf9Acertos: document.getElementById('config-pdf-9-acertos')?.checked || true,
            pdfAuditoria: document.getElementById('config-pdf-auditoria')?.checked || true,
            pdfObservacoes: document.getElementById('config-pdf-observacoes')?.checked || true,
            pdfQRCode: document.getElementById('config-pdf-qrcode')?.checked || true,
            pdfTimestamp: true, // Sempre true (obrigatório)
            
            // Conversor de Unidades
            convPeso: document.getElementById('config-conv-peso')?.checked || true,
            convAltura: document.getElementById('config-conv-altura')?.checked || true,
            convVolume: document.getElementById('config-conv-volume')?.checked || true,
            convTemperatura: document.getElementById('config-conv-temperatura')?.checked || true,
            conversorAuto: document.getElementById('config-conversor-auto')?.checked || true,
            conversorSidebar: document.getElementById('config-conversor-sidebar')?.checked || true,
            
            // Interface
            modoCompacto: document.getElementById('config-modo-compacto')?.checked || false,
            autoFocus: document.getElementById('config-auto-focus')?.checked || true
        };
        
        localStorage.setItem('calculatorConfig', JSON.stringify(config));
        
        if (typeof mostrarModalFeedback === 'function') {
            mostrarModalFeedback('✅ Configurações salvas com sucesso!', 'success');
        } else {
            alert('✅ Configurações salvas com sucesso!');
        }
    },
    
    /**
     * Carrega configurações do localStorage
     */
    carregarConfiguracoes() {
        // Carrega dados do profissional (localStorage separado)
        const dadosProfissional = localStorage.getItem('dadosProfissional');
        if (dadosProfissional) {
            try {
                const dados = JSON.parse(dadosProfissional);
                if (document.getElementById('config-nome-profissional')) {
                    document.getElementById('config-nome-profissional').value = dados.nome || '';
                    document.getElementById('config-nome-profissional').disabled = true;
                }
                if (document.getElementById('config-coren')) {
                    document.getElementById('config-coren').value = dados.coren || '';
                    document.getElementById('config-coren').disabled = true;
                }
            } catch (error) {
                console.error('Erro ao carregar dados do profissional:', error);
            }
        }
        
        // Carrega outras configurações
        const savedConfig = localStorage.getItem('calculatorConfig');
        if (!savedConfig) return;
        
        try {
            const config = JSON.parse(savedConfig);
            
            // PDF (sem os campos obrigatórios que agora são apenas texto)
            if (document.getElementById('config-pdf-paciente')) {
                document.getElementById('config-pdf-paciente').checked = config.pdfPaciente ?? true;
                document.getElementById('config-pdf-parametros').checked = config.pdfParametros ?? true;
                document.getElementById('config-pdf-profissional').checked = config.pdfProfissional ?? true;
                document.getElementById('config-pdf-metas-seguranca').checked = config.pdfMetasSeguranca ?? true;
                document.getElementById('config-pdf-9-acertos').checked = config.pdf9Acertos ?? true;
                document.getElementById('config-pdf-auditoria').checked = config.pdfAuditoria ?? true;
                document.getElementById('config-pdf-observacoes').checked = config.pdfObservacoes ?? true;
                document.getElementById('config-pdf-qrcode').checked = config.pdfQRCode ?? true;
            }
            
            // Conversor de Unidades
            if (document.getElementById('config-conv-peso')) {
                document.getElementById('config-conv-peso').checked = config.convPeso ?? true;
                document.getElementById('config-conv-altura').checked = config.convAltura ?? true;
                document.getElementById('config-conv-volume').checked = config.convVolume ?? true;
                document.getElementById('config-conv-temperatura').checked = config.convTemperatura ?? true;
                document.getElementById('config-conversor-auto').checked = config.conversorAuto ?? true;
                document.getElementById('config-conversor-sidebar').checked = config.conversorSidebar ?? true;
            }
            
            // Interface
            if (document.getElementById('config-modo-compacto')) {
                document.getElementById('config-modo-compacto').checked = config.modoCompacto ?? false;
                document.getElementById('config-auto-focus').checked = config.autoFocus ?? true;
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    },
    
    /**
     * Restaura configurações padrão
     */
    restaurarPadroes() {
        if (confirm('Deseja restaurar as configurações padrão?')) {
            localStorage.removeItem('calculatorConfig');
            
            // Marca opções padrão - PDF (sem os campos obrigatórios que agora são apenas texto)
            if (document.getElementById('config-pdf-paciente')) {
                document.getElementById('config-pdf-paciente').checked = true;
                document.getElementById('config-pdf-parametros').checked = true;
                document.getElementById('config-pdf-profissional').checked = true;
                document.getElementById('config-pdf-metas-seguranca').checked = true;
                document.getElementById('config-pdf-9-acertos').checked = true;
                document.getElementById('config-pdf-auditoria').checked = true;
                document.getElementById('config-pdf-observacoes').checked = true;
                document.getElementById('config-pdf-qrcode').checked = true;
            }
            
            // Marca opções padrão - Conversor
            if (document.getElementById('config-conv-peso')) {
                document.getElementById('config-conv-peso').checked = true;
                document.getElementById('config-conv-altura').checked = true;
                document.getElementById('config-conv-volume').checked = true;
                document.getElementById('config-conv-temperatura').checked = true;
                document.getElementById('config-conversor-auto').checked = true;
                document.getElementById('config-conversor-sidebar').checked = true;
            }
            
            // Marca opções padrão - Interface
            if (document.getElementById('config-modo-compacto')) {
                document.getElementById('config-modo-compacto').checked = false;
                document.getElementById('config-auto-focus').checked = true;
            }
            
            if (typeof mostrarModalFeedback === 'function') {
                mostrarModalFeedback('✅ Configurações restauradas!', 'success');
            } else {
                alert('✅ Configurações restauradas!');
            }
        }
    },
    
    /**
     * Obtém configurações atuais
     * @returns {Object} Configurações atuais
     */
    getConfiguracoes() {
        const savedConfig = localStorage.getItem('calculatorConfig');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
        
        // Configurações padrão
        return {
            pdfPaciente: true,
            pdfParametros: true,
            pdfProfissional: true,
            pdfResultado: true,
            pdfMetasSeguranca: true,
            pdf9Acertos: true,
            pdfAuditoria: true,
            pdfObservacoes: true,
            pdfQRCode: true,
            pdfTimestamp: true,
            convPeso: true,
            convAltura: true,
            convVolume: true,
            convTemperatura: true,
            conversorAuto: true,
            conversorSidebar: true,
            modoCompacto: false,
            autoFocus: true
        };
    },
    
    /**
     * Funções de Conversão de Unidades
     */
    
    /**
     * Converte peso entre kg e lb
     */
    converterPeso(from) {
        const kg = document.getElementById('conv-kg');
        const lb = document.getElementById('conv-lb');
        
        if (!kg || !lb) return;
        
        if (from === 'kg' && kg.value) {
            lb.value = (parseFloat(kg.value) * 2.20462).toFixed(2);
        } else if (from === 'lb' && lb.value) {
            kg.value = (parseFloat(lb.value) / 2.20462).toFixed(2);
        }
    },
    
    /**
     * Converte altura entre cm e in
     */
    converterAltura(from) {
        const cm = document.getElementById('conv-cm');
        const inches = document.getElementById('conv-in');
        
        if (!cm || !inches) return;
        
        if (from === 'cm' && cm.value) {
            inches.value = (parseFloat(cm.value) / 2.54).toFixed(2);
        } else if (from === 'in' && inches.value) {
            cm.value = (parseFloat(inches.value) * 2.54).toFixed(2);
        }
    },
    
    /**
     * Converte temperatura entre °C e °F
     */
    converterTemperatura(from) {
        const celsius = document.getElementById('conv-celsius');
        const fahrenheit = document.getElementById('conv-fahrenheit');
        
        if (!celsius || !fahrenheit) return;
        
        if (from === 'celsius' && celsius.value) {
            fahrenheit.value = ((parseFloat(celsius.value) * 9/5) + 32).toFixed(1);
        } else if (from === 'fahrenheit' && fahrenheit.value) {
            celsius.value = ((parseFloat(fahrenheit.value) - 32) * 5/9).toFixed(1);
        }
    },
    
    /**
     * Converte volume entre mL e oz
     */
    converterVolume(from) {
        const ml = document.getElementById('conv-ml');
        const oz = document.getElementById('conv-oz');
        
        if (!ml || !oz) return;
        
        if (from === 'ml' && ml.value) {
            oz.value = (parseFloat(ml.value) / 29.5735).toFixed(2);
        } else if (from === 'oz' && oz.value) {
            ml.value = (parseFloat(oz.value) * 29.5735).toFixed(2);
        }
    },
    
    /**
     * Limpa todos os campos do conversor
     */
    limparConversor() {
        const campos = [
            'conv-kg', 'conv-lb',
            'conv-cm', 'conv-in',
            'conv-celsius', 'conv-fahrenheit',
            'conv-ml', 'conv-oz'
        ];
        
        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.value = '';
        });
    },
    
    /**
     * Salva dados do profissional no localStorage
     */
    salvarDadosProfissional() {
        const nome = document.getElementById('config-nome-profissional')?.value || '';
        const coren = document.getElementById('config-coren')?.value || '';
        
        if (!nome && !coren) {
            alert('⚠️ Preencha pelo menos um campo antes de salvar.');
            return;
        }
        
        // Salva no localStorage
        const dadosProfissional = { nome, coren };
        localStorage.setItem('dadosProfissional', JSON.stringify(dadosProfissional));
        
        // Bloqueia os campos
        document.getElementById('config-nome-profissional').disabled = true;
        document.getElementById('config-coren').disabled = true;
        
        if (typeof mostrarModalFeedback === 'function') {
            mostrarModalFeedback('✅ Dados do profissional salvos com sucesso!', 'success');
        } else {
            alert('✅ Dados do profissional salvos com sucesso!');
        }
    },
    
    /**
     * Limpa dados do profissional
     */
    limparDadosProfissional() {
        if (confirm('Deseja limpar os dados do profissional?')) {
            document.getElementById('config-nome-profissional').value = '';
            document.getElementById('config-coren').value = '';
            document.getElementById('config-nome-profissional').disabled = false;
            document.getElementById('config-coren').disabled = false;
            
            localStorage.removeItem('dadosProfissional');
            
            if (typeof mostrarModalFeedback === 'function') {
                mostrarModalFeedback('✅ Dados limpos!', 'success');
            } else {
                alert('✅ Dados limpos!');
            }
        }
    },
    
    /**
     * Habilita edição dos dados do profissional
     */
    editarDadosProfissional() {
        const nomeField = document.getElementById('config-nome-profissional');
        const corenField = document.getElementById('config-coren');
        
        if (nomeField.disabled || corenField.disabled) {
            nomeField.disabled = false;
            corenField.disabled = false;
            nomeField.focus();
            
            if (typeof mostrarModalFeedback === 'function') {
                mostrarModalFeedback('✏️ Modo de edição ativado!', 'info');
            } else {
                alert('✏️ Modo de edição ativado!');
            }
        } else {
            if (typeof mostrarModalFeedback === 'function') {
                mostrarModalFeedback('ℹ️ Os campos já estão disponíveis para edição.', 'info');
            } else {
                alert('ℹ️ Os campos já estão disponíveis para edição.');
            }
        }
    }
};

// Exporta para uso global
window.CalculatorTabs = CalculatorTabs;

console.log('✓ Módulo Calculator Tabs carregado (modo colapsável)');