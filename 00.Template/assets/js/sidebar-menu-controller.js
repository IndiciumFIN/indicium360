/**
 * SIDEBAR MENU CONTROLLER
 * =======================
 * Controla comportamento do menu lateral para seções
 */

(function() {
    'use strict';
    
    // ===================================
    // CONFIGURAÇÕES
    // ===================================
    
    const CONFIG = {
        storageKey: 'sidebar_menu_state',
        collapsedClass: 'collapsed',
        expandedClass: 'expanded',
        activeClass: 'active'
    };
    
    // ===================================
    // INICIALIZAÇÃO
    // ===================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupSidebars);
        } else {
            setupSidebars();
        }
    }
    
    function setupSidebars() {
        const sidebars = document.querySelectorAll('.sidebar-menu');
        
        sidebars.forEach(sidebar => {
            initializeSidebar(sidebar);
        });
        
        console.log(`✓ ${sidebars.length} sidebar(s) inicializado(s)`);
    }
    
    // ===================================
    // SIDEBAR INDIVIDUAL
    // ===================================
    
    function initializeSidebar(sidebar) {
        const toggleBtn = sidebar.querySelector('.sidebar-toggle-btn');
        const navLinks = sidebar.querySelectorAll('.sidebar-nav-link');
        const sidebarId = sidebar.dataset.sidebarId || 'default';
        
        // Restaurar estado salvo
        restoreSidebarState(sidebar, sidebarId);
        
        // Toggle button
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => toggleSidebar(sidebar, sidebarId));
        }
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => handleNavClick(e, link, navLinks));
        });
        
        // Highlight current page
        highlightCurrentPage(navLinks);
    }
    
    // ===================================
    // TOGGLE SIDEBAR
    // ===================================
    
    function toggleSidebar(sidebar, sidebarId) {
        const isCollapsed = sidebar.classList.contains(CONFIG.collapsedClass);
        
        if (isCollapsed) {
            expandSidebar(sidebar, sidebarId);
        } else {
            collapseSidebar(sidebar, sidebarId);
        }
    }
    
    function expandSidebar(sidebar, sidebarId) {
        sidebar.classList.remove(CONFIG.collapsedClass);
        sidebar.classList.add(CONFIG.expandedClass);
        saveSidebarState(sidebarId, 'expanded');
        
        // Anunciar para leitores de tela
        announceToScreenReader('Menu expandido');
    }
    
    function collapseSidebar(sidebar, sidebarId) {
        sidebar.classList.add(CONFIG.collapsedClass);
        sidebar.classList.remove(CONFIG.expandedClass);
        saveSidebarState(sidebarId, 'collapsed');
        
        // Anunciar para leitores de tela
        announceToScreenReader('Menu recolhido');
    }
    
    // ===================================
    // NAVIGATION
    // ===================================
    
    function handleNavClick(e, clickedLink, allLinks) {
        // Se for link interno (não navega), prevenir default
        if (clickedLink.dataset.action) {
            e.preventDefault();
        }
        
        // Remover active de todos
        allLinks.forEach(link => link.classList.remove(CONFIG.activeClass));
        
        // Adicionar active ao clicado
        clickedLink.classList.add(CONFIG.activeClass);
        
        // Executar ação customizada se existir
        const action = clickedLink.dataset.action;
        if (action && typeof window[action] === 'function') {
            window[action](clickedLink);
        }
    }
    
    function highlightCurrentPage(navLinks) {
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === currentPath) {
                link.classList.add(CONFIG.activeClass);
            }
        });
    }
    
    // ===================================
    // STORAGE
    // ===================================
    
    function saveSidebarState(sidebarId, state) {
        try {
            const states = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
            states[sidebarId] = state;
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(states));
        } catch (e) {
            console.error('Erro ao salvar estado do sidebar:', e);
        }
    }
    
    function restoreSidebarState(sidebar, sidebarId) {
        try {
            const states = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
            const state = states[sidebarId];
            
            if (state === 'collapsed') {
                sidebar.classList.add(CONFIG.collapsedClass);
                sidebar.classList.remove(CONFIG.expandedClass);
            } else {
                sidebar.classList.remove(CONFIG.collapsedClass);
                sidebar.classList.add(CONFIG.expandedClass);
            }
        } catch (e) {
            console.error('Erro ao restaurar estado do sidebar:', e);
        }
    }
    
    // ===================================
    // ACCESSIBILITY
    // ===================================
    
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // ===================================
    // HELPERS - CRIAR SIDEBAR DINAMICAMENTE
    // ===================================
    
    /**
     * Cria um sidebar menu dinamicamente
     * @param {Object} config - Configuração do sidebar
     * @param {string} config.id - ID único do sidebar
     * @param {string} config.title - Título do sidebar
     * @param {Array} config.items - Array de itens do menu
     * @param {string} config.mode - 'overlay' ou 'push-down'
     * @returns {string} HTML do sidebar
     */
    function createSidebar(config) {
        const {
            id = 'sidebar-' + Date.now(),
            title = 'Menu',
            items = [],
            mode = 'overlay',
            footer = ''
        } = config;
        
        const itemsHTML = items.map(item => `
            <li class="sidebar-nav-item">
                <a href="${item.link || '#'}" class="sidebar-nav-link" ${item.action ? `data-action="${item.action}"` : ''}>
                    <span class="sidebar-nav-icon">
                        <i class="${item.icon || 'fas fa-circle'}" aria-hidden="true"></i>
                    </span>
                    <span class="sidebar-nav-text">${item.text}</span>
                </a>
            </li>
        `).join('');
        
        return `
            <aside class="sidebar-menu expanded" data-sidebar-id="${id}" role="navigation" aria-label="${title}">
                <div class="sidebar-header">
                    <h3 class="sidebar-title">${title}</h3>
                    <button class="sidebar-toggle-btn" aria-label="Alternar menu">
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                </div>
                <nav>
                    <ul class="sidebar-nav">
                        ${itemsHTML}
                    </ul>
                </nav>
                ${footer ? `<div class="sidebar-footer">${footer}</div>` : ''}
            </aside>
        `;
    }
    
    // ===================================
    // RESPONSIVE - AUTO COLLAPSE
    // ===================================
    
    function handleResize() {
        const sidebars = document.querySelectorAll('.sidebar-menu');
        const isMobile = window.innerWidth <= 768;
        
        sidebars.forEach(sidebar => {
            if (isMobile && !sidebar.classList.contains(CONFIG.collapsedClass)) {
                // Auto-colapsar no mobile
                const sidebarId = sidebar.dataset.sidebarId || 'default';
                collapseSidebar(sidebar, sidebarId);
            }
        });
    }
    
    // Debounce resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // ===================================
    // API PÚBLICA
    // ===================================
    
    window.SidebarMenuController = {
        createSidebar,
        toggleSidebar: (sidebarId) => {
            const sidebar = document.querySelector(`[data-sidebar-id="${sidebarId}"]`);
            if (sidebar) toggleSidebar(sidebar, sidebarId);
        },
        expandSidebar: (sidebarId) => {
            const sidebar = document.querySelector(`[data-sidebar-id="${sidebarId}"]`);
            if (sidebar) expandSidebar(sidebar, sidebarId);
        },
        collapseSidebar: (sidebarId) => {
            const sidebar = document.querySelector(`[data-sidebar-id="${sidebarId}"]`);
            if (sidebar) collapseSidebar(sidebar, sidebarId);
        },
        refresh: setupSidebars
    };
    
    // Inicializar
    init();
    
})();
