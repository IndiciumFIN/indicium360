// Ação de fallback para o carregamento dinâmico de scripts
function loadExternalScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
}

// Carregar o badge de carbono no final do corpo
loadExternalScript("https://unpkg.com/website-carbon-badges@1.1.3/b.min.js");

/**
 * Função principal que inicializa todos os componentes interativos do site.
 * Esta função deve ser chamada depois de o DOM estar totalmente populado.
 */
function initializeApp() {
    console.log("Inicializando a aplicação...");

    // --- FIREBASE INITIALIZATION & DYNAMIC FORMS ---
    const firebaseConfig = {
        apiKey: "AIzaSyAuJ-f5ZyQ4df_5-EPUw8QlUUfpDRdyKH8",
        authDomain: "site-calculadoras.firebaseapp.com",
        projectId: "site-calculadoras",
        storageBucket: "site-calculadoras.firebasestorage.app",
        messagingSenderId: "57518126485",
        appId: "1:57518126485:web:06e8853cedea7697c5729c",
        measurementId: "G-GD0NBBTFYR"
    };

    if (typeof firebase !== 'undefined') {
        try {
            const app = firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();

            // --- LÓGICA DO FORMULÁRIO DE NEWSLETTER ---
            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('newsletter-email');
                    const feedbackDiv = document.getElementById('newsletter-feedback');
                    const email = emailInput.value.trim();

                    if (email) {
                        feedbackDiv.textContent = 'A processar...';
                        feedbackDiv.style.color = 'gray';
                        try {
                            await db.collection("newsletterSubscribers").add({
                                email: email,
                                subscribedAt: new Date()
                            });
                            feedbackDiv.textContent = 'Obrigado por subscrever!';
                            feedbackDiv.style.color = 'green';
                            emailInput.value = '';
                        } catch (error) {
                            console.error("Erro ao adicionar subscrição: ", error);
                            feedbackDiv.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
                            feedbackDiv.style.color = 'red';
                        }
                    }
                });
            }

            // --- LÓGICA DO FORMULÁRIO DE SUGESTÃO ---
            const suggestionForm = document.getElementById('suggestion-form');
            if (suggestionForm) {
                suggestionForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const suggestionText = document.getElementById('suggestion-text');
                    const feedbackDiv = document.getElementById('suggestion-feedback');
                    const submitBtn = document.getElementById('suggestion-submit-btn');
                    const suggestion = suggestionText.value.trim();

                    if (suggestion) {
                        submitBtn.disabled = true;
                        feedbackDiv.textContent = 'A enviar sugestão...';
                        feedbackDiv.style.color = 'gray';

                        try {
                            await db.collection("toolSuggestions").add({
                                suggestion: suggestion,
                                submittedAt: new Date()
                            });
                            feedbackDiv.textContent = 'Sugestão enviada com sucesso. Obrigado!';
                            feedbackDiv.style.color = 'green';
                            suggestionText.value = '';
                        } catch (error) {
                            console.error("Erro ao enviar sugestão: ", error);
                            feedbackDiv.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
                            feedbackDiv.style.color = 'red';
                        } finally {
                            submitBtn.disabled = false;
                        }
                    }
                });
            }
        } catch (e) {
            console.error("Falha ao inicializar Firebase.", e);
        }
    } else {
        console.warn("Firebase não está definido. Funcionalidades de formulário estarão desativadas.");
    }

    // --- MENU HAMBÚRGUER ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    if (hamburgerBtn && mobileMenu && closeMenuBtn) {
        const toggleMenu = () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.style.display = isExpanded ? 'none' : 'block';
        };
        hamburgerBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);
    }
    
    // --- LÓGICA DE NAVEGAÇÃO UNIFICADA (DESKTOP E MÓVEL) ---
    function setupNavigation() {
        const dropdownButtons = document.querySelectorAll('[aria-haspopup="true"]');
        dropdownButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const menuId = button.getAttribute('aria-controls');
                const menu = document.getElementById(menuId);
                if (!menu) return;
                const isCurrentlyOpen = button.getAttribute('aria-expanded') === 'true';
                document.querySelectorAll('[aria-expanded="true"]').forEach(openBtn => {
                    if (openBtn !== button) {
                       const openMenuId = openBtn.getAttribute('aria-controls');
                       const openMenu = document.getElementById(openMenuId);
                       openBtn.setAttribute('aria-expanded', 'false');
                       if (openMenu) openMenu.classList.add('hidden');
                       const icon = openBtn.querySelector('svg, i.fas');
                       if (icon) icon.classList.remove('rotate-180');
                    }
                });
                button.setAttribute('aria-expanded', String(!isCurrentlyOpen));
                menu.classList.toggle('hidden', isCurrentlyOpen);
                const icon = button.querySelector('svg, i.fas');
                if (icon) icon.classList.toggle('rotate-180', !isCurrentlyOpen);
            });
        });
        window.addEventListener('click', () => {
            document.querySelectorAll('[aria-expanded="true"]').forEach(openBtn => {
                const openMenuId = openBtn.getAttribute('aria-controls');
                const openMenu = document.getElementById(openMenuId);
                openBtn.setAttribute('aria-expanded', 'false');
                if (openMenu) openMenu.classList.add('hidden');
                const icon = openBtn.querySelector('svg, i.fas');
                if (icon) icon.classList.remove('rotate-180');
            });
        });
    }
    setupNavigation();

    // --- LÓGICA DE MODAIS E COOKIES (GLOBAL) ---
    const suggestionModal = document.getElementById('suggestion-modal');
    const cookiePrefsModal = document.getElementById('cookie-prefs-modal');
    const openModal = (modal, opener) => {
        if(!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.opener = opener; 
        window.addEventListener('keydown', closeModalOnEsc);
    };
    const closeModal = (modal) => {
        if(!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if(modal.opener) modal.opener.focus();
        window.removeEventListener('keydown', closeModalOnEsc);
    };
    const closeModalOnEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal(suggestionModal);
            closeModal(cookiePrefsModal);
        }
    };
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(suggestionModal);
            closeModal(cookiePrefsModal);
        });
    });
    document.getElementById('suggest-tool-btn')?.addEventListener('click', (e) => openModal(suggestionModal, e.target));
    
    // --- GESTOR DE COOKIES ---
    class CookieManager {
        constructor() {
            this.banner = document.getElementById('cookie-banner');
            this.prefsModal = document.getElementById('cookie-prefs-modal');
            this.modalToggles = {
                analiticos: document.getElementById('cookies-analiticos'),
                marketing: document.getElementById('cookies-marketing')
            };
            this.prefs = { analiticos: true, marketing: true };
            this.init();
        }
        init() {
            this.loadPreferences();
            this.bindEvents();
            this.checkConsent();
            this.applyCurrentConsent();
        }
        applyCurrentConsent() {
            const adSection = document.getElementById('ad-section');
            if (this.prefs.marketing) {
                if(adSection) adSection.style.display = 'block';
                if (typeof gtag === 'function') gtag('consent', 'update', { 'ad_storage': 'granted' });
            } else {
                if(adSection) adSection.style.display = 'none';
                if (typeof gtag === 'function') gtag('consent', 'update', { 'ad_storage': 'denied' });
            }
            if (this.prefs.analiticos) {
                 if (typeof gtag === 'function') gtag('consent', 'update', { 'analytics_storage': 'granted' });
            } else {
                 if (typeof gtag === 'function') gtag('consent', 'update', { 'analytics_storage': 'denied' });
            }
        }
        loadPreferences() {
            try {
                const storedPrefs = localStorage.getItem('cookiePrefs');
                if (storedPrefs) this.prefs = JSON.parse(storedPrefs);
            } catch (e) { console.error('Falha ao carregar preferências de cookies:', e); }
            this.updateUI();
        }
        savePreferences() {
            try {
                localStorage.setItem('cookiePrefs', JSON.stringify(this.prefs));
                localStorage.setItem('cookieConsent', 'managed');
            } catch (e) { console.error('Falha ao salvar preferências de cookies:', e); }
            this.hideBanner();
            if(this.prefsModal) closeModal(this.prefsModal);
            this.applyCurrentConsent();
        }
        updateUI() {
            for (const key in this.prefs) {
                if (this.modalToggles[key]) this.modalToggles[key].checked = this.prefs[key];
            }
        }
        bindEvents() {
            document.getElementById('accept-cookies-btn')?.addEventListener('click', () => this.acceptAll());
            document.getElementById('accept-all-cookies-btn')?.addEventListener('click', () => this.acceptAll());
            document.getElementById('decline-cookies-btn')?.addEventListener('click', () => this.declineAll());
            document.getElementById('save-cookie-prefs-btn')?.addEventListener('click', () => this.managePrefsFromModal());
            document.getElementById('manage-cookies-banner-btn')?.addEventListener('click', (e) => openModal(this.prefsModal, e.target));
            document.getElementById('manage-cookies-footer-btn')?.addEventListener('click', (e) => openModal(this.prefsModal, e.target));
        }
        acceptAll() {
            this.prefs = { analiticos: true, marketing: true };
            try { localStorage.setItem('cookieConsent', 'accepted'); } catch (e) { console.error('Falha ao salvar consentimento:', e); }
            this.savePreferences();
            this.updateUI();
        }
        declineAll() {
            this.prefs = { analiticos: false, marketing: false };
            try { localStorage.setItem('cookieConsent', 'declined'); } catch (e) { console.error('Falha ao salvar consentimento:', e); }
            this.savePreferences();
            this.updateUI();
        }
        managePrefsFromModal() {
            if(this.modalToggles.analiticos) this.prefs.analiticos = this.modalToggles.analiticos.checked;
            if(this.modalToggles.marketing) this.prefs.marketing = this.modalToggles.marketing.checked;
            this.savePreferences();
            this.updateUI();
        }
        checkConsent() {
             try {
                if (!localStorage.getItem('cookieConsent') && this.banner) {
                    setTimeout(() => this.showBanner(), 2000);
                }
            } catch (e) { console.error('Falha ao verificar consentimento:', e); }
        }
        showBanner() { if(this.banner) this.banner.classList.add('show'); }
        hideBanner() { if(this.banner) this.banner.classList.remove('show'); }
    }
    new CookieManager();
    
    // --- MÓDULO DE ACESSIBILIDADE ---
    class AccessibilityManager {
        // ... (código completo da classe AccessibilityManager aqui)
    }
    new AccessibilityManager();

    // --- BOTÃO LIBRAS (VERSÃO CORRIGIDA E ROBUSTA) ---
    const librasBtn = document.getElementById('libras-btn');
    if (librasBtn) {
        librasBtn.addEventListener('click', () => {
            let vw_widget = document.querySelector('[vw-access-button]');
            if (vw_widget) {
                vw_widget.click();
            } else {
                console.warn("Widget VLibras não encontrado imediatamente. A tentar novamente por 5 segundos...");
                librasBtn.disabled = true;
                let attempts = 0;
                const interval = setInterval(() => {
                    vw_widget = document.querySelector('[vw-access-button]');
                    attempts++;
                    if (vw_widget) {
                        clearInterval(interval);
                        vw_widget.click();
                        librasBtn.disabled = false;
                    } else if (attempts >= 10) {
                        clearInterval(interval);
                        console.error("Widget VLibras não foi carregado após 5 segundos.");
                        alert("A funcionalidade de LIBRAS não pôde ser carregada. Por favor, tente recarregar a página.");
                        librasBtn.disabled = false;
                    }
                }, 500);
            }
        });
    }

    // --- BOTÃO VOLTAR AO TOPO ---
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        const toggleBackToTopButton = () => {
            backToTopBtn.classList.toggle('is-hidden', window.scrollY <= 300);
        };
        toggleBackToTopButton();
        window.addEventListener('scroll', toggleBackToTopButton);
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- REGISTO DO SERVICE WORKER PARA PWA ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker registado:', registration.scope))
                .catch(err => console.error('Falha ao registar Service Worker:', err));
        });
    }

    console.log("Aplicação inicializada com sucesso.");
}
