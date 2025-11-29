/**
 * SISTEMA DE CONSENTIMENTO DE COOKIES - LÓGICA MODULAR
 * ======================================================
 * Arquivo: cookie-consent.js
 * Integração: Google Consent Mode v2, Google Analytics, Google Ads
 * Armazenamento: localStorage
 * Funcionalidades:
 * - Gerenciamento de preferências de cookies
 * - Integração real com Google Consent Mode
 * - Controle de cookies de terceiros
 * - Notificação aos serviços de rastreamento
 */

const CookieConsent = (function() {
    'use strict';

    // ===================================
    // CONFIGURAÇÕES
    // ===================================
    const CONFIG = {
        storageKey: 'calculadoras_cookie_consent',
        bannerDelay: 1000, // Atraso para exibir o banner (ms)
        cookieDomain: '.calculadorasdeenfermagem.com.br',
        cookiePath: '/',
        consentDuration: 365 // Dias para expirar o consentimento
    };

    // ===================================
    // ESTADO INTERNO
    // ===================================
    let state = {
        banner: null,
        overlay: null,
        fab: null,
        preferences: {
            necessary: true,      // Sempre true (obrigatório)
            analytics: false,     // Google Analytics
            marketing: false      // Google Ads / Marketing
        }
    };

    // ===================================
    // INICIALIZAÇÃO
    // ===================================
    function init() {
        console.log('🍪 Inicializando Sistema de Consentimento de Cookies...');
        
        // Carrega elementos DOM
        loadElements();
        
        // Carrega preferências salvas
        loadPreferences();
        
        // Configura Google Consent Mode inicial
        initializeGoogleConsentMode();
        
        // Aplica preferências aos serviços de terceiros
        applyPreferences();
        
        // Configura eventos
        setupEvents();
        
        // Exibe banner se necessário
        showBannerIfNeeded();
        
        console.log('✅ Sistema de Consentimento de Cookies inicializado');
    }

    // ===================================
    // CARREGAR ELEMENTOS DOM
    // ===================================
    function loadElements() {
        state.banner = document.getElementById('cookie-banner');
        state.overlay = document.getElementById('cookie-overlay');
        state.fab = document.getElementById('cookie-fab');
        
        if (!state.banner || !state.overlay || !state.fab) {
            console.error('❌ Erro: Elementos de cookies não encontrados no DOM');
        }
    }

    // ===================================
    // GERENCIAMENTO DE PREFERÊNCIAS
    // ===================================
    function loadPreferences() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                state.preferences = { ...state.preferences, ...parsed };
                console.log('📦 Preferências carregadas:', state.preferences);
                return true;
            }
        } catch (e) {
            console.error('❌ Erro ao carregar preferências:', e);
        }
        return false;
    }

    function savePreferences() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.preferences));
            console.log('💾 Preferências salvas:', state.preferences);
            return true;
        } catch (e) {
            console.error('❌ Erro ao salvar preferências:', e);
            return false;
        }
    }

    // ===================================
    // GOOGLE CONSENT MODE V2
    // ===================================
    function initializeGoogleConsentMode() {
        // Inicializa o dataLayer se não existir
        window.dataLayer = window.dataLayer || [];
        
        function gtag() {
            window.dataLayer.push(arguments);
        }
        
        // Define consentimento padrão (denied)
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });
        
        console.log('🔒 Google Consent Mode inicializado (default: denied)');
    }

    function updateGoogleConsent() {
        if (typeof window.gtag !== 'function') {
            console.warn('⚠️ gtag não está disponível');
            return;
        }
        
        const consentUpdate = {
            'ad_storage': state.preferences.marketing ? 'granted' : 'denied',
            'ad_user_data': state.preferences.marketing ? 'granted' : 'denied',
            'ad_personalization': state.preferences.marketing ? 'granted' : 'denied',
            'analytics_storage': state.preferences.analytics ? 'granted' : 'denied'
        };
        
        window.gtag('consent', 'update', consentUpdate);
        console.log('🔄 Google Consent Mode atualizado:', consentUpdate);
    }

    // ===================================
    // GERENCIAMENTO DE COOKIES DE TERCEIROS
    // ===================================
    function applyPreferences() {
        // Atualiza Google Consent Mode
        updateGoogleConsent();
        
        // Remove cookies de terceiros se negados
        if (!state.preferences.analytics) {
            removeGoogleAnalyticsCookies();
        }
        
        if (!state.preferences.marketing) {
            removeGoogleAdsCookies();
        }
        
        // Atualiza UI dos switches no modal
        updateModalSwitches();
        
        console.log('✅ Preferências aplicadas aos serviços de terceiros');
    }

    function removeGoogleAnalyticsCookies() {
        const gaCookies = ['_ga', '_gat', '_gid', '_ga_*', '_gat_gtag_*'];
        
        gaCookies.forEach(cookieName => {
            if (cookieName.includes('*')) {
                // Remove cookies com padrão
                const pattern = cookieName.replace('*', '');
                document.cookie.split(';').forEach(cookie => {
                    const name = cookie.split('=')[0].trim();
                    if (name.startsWith(pattern)) {
                        deleteCookie(name);
                    }
                });
            } else {
                deleteCookie(cookieName);
            }
        });
        
        console.log('🗑️ Cookies do Google Analytics removidos');
    }

    function removeGoogleAdsCookies() {
        const adsCookies = ['_gcl_au', 'test_cookie', 'IDE', 'DSID', 'FLC', 'AID', 'TAID'];
        
        adsCookies.forEach(cookieName => {
            deleteCookie(cookieName);
        });
        
        console.log('🗑️ Cookies do Google Ads removidos');
    }

    function deleteCookie(name) {
        // Remove do domínio principal
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${CONFIG.cookiePath};`;
        
        // Remove do domínio com prefixo
        if (CONFIG.cookieDomain) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${CONFIG.cookiePath}; domain=${CONFIG.cookieDomain};`;
        }
    }

    // ===================================
    // ATUALIZAÇÃO DA UI DO MODAL
    // ===================================
    function updateModalSwitches() {
        const checkAnalytics = document.getElementById('check-analytics');
        const checkMarketing = document.getElementById('check-marketing');
        
        if (checkAnalytics) {
            checkAnalytics.checked = state.preferences.analytics;
        }
        
        if (checkMarketing) {
            checkMarketing.checked = state.preferences.marketing;
        }
    }

    // ===================================
    // CONTROLE DE EXIBIÇÃO
    // ===================================
    function showBannerIfNeeded() {
        const hasConsent = loadPreferences();
        
        if (!hasConsent) {
            // Usuário ainda não consentiu
            setTimeout(() => {
                if (state.banner) {
                    state.banner.classList.add('show');
                    console.log('📢 Banner de cookies exibido');
                }
            }, CONFIG.bannerDelay);
        } else {
            // Usuário já consentiu, mostra FAB
            if (state.fab) {
                state.fab.style.display = 'flex';
                console.log('🔘 FAB de cookies exibido');
            }
        }
    }

    function hideBanner() {
        if (state.banner) {
            state.banner.classList.remove('show');
        }
    }

    function showFab() {
        if (state.fab) {
            state.fab.style.display = 'flex';
        }
    }

    function openModal() {
        hideBanner();
        if (state.overlay) {
            state.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Foca no botão de fechar para acessibilidade
            const closeBtn = document.getElementById('modal-close-x');
            if (closeBtn) {
                closeBtn.focus();
            }
        }
        console.log('📋 Modal de preferências aberto');
    }

    function closeModal() {
        if (state.overlay) {
            state.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        showFab();
        
        // Retorna foco ao FAB
        if (state.fab) {
            state.fab.focus();
        }
        console.log('✖️ Modal de preferências fechado');
    }

    // ===================================
    // AÇÕES DE CONSENTIMENTO
    // ===================================
    function acceptAll() {
        state.preferences.analytics = true;
        state.preferences.marketing = true;
        
        savePreferences();
        applyPreferences();
        
        hideBanner();
        closeModal();
        showFab();
        
        console.log('✅ Todos os cookies aceitos');
        showNotification('Suas preferências foram salvas. Todos os cookies aceitos.');
    }

    function rejectAll() {
        state.preferences.analytics = false;
        state.preferences.marketing = false;
        
        savePreferences();
        applyPreferences();
        
        hideBanner();
        closeModal();
        showFab();
        
        console.log('❌ Todos os cookies opcionais rejeitados');
        showNotification('Apenas cookies necessários serão utilizados.');
    }

    function saveCustomPreferences() {
        // Lê estado dos switches
        const checkAnalytics = document.getElementById('check-analytics');
        const checkMarketing = document.getElementById('check-marketing');
        
        if (checkAnalytics) {
            state.preferences.analytics = checkAnalytics.checked;
        }
        
        if (checkMarketing) {
            state.preferences.marketing = checkMarketing.checked;
        }
        
        savePreferences();
        applyPreferences();
        
        closeModal();
        showFab();
        
        console.log('💾 Preferências personalizadas salvas');
        showNotification('Suas preferências foram salvas com sucesso.');
    }

    // ===================================
    // NOTIFICAÇÕES
    // ===================================
    function showNotification(message) {
        // Cria elemento de notificação temporária
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #2B5C97 0%, #3CACD5 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ===================================
    // TOGGLE DE DESCRIÇÕES
    // ===================================
    window.toggleCookieDesc = function(button, targetId) {
        const element = document.getElementById(targetId);
        if (!element) return;
        
        const isShowing = element.classList.toggle('show');
        
        // Atualiza botão "Ver detalhes"
        if (button.classList.contains('btn-show-more')) {
            button.setAttribute('data-open', isShowing);
            const arrow = button.querySelector('.btn-show-more-arrow');
            button.innerHTML = isShowing 
                ? 'Ocultar detalhes <span class="btn-show-more-arrow">›</span>' 
                : 'Ver detalhes <span class="btn-show-more-arrow">›</span>';
        }
    };

    // ===================================
    // CONFIGURAÇÃO DE EVENTOS
    // ===================================
    function setupEvents() {
        // Banner - Aceitar
        const btnBannerAccept = document.getElementById('banner-accept');
        if (btnBannerAccept) {
            btnBannerAccept.addEventListener('click', acceptAll);
        }
        
        // Banner - Personalizar
        const btnBannerOptions = document.getElementById('banner-options');
        if (btnBannerOptions) {
            btnBannerOptions.addEventListener('click', openModal);
        }
        
        // Modal - Salvar
        const btnModalSave = document.getElementById('modal-save');
        if (btnModalSave) {
            btnModalSave.addEventListener('click', saveCustomPreferences);
        }
        
        // Modal - Rejeitar Tudo
        const btnModalReject = document.getElementById('modal-reject-all');
        if (btnModalReject) {
            btnModalReject.addEventListener('click', rejectAll);
        }
        
        // Modal - Fechar (X)
        const btnModalClose = document.getElementById('modal-close-x');
        if (btnModalClose) {
            btnModalClose.addEventListener('click', closeModal);
        }
        
        // FAB - Abrir Modal
        if (state.fab) {
            state.fab.addEventListener('click', openModal);
        }
        
        // Footer Button - Abrir Modal
        const btnFooterManage = document.getElementById('manage-cookies-footer-btn');
        if (btnFooterManage) {
            btnFooterManage.addEventListener('click', openModal);
            console.log('✓ Botão do footer vinculado ao modal de cookies');
        }
        
        // Overlay - Fechar ao clicar fora
        if (state.overlay) {
            state.overlay.addEventListener('click', (e) => {
                if (e.target === state.overlay) {
                    closeModal();
                }
            });
        }
        
        // ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.overlay && state.overlay.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Switches - Escutar mudanças em tempo real
        const checkAnalytics = document.getElementById('check-analytics');
        const checkMarketing = document.getElementById('check-marketing');
        
        if (checkAnalytics) {
            checkAnalytics.addEventListener('change', (e) => {
                console.log('📊 Analytics:', e.target.checked ? 'Habilitado' : 'Desabilitado');
            });
        }
        
        if (checkMarketing) {
            checkMarketing.addEventListener('change', (e) => {
                console.log('📢 Marketing:', e.target.checked ? 'Habilitado' : 'Desabilitado');
            });
        }
        
        console.log('🔗 Eventos configurados');
    }

    // ===================================
    // API PÚBLICA
    // ===================================
    return {
        init: init,
        openModal: openModal,
        acceptAll: acceptAll,
        rejectAll: rejectAll,
        getPreferences: () => ({ ...state.preferences }),
        updatePreference: (key, value) => {
            if (key in state.preferences) {
                state.preferences[key] = value;
                savePreferences();
                applyPreferences();
            }
        }
    };
})();

// ===================================
// AUTO-INICIALIZAÇÃO
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CookieConsent.init);
} else {
    CookieConsent.init();
}

// Exporta para window para acesso global
window.CookieConsent = CookieConsent;
