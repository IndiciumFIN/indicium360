/**
 * AUDITORIA DE CÁLCULO - Sistema de Registro e Rastreabilidade
 * Registra cálculos realizados para auditoria e rastreabilidade
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const AuditoriaCalculo = {
    /**
     * Armazena histórico de cálculos realizados na sessão
     */
    historico: [],
    
    /**
     * Registra um novo cálculo
     * @param {Object} dados - Dados do cálculo (inputs, resultado, tipo)
     */
    registrarCalculo(dados) {
        const registro = {
            id: this.gerarId(),
            timestamp: new Date().toISOString(),
            timestampFormatado: this.formatarDataHora(),
            ...dados
        };
        
        this.historico.push(registro);
        
        // Salva no localStorage
        this.salvarNoLocalStorage();
        
        console.log('✓ Cálculo registrado na auditoria:', registro.id);
        
        return registro;
    },
    
    /**
     * Gera ID único para o registro
     * @returns {String} ID único
     */
    gerarId() {
        return `CALC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Formata data e hora atual
     * @returns {String} Data formatada
     */
    formatarDataHora() {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
    },
    
    /**
     * Salva histórico no localStorage
     */
    salvarNoLocalStorage() {
        try {
            const chave = `auditoria_calculadora_${window.location.pathname}`;
            localStorage.setItem(chave, JSON.stringify(this.historico));
        } catch (error) {
            console.warn('Não foi possível salvar no localStorage:', error);
        }
    },
    
    /**
     * Carrega histórico do localStorage
     */
    carregarDoLocalStorage() {
        try {
            const chave = `auditoria_calculadora_${window.location.pathname}`;
            const dados = localStorage.getItem(chave);
            if (dados) {
                this.historico = JSON.parse(dados);
                console.log(`✓ ${this.historico.length} registros carregados da auditoria`);
            }
        } catch (error) {
            console.warn('Não foi possível carregar do localStorage:', error);
        }
    },
    
    /**
     * Renderiza card de auditoria do último cálculo
     * @param {Object} registro - Registro do cálculo
     * @returns {String} HTML do card
     */
    renderCardAuditoria(registro) {
        if (!registro) return '';
        
        return `
            <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl shadow-md p-6 mt-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #1A3E74;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Auditoria do Cálculo
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <p class="text-xs font-semibold text-gray-600 mb-2">ID do Registro</p>
                        <p class="text-sm font-mono text-gray-800 break-all">${registro.id}</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <p class="text-xs font-semibold text-gray-600 mb-2">Data e Hora</p>
                        <p class="text-sm text-gray-800">${registro.timestampFormatado}</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <p class="text-xs font-semibold text-gray-600 mb-2">Tipo de Cálculo</p>
                        <p class="text-sm text-gray-800">${registro.tipoCalculo || 'Não especificado'}</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <p class="text-xs font-semibold text-gray-600 mb-2">Profissional</p>
                        <p class="text-sm text-gray-800">${registro.profissional || 'Não identificado'}</p>
                    </div>
                </div>
                
                <div class="mt-4 bg-blue-50 rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="flex-1">
                            <p class="text-xs font-semibold text-blue-800 mb-1">Rastreabilidade e Responsabilidade</p>
                            <p class="text-xs text-blue-700">
                                Este registro permite rastreabilidade do cálculo realizado, contribuindo para 
                                segurança do paciente e responsabilidade profissional. Os dados são armazenados 
                                localmente no navegador e não são enviados para servidores externos.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 flex gap-2">
                    <button 
                        onclick="AuditoriaCalculo.exportarRegistro('${registro.id}')"
                        class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 text-sm flex items-center justify-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Exportar Registro
                    </button>
                    
                    <button 
                        onclick="AuditoriaCalculo.verHistorico()"
                        class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm flex items-center justify-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Ver Histórico (${this.historico.length})
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderiza versão SIMPLIFICADA de auditoria (formato calculadora)
     * @param {Object} dadosPaciente - Dados do paciente
     * @param {Object} parametros - Parâmetros do cálculo
     * @param {String} formula - Fórmula utilizada
     * @returns {String} HTML da auditoria simplificada
     */
    renderAuditoriaSimplificada(dadosPaciente = {}, parametros = {}, formula = '') {
        const formatarNascimento = (data) => {
            if (!data) return 'Não Informado';
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        };
        
        const calcularIdade = (dataNasc) => {
            if (!dataNasc) return 'Não Informado';
            const hoje = new Date();
            const nascimento = new Date(dataNasc);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            return idade >= 0 ? `${idade} anos` : 'Data Inválida';
        };
        
        const formatarChave = (key) => {
            // Formata primeira letra em maiúscula
            return key.charAt(0).toUpperCase() + key.slice(1);
        };
        
        const parametrosHTML = Object.entries(parametros)
            .map(([key, value]) => {
                // Formatação especial para chaves específicas
                let chaveFormatada;
                if (key === 'dosePrescrita') {
                    chaveFormatada = 'Dose Prescrita';
                } else {
                    chaveFormatada = formatarChave(key);
                }
                return `<li id="audit-${key}">${chaveFormatada}: ${value !== 'N/A' ? value : 'Não Informado'}</li>`;
            })
            .join('');
        
        return `
            <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <h3 class="bg-[#1A3E74] text-white p-4 font-bold text-xl">Auditoria do Cálculo</h3>
                <div class="p-6 text-sm text-gray-600 space-y-4">
                    <div class="pb-4 border-b border-gray-200">
                        <h4 class="font-semibold text-gray-800 mb-2">Dados do Paciente:</h4>
                        <ul class="list-disc list-inside ml-2 space-y-1">
                            <li id="audit-nome">Nome: ${dadosPaciente.nome || 'Não Informado'}</li>
                            <li id="audit-nascimento">Nascimento: ${formatarNascimento(dadosPaciente.dataNascimento)}</li>
                            <li id="audit-idade">Idade: ${calcularIdade(dadosPaciente.dataNascimento)}</li>
                        </ul>
                    </div>
                    ${parametrosHTML ? `
                    <div class="pb-4 border-b border-gray-200">
                        <h4 class="font-semibold text-gray-800 mb-2">Parâmetros:</h4>
                        <ul class="list-disc list-inside ml-2 space-y-1">
                            ${parametrosHTML}
                        </ul>
                    </div>` : ''}
                    ${formula ? `
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-1">Fórmula:</h4>
                        <p id="audit-formula" class="text-xs text-gray-500">${formula}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Insere card de auditoria no DOM
     * @param {String} containerId - ID do container
     * @param {Object} registro - Registro do cálculo OU dados simplificados
     * @param {Boolean} modoSimplificado - Se true, usa renderização simplificada
     */
    inserir(containerId, registro, modoSimplificado = false) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        if (modoSimplificado) {
            container.innerHTML = this.renderAuditoriaSimplificada(
                registro.paciente || {},
                registro.parametros || {},
                registro.formula || ''
            );
        } else {
            container.innerHTML = this.renderCardAuditoria(registro);
        }
        
        console.log('✓ Card de auditoria inserido' + (modoSimplificado ? ' (simplificado)' : ''));
    },
    
    /**
     * Exporta registro específico como JSON
     * @param {String} id - ID do registro
     */
    exportarRegistro(id) {
        const registro = this.historico.find(r => r.id === id);
        if (!registro) {
            mostrarModalFeedback('❌ Registro não encontrado', 'error');
            return;
        }
        
        const dataStr = JSON.stringify(registro, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditoria_${id}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        mostrarModalFeedback('✅ Registro exportado com sucesso!', 'success');
    },
    
    /**
     * Mostra histórico de cálculos em modal
     */
    verHistorico() {
        if (this.historico.length === 0) {
            mostrarModalFeedback('ℹ️ Nenhum cálculo registrado nesta sessão', 'error');
            return;
        }
        
        const historicosHTML = this.historico.slice().reverse().map((reg, index) => `
            <div class="bg-gray-50 rounded-lg p-3 mb-2">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-mono text-gray-500">${reg.id}</span>
                    <span class="text-xs text-gray-600">${reg.timestampFormatado}</span>
                </div>
                <p class="text-sm font-semibold text-gray-800">${reg.tipoCalculo || 'Cálculo'}</p>
                <p class="text-xs text-gray-600 mt-1">${reg.resumo || 'Sem descrição'}</p>
            </div>
        `).join('');
        
        // Cria modal customizado para histórico
        const modalHTML = `
            <div id="historicoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove()">
                <div class="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onclick="event.stopPropagation()">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold" style="color: #1A3E74;">Histórico de Cálculos</h3>
                        <button onclick="document.getElementById('historicoModal').remove()" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="mb-4">
                        ${historicosHTML}
                    </div>
                    <button 
                        onclick="AuditoriaCalculo.exportarTodoHistorico()"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Exportar Todo Histórico
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    /**
     * Exporta todo o histórico como JSON
     */
    exportarTodoHistorico() {
        if (this.historico.length === 0) {
            mostrarModalFeedback('❌ Nenhum registro para exportar', 'error');
            return;
        }
        
        const dataStr = JSON.stringify(this.historico, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico_auditoria_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        mostrarModalFeedback('✅ Histórico exportado com sucesso!', 'success');
    },
    
    /**
     * Limpa todo o histórico
     */
    limparHistorico() {
        if (confirm('Deseja realmente limpar todo o histórico de cálculos?')) {
            this.historico = [];
            this.salvarNoLocalStorage();
            mostrarModalFeedback('✅ Histórico limpo com sucesso!', 'success');
            console.log('✓ Histórico de auditoria limpo');
        }
    }
};

// Carrega histórico ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    AuditoriaCalculo.carregarDoLocalStorage();
});

// Exporta para uso global
window.AuditoriaCalculo = AuditoriaCalculo;

console.log('✓ Módulo Auditoria de Cálculo carregado');
