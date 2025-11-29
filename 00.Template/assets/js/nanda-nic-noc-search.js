/**
 * NANDA/NIC/NOC SEARCH - Busca de Diagnósticos e Intervenções de Enfermagem
 * Abre busca no Google para NANDA, NIC e NOC baseado nos resultados da calculadora
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const NANDANICNOCSearch = {
    /**
     * Abre busca no Google para NANDA
     * @param {String} contexto - Contexto clínico baseado no resultado (ex: "hipotermia", "risco de queda")
     */
    buscarNANDA(contexto) {
        if (!contexto || contexto.trim() === '') {
            mostrarModalFeedback('⚠️ Nenhum contexto disponível para busca', 'error');
            return;
        }
        
        const query = `NANDA diagnóstico de enfermagem ${contexto}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        
        console.log('🔍 Busca NANDA:', query);
    },
    
    /**
     * Abre busca no Google para NIC (Nursing Interventions Classification)
     * @param {String} contexto - Contexto clínico baseado no resultado
     */
    buscarNIC(contexto) {
        if (!contexto || contexto.trim() === '') {
            mostrarModalFeedback('⚠️ Nenhum contexto disponível para busca', 'error');
            return;
        }
        
        const query = `NIC intervenções de enfermagem ${contexto}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        
        console.log('🔍 Busca NIC:', query);
    },
    
    /**
     * Abre busca no Google para NOC (Nursing Outcomes Classification)
     * @param {String} contexto - Contexto clínico baseado no resultado
     */
    buscarNOC(contexto) {
        if (!contexto || contexto.trim() === '') {
            mostrarModalFeedback('⚠️ Nenhum contexto disponível para busca', 'error');
            return;
        }
        
        const query = `NOC resultados de enfermagem ${contexto}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        
        console.log('🔍 Busca NOC:', query);
    },
    
    /**
     * Busca geral no Google combinando NANDA, NIC e NOC
     * @param {String} contexto - Contexto clínico baseado no resultado
     */
    buscarDiagnosticosIntervencoes(contexto) {
        if (!contexto || contexto.trim() === '') {
            mostrarModalFeedback('⚠️ Nenhum contexto disponível para busca', 'error');
            return;
        }
        
        const query = `NANDA NIC NOC enfermagem ${contexto}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        
        console.log('🔍 Busca NANDA/NIC/NOC:', query);
    },
    
    /**
     * Renderiza botões de busca NANDA/NIC/NOC
     * @param {String} contexto - Contexto clínico baseado no resultado
     * @returns {String} HTML dos botões
     */
    renderBotoesBusca(contexto) {
        if (!contexto) return '';
        
        return `
            <div class="bg-white rounded-lg shadow-md border border-t-0 border-gray-200 overflow-hidden mt-6">
                <h4 class="bg-[#1A3E74] text-white p-3 font-semibold text-lg">
                    Buscar Diagnósticos
                </h4>
                <div class="p-6">
                    <p class="text-sm text-gray-600 mb-4">
                        Busque diagnósticos (NANDA), intervenções (NIC) e resultados (NOC) relacionados ao resultado obtido:
                    </p>
                    <button 
                        onclick="NANDANICNOCSearch.buscarDiagnosticosIntervencoes('${contexto.replace(/'/g, "\\'")}')"
                        class="w-full bg-[#1A3E74] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#152E5A] transition duration-300 shadow-md flex items-center justify-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Pesquisar NANDA/NIC/NOC
                    </button>
                    <div class="mt-3 text-xs text-gray-500 text-center">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        A busca será aberta em nova aba do Google
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Insere botões de busca no DOM
     * @param {String} containerId - ID do container onde inserir os botões
     * @param {String} contexto - Contexto clínico
     */
    inserirBotoes(containerId, contexto) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        const botoesHTML = this.renderBotoesBusca(contexto);
        container.innerHTML += botoesHTML;
        
        console.log('✓ Botões NANDA/NIC/NOC inseridos');
    }
};

// Exporta para uso global
window.NANDANICNOCSearch = NANDANICNOCSearch;

console.log('✓ Módulo NANDA/NIC/NOC Search carregado');
