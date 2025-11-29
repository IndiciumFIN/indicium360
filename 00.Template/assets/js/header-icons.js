/**
 * HEADER ICONS INTERACTION SYSTEM
 * ================================
 * Controls the expandable search, icon behavior and mobile menu
 */

(function() {
    'use strict';
    
    /**
     * Initialize header icons system
     */
    function initHeaderIcons() {
        // Wait for components to be injected
        setTimeout(() => {
            initSearchExpansion();
            initMobileMenu();
        }, 500);
    }
    
    /**
     * Initialize search expansion functionality
     */
    function initSearchExpansion() {
        const searchWrap = document.querySelector('.search-wrap');
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        let searchClose = document.querySelector('.search-close');
        
        if (!searchWrap || !searchBtn || !searchInput) {
            console.warn('Header search elements not found');
            return;
        }
        
        // Create close button if not exists
        if (!searchClose) {
            searchClose = document.createElement('button');
            searchClose.className = 'search-close';
            searchClose.setAttribute('aria-label', 'Fechar busca');
            searchClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            searchWrap.insertBefore(searchClose, searchBtn);
        }
        
        // Search button click - toggle expansion
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!searchWrap.classList.contains('expanded')) {
                // Expand search
                expandSearch();
            } else {
                // If already expanded and has value, perform search
                if (searchInput.value.trim()) {
                    performSearch(searchInput.value.trim());
                }
            }
        });
        
        // Close button click
        searchClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            collapseSearch();
        });
        
        // Input focus behavior
        searchInput.addEventListener('focus', () => {
            if (!searchWrap.classList.contains('expanded')) {
                expandSearch();
            }
        });
        
        // Enter key to search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (searchInput.value.trim()) {
                    performSearch(searchInput.value.trim());
                }
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchWrap.classList.contains('expanded')) {
                collapseSearch();
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (searchWrap.classList.contains('expanded')) {
                if (!searchWrap.contains(e.target)) {
                    collapseSearch();
                }
            }
        });
        
        console.log('✓ Header search system initialized');
    }
    
    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Toggle click
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = document.body.classList.contains('mobile-menu-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
        });
        
        // Close on click on overlay (click outside menu and toggle)
        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('mobile-menu-open')) {
                // Se o clique não foi no menu nem no botão toggle
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        // Update toggle icon based on state
        function updateToggleIcon() {
            const icon = mobileToggle.querySelector('i');
            if (document.body.classList.contains('mobile-menu-open')) {
                icon.className = 'fa-solid fa-xmark';
                mobileToggle.setAttribute('aria-expanded', 'true');
                mobileToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                icon.className = 'fa-solid fa-bars';
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.setAttribute('aria-label', 'Abrir menu');
            }
        }
        
        // Observer for class changes
        const observer = new MutationObserver(updateToggleIcon);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // INICIALIZAR SUBMENUS MOBILE (MEGA MENUS)
        initMobileSubMenus();
        
        console.log('✓ Mobile menu system initialized');
    }
    
    /**
     * Initialize mobile sub-menus (mega menu expansion) - OTIMIZADO
     */
    function initMobileSubMenus() {
        const navItems = document.querySelectorAll('.nav-menu .nav-item');
        
        navItems.forEach(navItem => {
            const navLink = navItem.querySelector('.nav-link');
            const megaMenu = navItem.querySelector('.mega-menu-wrapper');
            
            // Apenas itens com mega menu
            if (!megaMenu) return;
            
            navLink.addEventListener('click', (e) => {
                // Se estamos no mobile
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle open class
                    const isOpen = navItem.classList.contains('open');
                    
                    // Fechar outros menus
                    navItems.forEach(item => {
                        if (item !== navItem) {
                            item.classList.remove('open');
                        }
                    });
                    
                    // Toggle atual
                    if (isOpen) {
                        navItem.classList.remove('open');
                    } else {
                        navItem.classList.add('open');
                        
                        // Inicializar navegação do mega menu se ainda não foi
                        initMegaMenuNavigation(megaMenu);
                        
                        // Scroll suave até o item aberto após animação
                        setTimeout(() => {
                            smoothScrollToElement(navItem, 100);
                        }, 100);
                    }
                }
            });
        });
        
        console.log('✓ Mobile sub-menus initialized');
    }
    
    /**
     * Initialize mega menu navigation (sidebar tabs) - OTIMIZADO
     */
    function initMegaMenuNavigation(megaMenu) {
        const mmNavItems = megaMenu.querySelectorAll('.mm-nav-item');
        const mmSections = megaMenu.querySelectorAll('.mm-section-content');
        
        if (mmNavItems.length === 0 || mmSections.length === 0) return;
        
        // Ativar primeira seção por padrão se nenhuma estiver ativa
        if (!megaMenu.querySelector('.mm-nav-item.active')) {
            mmNavItems[0].classList.add('active');
            const targetId = mmNavItems[0].getAttribute('data-target');
            const targetSection = megaMenu.querySelector(`#${targetId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
        
        // Adicionar listeners para navegação
        mmNavItems.forEach(navItem => {
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = navItem.getAttribute('data-target');
                if (!targetId) return;
                
                // Remover active de todos
                mmNavItems.forEach(item => item.classList.remove('active'));
                mmSections.forEach(section => section.classList.remove('active'));
                
                // Ativar selecionado
                navItem.classList.add('active');
                const targetSection = megaMenu.querySelector(`#${targetId}`);
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Scroll suave até o topo da seção ativa na área de conteúdo
                    const contentArea = megaMenu.querySelector('.mm-content-area');
                    if (contentArea && window.innerWidth <= 900) {
                        contentArea.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        
        document.body.classList.add('mobile-menu-open');
        navMenu.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Announce to screen readers
        announceAction('Menu aberto');
    }
    
    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        
        document.body.classList.remove('mobile-menu-open');
        navMenu.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Announce to screen readers
        announceAction('Menu fechado');
    }
    
    /**
     * Expand search field
     */
    function expandSearch() {
        const searchWrap = document.querySelector('.search-wrap');
        const searchInput = document.querySelector('.search-input');
        
        // Add classes
        searchWrap.classList.add('expanded');
        document.body.classList.add('search-active');
        
        // Focus input with slight delay for animation
        setTimeout(() => {
            searchInput.focus();
        }, 200);
        
        // Announce to screen readers
        announceAction('Campo de busca expandido');
    }
    
    /**
     * Collapse search field
     */
    function collapseSearch() {
        const searchWrap = document.querySelector('.search-wrap');
        const searchInput = document.querySelector('.search-input');
        
        // Remove classes
        searchWrap.classList.remove('expanded');
        document.body.classList.remove('search-active');
        
        // Blur input
        searchInput.blur();
        
        // Announce to screen readers
        announceAction('Campo de busca fechado');
    }
    
    /**
     * Perform search
     */
    function performSearch(query) {
        console.log('Searching for:', query);
        
        // Construct search URL
        const searchUrl = `https://www.calculadorasdeenfermagem.com.br/busca?q=${encodeURIComponent(query)}`;
        
        // Navigate to search results
        window.location.href = searchUrl;
    }
    
    /**
     * Smooth scroll to element - OTIMIZADO
     */
    function smoothScrollToElement(element, offset = 0) {
        if (!element) return;
        
        const container = document.querySelector('.nav-menu');
        if (!container) return;
        
        const elementTop = element.offsetTop;
        const containerTop = container.scrollTop;
        const targetScroll = elementTop - offset;
        
        container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }
    
    /**
     * Announce action to screen readers
     */
    function announceAction(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderIcons);
    } else {
        initHeaderIcons();
    }
    
    // Export functions for external use
    window.HeaderIcons = {
        expandSearch,
        collapseSearch,
        openMobileMenu,
        closeMobileMenu
    };
    
})();
