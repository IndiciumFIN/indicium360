/**
 * RELATED TOOLS - Tags e Ferramentas Relacionadas
 * Módulo de Calculadora - Exibe cards de ferramentas relacionadas
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const RelatedTools = {
    /**
     * Injeta seção de ferramentas relacionadas
     * @param {String} containerId - ID do container
     * @param {Object} toolsData - Dados das ferramentas {tags: [], ferramentas: []}
     */
    inserir(containerId, toolsData = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} não encontrado`);
            return;
        }
        
        // Se não houver dados, não renderiza nada
        if (!toolsData || (!toolsData.tags && !toolsData.ferramentas)) {
            container.innerHTML = '';
            console.log('✓ Related Tools: sem dados para exibir');
            return;
        }
        
        // Renderiza seção completa
        container.innerHTML = this.renderSection(toolsData);
        
        console.log('✓ Tags e Ferramentas Relacionadas injetadas (modular de calculadora)');
    },
    
    /**
     * Renderiza a seção completa
     * @param {Object} toolsData - Dados {tags: [], ferramentas: []}
     * @returns {String} HTML da seção
     */
    renderSection(toolsData) {
        const { tags, ferramentas } = toolsData;
        
        return `
            <!-- Author Box -->
            ${this.renderAuthorBox()}
            
            <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-md p-6 mt-8 mb-8">
                
                ${tags && tags.length > 0 ? this.renderTags(tags) : ''}
                
                ${ferramentas && ferramentas.length > 0 ? this.renderFerramentasRelacionadas(ferramentas) : ''}
                
            </div>
        `;
    },
    
    /**
     * Renderiza Author Box - Calculadoras de Enfermagem
     * @returns {String} HTML do Author Box
     */
    renderAuthorBox() {
        return `
            <div class="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-[#1A3E74]">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <img 
                        src="https://www.calculadorasdeenfermagem.com.br/icontopbar1.webp" 
                        alt="Calculadoras de Enfermagem" 
                        class="w-20 h-20 rounded-full object-cover shadow-md flex-shrink-0"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%231A3E74%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22white%22 font-family=%22Arial%22 font-size=%2240%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ECE%3C/text%3E%3C/svg%3E'"
                    >
                    <div class="flex-1">
                        <h3 class="text-xl font-bold mb-2" style="color: #1A3E74;">Calculadoras de Enfermagem</h3>
                        <p class="text-gray-700 text-sm leading-relaxed mb-3">
                            Ferramentas essenciais para profissionais e estudantes de enfermagem, oferecendo calculadoras de escalas clínicas e de dosagem de medicamentos para otimizar a prática diária e a segurança do paciente. São mais de 50 escalas clínicas disponíveis.
                        </p>
                        <blockquote class="border-l-3 border-[#1A3E74] pl-3 italic text-gray-600 text-sm">
                            "Conhecer e ter domínio em escalas clínicas é fundamental para o enfermeiro, auxilia na tomada de decisões, otimiza a assistência e empodera!"
                        </blockquote>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza tags
     * @param {Array} tags - Array de strings com tags
     * @returns {String} HTML das tags
     */
    renderTags(tags) {
        return `
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4" style="color: #1A3E74;">
                    Tags Relacionadas
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${tags.map(tag => `
                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                            </svg>
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza ferramentas relacionadas
     * @param {Array} ferramentas - Array de objetos {titulo, descricao, url, gradient, iconBg, icon}
     * @returns {String} HTML das ferramentas
     */
    renderFerramentasRelacionadas(ferramentas) {
        return `
            <div>
                <h3 class="text-lg font-semibold mb-4" style="color: #1A3E74;">
                    Ferramentas Relacionadas
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ferramentas.map(ferramenta => this.renderFerramentaCard(ferramenta)).join('')}
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza um card de ferramenta
     * @param {Object} ferramenta - {titulo, descricao, url, gradient, iconBg, icon}
     * @returns {String} HTML do card
     */
    renderFerramentaCard(ferramenta) {
        const { titulo, descricao, url, gradient, iconBg, icon } = ferramenta;
        
        return `
            <a 
                href="${url}" 
                class="group block bg-gradient-to-br ${gradient} hover:shadow-lg transition-all duration-300 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:scale-[1.02]"
            >
                <div class="flex items-start gap-3">
                    <div class="${iconBg} rounded-lg p-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        ${icon}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors duration-200">
                            ${titulo}
                        </h4>
                        <p class="text-sm text-gray-600">
                            ${descricao}
                        </p>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </a>
        `;
    },
    
    /**
     * Renderiza exemplo de ferramentas padrão (para referência)
     */
    getDefaultTools() {
        return {
            tags: [
                'Superfície Corporal',
                'Quimioterapia',
                'Dosagem Medicamentosa',
                'Oncologia',
                'Fórmula de Mosteller',
                'BSA',
                'Enfermagem Oncológica',
                'Cálculos Clínicos'
            ],
            ferramentas: [
                {
                    titulo: 'Calculadora de TFG',
                    descricao: 'Calcule a Taxa de Filtração Glomerular para avaliar função renal',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/tfg',
                    gradient: 'from-green-50 to-emerald-50',
                    iconBg: 'bg-green-100',
                    icon: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de TIMI',
                    descricao: 'Avalie o risco em síndrome coronariana aguda',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/timi',
                    gradient: 'from-red-50 to-pink-50',
                    iconBg: 'bg-red-100',
                    icon: `<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de Wells (TEP)',
                    descricao: 'Escore para avaliação de risco de tromboembolismo pulmonar',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/wells-tep',
                    gradient: 'from-blue-50 to-cyan-50',
                    iconBg: 'bg-blue-100',
                    icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de Wells (TVP)',
                    descricao: 'Escore para avaliação de risco de trombose venosa profunda',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/wells-tvp',
                    gradient: 'from-purple-50 to-indigo-50',
                    iconBg: 'bg-purple-100',
                    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>`
                }
            ]
        };
    }
};

// Exporta para uso global
window.RelatedTools = RelatedTools;

console.log('✓ Módulo Related Tools carregado (modular de calculadora)');
