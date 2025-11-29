/**
 * ARQUIVO DE CONFIGURAÇÃO CENTRALIZADO
 * ========================================
 * 
 * Este arquivo contém TODAS as configurações globais do site,
 * incluindo credenciais de serviços externos, URLs, e constantes.
 * 
 * IMPORTANTE: Este é o ÚNICO lugar onde as credenciais devem ser definidas.
 * Todos os templates e scripts devem importar deste arquivo.
 * 
 * @version 1.0.0
 * @date 2025-11-22
 * @author MiniMax Agent
 */

// ============================================================================
// CREDENCIAIS DE SERVIÇOS EXTERNOS
// ============================================================================

const CONFIG = {
    
    // Google Analytics 4
    analytics: {
        measurementId: 'G-8FLJ59XXDK',
        gtmSrc: 'https://www.googletagmanager.com/gtag/js',
        anonymizeIp: true,
        cookieFlags: 'SameSite=None;Secure'
    },
    
    // Google AdSense
    adsense: {
        clientId: 'ca-pub-6472730056006847',
        enabled: true,
        autoAds: true
    },
    
    // Firebase (se aplicável)
    firebase: {
        apiKey: 'AIzaSyB3S3cx-u93_8anjExi9Q69VTUJURWw2lc',
        enabled: false // Alterar para true quando implementar Firebase
    },
    
    // ========================================================================
    // INFORMAÇÕES DO SITE
    // ========================================================================
    
    site: {
        name: 'Calculadoras de Enfermagem',
        domain: 'https://www.calculadorasdeenfermagem.com.br',
        language: 'pt-BR',
        logo: {
            url: 'https://www.calculadorasdeenfermagem.com.br/icontopbar1.webp',
            alt: 'Calculadoras de Enfermagem - Logo'
        },
        favicon: {
            url: 'https://www.calculadorasdeenfermagem.com.br/iconpages.webp',
            type: 'image/webp'
        },
        organization: {
            name: 'Calculadoras de Enfermagem',
            type: 'Organization'
        }
    },
    
    // ========================================================================
    // GOOGLE CONSENT MODE V2
    // ========================================================================
    
    consent: {
        default: {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        },
        // Configurações após consentimento do usuário
        granted: {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
        }
    },
    
    // ========================================================================
    // CAMINHOS DE ARQUIVOS (ASSETS)
    // ========================================================================
    
    assets: {
        css: {
            base: 'assets/css/',
            fonts: 'assets/fonts/',
            images: 'assets/images/'
        },
        js: {
            base: 'assets/js/',
            components: 'assets/js/components.js',
            config: 'assets/js/config.js'
        }
    },
    
    // ========================================================================
    // CONFIGURAÇÕES DE SEO
    // ========================================================================
    
    seo: {
        defaultLanguage: 'pt-BR',
        alternateLanguage: 'x-default',
        author: 'Calculadoras de Enfermagem',
        publisher: 'Calculadoras de Enfermagem'
    },
    
    // ========================================================================
    // CONFIGURAÇÕES DE FEATURES
    // ========================================================================
    
    features: {
        cookieConsent: true,
        lazyLoading: true,
        mobilemenu: true,
        headerIcons: true,
        floatingButtons: true,
        rotatingCards: true,
        relatedContent: true
    },
    
    // ========================================================================
    // BREAKPOINTS RESPONSIVOS
    // ========================================================================
    
    breakpoints: {
        mobile: 600,
        tablet: 768,
        desktop: 900,
        largeDesktop: 1400
    },
    
    // ========================================================================
    // CONFIGURAÇÕES DE API (FUTURO)
    // ========================================================================
    
    api: {
        enabled: false,
        baseUrl: '',
        endpoints: {}
    }
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS DE CONFIGURAÇÃO
// ============================================================================

/**
 * Inicializa o Google Analytics com as configurações definidas
 */
CONFIG.initGoogleAnalytics = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    
    // Configura Consent Mode v2
    gtag('consent', 'default', this.consent.default);
    
    // Inicializa Analytics
    gtag('js', new Date());
    gtag('config', this.analytics.measurementId, {
        'anonymize_ip': this.analytics.anonymizeIp,
        'cookie_flags': this.analytics.cookieFlags
    });
    
    // Injeta script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `${this.analytics.gtmSrc}?id=${this.analytics.measurementId}`;
    document.head.appendChild(script);
    
    console.log('✅ Google Analytics inicializado:', this.analytics.measurementId);
};

/**
 * Inicializa o Google AdSense se habilitado
 */
CONFIG.initGoogleAdsense = function() {
    if (!this.adsense.enabled) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adsense.clientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    console.log('✅ Google AdSense inicializado:', this.adsense.clientId);
};

/**
 * Atualiza o consentimento após aprovação do usuário
 */
CONFIG.updateConsent = function(granted = true) {
    if (typeof gtag === 'undefined') {
        console.warn('⚠️ Google Analytics não está inicializado');
        return;
    }
    
    const consentSettings = granted ? this.consent.granted : this.consent.default;
    gtag('consent', 'update', consentSettings);
    
    console.log('✅ Consentimento atualizado:', granted ? 'CONCEDIDO' : 'NEGADO');
};

/**
 * Retorna a URL completa baseada em um caminho relativo
 */
CONFIG.getFullUrl = function(relativePath) {
    return `${this.site.domain}/${relativePath}`.replace(/\/\//g, '/').replace(':/', '://');
};

/**
 * Verifica se uma feature está habilitada
 */
CONFIG.isFeatureEnabled = function(featureName) {
    return this.features[featureName] === true;
};

/**
 * Retorna o breakpoint atual baseado na largura da tela
 */
CONFIG.getCurrentBreakpoint = function() {
    const width = window.innerWidth;
    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    if (width <= this.breakpoints.desktop) return 'desktop';
    return 'largeDesktop';
};

// ============================================================================
// EXPORTAÇÃO E INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Torna CONFIG disponível globalmente
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    
    // Log de inicialização
    console.log('%c🔧 CONFIG CARREGADO', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log('📍 Site:', CONFIG.site.name);
    console.log('📍 Domain:', CONFIG.site.domain);
    console.log('📍 Analytics:', CONFIG.analytics.measurementId);
    console.log('📍 AdSense:', CONFIG.adsense.clientId);
}

// Exporta para uso em módulos ES6 (futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
