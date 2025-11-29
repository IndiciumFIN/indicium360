/**
 * CALCULADORAS DE ENFERMAGEM - COMPONENTES PARA CALCULADORAS/ESCALAS
 * Versão 1.0 - Componentes Modulares Específicos
 * ==================================================================
 * Este arquivo contém componentes específicos para páginas de calculadoras
 * e escalas clínicas. Não deve ser carregado em páginas institucionais.
 */

// ===================================
// COMPONENTE: BOTÕES DE AÇÃO
// ===================================
/**
 * Renderiza os botões de ação padrão para calculadoras/escalas
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.showCalcular - Mostrar botão Calcular (padrão: true)
 * @param {boolean} options.showLimpar - Mostrar botão Limpar (padrão: true)
 * @param {boolean} options.showGerarPDF - Mostrar botão Gerar PDF (padrão: true)
 * @param {boolean} options.showNandaNicNoc - Mostrar botão NANDA/NIC/NOC (padrão: true)
 * @returns {string} HTML dos botões
 */
function renderCalculatorButtons(options = {}) {
    const {
        showCalcular = true,
        showLimpar = true,
        showGerarPDF = true,
        showNandaNicNoc = true
    } = options;

    let buttons = '';

    if (showCalcular) {
        buttons += '<button id="btnCalcular" class="btn-primary">Calcular</button>';
    }

    if (showLimpar) {
        buttons += '<button id="btnLimpar" class="btn-primary">Limpar</button>';
    }

    if (showGerarPDF) {
        buttons += '<button id="btnGerarPDF" class="btn-secondary">Gerar PDF</button>';
    }

    if (showNandaNicNoc) {
        buttons += '<button id="btnNandaNicNoc" class="btn-primary">NANDA, NIC, NOC</button>';
    }

    return `<div class="button-group">${buttons}</div>`;
}

// ===================================
// COMPONENTE: SEÇÃO DE RESULTADO
// ===================================
/**
 * Renderiza o container para exibição de resultados
 * @param {string} id - ID do elemento (padrão: 'resultado')
 * @param {boolean} hidden - Se deve estar oculto inicialmente (padrão: true)
 * @returns {string} HTML do container de resultado
 */
function renderResultSection(id = 'resultado', hidden = true) {
    const hiddenClass = hidden ? ' hidden' : '';
    return `<div id="${id}" class="resultado${hiddenClass}" aria-live="polite"></div>`;
}

// ===================================
// COMPONENTE: REFERÊNCIA BIBLIOGRÁFICA
// ===================================
/**
 * Renderiza seção de referência bibliográfica
 * @param {Object} reference - Dados da referência
 * @param {string} reference.text - Texto da referência
 * @param {string} reference.url - URL do documento (opcional)
 * @param {string} reference.linkText - Texto do link (padrão: 'Acessar Documento')
 * @returns {string} HTML da referência
 */
function renderReference(reference) {
    if (!reference || !reference.text) return '';

    const { text, url, linkText = 'Acessar Documento' } = reference;

    let linkHTML = '';
    if (url) {
        linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    }

    return `
    <div class="reference">
        <strong>Referência:</strong>
        <p>${text}
        ${linkHTML}</p>
    </div>`;
}

// ===================================
// COMPONENTE: ESTRUTURA COMPLETA DE CALCULADORA
// ===================================
/**
 * Renderiza estrutura completa de uma calculadora/escala
 * @param {Object} config - Configuração da calculadora
 * @param {string} config.title - Título principal
 * @param {string} config.subtitle - Subtítulo/descrição
 * @param {string} config.description - Texto de instrução/descrição
 * @param {string} config.contentId - ID do container de conteúdo (padrão: 'conteudo')
 * @param {Object} config.buttons - Opções dos botões (opcional)
 * @param {Object} config.reference - Dados da referência bibliográfica (opcional)
 * @param {Array} config.breadcrumb - Array de itens do breadcrumb (opcional)
 * @returns {string} HTML completo da estrutura
 */
function renderCalculatorStructure(config) {
    const {
        title,
        subtitle,
        description,
        contentId = 'conteudo',
        buttons = {},
        reference = null,
        breadcrumb = []
    } = config;

    let breadcrumbHTML = '';
    if (breadcrumb.length > 0 && window.renderBreadcrumb) {
        breadcrumbHTML = window.renderBreadcrumb(breadcrumb);
    }

    const buttonsHTML = renderCalculatorButtons(buttons);
    const resultHTML = renderResultSection();
    const referenceHTML = renderReference(reference);

    return `
        ${breadcrumbHTML}

        <div class="text-center mb-8">
            <h1 class="page-title">${title}</h1>
            <div class="title-bar"></div>
            ${subtitle ? `<h2 class="page-subtitle">${subtitle}</h2>` : ''}
        </div>

        <div class="card">
            ${description ? `<p class="description">${description}</p>` : ''}

            <div id="${contentId}" role="form" aria-labelledby="main-title"></div>

            ${resultHTML}

            ${buttonsHTML}

            ${referenceHTML}
        </div>
    `;
}

// ===================================
// VERIFICAÇÃO DE BOTÕES
// ===================================
/**
 * Verifica se todos os botões padrão estão presentes na página
 * @returns {Object} Status de cada botão
 */
function checkCalculatorButtons() {
    return {
        calcular: !!document.getElementById('btnCalcular'),
        limpar: !!document.getElementById('btnLimpar'),
        gerarPDF: !!document.getElementById('btnGerarPDF'),
        nandaNicNoc: !!document.getElementById('btnNandaNicNoc')
    };
}

// ===================================
// VALIDAÇÃO DE ESTRUTURA
// ===================================
/**
 * Valida se a página possui a estrutura mínima de calculadora
 * @returns {Object} Resultado da validação
 */
function validateCalculatorStructure() {
    const buttons = checkCalculatorButtons();
    const hasResult = !!document.getElementById('resultado');
    const hasReference = !!document.querySelector('.reference');

    const warnings = [];

    if (!buttons.calcular) warnings.push('Botão "Calcular" não encontrado');
    if (!buttons.limpar) warnings.push('Botão "Limpar" não encontrado');
    if (!buttons.gerarPDF) warnings.push('Botão "Gerar PDF" não encontrado');
    if (!buttons.nandaNicNoc) warnings.push('Botão "NANDA, NIC, NOC" não encontrado');
    if (!hasResult) warnings.push('Seção de resultado não encontrada');
    if (!hasReference) warnings.push('Referência bibliográfica não encontrada');

    return {
        valid: warnings.length === 0,
        buttons,
        hasResult,
        hasReference,
        warnings
    };
}

// Disponibilizar funções globalmente
window.renderCalculatorButtons = renderCalculatorButtons;
window.renderResultSection = renderResultSection;
window.renderReference = renderReference;
window.renderCalculatorStructure = renderCalculatorStructure;
window.checkCalculatorButtons = checkCalculatorButtons;
window.validateCalculatorStructure = validateCalculatorStructure;

// Log de carregamento (apenas para debug)
console.log('✅ Calculator Components carregado');
