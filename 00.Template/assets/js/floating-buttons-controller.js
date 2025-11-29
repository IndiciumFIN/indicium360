/**
 * FLOATING BUTTONS CONTROLLER
 * ===========================
 * Controla interação entre botões flutuantes (Back to Top e Cookie FAB)
 * - Back to Top aparece/desaparece com scroll
 * - Cookie FAB oculta quando Back to Top sobrepõe
 * - Ambos ocultam quando menu hambúrguer abre
 */

(function() {
    'use strict';
    
    // ===================================
    // CONFIGURAÇÕES
    // ===================================
    
    const CONFIG = {
        scrollThreshold: 300, // Pixels de scroll para mostrar Back to Top
        overlapZone: 140, // Distância em px para considerar sobreposição
        checkInterval: 100 // Intervalo de verificação em ms
    };
    
    // ===================================
    // ELEMENTOS DOM
    // ===================================
    
    let backToTopBtn = null;
    let cookieFab = null;
    let mobileMenuToggle = null;
    let mobileMenu = null;
    
    // ===================================
    // INICIALIZAÇÃO
    // ===================================
    
    function init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupElements);
        } else {
            setupElements();
        }
    }
    
    function setupElements() {
        // Buscar elementos
        backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.back-to-top-btn');
        cookieFab = document.getElementById('cookie-fab-floating') || document.querySelector('.cookie-fab');
        mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        mobileMenu = document.querySelector('.mobile-menu') || document.querySelector('.nav-menu');
        
        // Iniciar funcionalidades
        initBackToTop();
        initFloatingButtonsInteraction();
        initMobileMenuInteraction();
        
        console.log('✓ Floating Buttons Controller inicializado');
    }
    
    // ===================================
    // BACK TO TOP - SCROLL BEHAVIOR
    // ===================================
    
    function initBackToTop() {
        if (!backToTopBtn) {
            console.warn('⚠️ Botão Back to Top não encontrado');
            return;
        }
        
        // Mostrar/ocultar baseado no scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Click para voltar ao topo
        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Verificação inicial
        handleScroll();
    }
    
    function handleScroll() {
        if (!backToTopBtn) return;
        
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > CONFIG.scrollThreshold) {
            backToTopBtn.classList.add('show');
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.classList.remove('show');
            setTimeout(() => {
                if (!backToTopBtn.classList.contains('show')) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
        
        // Verificar sobreposição
        checkOverlap();
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // ===================================
    // FLOATING BUTTONS INTERACTION
    // ===================================
    
    function initFloatingButtonsInteraction() {
        if (!cookieFab || !backToTopBtn) {
            console.warn('⚠️ Botões flutuantes não encontrados para interação');
            return;
        }
        
        // Verificar sobreposição periodicamente
        setInterval(checkOverlap, CONFIG.checkInterval);
    }
    
    function checkOverlap() {
        if (!cookieFab || !backToTopBtn) return;
        
        // Se back to top não está visível, cookie FAB sempre visível
        if (!backToTopBtn.classList.contains('show')) {
            document.body.classList.remove('back-to-top-overlap');
            return;
        }
        
        // Obter posições
        const backToTopRect = backToTopBtn.getBoundingClientRect();
        const cookieRect = cookieFab.getBoundingClientRect();
        
        // Calcular distância vertical entre os botões
        const verticalDistance = Math.abs(backToTopRect.top - cookieRect.top);
        
        // Se a distância é menor que a zona de sobreposição
        if (verticalDistance < CONFIG.overlapZone) {
            document.body.classList.add('back-to-top-overlap');
        } else {
            document.body.classList.remove('back-to-top-overlap');
        }
    }
    
    // ===================================
    // MOBILE MENU INTERACTION
    // ===================================
    
    function initMobileMenuInteraction() {
        if (!mobileMenuToggle) {
            console.warn('⚠️ Mobile menu toggle não encontrado');
            return;
        }
        
        // Observar mudanças no menu mobile
        mobileMenuToggle.addEventListener('click', handleMobileMenuToggle);
        
        // Observar classe no body/html
        const observer = new MutationObserver(checkMobileMenuState);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    function handleMobileMenuToggle() {
        // Toggle da classe mobile-menu-open no body
        setTimeout(checkMobileMenuState, 50);
    }
    
    function checkMobileMenuState() {
        const isMenuOpen = document.body.classList.contains('mobile-menu-open') || 
                          document.body.classList.contains('menu-open') ||
                          (mobileMenu && mobileMenu.classList.contains('active'));
        
        if (isMenuOpen) {
            hideFloatingButtons();
        } else {
            showFloatingButtons();
        }
    }
    
    function hideFloatingButtons() {
        if (cookieFab) {
            cookieFab.style.opacity = '0';
            cookieFab.style.pointerEvents = 'none';
        }
        
        if (backToTopBtn && backToTopBtn.classList.contains('show')) {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    }
    
    function showFloatingButtons() {
        if (cookieFab && !document.body.classList.contains('back-to-top-overlap')) {
            cookieFab.style.opacity = '1';
            cookieFab.style.pointerEvents = 'all';
        }
        
        if (backToTopBtn && backToTopBtn.classList.contains('show')) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'all';
        }
    }
    
    // ===================================
    // ACESSIBILIDADE
    // ===================================
    
    // Suporte a teclado para Back to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    }
    
    // ===================================
    // EXPORTAR FUNÇÕES (para uso externo se necessário)
    // ===================================
    
    window.FloatingButtonsController = {
        refresh: checkOverlap,
        showButtons: showFloatingButtons,
        hideButtons: hideFloatingButtons,
        scrollToTop: scrollToTop
    };
    
    // Inicializar
    init();
    
})();
