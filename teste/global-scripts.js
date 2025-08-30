// Ação de fallback para o carregamento dinâmico de scripts
function loadExternalScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
}

// Carregar o badge de carbono no final do corpo
loadExternalScript("https://unpkg.com/website-carbon-badges@1.1.3/b.min.js");

// --- FIREBASE INITIALIZATION & DYNAMIC FORMS ---
let db = null;
let firebaseInitialized = false;

// Verificar e inicializar Firebase
function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && firebase.app) {
            const firebaseConfig = {
                apiKey: "AIzaSyAuJ-f5ZyQ4df_5-EPUw8QlUUfpDRdyKH8",
                authDomain: "site-calculadoras.firebaseapp.com",
                projectId: "site-calculadoras",
                storageBucket: "site-calculadoras.firebasestorage.app",
                messagingSenderId: "57518126485",
                appId: "1:57518126485:web:06e8853cedea7697c5729c",
                measurementId: "G-GD0NBBTFYR"
            };
            
            // Verificar se já foi inicializado
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            db = firebase.firestore();
            firebaseInitialized = true;
            console.log('Firebase inicializado com sucesso');
            
            // Habilitar formulários
            enableForms();
        } else {
            console.warn('Firebase não está disponível');
            disableForms();
        }
    } catch (e) {
        console.error('Erro ao inicializar Firebase:', e);
        disableForms();
    }
}

// Habilitar formulários
function enableForms() {
    const forms = document.querySelectorAll('#newsletter-form, #suggestion-form');
    forms.forEach(form => {
        form.style.opacity = '1';
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
    });
}

// Desabilitar formulários com fallback
function disableForms() {
    const forms = document.querySelectorAll('#newsletter-form, #suggestion-form');
    forms.forEach(form => {
        form.style.opacity = '0.7';
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
    });
    
    // Adicionar mensagem de fallback
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm && !newsletterForm.querySelector('.fallback-message')) {
        const message = document.createElement('p');
        message.className = 'fallback-message text-sm text-gray-500 mt-2';
        message.textContent = 'Sistema temporariamente indisponível. Tente novamente mais tarde.';
        newsletterForm.appendChild(message);
    }
}

// Função fallback para enviar dados por email (usando FormSubmit)
function fallbackSubmitForm(formId, data) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formsubmit.co/seu-email@dominio.com';
    
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    });
    
    // Adicionar identificador do formulário
    const formTypeInput = document.createElement('input');
    formTypeInput.type = 'hidden';
    formTypeInput.name = '_subject';
    formTypeInput.value = formId === 'newsletter-form' ? 'Nova inscrição na newsletter' : 'Nova sugestão de ferramenta';
    form.appendChild(formTypeInput);
    
    document.body.appendChild(form);
    form.submit();
    return true;
}

/**
 * Função principal que inicializa todos os componentes interativos do site.
 * Esta função deve ser chamada depois de o DOM estar totalmente populado.
 */
function initializeApp() {
    console.log("Inicializando a aplicação...");

    // Inicializar Firebase
    initializeFirebase();

    // --- LÓGICA DO FORMULÁRIO DE NEWSLETTER ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const feedbackDiv = document.getElementById('newsletter-feedback');
            const email = emailInput.value.trim();

            if (!email) {
                feedbackDiv.textContent = 'Por favor, insira um email válido.';
                feedbackDiv.style.color = 'red';
                return;
            }

            if (!firebaseInitialized) {
                // Usar fallback
                const success = fallbackSubmitForm('newsletter-form', { email });
                if (success) {
                    feedbackDiv.textContent = 'Obrigado por subscrever! Entraremos em contato em breve.';
                    feedbackDiv.style.color = 'green';
                    emailInput.value = '';
                } else {
                    feedbackDiv.textContent = 'Sistema temporariamente indisponível. Tente novamente mais tarde.';
                    feedbackDiv.style.color = 'red';
                }
                return;
            }

            // Usar Firebase
            feedbackDiv.textContent = 'A processar...';
            feedbackDiv.style.color = 'gray';
            try {
                await db.collection("newsletterSubscribers").add({
                    email: email,
                    subscribedAt: new Date(),
                    source: 'website'
                });
                feedbackDiv.textContent = 'Obrigado por subscrever!';
                feedbackDiv.style.color = 'green';
                emailInput.value = '';
                
                // Opcional: enviar evento para Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'engagement',
                        'event_label': 'newsletter'
                    });
                }
            } catch (error) {
                console.error("Erro ao adicionar subscrição: ", error);
                // Tentar fallback em caso de erro
                const success = fallbackSubmitForm('newsletter-form', { email });
                if (success) {
                    feedbackDiv.textContent = 'Obrigado por subscrever! Entraremos em contato em breve.';
                    feedbackDiv.style.color = 'green';
                    emailInput.value = '';
                } else {
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

            if (!suggestion) {
                feedbackDiv.textContent = 'Por favor, descreva sua sugestão.';
                feedbackDiv.style.color = 'red';
                return;
            }

            if (!firebaseInitialized) {
                // Usar fallback
                submitBtn.disabled = true;
                const success = fallbackSubmitForm('suggestion-form', { suggestion });
                if (success) {
                    feedbackDiv.textContent = 'Sugestão enviada com sucesso. Obrigado!';
                    feedbackDiv.style.color = 'green';
                    suggestionText.value = '';
                } else {
                    feedbackDiv.textContent = 'Sistema temporariamente indisponível. Tente novamente mais tarde.';
                    feedbackDiv.style.color = 'red';
                }
                submitBtn.disabled = false;
                return;
            }

            // Usar Firebase
            submitBtn.disabled = true;
            feedbackDiv.textContent = 'A enviar sugestão...';
            feedbackDiv.style.color = 'gray';

            try {
                await db.collection("toolSuggestions").add({
                    suggestion: suggestion,
                    submittedAt: new Date(),
                    page: window.location.pathname
                });
                feedbackDiv.textContent = 'Sugestão enviada com sucesso. Obrigado!';
                feedbackDiv.style.color = 'green';
                suggestionText.value = '';
                
                // Opcional: enviar evento para Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'tool_suggestion', {
                        'event_category': 'engagement',
                        'event_label': 'suggestion'
                    });
                }
            } catch (error) {
                console.error("Erro ao enviar sugestão: ", error);
                // Tentar fallback em caso de erro
                const success = fallbackSubmitForm('suggestion-form', { suggestion });
                if (success) {
                    feedbackDiv.textContent = 'Sugestão enviada com sucesso. Obrigado!';
                    feedbackDiv.style.color = 'green';
                    suggestionText.value = '';
                } else {
                    feedbackDiv.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
                    feedbackDiv.style.color = 'red';
                }
            } finally {
                submitBtn.disabled = false;
            }
        });
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
            document.querySelectorAll('[aria-expanded='true']').forEach(openBtn => {
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
        constructor() {
            this.body = document.body;
            this.html = document.documentElement;
            this.menu = document.getElementById('accessibility-menu');
            this.openBtn = document.getElementById('accessibility-btn');
            this.closeBtn = document.getElementById('close-accessibility-menu');
            this.closeBtnFooter = document.getElementById('close-accessibility-menu-footer');
            this.resetBtn = document.getElementById('reset-accessibility');
            
            this.state = {};
            this.readingMask = null;
            this.readingGuide = null;
            
            // Carrega o estado salvo do localStorage
            this.loadState();
            this.init();
        }

        init() {
            if(!this.openBtn || !this.menu) return;

            const closeMenu = () => this.menu.classList.remove('open');

            this.openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.menu.classList.toggle('open');
            });
            this.closeBtn.addEventListener('click', closeMenu);
            this.closeBtnFooter.addEventListener('click', closeMenu);
            
            document.addEventListener('click', (e) => {
                if (this.menu.classList.contains('open') && !e.target.closest('#accessibility-menu') && !e.target.closest('#accessibility-btn')) {
                    this.menu.classList.remove('open');
                }
            });

            this.resetBtn.addEventListener('click', () => {
                this.resetAll();
                this.saveState();
            });
            
            this.menu.addEventListener('click', (e) => {
                const target = e.target.closest('.acc-option');
                if (!target) return;
                const { action, value } = target.dataset;
                this.handleAction(action, value);
            });
        }

        handleAction(action, value) {
            const group = action.replace(/-(\w)/g, (m, p1) => p1.toUpperCase());
            const isToggle = !value;

            if (isToggle) { this.state[group] = !this.state[group]; } 
            else { this.state[group] = this.state[group] === value ? null : value; }

            const funcName = 'apply' + group.charAt(0).toUpperCase() + group.slice(1);
            if (typeof this[funcName] === 'function') { this[funcName](this.state[group]); }

            this.updateActiveState();
            this.saveState(); // Salva o estado após a mudança
        }

        applyFontSize(value) { this.body.style.fontSize = value ? `${value}em` : ''; }
        applyFontType(value) { this.body.classList.toggle('font-serif', value === 'serif'); this.body.classList.toggle('font-bold-force', value === 'bold'); }
        applyLineSpacing(value) { this.body.style.lineHeight = value || ''; }
        applyLetterSpacing(value) { this.body.style.letterSpacing = value ? `${value}em` : ''; }
        applyContrast(value) { 
            this.html.className = this.html.className.replace(/contrast-\w+/g, ''); 
            if(value) {
                 this.html.classList.add(`contrast-${value}`);
            }
            const carbonBadge = document.getElementById('wcb');
            if(carbonBadge) {
                // Adicionado a lógica para o modo dark do badge de carbono
                if(value === 'dark') {
                    carbonBadge.classList.add('wcb-d');
                } else {
                    carbonBadge.classList.remove('wcb-d');
                }
            }
        }
        applySaturation(value) { this.html.className = this.html.className.replace(/saturation-\w+/g, ''); if(value) this.html.classList.add(`saturation-${value}`); }
        applyHighlightLinks(active) { this.body.classList.toggle('links-highlighted', active); }
        
        applySiteReader(active) {
            if (active) { 
                // Aviso sobre conflito com leitores de tela
                console.warn("Leitor de sites ativado. Pode haver conflito com outros leitores de tela instalados.");
                this.body.addEventListener('click', this.readText, false); 
            } else { 
                this.body.removeEventListener('click', this.readText, false); 
                speechSynthesis.cancel(); 
            }
        }
        
        readText(event) {
            if(event.target.closest('a, button, input, select, textarea')) return;
            event.preventDefault();
            event.stopPropagation();
            const text = event.target.textContent || event.target.alt || event.target.ariaLabel;
            if (text) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text.trim());
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
        
        // Salva o estado atual no localStorage
        saveState() {
            try {
                localStorage.setItem('accessibilityState', JSON.stringify(this.state));
            } catch (e) {
                console.error("Falha ao salvar estado de acessibilidade:", e);
            }
        }

        // Carrega o estado do localStorage e o aplica
        loadState() {
            try {
                const stored = localStorage.getItem('accessibilityState');
                if (stored) {
                    this.state = JSON.parse(stored);
                    for (const key in this.state) {
                        const funcName = 'apply' + key.charAt(0).toUpperCase() + key.slice(1);
                        if (typeof this[funcName] === 'function') {
                            this[funcName](this.state[key]);
                        }
                    }
                    this.updateActiveState();
                }
            } catch (e) {
                console.error("Falha ao carregar estado de acessibilidade:", e);
            }
        }
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

// Verificação de funcionamento do Firebase
function checkFirebaseStatus() {
    if (!firebaseInitialized) {
        console.warn('Firebase não inicializado - formulários desativados');
        disableForms();
    }
}

// Verificar após um tempo se o Firebase carregou
setTimeout(checkFirebaseStatus, 5000);

// Adicionar fallback para FormSubmit caso o Firebase falhe
function setupFormSubmitFallback() {
    const newsletterForm = document.getElementById('newsletter-form');
    const suggestionForm = document.getElementById('suggestion-form');
    
    if (newsletterForm && !newsletterForm.getAttribute('data-fallback-setup')) {
        newsletterForm.setAttribute('data-fallback-setup', 'true');
    }
    
    if (suggestionForm && !suggestion
