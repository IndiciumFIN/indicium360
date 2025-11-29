/* ============================================================
   MODAL DE FEEDBACK - JavaScript Modular
   Versão: 1.0
   Descrição: Funções para controlar modal de feedback
   ============================================================ */

/**
 * Renderiza o HTML do modal de feedback
 * Deve ser chamado no DOMContentLoaded para injetar o modal na página
 * @returns {string} HTML do modal
 */
function renderModalFeedback() {
    return `
        <div id="modalFeedback" class="feedback-modal">
            <div class="feedback-modal-overlay" onclick="fecharModalFeedback()"></div>
            <div class="feedback-modal-content">
                <div class="modal-feedback-body">
                    <span id="modalFeedbackIcon" class="modal-feedback-icon"></span>
                    <p id="modalFeedbackMessage" class="modal-feedback-message"></p>
                </div>
                <button onclick="fecharModalFeedback()" class="btn-modal-close">
                    Fechar
                </button>
            </div>
        </div>
    `;
}

/**
 * Exibe o modal de feedback
 * @param {string} mensagem - Mensagem a ser exibida no modal
 * @param {string} tipo - Tipo de feedback: 'success' ou 'error'
 * @param {number} autoClose - Tempo em ms para fechar automaticamente (0 = não fechar automaticamente)
 */
function mostrarModalFeedback(mensagem, tipo = 'success', autoClose = 3000) {
    const modal = document.getElementById('modalFeedback');
    const icone = document.getElementById('modalFeedbackIcon');
    const mensagemEl = document.getElementById('modalFeedbackMessage');
    
    if (!modal || !icone || !mensagemEl) {
        console.error('❌ Modal de feedback não encontrado. Certifique-se de que renderModalFeedback() foi chamado.');
        return;
    }
    
    // Define a mensagem
    mensagemEl.textContent = mensagem;
    
    // Define o ícone e estilo baseado no tipo
    if (tipo === 'success') {
        icone.textContent = '✅';
        icone.className = 'modal-feedback-icon success';
    } else if (tipo === 'error') {
        icone.textContent = '❌';
        icone.className = 'modal-feedback-icon error';
    } else {
        icone.textContent = 'ℹ️';
        icone.className = 'modal-feedback-icon';
    }
    
    // Exibe o modal
    modal.classList.add('show');
    
    // Auto-fechar se especificado
    if (autoClose > 0) {
        setTimeout(() => {
            fecharModalFeedback();
        }, autoClose);
    }
}

/**
 * Fecha o modal de feedback
 */
function fecharModalFeedback() {
    const modal = document.getElementById('modalFeedback');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Inicializa o modal de feedback
 * Injeta o HTML do modal no body da página
 * Deve ser chamado no DOMContentLoaded
 */
function inicializarModalFeedback() {
    // Verifica se já existe
    if (document.getElementById('modalFeedback')) {
        return;
    }
    
    // Cria um container temporário
    const container = document.createElement('div');
    container.innerHTML = renderModalFeedback();
    
    // Injeta no body
    document.body.appendChild(container.firstElementChild);
    
    console.log('✓ Modal de Feedback inicializado com sucesso');
}

// Inicializa automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarModalFeedback);
} else {
    inicializarModalFeedback();
}
