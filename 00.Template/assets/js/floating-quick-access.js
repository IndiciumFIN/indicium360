/**
 * ============================================================
 * BOTÃO FLUTUANTE DE ACESSO RÁPIDO
 * ============================================================
 * Componente flutuante fixo na lateral direita da tela
 * Fornece acesso rápido às principais seções da calculadora
 * Versão: 1.0.0
 * ============================================================
 */

(function() {
    'use strict';
    
    /**
     * Renderiza o HTML do botão flutuante
     */
    function renderFloatingQuickAccess() {
        return `
            <div id="floating-quick-access" class="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
                <div class="bg-white rounded-lg shadow-lg border-2 border-[#1A3E74] overflow-hidden">
                    <button 
                        id="quick-access-toggle"
                        class="bg-[#1A3E74] text-white px-4 py-3 font-semibold text-sm flex items-center gap-2 hover:bg-[#2a5a9e] transition-colors w-full"
                        onclick="FloatingQuickAccess.toggle()"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Acesso Rápido
                    </button>
                    <div id="quick-access-menu" class="hidden bg-white">
                        <button 
                            onclick="FloatingQuickAccess.navigateTo('oque-e')"
                            class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 border-t border-gray-200"
                        >
                            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Sobre a Calculadora
                        </button>
                        <button 
                            onclick="FloatingQuickAccess.navigateTo('como-utilizar')"
                            class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 border-t border-gray-200"
                        >
                            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            Como Utilizar
                        </button>
                        <button 
                            onclick="FloatingQuickAccess.navigateTo('configuracoes')"
                            class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 border-t border-gray-200"
                        >
                            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Configurações
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza o CSS do botão flutuante
     */
    function renderFloatingQuickAccessCSS() {
        return `
            <style>
                /* Animação do botão flutuante */
                #floating-quick-access {
                    animation: slideInRight 0.5s ease-out;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translate(100%, -50%);
                        opacity: 0;
                    }
                    to {
                        transform: translate(0, -50%);
                        opacity: 1;
                    }
                }
                
                /* Garantir que o menu fique acima de outros elementos */
                #floating-quick-access {
                    max-width: 250px;
                }
                
                /* Efeito de hover no botão principal */
                #quick-access-toggle:hover {
                    transform: scale(1.02);
                }
                
                /* Responsividade - esconder em telas menores */
                @media (max-width: 1024px) {
                    #floating-quick-access {
                        display: none !important;
                    }
                }
            </style>
        `;
    }
    
    /**
     * Alterna a visibilidade do menu
     */
    function toggle() {
        const menu = document.getElementById('quick-access-menu');
        if (!menu) return;
        
        const isHidden = menu.classList.contains('hidden');
        
        if (isHidden) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }
    
    /**
     * Navega para uma aba e fecha o menu
     */
    function navigateTo(tabId) {
        // Chama a função do CalculatorTabs para mudar de aba
        if (typeof CalculatorTabs !== 'undefined' && CalculatorTabs.switchTab) {
            CalculatorTabs.switchTab(tabId);
        }
        
        // Fecha o menu
        close();
    }
    
    /**
     * Fecha o menu
     */
    function close() {
        const menu = document.getElementById('quick-access-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    }
    
    /**
     * Injeta o botão flutuante na página
     */
    function inject() {
        // Verifica se já existe
        if (document.getElementById('floating-quick-access')) {
            console.log('⚠️ Botão flutuante já existe na página');
            return;
        }
        
        // Cria container se não existir
        let container = document.getElementById('floating-quick-access-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'floating-quick-access-container';
            document.body.appendChild(container);
        }
        
        // Injeta HTML
        container.innerHTML = renderFloatingQuickAccess();
        
        // Injeta CSS
        const styleElement = document.createElement('div');
        styleElement.innerHTML = renderFloatingQuickAccessCSS();
        document.head.appendChild(styleElement.firstElementChild);
        
        // Adiciona listener para fechar ao clicar fora
        document.addEventListener('click', function(event) {
            const quickAccess = document.getElementById('floating-quick-access');
            if (quickAccess && !quickAccess.contains(event.target)) {
                close();
            }
        });
        
        console.log('✓ Botão flutuante de acesso rápido injetado');
    }
    
    /**
     * Inicialização
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', inject);
        } else {
            inject();
        }
    }
    
    // Exporta para o escopo global
    window.FloatingQuickAccess = {
        init: init,
        inject: inject,
        toggle: toggle,
        navigateTo: navigateTo,
        close: close,
        render: renderFloatingQuickAccess,
        renderCSS: renderFloatingQuickAccessCSS
    };
    
    // Auto-inicialização (pode ser desabilitada se necessário)
    // init();
    
})();
