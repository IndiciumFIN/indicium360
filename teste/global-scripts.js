/**
 * Função principal que inicializa todos os componentes interativos do site.
 * Esta função é chamada pelo Index.html DEPOIS que todos os componentes
 * HTML (header, footer) foram carregados na página.
 */
function initializeApp() {
    console.log("initializeApp() foi chamada. Iniciando a aplicação...");

    // --- LÓGICA DE MODAIS E COOKIES (GLOBAL) ---
    const suggestionModal = document.getElementById('suggestion-modal');
    const cookiePrefsModal = document.getElementById('cookie-prefs-modal');
    
    const openModal = (modal) => {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            window.addEventListener('keydown', closeModalOnEsc);
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            window.removeEventListener('keydown', closeModalOnEsc);
        }
    };
    
    const closeModalOnEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal(suggestionModal);
            closeModal(cookiePrefsModal);
        }
    };

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    document.getElementById('suggest-tool-btn')?.addEventListener('click', () => openModal(suggestionModal));
    document.getElementById('manage-cookies-banner-btn')?.addEventListener('click', () => openModal(cookiePrefsModal));
    document.getElementById('manage-cookies-footer-btn')?.addEventListener('click', () => openModal(cookiePrefsModal));

    // --- LÓGICA DO BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
        const declineCookiesBtn = document.getElementById('decline-cookies-btn');
        
        const hideCookieBanner = () => cookieBanner.classList.remove('show');
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
        });
        
        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieBanner();
        });

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
    }


    // --- MÓDULO DE ACESSIBILIDADE ---
    const accessibilityManager = new AccessibilityManager();
    
    // --- BOTÃO LIBRAS ---
    const librasBtn = document.getElementById('libras-btn');
    if (librasBtn) {
        librasBtn.addEventListener('click', () => {
            const vw_widget = document.querySelector('[vw-access-button]');
            if (vw_widget) {
                vw_widget.click();
            } else {
                console.error("Widget VLibras não encontrado. O script pode não ter carregado.");
            }
        });
    }

    // --- BOTÕES FLUTUANTES ---
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    console.log("Aplicação inicializada com sucesso.");
}


// --- INÍCIO DAS CLASSES E FUNÇÕES DE APOIO ---

class AccessibilityManager {
    constructor() {
        this.body = document.body;
        this.html = document.documentElement;
        this.menu = document.getElementById('accessibility-menu');
        this.openBtn = document.getElementById('accessibility-btn');
        this.closeBtn = document.getElementById('close-accessibility-menu');
        this.resetBtn = document.getElementById('reset-accessibility');
        
        this.state = {};
        this.readingMask = null;
        this.readingGuide = null;
        this.init();
    }

    init() {
        if (!this.menu || !this.openBtn || !this.closeBtn || !this.resetBtn) {
            console.warn("Elementos do menu de acessibilidade não encontrados.");
            return;
        }
        
        this.openBtn.addEventListener('click', () => this.toggleMenu(true));
        this.closeBtn.addEventListener('click', () => this.toggleMenu(false));
        this.resetBtn.addEventListener('click', () => this.resetAll());
        
        this.menu.addEventListener('click', (e) => {
            const target = e.target.closest('.acc-option');
            if (!target) return;
            const { action, value } = target.dataset;
            this.handleAction(action, value);
        });
    }

    toggleMenu(open) { this.menu.classList.toggle('open', open); }

    handleAction(action, value) {
        const group = action.replace(/-(\w)/g, (m, p1) => p1.toUpperCase());
        const isToggle = !value;

        if (isToggle) { this.state[group] = !this.state[group]; } 
        else { this.state[group] = this.state[group] === value ? null : value; }

        const funcName = 'apply' + group.charAt(0).toUpperCase() + group.slice(1);
        if (typeof this[funcName] === 'function') { this[funcName](this.state[group]); }

        this.updateActiveState();
    }

    applyFontSize(value) { this.body.style.fontSize = value ? `${value}em` : ''; }
    applyFontType(value) { this.body.classList.toggle('font-serif', value === 'serif'); this.body.classList.toggle('font-bold-force', value === 'bold'); }
    applyLineSpacing(value) { this.body.style.lineHeight = value || ''; }
    applyLetterSpacing(value) { this.body.style.letterSpacing = value ? `${value}em` : ''; }
    applyContrast(value) { this.html.className = this.html.className.replace(/contrast-\w+/g, ''); if(value) this.html.classList.add(`contrast-${value}`); }
    applySaturation(value) { this.html.className = this.html.className.replace(/saturation-\w+/g, ''); if(value) this.html.classList.add(`saturation-${value}`); }
    applyHighlightLinks(active) { this.body.classList.toggle('links-highlighted', active); }
    
    applySiteReader(active) {
        if (active) { this.body.addEventListener('click', this.readText, true); } 
        else { this.body.removeEventListener('click', this.readText, true); speechSynthesis.cancel(); }
    }
    
    readText(event) {
        event.preventDefault(); event.stopPropagation();
        const text = event.target.textContent || event.target.alt || event.target.ariaLabel;
        if (text) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            speechSynthesis.speak(utterance);
        }
    }

    applyReadingMask(active) {
        if (active && !this.readingMask) {
            this.readingMask = document.createElement('div'); this.readingMask.id = 'reading-mask'; this.body.appendChild(this.readingMask);
            document.addEventListener('mousemove', this.updateMaskPosition);
        } else if (!active && this.readingMask) {
            this.readingMask.remove(); this.readingMask = null;
            document.removeEventListener('mousemove', this.updateMaskPosition);
        }
    }
    
    updateMaskPosition(e) { const maskHeight = 100; document.getElementById('reading-mask').style.clipPath = `polygon(0 ${e.clientY - maskHeight/2}px, 100% ${e.clientY - maskHeight/2}px, 100% ${e.clientY + maskHeight/2}px, 0 ${e.clientY + maskHeight/2}px)`; }

    applyReadingGuide(active) {
        if (active && !this.readingGuide) {
            this.readingGuide = document.createElement('div'); this.readingGuide.id = 'reading-guide'; this.body.appendChild(this.readingGuide);
            document.addEventListener('mousemove', this.updateGuidePosition);
        } else if (!active && this.readingGuide) {
            this.readingGuide.remove(); this.readingGuide = null;
            document.removeEventListener('mousemove', this.updateGuidePosition);
        }
    }

    updateGuidePosition(e) { document.getElementById('reading-guide').style.top = `${e.clientY}px`; }

    resetAll() {
        const allActions = new Set(Array.from(this.menu.querySelectorAll('[data-action]')).map(el => el.dataset.action));
        allActions.forEach(action => {
            const group = action.replace(/-(\w)/g, (m, p1) => p1.toUpperCase());
            this.state[group] = null;
            const funcName = 'apply' + group.charAt(0).toUpperCase() + group.slice(1);
            if (typeof this[funcName] === 'function') { this[funcName](null); }
        });
        this.updateActiveState();
    }
    
    updateActiveState() {
        this.menu.querySelectorAll('.acc-feature').forEach(feature => {
            const group = feature.dataset.group;
            let hasActive = false;
            feature.querySelectorAll('.acc-option').forEach(option => {
                const { action, value } = option.dataset;
                const isActive = value ? this.state[group] === value : !!this.state[group];
                option.classList.toggle('active', isActive);
                if (isActive) hasActive = true;
            });
            feature.classList.toggle('active', hasActive);
        });
    }
}
