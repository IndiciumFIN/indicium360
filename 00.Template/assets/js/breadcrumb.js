/**
 * BREADCRUMB - Sistema de Navegação Estruturada
 * Breadcrumb dinâmico e acessível para calculadoras
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const Breadcrumb = {
    /**
     * Configuração de rotas e títulos
     */
    rotas: {
        '/': 'Início',
        '/calculadoras': 'Calculadoras',
        '/escalas': 'Escalas Clínicas',
        '/calendario-vacinal': 'Calendário Vacinal',
        '/ferramentas': 'Ferramentas',
        '/sobre': 'Sobre Nós'
    },
    
    /**
     * Gera breadcrumb baseado na URL atual
     * @param {Object} config - Configuração customizada (opcional)
     * @returns {String} HTML do breadcrumb
     */
    gerar(config = {}) {
        const path = window.location.pathname;
        const partes = path.split('/').filter(p => p);
        
        // Se config tem breadcrumb customizado, usa ele
        if (config.breadcrumb && Array.isArray(config.breadcrumb)) {
            return this.renderBreadcrumb(config.breadcrumb);
        }
        
        // Gera breadcrumb automático baseado na URL
        const items = this.gerarItemsAutomatico(partes);
        return this.renderBreadcrumb(items);
    },
    
    /**
     * Gera items do breadcrumb automaticamente
     * @param {Array} partes - Partes da URL
     * @returns {Array} Items do breadcrumb
     */
    gerarItemsAutomatico(partes) {
        const items = [
            { texto: 'Início', url: 'https://www.calculadorasdeenfermagem.com.br/' }
        ];
        
        let urlAcumulada = 'https://www.calculadorasdeenfermagem.com.br';
        
        partes.forEach((parte, index) => {
            urlAcumulada += `/${parte}`;
            
            // Última parte não tem link
            const isUltimo = index === partes.length - 1;
            
            // Formata texto (capitaliza, remove hífens)
            let texto = parte
                .split('-')
                .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
                .join(' ');
            
            // Mapeia alguns textos conhecidos
            const mapeamento = {
                'Calculadoras': 'Calculadoras',
                'Escalas': 'Escalas Clínicas',
                'Calendario Vacinal': 'Calendário Vacinal',
                'Balanco Hidrico': 'Balanço Hídrico',
                'Clearance Creatinina': 'Clearance de Creatinina',
                'Dimensionamento': 'Dimensionamento de Enfermagem',
                'Superficie Corporal': 'Superfície Corporal',
                'Tfg': 'Taxa de Filtração Glomerular',
                'Timi': 'Escore TIMI',
                'Wells Tep': 'Escore de Wells (TEP)',
                'Wells Tvp': 'Escore de Wells (TVP)'
            };
            
            texto = mapeamento[texto] || texto;
            
            items.push({
                texto: texto,
                url: isUltimo ? null : urlAcumulada
            });
        });
        
        return items;
    },
    
    /**
     * Renderiza HTML do breadcrumb
     * @param {Array} items - Items do breadcrumb [{texto, url}]
     * @returns {String} HTML do breadcrumb
     */
    renderBreadcrumb(items) {
        if (!items || items.length === 0) return '';
        
        const itemsHTML = items.map((item, index) => {
            const isUltimo = index === items.length - 1;
            const separador = index > 0 ? `
                <svg class="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            ` : '';
            
            if (isUltimo || !item.url) {
                return `
                    ${separador}
                    <span class="text-gray-700 font-medium" aria-current="page">${item.texto}</span>
                `;
            }
            
            return `
                ${separador}
                <a href="${item.url}" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    ${item.texto}
                </a>
            `;
        }).join('');
        
        return `
            <nav aria-label="Breadcrumb" class="bg-white rounded-lg shadow-sm px-4 py-3 mb-6">
                <ol class="flex items-center flex-wrap text-sm">
                    ${itemsHTML}
                </ol>
            </nav>
        `;
    },
    
    /**
     * Insere breadcrumb no DOM
     * @param {String} containerId - ID do container
     * @param {Object} config - Configuração customizada
     */
    inserir(containerId, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        const breadcrumbHTML = this.gerar(config);
        container.innerHTML = breadcrumbHTML;
        
        console.log('✓ Breadcrumb inserido');
    },
    
    /**
     * Renderiza breadcrumb com Schema.org (SEO)
     * @param {Array} items - Items do breadcrumb
     * @returns {String} Script JSON-LD para SEO
     */
    renderSchemaOrg(items) {
        if (!items || items.length === 0) return '';
        
        const itemListElement = items
            .filter(item => item.url)
            .map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.texto,
                "item": item.url
            }));
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };
        
        return `
            <script type="application/ld+json">
            ${JSON.stringify(schema, null, 2)}
            </script>
        `;
    },
    
    /**
     * Insere breadcrumb com Schema.org
     * @param {String} containerId - ID do container HTML
     * @param {Object} config - Configuração customizada
     */
    inserirComSchema(containerId, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        const items = config.breadcrumb || this.gerarItemsAutomatico(
            window.location.pathname.split('/').filter(p => p)
        );
        
        const breadcrumbHTML = this.renderBreadcrumb(items);
        const schemaHTML = this.renderSchemaOrg(items);
        
        container.innerHTML = breadcrumbHTML + schemaHTML;
        
        console.log('✓ Breadcrumb com Schema.org inserido');
    }
};

/**
 * Inicialização automática
 * Procura por container #breadcrumb-container e insere automaticamente
 */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('breadcrumb-container');
    if (container) {
        Breadcrumb.inserirComSchema('breadcrumb-container');
    }
});

// Exporta para uso global
window.Breadcrumb = Breadcrumb;

console.log('✓ Módulo Breadcrumb carregado');
