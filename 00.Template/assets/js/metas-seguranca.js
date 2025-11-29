/**
 * METAS INTERNACIONAIS DE SEGURANÇA DO PACIENTE
 * Conteúdo modular reutilizável para todas as calculadoras
 * Baseado nas 6 Metas Internacionais de Segurança do Paciente da Joint Commission
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const MetasSeguranca = {
    /**
     * Dados das 6 Metas Internacionais de Segurança do Paciente
     */
    metas: [
        {
            numero: 1,
            titulo: 'Identificar os pacientes corretamente',
            icon: '🏷️',
            descricao: 'Utilizar pelo menos dois identificadores (nome completo e data de nascimento) antes de realizar qualquer procedimento, administrar medicamentos ou coletar amostras.',
            acoes: [
                'Verificar pulseira de identificação',
                'Confirmar nome completo e data de nascimento',
                'Nunca usar número do leito como identificador',
                'Questionar o paciente sobre sua identidade'
            ]
        },
        {
            numero: 2,
            titulo: 'Melhorar a comunicação efetiva',
            icon: '💬',
            descricao: 'Garantir comunicação clara, completa e precisa entre profissionais de saúde, especialmente em ordens verbais, resultados críticos e passagem de plantão.',
            acoes: [
                'Utilizar técnica READ-BACK para ordens verbais',
                'Comunicar resultados críticos imediatamente',
                'Padronizar passagem de plantão (SBAR/ISBAR)',
                'Evitar abreviações perigosas'
            ]
        },
        {
            numero: 3,
            titulo: 'Melhorar a segurança de medicamentos de alta vigilância',
            icon: '💉',
            descricao: 'Armazenar, prescrever, preparar e administrar medicamentos potencialmente perigosos com dupla checagem e protocolos específicos.',
            acoes: [
                'Dupla checagem em medicamentos de alta vigilância',
                'Armazenamento segregado e identificado',
                'Usar bombas de infusão com limites programados',
                'Conhecer lista de medicamentos potencialmente perigosos'
            ]
        },
        {
            numero: 4,
            titulo: 'Assegurar cirurgias com local de intervenção correto, procedimento correto e paciente correto',
            icon: '✅',
            descricao: 'Implementar protocolo de cirurgia segura com marcação do sítio cirúrgico, checklist e timeout antes do procedimento.',
            acoes: [
                'Marcar sítio cirúrgico com participação do paciente',
                'Realizar timeout antes de iniciar procedimento',
                'Utilizar checklist de cirurgia segura (OMS)',
                'Confirmar procedimento, paciente e lateralidade'
            ]
        },
        {
            numero: 5,
            titulo: 'Reduzir o risco de infecções associadas aos cuidados de saúde',
            icon: '🧼',
            descricao: 'Implementar práticas baseadas em evidências de higiene das mãos, precauções de contato e protocolos de prevenção de IRAS.',
            acoes: [
                'Higienizar mãos nos 5 momentos (OMS)',
                'Utilizar técnica asséptica em procedimentos invasivos',
                'Implementar bundles de prevenção de IRAS',
                'Monitorar adesão à higiene das mãos'
            ]
        },
        {
            numero: 6,
            titulo: 'Reduzir o risco de lesões ao paciente decorrente de quedas',
            icon: '🚨',
            descricao: 'Avaliar risco de quedas, implementar medidas preventivas e orientar pacientes e familiares sobre prevenção.',
            acoes: [
                'Aplicar escala de avaliação de risco de quedas',
                'Manter grades do leito elevadas quando indicado',
                'Garantir ambiente seguro e iluminado',
                'Orientar paciente e família sobre prevenção'
            ]
        }
    ],
    
    /**
     * Renderiza card de uma meta específica
     * @param {Object} meta - Objeto com dados da meta
     * @returns {String} HTML do card
     */
    renderMetaCard(meta) {
        const acoesHTML = meta.acoes.map(acao => 
            `<li class="flex items-start">
                <span class="text-blue-600 mr-2 mt-1">•</span>
                <span class="text-sm">${acao}</span>
            </li>`
        ).join('');
        
        return `
            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-start mb-3">
                    <span class="text-3xl mr-3">${meta.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800 mb-1">
                            Meta ${meta.numero}: ${meta.titulo}
                        </h4>
                        <p class="text-sm text-gray-600 mb-3">${meta.descricao}</p>
                    </div>
                </div>
                <div class="bg-blue-50 rounded-lg p-3">
                    <p class="text-xs font-semibold text-blue-800 mb-2">Ações Práticas:</p>
                    <ul class="space-y-1">${acoesHTML}</ul>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza seção completa de Metas Internacionais (FORMATO CHECKLIST)
     * @returns {String} HTML completo da seção
     */
    renderSecaoCompleta() {
        return `
            <div id="metas-seguranca-checklist" class="bg-white rounded-b-lg shadow-md border border-t-0 border-gray-200 overflow-hidden mt-0 rounded-t-none">
                <h4 class="bg-gray-50 text-[#1A3E74] p-3 font-semibold text-lg border-b border-gray-200">
                    Metas Internacionais de Segurança
                </h4>
                <div class="p-6">
                    <div class="space-y-2">
                        <!-- Meta 1 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-red-100 text-sm cursor-pointer hover:bg-red-50">
                            <input type="checkbox" id="check-meta-1" class="mr-3 accent-[#1A3E74]">
                            <span class="text-red-800">Meta 1: Identificar corretamente o paciente</span>
                        </label>
                        <!-- Meta 2 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-yellow-100 text-sm cursor-pointer hover:bg-yellow-50">
                            <input type="checkbox" id="check-meta-2" class="mr-3 accent-[#1A3E74]">
                            <span class="text-yellow-800">Meta 2: Melhorar a comunicação efetiva</span>
                        </label>
                        <!-- Meta 3 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-blue-100 text-sm cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" id="check-meta-3" class="mr-3 accent-[#1A3E74]">
                            <span class="text-blue-800">Meta 3: Melhorar a segurança na prescrição, no uso e na administração de medicamentos</span>
                        </label>
                        <!-- Meta 4 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-purple-100 text-sm cursor-pointer hover:bg-purple-50">
                            <input type="checkbox" id="check-meta-4" class="mr-3 accent-[#1A3E74]">
                            <span class="text-purple-800">Meta 4: Assegurar cirurgia em local, procedimento e paciente corretos</span>
                        </label>
                        <!-- Meta 5 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-green-100 text-sm cursor-pointer hover:bg-green-50">
                            <input type="checkbox" id="check-meta-5" class="mr-3 accent-[#1A3E74]">
                            <span class="text-green-800">Meta 5: Higienizar as mãos para prevenir infecções</span>
                        </label>
                        <!-- Meta 6 -->
                        <label class="flex items-center p-3 rounded transition-colors duration-200 bg-orange-100 text-sm cursor-pointer hover:bg-orange-50">
                            <input type="checkbox" id="check-meta-6" class="mr-3 accent-[#1A3E74]">
                            <span class="text-orange-800">Meta 6: Reduzir o risco de danos ao paciente em decorrência de quedas</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Insere seção de Metas no DOM
     * @param {String} containerId - ID do container onde inserir
     */
    inserir(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        container.innerHTML = this.renderSecaoCompleta();
        console.log('✓ Metas Internacionais de Segurança (checklist) inseridas');
    },
    
    /**
     * Renderiza versão compacta das metas (para sidebar)
     * @returns {String} HTML da versão compacta
     */
    renderVersaoCompacta() {
        const metasHTML = this.metas.map(meta => 
            `<div class="flex items-start p-3 bg-white rounded-lg shadow-sm">
                <span class="text-2xl mr-3">${meta.icon}</span>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">${meta.numero}. ${meta.titulo}</p>
                </div>
            </div>`
        ).join('');
        
        return `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #1A3E74;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Metas de Segurança (JCI)
                </h3>
                <div class="space-y-2">
                    ${metasHTML}
                </div>
                <p class="text-xs text-gray-500 text-center mt-4">
                    Joint Commission International
                </p>
            </div>
        `;
    }
};

// Exporta para uso global
window.MetasSeguranca = MetasSeguranca;

console.log('✓ Módulo Metas Internacionais de Segurança carregado');
