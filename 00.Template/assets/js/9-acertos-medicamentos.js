/**
 * 9 ACERTOS DO CÁLCULO DE MEDICAMENTOS
 * Conteúdo modular reutilizável para todas as calculadoras de enfermagem
 * Baseado nas boas práticas de administração segura de medicamentos
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const NoveAcertosMedicamentos = {
    /**
     * Dados dos 9 Acertos (Certos) de Medicamentos
     */
    acertos: [
        {
            numero: 1,
            titulo: 'Paciente Certo',
            icon: '👤',
            cor: '#3B82F6',
            descricao: 'Confirmar a identidade do paciente antes de administrar qualquer medicamento.',
            checkpoints: [
                'Verificar pulseira de identificação',
                'Confirmar nome completo e data de nascimento',
                'Perguntar ao paciente seu nome (quando possível)',
                'Nunca usar número do leito como identificador',
                'Comparar dados com prescrição médica'
            ],
            exemplo: 'Antes de administrar: "Qual é o seu nome completo e data de nascimento?" e verificar pulseira'
        },
        {
            numero: 2,
            titulo: 'Medicamento Certo',
            icon: '💊',
            cor: '#10B981',
            descricao: 'Garantir que o medicamento a ser administrado é exatamente o prescrito.',
            checkpoints: [
                'Ler atentamente a prescrição médica',
                'Verificar o nome do medicamento 3 vezes',
                'Conferir medicamentos com nomes semelhantes (LASA)',
                'Checar validade do medicamento',
                'Não administrar se houver dúvidas'
            ],
            exemplo: 'Dopamina ≠ Dobutamina | Heparina ≠ Insulina (medicamentos LASA - Look-Alike, Sound-Alike)'
        },
        {
            numero: 3,
            titulo: 'Via Certa',
            icon: '💉',
            cor: '#F59E0B',
            descricao: 'Administrar o medicamento pela via correta conforme prescrição.',
            checkpoints: [
                'Confirmar via prescrita (EV, VO, IM, SC, etc.)',
                'Verificar se o medicamento pode ser dado por aquela via',
                'Preparar material adequado para a via',
                'Nunca trocar vias sem ordem médica',
                'Conhecer diferenças entre vias (absorção, ação)'
            ],
            exemplo: 'Medicamento prescrito EV não pode ser administrado VO, mesmo que exista apresentação oral'
        },
        {
            numero: 4,
            titulo: 'Dose Certa',
            icon: '⚖️',
            cor: '#EF4444',
            descricao: 'Calcular e administrar a dose exata prescrita, utilizando calculadoras quando necessário.',
            checkpoints: [
                'Realizar cálculo de dose corretamente',
                'Usar calculadoras validadas',
                'Conferir unidades de medida (mg, mcg, UI)',
                'Solicitar dupla checagem em doses críticas',
                'Conhecer doses usuais e terapêuticas'
            ],
            exemplo: 'Prescrição: 500mg. Disponível: ampola de 1g/10mL. Dose = 5mL (sempre calcular!)'
        },
        {
            numero: 5,
            titulo: 'Horário Certo',
            icon: '⏰',
            cor: '#8B5CF6',
            descricao: 'Administrar o medicamento no horário prescrito, respeitando intervalos e cronogramas.',
            checkpoints: [
                'Seguir horários de aprazamento',
                'Respeitar margem de segurança (±30 minutos)',
                'Conhecer medicamentos tempo-dependentes',
                'Documentar hora da administração',
                'Considerar interações com alimentos'
            ],
            exemplo: 'Antibióticos: manter intervalo rigoroso (8/8h = 6h-14h-22h) para níveis séricos adequados'
        },
        {
            numero: 6,
            titulo: 'Registro Certo',
            icon: '📝',
            cor: '#EC4899',
            descricao: 'Documentar imediatamente após administração, com letra legível e informações completas.',
            checkpoints: [
                'Registrar IMEDIATAMENTE após administrar',
                'Incluir: data, hora, medicamento, dose, via',
                'Assinar com nome legível e COREN',
                'Registrar recusas ou eventos adversos',
                'Não registrar antes de administrar'
            ],
            exemplo: '"15/03/2025 14:00 - Dipirona 1g EV - Sem intercorrências. Maria Silva - COREN 123456"'
        },
        {
            numero: 7,
            titulo: 'Orientação Certa',
            icon: '💬',
            cor: '#14B8A6',
            descricao: 'Orientar o paciente sobre o medicamento, efeitos esperados e possíveis reações.',
            checkpoints: [
                'Explicar para que serve o medicamento',
                'Informar possíveis efeitos colaterais',
                'Orientar cuidados específicos',
                'Responder dúvidas do paciente',
                'Documentar orientações fornecidas'
            ],
            exemplo: '"Vou administrar um analgésico para sua dor. Você pode sentir sonolência. Me avise se tiver náusea."'
        },
        {
            numero: 8,
            titulo: 'Forma Certa',
            icon: '💊',
            cor: '#F97316',
            descricao: 'Administrar o medicamento na forma farmacêutica correta (comprimido, cápsula, líquido).',
            checkpoints: [
                'Verificar forma farmacêutica prescrita',
                'Não triturar comprimidos de liberação controlada',
                'Não abrir cápsulas sem orientação',
                'Conhecer apresentações disponíveis',
                'Consultar farmacêutico em caso de dúvida'
            ],
            exemplo: 'Comprimidos de liberação prolongada (LP, XR, SR) NÃO podem ser triturados ou partidos'
        },
        {
            numero: 9,
            titulo: 'Resposta Certa',
            icon: '🔍',
            cor: '#06B6D4',
            descricao: 'Monitorar o paciente após administração para avaliar eficácia e detectar reações adversas.',
            checkpoints: [
                'Avaliar resposta terapêutica esperada',
                'Monitorar sinais vitais quando indicado',
                'Observar reações adversas',
                'Registrar resposta do paciente',
                'Comunicar médico se houver problemas'
            ],
            exemplo: 'Após anti-hipertensivo: verificar PA em 30min. Após analgésico: reavaliar dor em 1h.'
        }
    ],
    
    /**
     * Renderiza card de um acerto específico
     * @param {Object} acerto - Objeto com dados do acerto
     * @returns {String} HTML do card
     */
    renderAcertoCard(acerto) {
        const checkpointsHTML = acerto.checkpoints.map(checkpoint => 
            `<li class="flex items-start">
                <svg class="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">${checkpoint}</span>
            </li>`
        ).join('');
        
        return `
            <div class="bg-white rounded-lg shadow-md p-5" style="border-color: ${acerto.cor};">
                <div class="flex items-start mb-3">
                    <span class="text-3xl mr-3">${acerto.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800 mb-1" style="color: ${acerto.cor};">
                            ${acerto.numero}º Certo: ${acerto.titulo}
                        </h4>
                        <p class="text-sm text-gray-600 mb-3">${acerto.descricao}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3 mb-3">
                    <p class="text-xs font-semibold text-gray-700 mb-2">Checkpoints:</p>
                    <ul class="space-y-1.5">${checkpointsHTML}</ul>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-3 border-l-2 border-blue-400">
                    <p class="text-xs font-semibold text-blue-800 mb-1">💡 Exemplo Prático:</p>
                    <p class="text-xs text-gray-700 italic">${acerto.exemplo}</p>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza seção completa dos 9 Acertos
     * @returns {String} HTML completo da seção
     */
    renderSecaoCompleta() {
        const acertosHTML = this.acertos.map(acerto => this.renderAcertoCard(acerto)).join('');
        
        return `
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 mt-6">
                <div class="mb-6 text-center">
                    <h2 class="text-2xl font-bold mb-2" style="color: #1A3E74;">
                        ✅ 9 Acertos (Certos) da Administração de Medicamentos
                    </h2>
                    <p class="text-sm text-gray-600">
                        Protocolo essencial para segurança na administração de medicamentos
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${acertosHTML}
                </div>
                
                <div class="mt-6 bg-white rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <div>
                            <p class="font-semibold text-red-800 mb-1">⚠️ Atenção: Segurança do Paciente</p>
                            <p class="text-sm text-gray-700">
                                A observância rigorosa dos 9 Acertos previne erros de medicação, que são responsáveis 
                                por significativa morbimortalidade hospitalar. <strong>NUNCA</strong> pule etapas, mesmo sob pressão. 
                                Em caso de dúvida, <strong>NÃO ADMINISTRE</strong> até esclarecer com médico ou farmacêutico.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-6 h-6 text-blue-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        <div>
                            <p class="font-semibold text-blue-800 mb-1">💡 Dica Profissional</p>
                            <p class="text-sm text-gray-700">
                                Use mnemônico: <strong>"PP-MD-VD-HR-RF-OR-FM-RP"</strong> (Paciente, Medicamento, Via, Dose, Horário, Registro, Forma, Orientação, Resposta) 
                                para memorizar os 9 Acertos. Ao utilizar calculadoras de enfermagem, você está aplicando o <strong>4º Certo (Dose Certa)</strong>!
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 text-center">
                    <p class="text-xs text-gray-500">
                        Baseado em: COFEN, Joint Commission, OMS - Segurança do Paciente
                    </p>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza versão CHECKLIST dos 9 Acertos (formato simplificado)
     * @returns {String} HTML da versão checklist
     */
    renderChecklist() {
        const certosHTML = ['Paciente', 'Medicamento', 'Dose', 'Hora', 'Via', 'Registro', 'Orientação', 'Resposta', 'Validade'].map(item => 
            `<label class="flex items-center p-3 text-sm cursor-pointer transition-colors duration-200 rounded border border-gray-200 bg-white hover:bg-gray-50">
                <input type="checkbox" id="check-nove-certos-${item}" class="mr-3 accent-[#1A3E74]">
                ${item} Certo
            </label>`
        ).join('');
        
        return `
            <div id="nove-certos-checklist" class="bg-white rounded-b-lg shadow-md border border-t-0 border-blue-300 overflow-hidden mb-6">
                <h4 class="bg-gray-50 text-[#1A3E74] p-3 font-semibold text-lg border-b border-blue-200">
                    9 certos na administração de medicamentos
                </h4>
                <div class="p-6 space-y-2">
                    ${certosHTML}
                </div>
            </div>
        `;
    },
    
    /**
     * Insere seção dos 9 Acertos no DOM
     * @param {String} containerId - ID do container onde inserir
     * @param {Boolean} checklistMode - Se true, renderiza versão checklist simplificada
     */
    inserir(containerId, checklistMode = false) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        container.innerHTML = checklistMode ? this.renderChecklist() : this.renderSecaoCompleta();
        console.log('✓ 9 Acertos de Medicamentos inseridos' + (checklistMode ? ' (checklist)' : ''));
    },
    
    /**
     * Renderiza versão compacta (para sidebar)
     * @returns {String} HTML da versão compacta
     */
    renderVersaoCompacta() {
        const acertosHTML = this.acertos.map(acerto => 
            `<div class="flex items-center p-2 bg-white rounded shadow-sm">
                <span class="text-xl mr-2">${acerto.icon}</span>
                <p class="text-xs font-medium text-gray-700">${acerto.numero}º ${acerto.titulo}</p>
            </div>`
        ).join('');
        
        return `
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #1A3E74;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    9 Acertos de Medicamentos
                </h3>
                <div class="grid grid-cols-1 gap-2">
                    ${acertosHTML}
                </div>
                <p class="text-xs text-gray-500 text-center mt-3">
                    Protocolo de Segurança
                </p>
            </div>
        `;
    }
};

// Exporta para uso global
window.NoveAcertosMedicamentos = NoveAcertosMedicamentos;

console.log('✓ Módulo 9 Acertos de Medicamentos carregado');
