/**
 * CALCULADORAS DE ENFERMAGEM - JAVASCRIPT
 * Versão 6.0 - Estrutura Modular
 * =============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // 1. LANGUAGE SELECTOR (HEADER) - CLICK ONLY
    // ===================================
    const langTrigger = document.getElementById('langTrigger');
    const langMegaMenu = document.getElementById('langMegaMenu');
    const langSelector = document.querySelector('.lang-selector');

    if (langTrigger && langMegaMenu) {
        const arrow = langTrigger.querySelector('.fa-chevron-down');

        // Click para abrir/fechar (SOMENTE CLICK - SEM HOVER)
        langTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = langMegaMenu.classList.contains('active');
            langMegaMenu.classList.toggle('active');
            
            if (arrow) {
                arrow.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!langSelector.contains(e.target) && !langMegaMenu.contains(e.target)) {
                langMegaMenu.classList.remove('active');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        });
        
        // Prevenir fechamento ao clicar dentro do menu
        langMegaMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // ===================================
    // 2. THEME SWITCHER
    // ===================================
    const btnLight = document.getElementById('btnLight');
    const btnDark = document.getElementById('btnDark');
    
    if(btnLight && btnDark) {
        btnLight.addEventListener('click', () => {
            document.documentElement.removeAttribute('data-theme');
            btnLight.classList.add('active');
            btnDark.classList.remove('active');
            localStorage.setItem('theme', 'light');
        });
        
        btnDark.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            btnDark.classList.add('active');
            btnLight.classList.remove('active');
            localStorage.setItem('theme', 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            btnDark.classList.add('active');
            btnLight.classList.remove('active');
        }
    }
    
    // ===================================
    // 3. FONT SIZE CONTROLS
    // ===================================
    const btnFontIncrease = document.getElementById('btnFontIncrease');
    const btnFontDecrease = document.getElementById('btnFontDecrease');
    let currentFontSize = 16;
    const minFontSize = 12;
    const maxFontSize = 24;
    
    // Load saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        document.documentElement.style.setProperty('--font-size-base', currentFontSize + 'px');
    }
    
    if (btnFontIncrease) {
        btnFontIncrease.addEventListener('click', () => {
            if (currentFontSize < maxFontSize) {
                currentFontSize += 2;
                document.documentElement.style.setProperty('--font-size-base', currentFontSize + 'px');
                localStorage.setItem('fontSize', currentFontSize);
            }
        });
    }
    
    if (btnFontDecrease) {
        btnFontDecrease.addEventListener('click', () => {
            if (currentFontSize > minFontSize) {
                currentFontSize -= 2;
                document.documentElement.style.setProperty('--font-size-base', currentFontSize + 'px');
                localStorage.setItem('fontSize', currentFontSize);
            }
        });
    }

    // ===================================
    // 4. NAVIGATION MEGA MENUS
    // ===================================
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const megaMenu = item.querySelector('.mega-menu-wrapper');
        
        if (megaMenu) {
            item.addEventListener('mouseenter', () => {
                megaMenu.classList.add('active');
            });
            
            item.addEventListener('mouseleave', () => {
                megaMenu.classList.remove('active');
            });
        }
    });

    // ===================================
    // 5. SMOOTH SCROLL PARA SKIP LINKS
    // ===================================
    const skipLinks = document.querySelectorAll('.skip-links a');
    
    skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focar no elemento de destino
                targetElement.focus();
            }
        });
    });

    // ===================================
    // 6. LOADING OPTIMIZATION
    // ===================================
    // Lazy loading para imagens
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback para navegadores antigos - usando versão local
        const script = document.createElement('script');
        script.src = 'assets/js/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // 7. COOKIE CONSENT (PLACEHOLDER)
    // ===================================
    const manageCookiesBtn = document.getElementById('manage-cookies-footer-btn');
    
    if (manageCookiesBtn) {
        manageCookiesBtn.addEventListener('click', () => {
            // Implementar lógica de gerenciamento de cookies
            alert('Gerenciador de Cookies - Em desenvolvimento');
        });
    }

    // ===================================
    // 7.2 SEARCH FUNCTIONALITY
    // ===================================
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchWrap = document.querySelector('.search-wrap');
    
    function performSearch() {
        if (searchInput && searchInput.value.trim() !== '') {
            const searchTerm = searchInput.value.trim();
            // Redirecionar para página de busca com o termo
            window.location.href = `https://www.calculadorasdeenfermagem.com.br/busca.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // ===================================
    // 8. ANALYTICS TRACKING (PLACEHOLDER)
    // ===================================
    // Google Analytics ou similar podem ser adicionados aqui
    
    // ===================================
    // 9. ACCESSIBILITY ENHANCEMENTS
    // ===================================
    // Adicionar indicadores visuais de foco
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // ===================================
    // 10. PERFORMANCE MONITORING
    // ===================================
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('Tempo de carregamento da página:', pageLoadTime, 'ms');
        });
    }

    // ===================================
    // 11. ERROR HANDLING
    // ===================================
    window.addEventListener('error', (e) => {
        console.error('Erro capturado:', e.message);
        // Aqui você pode enviar erros para um serviço de monitoramento
    });

    // ===================================
    // 12. SERVICE WORKER (PWA - OPCIONAL)
    // ===================================
    if ('serviceWorker' in navigator) {
        // Descomentar quando implementar PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registrado', reg))
        //     .catch(err => console.log('Erro ao registrar Service Worker', err));
    }

});

// ===================================
// FUNÇÕES UTILITÁRIAS GLOBAIS
// ===================================

/**
 * Debounce function para otimizar eventos de scroll/resize
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Detectar se elemento está visível no viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Animar números contadores
 */
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Formatar data em português
 */
function formatDatePTBR(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Copiar texto para clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erro ao copiar:', err);
        return false;
    }
}

// Exportar funções se estiver usando módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        isElementInViewport,
        animateCounter,
        formatDatePTBR,
        copyToClipboard
    };
}


/* ================================================
   GOOGLE ANALYTICS CONSENT MODE V2
   ================================================ */

// Configuração inicial de consentimento (executa antes do GA)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Default: nega até obter consentimento
gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
});

/* ================================================
   CONSENT BANNER FUNCTIONALITY
   ================================================ */

const ConsentManager = {
    STORAGE_KEY: 'cookie_consent',
    
    init() {
        const consent = this.getConsent();
        if (consent === null) {
            this.showBanner();
        } else if (consent === 'accepted') {
            this.updateGtagConsent(true);
        }
        this.bindEvents();
    },
    
    getConsent() {
        return localStorage.getItem(this.STORAGE_KEY);
    },
    
    setConsent(value) {
        localStorage.setItem(this.STORAGE_KEY, value);
    },
    
    showBanner() {
        const banner = document.querySelector('.consent-banner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('active');
            }, 1000);
        }
    },
    
    hideBanner() {
        const banner = document.querySelector('.consent-banner');
        if (banner) {
            banner.classList.remove('active');
        }
    },
    
    acceptAll() {
        this.setConsent('accepted');
        this.updateGtagConsent(true);
        this.hideBanner();
    },
    
    rejectAll() {
        this.setConsent('rejected');
        this.updateGtagConsent(false);
        this.hideBanner();
    },
    
    updateGtagConsent(granted) {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': granted ? 'granted' : 'denied',
                'ad_storage': granted ? 'granted' : 'denied',
                'ad_user_data': granted ? 'granted' : 'denied',
                'ad_personalization': granted ? 'granted' : 'denied'
            });
        }
    },
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.consent-btn-accept')) {
                this.acceptAll();
            } else if (e.target.matches('.consent-btn-reject')) {
                this.rejectAll();
            }
        });
    }
};

// Inicializa o gerenciador de consentimento
document.addEventListener('DOMContentLoaded', () => {
    ConsentManager.init();
});

/* ================================================
   VLIBRAS INTEGRATION
   ================================================ */

function loadVLibras() {
    // Verifica se já existe
    if (document.querySelector('[vw]')) {
        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.onload = function() {
            if (window.VLibras) {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            }
        };
        document.body.appendChild(script);
    }
}

// Carrega VLibras após a página carregar
window.addEventListener('load', loadVLibras);

/* ================================================
   BREADCRUMB DYNAMIC GENERATION
   ================================================ */

function generateBreadcrumb(items) {
    const container = document.querySelector('.breadcrumb-list');
    if (!container || !items || !items.length) return;
    
    container.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast) {
            return `<li class="breadcrumb-item">
                <span class="breadcrumb-current">${item.label}</span>
            </li>`;
        }
        
        return `<li class="breadcrumb-item">
            <a href="${item.url}">${item.label}</a>
            <span class="breadcrumb-separator">/</span>
        </li>`;
    }).join('');
}

/* ================================================
   DYNAMIC FOOTER LOADING (OPCIONAL)
   ================================================ */

async function loadFooter(footerPath) {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;
    
    try {
        const response = await fetch(footerPath || '../0.Template/footer.html');
        if (response.ok) {
            const footerHTML = await response.text();
            footerPlaceholder.innerHTML = footerHTML;
        } else {
            console.warn('Footer não encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar footer:', error);
    }
}

/* ================================================
   PRINT PAGE FUNCTION
   ================================================ */

function printPage() {
    window.print();
}

/* ================================================
   SHARE PAGE FUNCTION
   ================================================ */

async function sharePage(title, text) {
    const shareData = {
        title: title || document.title,
        text: text || document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: copiar URL
            await copyToClipboard(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    } catch (err) {
        console.error('Erro ao compartilhar:', err);
    }
}

/* ================================================
   READING TIME CALCULATOR
   ================================================ */

function calculateReadingTime(text, wordsPerMinute = 200) {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

function displayReadingTime(selector) {
    const content = document.querySelector(selector);
    const display = document.querySelector('.reading-time');
    
    if (content && display) {
        const minutes = calculateReadingTime(content.textContent);
        display.textContent = `${minutes} min de leitura`;
    }
}

/* ================================================
   SMOOTH SCROLL TO ELEMENT
   ================================================ */

function scrollToElement(selector, offset = 100) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

/* ================================================
   TABLE OF CONTENTS GENERATOR
   ================================================ */

function generateTableOfContents(contentSelector, tocSelector) {
    const content = document.querySelector(contentSelector);
    const toc = document.querySelector(tocSelector);
    
    if (!content || !toc) return;
    
    const headings = content.querySelectorAll('h2, h3');
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        // Adiciona ID ao heading se não tiver
        if (!heading.id) {
            heading.id = `section-${index}`;
        }
        
        const li = document.createElement('li');
        li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToElement(`#${heading.id}`);
        });
        
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
}


/* ================================================
   EXPANDABLE MEGA MENU SECTIONS
   ================================================ */

// Inicializar sub-menus expansíveis
function initializeExpandableMenus() {
    const expandableTitles = document.querySelectorAll('.expandable-title');
    
    expandableTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Alternar expanded no título
            this.classList.toggle('expanded');
            
            // Encontrar o conteúdo expansível logo após o título
            const content = this.nextElementSibling;
            
            if (content && content.classList.contains('mm-expandable-content')) {
                content.classList.toggle('expanded');
            }
        });
    });
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExpandableMenus);
} else {
    initializeExpandableMenus();
}

/* ================================================
   NAVEGAÇÃO LATERAL (SIDEBAR MEGA MENU)
   ================================================ */

// Inicializar navegação lateral nos mega menus
function initializeSidebarNavigation() {
    const navItems = document.querySelectorAll('.mm-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Pegar o ID da seção alvo
            const targetId = this.getAttribute('data-target');
            
            if (!targetId) return;
            
            // Encontrar o container pai
            const container = this.closest('.mm-sidebar-layout');
            if (!container) return;
            
            // Remover 'active' de todos os itens de navegação no mesmo container
            container.querySelectorAll('.mm-nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Adicionar 'active' no item clicado
            this.classList.add('active');
            
            // Ocultar todas as seções de conteúdo no mesmo container
            container.querySelectorAll('.mm-section-content').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar a seção correspondente
            const targetSection = container.querySelector(`#${targetId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Ativar a primeira seção por padrão em cada sidebar
    document.querySelectorAll('.mm-sidebar-layout').forEach(sidebar => {
        const firstNavItem = sidebar.querySelector('.mm-nav-item');
        const firstSection = sidebar.querySelector('.mm-section-content');
        
        if (firstNavItem && firstSection) {
            firstNavItem.classList.add('active');
            firstSection.classList.add('active');
        }
    });
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebarNavigation);
} else {
    initializeSidebarNavigation();
}
