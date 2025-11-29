/**
 * INICIALIZAÇÃO GLOBAL - GARANTIR TODAS AS FUNCIONALIDADES
 * ========================================================
 * Carrega POR ÚLTIMO para garantir que todos os componentes estejam prontos
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

(function() {
    'use strict';
    
    console.log('🚀 Iniciando sistema global...');
    
    /**
     * Aguarda DOM + Componentes estarem prontos
     */
    function waitForComponents() {
        return new Promise((resolve) => {
            // Se já carregou, resolve imediatamente
            if (document.readyState === 'complete' && document.getElementById('topbar-container')?.children.length > 0) {
                resolve();
                return;
            }
            
            // Observer para detectar quando componentes forem injetados
            const observer = new MutationObserver((mutations, obs) => {
                const topbar = document.getElementById('topbar-container');
                if (topbar && topbar.children.length > 0) {
                    obs.disconnect();
                    // Aguarda mais 100ms para garantir que tudo renderizou
                    setTimeout(resolve, 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Fallback: se não detectar em 3s, resolve mesmo assim
            setTimeout(resolve, 3000);
        });
    }
    
    /**
     * Inicializa funcionalidades de acessibilidade
     */
    function initAccessibilityFeatures() {
        console.log('♿ Inicializando funcionalidades de acessibilidade...');
        
        // Font size controls
        const btnFontIncrease = document.getElementById('btnFontIncrease');
        const btnFontDecrease = document.getElementById('btnFontDecrease');
        
        if (btnFontIncrease && btnFontDecrease) {
            console.log('✓ Controles de fonte encontrados');
        } else {
            console.warn('⚠️ Controles de fonte não encontrados');
        }
        
        // Theme switcher
        const btnLight = document.getElementById('btnLight');
        const btnDark = document.getElementById('btnDark');
        
        if (btnLight && btnDark) {
            console.log('✓ Controles de tema encontrados');
        } else {
            console.warn('⚠️ Controles de tema não encontrados');
        }
    }
    
    /**
     * Inicializa sistema de cookies
     */
    function initCookieSystem() {
        console.log('🍪 Inicializando sistema de cookies...');
        
        const cookieBanner = document.getElementById('cookie-banner');
        const cookieFab = document.getElementById('cookie-fab');
        const manageCookiesBtn = document.getElementById('manage-cookies-footer-btn');
        
        if (cookieBanner) {
            console.log('✓ Cookie banner encontrado');
        } else {
            console.warn('⚠️ Cookie banner não encontrado');
        }
        
        if (cookieFab) {
            console.log('✓ Cookie FAB encontrado');
        } else {
            console.warn('⚠️ Cookie FAB não encontrado');
        }
        
        if (manageCookiesBtn) {
            console.log('✓ Botão gerenciar cookies encontrado');
        } else {
            console.warn('⚠️ Botão gerenciar cookies não encontrado');
        }
    }
    
    /**
     * Inicializa botões flutuantes
     */
    function initFloatingButtons() {
        console.log('🎈 Inicializando botões flutuantes...');
        
        const backToTopBtn = document.getElementById('backToTopBtn');
        const cookieFab = document.getElementById('cookie-fab');
        
        if (backToTopBtn) {
            console.log('✓ Botão voltar ao topo encontrado');
            
            // Re-aplicar event listener caso não esteja funcionando
            if (!backToTopBtn.dataset.listenerAdded) {
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
                backToTopBtn.dataset.listenerAdded = 'true';
                console.log('✓ Event listener adicionado ao botão voltar ao topo');
            }
        } else {
            console.warn('⚠️ Botão voltar ao topo não encontrado');
        }
        
        if (cookieFab) {
            console.log('✓ Cookie FAB encontrado');
        } else {
            console.warn('⚠️ Cookie FAB não encontrado');
        }
    }
    
    /**
     * Inicializa sistema de modais
     */
    function initModalSystem() {
        console.log('📄 Verificando sistema de modais...');
        
        const modalLinks = document.querySelectorAll('[data-modal]');
        
        if (modalLinks.length > 0) {
            console.log(`✓ ${modalLinks.length} links modais encontrados`);
            
            // Garantir que o event delegation está ativo
            if (typeof ModalInstitucional !== 'undefined') {
                console.log('✓ ModalInstitucional disponível');
            } else {
                console.warn('⚠️ ModalInstitucional não encontrado');
            }
        } else {
            console.warn('⚠️ Nenhum link modal encontrado');
        }
    }
    
    /**
     * Inicializa funcionalidades da calculadora
     */
    function initCalculatorFeatures() {
        console.log('🧮 Verificando funcionalidades da calculadora...');
        
        // Calculator Actions
        if (typeof CalculatorActions !== 'undefined') {
            console.log('✓ CalculatorActions disponível');
            console.log('  - copiarResultado()');
            console.log('  - exportarPDF()');
        } else {
            console.warn('⚠️ CalculatorActions não encontrado');
        }
        
        // NANDA/NIC/NOC Search
        if (typeof NANDANICNOCSearch !== 'undefined') {
            console.log('✓ NANDANICNOCSearch disponível');
        } else {
            console.warn('⚠️ NANDANICNOCSearch não encontrado');
        }
        
        // Auditoria
        if (typeof AuditoriaCalculo !== 'undefined') {
            console.log('✓ AuditoriaCalculo disponível');
        } else {
            console.warn('⚠️ AuditoriaCalculo não encontrado');
        }
    }
    
    /**
     * Diagnóstico completo do sistema
     */
    async function runDiagnostics() {
        console.log('\n═══════════════════════════════════════');
        console.log('🔍 DIAGNÓSTICO DO SISTEMA');
        console.log('═══════════════════════════════════════\n');
        
        // Aguardar componentes
        await waitForComponents();
        console.log('✓ Componentes carregados\n');
        
        // Executar diagnósticos
        initAccessibilityFeatures();
        console.log('');
        
        initCookieSystem();
        console.log('');
        
        initFloatingButtons();
        console.log('');
        
        initModalSystem();
        console.log('');
        
        initCalculatorFeatures();
        
        console.log('\n═══════════════════════════════════════');
        console.log('✅ DIAGNÓSTICO CONCLUÍDO');
        console.log('═══════════════════════════════════════\n');
        
        // Mensagem de status
        console.log('%c💚 Sistema Calculadoras de Enfermagem Inicializado', 
                    'color: #10b981; font-size: 14px; font-weight: bold;');
    }
    
    /**
     * Executar ao carregar
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDiagnostics);
    } else {
        runDiagnostics();
    }
    
})();
