/**
 * COMPONENTE HTML - BANNER E MODAL DE COOKIES
 * ============================================
 * Retorna HTML completo do banner e modal de consentimento
 * Integração: cookie-consent.css e cookie-consent.js
 */

function renderCookieBanner() {
    return `
    <!-- Botão Flutuante (FAB) - Direita -->
    <button id="cookie-fab" class="cookie-fab" 
            title="Gerenciar Preferências de Cookies" 
            aria-label="Abrir configurações de cookies"
            style="display: none;">
        <!-- Ícone de Cookie -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.5 12.5c-1.2 0-2.2-.6-2.8-1.5-.6-.9-.6-2-.1-3 .1-.2.1-.4 0-.6s-.3-.3-.5-.3c-.9.1-1.8-.3-2.4-1-.6-.7-.8-1.7-.4-2.6.1-.2 0-.5-.2-.6-.2-.2-.5-.2-.7-.1-3.2 1.3-5.6 4.2-6.1 7.7-.5 3.5 1.1 7 4.1 9.1 2 1.4 4.3 2.1 6.6 2.1.4 0 .8 0 1.2-.1.3 0 .5-.3.5-.6 0-1.2-.5-2.4-1.5-2.8-1.1-.4-2.3-.2-3.2.6-.2.2-.5.1-.6-.1-.2-.2-.2-.5 0-.7.8-1 1.2-2.3 1.2-3.6 0-.4.3-.8.7-.8h.1c1.1.2 2.3-.3 3.1-1.1.2-.2.2-.5 0-.7-.1-.3-.3-.6-.5-1zM11 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
        </svg>
    </button>

    <!-- Banner de Aviso (Rodapé) -->
    <div id="cookie-banner" class="cookie-banner" role="dialog" aria-labelledby="banner-title" aria-modal="false">
        <div class="banner-content">
            <!-- Ícone -->
            <svg class="banner-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.5 12.5c-1.2 0-2.2-.6-2.8-1.5-.6-.9-.6-2-.1-3 .1-.2.1-.4 0-.6s-.3-.3-.5-.3c-.9.1-1.8-.3-2.4-1-.6-.7-.8-1.7-.4-2.6.1-.2 0-.5-.2-.6-.2-.2-.5-.2-.7-.1-3.2 1.3-5.6 4.2-6.1 7.7-.5 3.5 1.1 7 4.1 9.1 2 1.4 4.3 2.1 6.6 2.1.4 0 .8 0 1.2-.1.3 0 .5-.3.5-.6 0-1.2-.5-2.4-1.5-2.8-1.1-.4-2.3-.2-3.2.6-.2.2-.5.1-.6-.1-.2-.2-.2-.5 0-.7.8-1 1.2-2.3 1.2-3.6 0-.4.3-.8.7-.8h.1c1.1.2 2.3-.3 3.1-1.1.2-.2.2-.5 0-.7-.1-.3-.3-.6-.5-1zM11 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
            </svg>
            
            <div>
                <div class="banner-text">
                    <strong id="banner-title">Seu conhecimento importa e sua privacidade também.</strong><br>
                    Utilizamos cookies para aprimorar sua experiência e analisar nosso tráfego. 
                    Trabalhamos com parceiros selecionados (Google) para apresentar conteúdo e publicidade 
                    baseados no seu perfil de utilização.
                </div>
                
                <!-- Links de Política -->
                <div class="banner-links">
                    <a href="https://www.calculadorasdeenfermagem.com.br/politica.html" 
                       target="_blank" 
                       rel="noopener">Política de Privacidade</a>
                    <a href="https://www.calculadorasdeenfermagem.com.br/termos.html" 
                       target="_blank" 
                       rel="noopener">Termos e Condições</a>
                    <a href="https://www.calculadorasdeenfermagem.com.br/notificacoes-legais.html" 
                       target="_blank" 
                       rel="noopener">Notificações Legais</a>
                </div>
            </div>
        </div>
        
        <!-- Botões de Ação -->
        <div class="banner-actions">
            <button class="btn-cookie btn-outline" id="banner-options">
                <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;" aria-hidden="true">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
                Personalizar
            </button>
            <button class="btn-cookie btn-primary" id="banner-accept">
                <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Aceitar Todos
            </button>
        </div>
    </div>

    <!-- Modal de Configuração -->
    <div id="cookie-overlay" class="cookie-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="cookie-modal">
            
            <!-- Header -->
            <header class="modal-header">
                <h2 id="modal-title" class="modal-title">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21.5 12.5c-1.2 0-2.2-.6-2.8-1.5-.6-.9-.6-2-.1-3 .1-.2.1-.4 0-.6s-.3-.3-.5-.3c-.9.1-1.8-.3-2.4-1-.6-.7-.8-1.7-.4-2.6.1-.2 0-.5-.2-.6-.2-.2-.5-.2-.7-.1-3.2 1.3-5.6 4.2-6.1 7.7-.5 3.5 1.1 7 4.1 9.1 2 1.4 4.3 2.1 6.6 2.1.4 0 .8 0 1.2-.1.3 0 .5-.3.5-.6 0-1.2-.5-2.4-1.5-2.8-1.1-.4-2.3-.2-3.2.6-.2.2-.5.1-.6-.1-.2-.2-.2-.5 0-.7.8-1 1.2-2.3 1.2-3.6 0-.4.3-.8.7-.8h.1c1.1.2 2.3-.3 3.1-1.1.2-.2.2-.5 0-.7-.1-.3-.3-.6-.5-1zM11 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
                    </svg>
                    Preferências de Cookies
                </h2>
                <button id="modal-close-x" class="btn-close-modal" aria-label="Fechar modal">×</button>
            </header>

            <!-- Body -->
            <div class="modal-body">
                
                <!-- ITEM 1: Cookies Necessários -->
                <div class="cookie-item">
                    <div class="item-top">
                        <div class="item-info">
                            <svg class="item-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>
                            <span class="item-label">Cookies Necessários</span>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked disabled aria-label="Cookies necessários sempre habilitados">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <button class="btn-show-more" data-open="false" onclick="toggleCookieDesc(this, 'desc-necessary')">
                        Ver detalhes <span class="btn-show-more-arrow">›</span>
                    </button>
                    
                    <div id="desc-necessary" class="item-desc">
                        <p>Cookies essenciais para o funcionamento básico do site, como navegação, 
                        autenticação e preferências de acessibilidade. Sem estes cookies, o site não funciona corretamente.</p>
                        
                        <!-- Sub-item: Google Tag Manager -->
                        <div class="sub-item-wrapper">
                            <div class="item-top" style="margin-bottom: 0;">
                                <div class="item-info">
                                    <span class="item-label" style="font-size: 14px;">Google Tag Manager</span>
                                </div>
                                <button class="btn-info-toggle" onclick="toggleCookieDesc(this, 'desc-gtm-info')" 
                                        title="Mais informações">
                                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:var(--cookie-primary);" aria-hidden="true">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                    Informação
                                </button>
                            </div>
                            <div id="desc-gtm-info" class="item-desc sub-item-info-modal">
                                <p><strong>Empresa:</strong> Google Ireland Limited</p>
                                <p><strong>Finalidade:</strong> Gestão de tags e fragmentos de código</p>
                                <p><strong>Tecnologia:</strong> Pixel, JavaScript</p>
                                <p><strong>Base jurídica:</strong> Interesses legítimos (Art. 7, IX LGPD)</p>
                                <p><strong>Retenção:</strong> 14 dias</p>
                                <p><a href="https://business.safety.google/privacy/" target="_blank" rel="noopener">Política de Privacidade</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ITEM 2: Análise e Estatísticas -->
                <div class="cookie-item">
                    <div class="item-top">
                        <div class="item-info">
                            <svg class="item-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                            <span class="item-label">Análise e Estatísticas</span>
                        </div>
                        <label class="switch">
                            <input type="checkbox" class="pref-check" id="check-analytics" 
                                   aria-label="Habilitar cookies de análise">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <button class="btn-show-more" data-open="false" onclick="toggleCookieDesc(this, 'desc-analytics')">
                        Ver detalhes <span class="btn-show-more-arrow">›</span>
                    </button>
                    
                    <div id="desc-analytics" class="item-desc">
                        <p>Utilizamos cookies de análise para entender como você usa nosso site e 
                        melhorar sua experiência. Coletamos dados anônimos sobre páginas visitadas, 
                        tempo de permanência e comportamento de navegação.</p>
                        
                        <!-- Sub-item: Google Analytics -->
                        <div class="sub-item-wrapper">
                            <div class="item-top" style="margin-bottom: 0;">
                                <div class="item-info">
                                    <span class="item-label" style="font-size: 14px;">Google Analytics</span>
                                </div>
                                <button class="btn-info-toggle" onclick="toggleCookieDesc(this, 'desc-ga-info')" 
                                        title="Mais informações">
                                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:var(--cookie-primary);" aria-hidden="true">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                    Informação
                                </button>
                            </div>
                            <div id="desc-ga-info" class="item-desc sub-item-info-modal">
                                <p><strong>Empresa:</strong> Google Ireland Limited</p>
                                <p><strong>Finalidade:</strong> Análise de tráfego e comportamento do usuário</p>
                                <p><strong>Dados coletados:</strong></p>
                                <ul>
                                    <li>Páginas visitadas</li>
                                    <li>Duração da sessão</li>
                                    <li>Origem do tráfego</li>
                                    <li>Dispositivo e navegador</li>
                                    <li>Localização geográfica (cidade/país)</li>
                                </ul>
                                <p><strong>Cookies:</strong> _ga, _gid, _gat</p>
                                <p><strong>Base jurídica:</strong> Consentimento (Art. 7, I LGPD)</p>
                                <p><strong>Retenção:</strong> Até 26 meses</p>
                                <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de Privacidade</a></p>
                                <p><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Desativar Google Analytics</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ITEM 3: Marketing e Publicidade -->
                <div class="cookie-item">
                    <div class="item-top">
                        <div class="item-info">
                            <svg class="item-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                            </svg>
                            <span class="item-label">Marketing e Publicidade</span>
                        </div>
                        <label class="switch">
                            <input type="checkbox" class="pref-check" id="check-marketing" 
                                   aria-label="Habilitar cookies de marketing">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <button class="btn-show-more" data-open="false" onclick="toggleCookieDesc(this, 'desc-marketing')">
                        Ver detalhes <span class="btn-show-more-arrow">›</span>
                    </button>
                    
                    <div id="desc-marketing" class="item-desc">
                        <p>Utilizamos cookies de marketing para apresentar anúncios relevantes e medir a 
                        eficácia de nossas campanhas. Parceiros como Google podem usar essas informações 
                        para personalizar anúncios em outros sites.</p>
                        
                        <!-- Sub-item: Google Ads -->
                        <div class="sub-item-wrapper">
                            <div class="item-top" style="margin-bottom: 0;">
                                <div class="item-info">
                                    <span class="item-label" style="font-size: 14px;">Google Ads</span>
                                </div>
                                <button class="btn-info-toggle" onclick="toggleCookieDesc(this, 'desc-ads-info')" 
                                        title="Mais informações">
                                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:var(--cookie-primary);" aria-hidden="true">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                    Informação
                                </button>
                            </div>
                            <div id="desc-ads-info" class="item-desc sub-item-info-modal">
                                <p><strong>Empresa:</strong> Google Ireland Limited</p>
                                <p><strong>Finalidade:</strong> Publicidade direcionada e remarketing</p>
                                <p><strong>Dados coletados:</strong></p>
                                <ul>
                                    <li>Anúncios visualizados</li>
                                    <li>Cliques em anúncios</li>
                                    <li>Conversões</li>
                                    <li>Interesses e comportamento</li>
                                </ul>
                                <p><strong>Cookies:</strong> _gcl_au, test_cookie, IDE, DSID</p>
                                <p><strong>Base jurídica:</strong> Consentimento (Art. 7, I LGPD)</p>
                                <p><strong>Retenção:</strong> Até 24 meses</p>
                                <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de Privacidade</a></p>
                                <p><a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de Anúncios</a></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <footer class="modal-footer">
                <button class="btn-cookie btn-secondary" id="modal-reject-all">
                    <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;" aria-hidden="true">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Rejeitar Tudo
                </button>
                <button class="btn-cookie btn-primary" id="modal-save">
                    <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;" aria-hidden="true">
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Salvar Preferências
                </button>
            </footer>
        </div>
    </div>
    `;
}

// Exporta a função globalmente
if (typeof window !== 'undefined') {
    window.renderCookieBanner = renderCookieBanner;
}
