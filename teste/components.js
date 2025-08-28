/**
 * @fileoverview Este ficheiro armazena o HTML dos componentes reutilizáveis
 * como strings para evitar problemas de fetch() e CORS em diferentes ambientes.
 */

const headerHTML = `
<header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
            <img src="https://www.calculadorasdeenfermagem.com.br/icontopbar1.webp" alt="Logotipo Portal de Enfermagem" class="h-16 w-auto">
        </div>
        <nav class="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegação Principal">
            <a href="https://www.calculadorasdeenfermagem.com.br/index.html" class="nav-link font-semibold text-gray-700">Início</a>
            <div class="relative" id="sobre-nos-dropdown">
                <button id="sobre-nos-btn" class="nav-link font-semibold text-gray-700 flex items-center" aria-haspopup="true" aria-expanded="false" aria-controls="sobre-nos-menu">
                    Sobre Nós
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="sobre-nos-menu" class="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 hidden" role="menu">
                    <!-- Conteúdo do dropdown Sobre Nós -->
                </div>
            </div>
            <div class="relative" id="calculadoras-dropdown">
                 <button id="calculadoras-btn" class="nav-link font-semibold text-gray-700 flex items-center" aria-haspopup="true" aria-expanded="false" aria-controls="calculadoras-menu">
                    Calculadoras
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="calculadoras-menu" class="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 hidden" role="menu">
                    <!-- Conteúdo do dropdown Calculadoras -->
                </div>
            </div>
            <!-- Outros itens do menu... -->
        </nav>
        <div class="md:hidden flex items-center gap-4">
            <button id="hamburger-btn" class="text-gray-800 focus:outline-none text-2xl" aria-label="Abrir menu de navegação" aria-controls="mobile-menu" aria-expanded="false">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
    <div id="mobile-menu" class="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto" style="display: none;" role="menu">
        <!-- Conteúdo completo do menu móvel aqui -->
    </div>
</header>
`;

const footerHTML = `
<footer>
    <!-- Secção de Propaganda -->
    <section id="ad-section" class="py-8">
        <div class="container mx-auto px-8 flex justify-center">
            <div id="container-62a5c8277a385b7247c1969a06823c61" class="w-full max-w-md mx-auto my-4"></div>
            <script async="async" data-cfasync="false" src="//pl27406653.profitableratecpm.com/62a5c8277a385b7247c1961/invoke.js"></script>
        </div>
    </section>

    <!-- Secção da Newsletter -->
    <section class="bg-white py-12">
        <div class="container mx-auto px-8 text-center">
            <h3 class="main-title text-3xl mb-2">Subscreva a nossa Newsletter</h3>
            <form id="newsletter-form" class="max-w-md mx-auto flex">
                <input id="newsletter-email" type="email" placeholder="O seu melhor email" class="w-full px-4 py-3 rounded-l-lg" required>
                <button type="submit" class="btn-primary font-bold py-3 px-6 rounded-r-lg">Subscrever</button>
            </form>
            <div id="newsletter-feedback" class="mt-4 text-sm"></div>
        </div>
    </section>

    <!-- Conteúdo principal do Rodapé -->
    <div class="bg-gray-800 text-gray-300 pt-12 pb-8">
        <!-- ... (todo o conteúdo do rodapé) ... -->
    </div>

    <!-- WIDGETS, MODAIS E BANNER DE COOKIES -->
    <div class="side-widgets-container">
        <div class="accessibility-widget">
            <button id="libras-btn" title="Traduzir para LIBRAS"><i class="fas fa-sign-language fa-lg"></i></button>
            <button id="accessibility-btn" title="Abrir menu de recursos assistivos"><i class="fas fa-eye fa-lg"></i></button>
        </div>
    </div>
    <div id="cookie-banner" class="bg-gray-900 text-white p-4">
        <!-- ... (conteúdo do banner de cookies) ... -->
    </div>
    <div id="suggestion-modal" class="modal hidden">
        <!-- ... (conteúdo do modal de sugestão) ... -->
    </div>
    <div id="cookie-prefs-modal" class="modal hidden">
        <!-- ... (conteúdo do modal de preferências de cookies) ... -->
    </div>
    <div id="accessibility-menu" class="flex flex-col">
        <!-- ... (conteúdo do menu de acessibilidade) ... -->
    </div>

    <!-- Integração do VLibras (ESSENCIAL) -->
    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    </div>
</footer>
`;

/**
 * Injeta o HTML do cabeçalho no placeholder correspondente.
 */
function loadHeader() {
    const placeholder = document.getElementById('global-header-placeholder');
    if (placeholder) {
        placeholder.outerHTML = headerHTML;
    } else {
        console.error('Placeholder do cabeçalho não encontrado.');
    }
}

/**
 * Injeta o HTML do rodapé no placeholder correspondente.
 */
function loadFooter() {
    const placeholder = document.getElementById('global-footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = footerHTML;
    } else {
        console.error('Placeholder do rodapé não encontrado.');
    }
}
