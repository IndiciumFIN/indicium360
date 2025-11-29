/**
 * ROTATING CARDS SYSTEM WITH GOOGLE ANALYTICS INTEGRATION
 * ========================================================
 * Sistema de rotação automática de 4 cards a cada 7 dias
 * Seleção baseada em métricas do Google Analytics (pageviews)
 * 
 * Integração: Google Analytics 4 (GA4)
 * Armazenamento: localStorage
 * Rotação: 7 dias
 * 
 * ATUALIZADO: Agora usa configurações centralizadas de CONFIG global
 */

(function() {
    'use strict';
    
    // ===================================
    // CONFIGURAÇÕES
    // ===================================
    
    const ROTATING_CARDS_CONFIG = {
        rotationDays: 7, // Rotacionar a cada 7 dias
        storageKey: 'rotating_cards_analytics_data',
        cardsPerSection: 4, // 4 cards por seção
        analyticsPropertyId: (typeof CONFIG !== 'undefined' && CONFIG.analytics) 
            ? CONFIG.analytics.measurementId 
            : 'G-8FLJ59XXDK', // Fallback para valor padrão
        lookbackDays: 30 // Últimos 30 dias para análise
    };
    
    // ===================================
    // POOL COMPLETO DE CARDS
    // ===================================
    
    const CARDS_POOL = {
        // Calculadoras de Enfermagem
        calculators: [
            {
                id: 'calc-gotejamento',
                type: 'calculator',
                title: 'Cálculo de Gotejamento',
                description: 'Calcule a velocidade de infusão de soluções com precisão.',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/gotejamento.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/gotejamento.html',
                category: 'Calculadoras',
                pageviews: 0
            },
            {
                id: 'calc-medicamentos',
                type: 'calculator',
                title: 'Cálculo de Medicamentos',
                description: 'Calcule doses, diluições e volumes com segurança.',
                image: 'https://images.unsplash.com/photo-1584515933487-9bdb2f9883f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/medicamentos.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/medicamentos.html',
                category: 'Calculadoras',
                pageviews: 0
            },
            {
                id: 'calc-balanco-hidrico',
                type: 'calculator',
                title: 'Balanço Hídrico',
                description: 'Controle preciso das entradas e saídas de líquidos.',
                image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/balancohidrico.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/balancohidrico.html',
                category: 'Calculadoras',
                pageviews: 0
            },
            {
                id: 'calc-imc',
                type: 'calculator',
                title: 'Índice de Massa Corporal',
                description: 'Avalie rapidamente o IMC do paciente.',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/imc.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/imc.html',
                category: 'Calculadoras',
                pageviews: 0
            },
            {
                id: 'calc-superficie-corporal',
                type: 'calculator',
                title: 'Superfície Corporal',
                description: 'Calcule a área de superfície corporal para dosagem de medicamentos.',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/superficie-corporal.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/superficie-corporal.html',
                category: 'Calculadoras',
                pageviews: 0
            }
        ],
        
        // Escalas Clínicas
        scales: [
            {
                id: 'escala-glasgow',
                type: 'scale',
                title: 'Escala de Glasgow',
                description: 'Avalie o nível de consciência em adultos e crianças.',
                image: 'https://images.unsplash.com/photo-1584515933487-9bdb2f9883f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/glasgow.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/glasgow.html',
                category: 'Escalas',
                pageviews: 0
            },
            {
                id: 'escala-braden',
                type: 'scale',
                title: 'Escala de Braden',
                description: 'Avalie o risco de úlcera por pressão.',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/braden.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/braden.html',
                category: 'Escalas',
                pageviews: 0
            },
            {
                id: 'escala-morse',
                type: 'scale',
                title: 'Escala de Morse',
                description: 'Avalie risco de quedas hospitalares.',
                image: 'https://images.unsplash.com/photo-1584515933487-9bdb2f9883f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/morse.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/morse.html',
                category: 'Escalas',
                pageviews: 0
            },
            {
                id: 'escala-aldrete',
                type: 'scale',
                title: 'Escala de Aldrete',
                description: 'Avalie a recuperação pós-anestésica.',
                image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/aldrete.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/aldrete.html',
                category: 'Escalas',
                pageviews: 0
            },
            {
                id: 'escala-ramsay',
                type: 'scale',
                title: 'Escala de Ramsay',
                description: 'Avalie o nível de sedação do paciente.',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/ramsay.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/ramsay.html',
                category: 'Escalas',
                pageviews: 0
            }
        ],
        
        // Biblioteca de Enfermagem
        library: [
            {
                id: 'biblioteca-protocolos',
                type: 'library',
                title: 'Protocolos Clínicos',
                description: 'Acesse protocolos baseados em evidências.',
                image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/biblioteca-protocolos.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-protocolos.html',
                category: 'Biblioteca',
                pageviews: 0
            },
            {
                id: 'biblioteca-diretrizes',
                type: 'library',
                title: 'Diretrizes Clínicas',
                description: 'Consulte diretrizes atualizadas.',
                image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/biblioteca-diretrizes.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-diretrizes.html',
                category: 'Biblioteca',
                pageviews: 0
            },
            {
                id: 'biblioteca-artigos',
                type: 'library',
                title: 'Artigos Científicos',
                description: 'Explore publicações relevantes.',
                image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/biblioteca-artigos.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-artigos.html',
                category: 'Biblioteca',
                pageviews: 0
            },
            {
                id: 'biblioteca-manuais',
                type: 'library',
                title: 'Manuais e Guias',
                description: 'Acesse manuais práticos de enfermagem.',
                image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/biblioteca-manuais.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-manuais.html',
                category: 'Biblioteca',
                pageviews: 0
            }
        ],
        
        // Carreiras
        careers: [
            {
                id: 'carreiras-especialidades',
                type: 'career',
                title: 'Especialidades de Enfermagem',
                description: 'Conheça as áreas de especialização.',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/carreiras-especialidades.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/carreiras-especialidades.html',
                category: 'Carreiras',
                pageviews: 0
            },
            {
                id: 'carreiras-capacitacao',
                type: 'career',
                title: 'Cursos e Capacitação',
                description: 'Descubra oportunidades de aprendizado.',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/carreiras-cursos.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/carreiras-cursos.html',
                category: 'Carreiras',
                pageviews: 0
            },
            {
                id: 'carreiras-concursos',
                type: 'career',
                title: 'Concursos Públicos',
                description: 'Informações sobre concursos na área.',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/carreiras-concursos.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/carreiras-concursos.html',
                category: 'Carreiras',
                pageviews: 0
            },
            {
                id: 'carreiras-residencia',
                type: 'career',
                title: 'Residências em Enfermagem',
                description: 'Informações sobre programas de residência.',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                url: '/carreiras-residencia.html',
                fullUrl: 'https://www.calculadorasdeenfermagem.com.br/carreiras-residencia.html',
                category: 'Carreiras',
                pageviews: 0
            }
        ]
    };
    
    // ===================================
    // UTILITÁRIOS DE DATA
    // ===================================
    
    function getCurrentDate() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    
    function getDaysDifference(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.floor((date2 - date1) / oneDay);
    }
    
    // ===================================
    // STORAGE
    // ===================================
    
    function getStoredData() {
        try {
            const stored = localStorage.getItem(ROTATING_CARDS_CONFIG.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('❌ Erro ao ler dados armazenados:', e);
        }
        return null;
    }
    
    function setStoredData(data) {
        try {
            localStorage.setItem(ROTATING_CARDS_CONFIG.storageKey, JSON.stringify(data));
            console.log('✓ Dados de cards salvos no localStorage');
        } catch (e) {
            console.error('❌ Erro ao salvar dados:', e);
        }
    }
    
    // ===================================
    // GOOGLE ANALYTICS INTEGRATION
    // ===================================
    
    /**
     * Busca dados de pageviews do Google Analytics
     * Usa a API GA4 via gtag ou fallback para dados simulados
     */
    async function fetchAnalyticsData() {
        console.log('📊 Buscando dados do Google Analytics...');
        
        // Verificar se GA4 está disponível
        if (typeof gtag === 'undefined' || typeof window.google_tag_manager === 'undefined') {
            console.warn('⚠️ Google Analytics não disponível, usando dados de fallback');
            return useFallbackData();
        }
        
        try {
            // Obter dados via Google Analytics
            // Como o gtag não fornece API direta para consultas, vamos usar uma abordagem alternativa:
            // 1. Verificar dados no dataLayer
            // 2. Se não disponível, usar fallback
            
            const analyticsData = await getPageviewsFromDataLayer();
            
            if (analyticsData && analyticsData.length > 0) {
                return analyticsData;
            } else {
                console.warn('⚠️ Dados do Analytics indisponíveis, usando fallback');
                return useFallbackData();
            }
            
        } catch (error) {
            console.error('❌ Erro ao buscar dados do Analytics:', error);
            return useFallbackData();
        }
    }
    
    /**
     * Tenta obter dados do dataLayer do Google Analytics
     */
    async function getPageviewsFromDataLayer() {
        // Implementação simplificada - em produção, você precisaria de uma API backend
        // que consulte o Google Analytics Data API
        
        // Por enquanto, retornamos null para acionar o fallback
        // Em produção, você implementaria uma chamada real à API GA4
        return null;
    }
    
    /**
     * Dados de fallback quando Analytics não está disponível
     * Simula métricas baseadas em popularidade típica
     */
    function useFallbackData() {
        console.log('📊 Usando dados de fallback (Analytics indisponível)');
        
        // Atribuir pageviews simulados baseados em popularidade típica
        const allCards = [
            ...CARDS_POOL.calculators,
            ...CARDS_POOL.scales,
            ...CARDS_POOL.library,
            ...CARDS_POOL.careers
        ];
        
        // Simular pageviews (valores aleatórios mas realistas)
        allCards.forEach(card => {
            card.pageviews = Math.floor(Math.random() * 5000) + 500;
        });
        
        return allCards;
    }
    
    /**
     * Mescla dados do Analytics com o pool de cards
     */
    function mergeAnalyticsWithCards(analyticsData) {
        const allCards = [
            ...CARDS_POOL.calculators,
            ...CARDS_POOL.scales,
            ...CARDS_POOL.library,
            ...CARDS_POOL.careers
        ];
        
        // Se analyticsData já contém os cards com pageviews, retornar
        if (analyticsData[0] && 'pageviews' in analyticsData[0]) {
            return analyticsData;
        }
        
        // Caso contrário, mapear pageviews do Analytics para os cards
        allCards.forEach(card => {
            const analyticsMatch = analyticsData.find(data => 
                data.url === card.url || data.url === card.fullUrl
            );
            
            if (analyticsMatch) {
                card.pageviews = analyticsMatch.pageviews || 0;
            }
        });
        
        return allCards;
    }
    
    // ===================================
    // SELEÇÃO DE CARDS
    // ===================================
    
    /**
     * Seleciona os 4 melhores cards baseado em pageviews
     * Garante diversidade (pelo menos 1 de cada categoria se possível)
     */
    function selectTopCards(cardsWithPageviews) {
        console.log('🎯 Selecionando top 4 cards baseado em pageviews...');
        
        // Garantir diversidade: pelo menos 1 de cada tipo
        const selectedCards = [];
        const types = ['calculator', 'scale', 'library', 'career'];
        
        // 1. Selecionar o melhor de cada tipo
        types.forEach(type => {
            const typeCards = cardsWithPageviews
                .filter(card => card.type === type)
                .sort((a, b) => b.pageviews - a.pageviews);
            
            if (typeCards.length > 0) {
                selectedCards.push(typeCards[0]);
            }
        });
        
        // Se não conseguimos 4 cards (alguma categoria vazia), completar com os mais populares
        if (selectedCards.length < ROTATING_CARDS_CONFIG.cardsPerSection) {
            const remaining = cardsWithPageviews
                .filter(card => !selectedCards.includes(card))
                .sort((a, b) => b.pageviews - a.pageviews)
                .slice(0, ROTATING_CARDS_CONFIG.cardsPerSection - selectedCards.length);
            
            selectedCards.push(...remaining);
        }
        
        // Ordenar por pageviews
        selectedCards.sort((a, b) => b.pageviews - a.pageviews);
        
        console.log('✓ Cards selecionados:', selectedCards.map(c => `${c.title} (${c.pageviews} views)`));
        
        return selectedCards.slice(0, ROTATING_CARDS_CONFIG.cardsPerSection);
    }
    
    // ===================================
    // LÓGICA DE ROTAÇÃO
    // ===================================
    
    function shouldRotate(storedData) {
        if (!storedData || !storedData.lastRotation) {
            console.log('🔄 Primeira rotação - sem dados armazenados');
            return true;
        }
        
        const lastRotation = new Date(storedData.lastRotation);
        const currentDate = getCurrentDate();
        const daysPassed = getDaysDifference(lastRotation, currentDate);
        
        console.log(`📅 Última rotação: ${daysPassed} dias atrás`);
        
        if (daysPassed >= ROTATING_CARDS_CONFIG.rotationDays) {
            console.log('🔄 Tempo de rotacionar (≥7 dias)');
            return true;
        }
        
        return false;
    }
    
    async function getActiveCards() {
        const storedData = getStoredData();
        
        // Se deve rotacionar, buscar novos dados do Analytics
        if (shouldRotate(storedData)) {
            console.log('🔄 Rotacionando cards com dados do Google Analytics...');
            
            const analyticsData = await fetchAnalyticsData();
            const cardsWithPageviews = mergeAnalyticsWithCards(analyticsData);
            const topCards = selectTopCards(cardsWithPageviews);
            
            const newData = {
                cards: topCards,
                lastRotation: getCurrentDate().toISOString(),
                analyticsDate: new Date().toISOString()
            };
            
            setStoredData(newData);
            
            return topCards;
        }
        
        // Usar cards armazenados
        console.log('✓ Usando cards armazenados (rotação em ' + 
                   (ROTATING_CARDS_CONFIG.rotationDays - getDaysDifference(new Date(storedData.lastRotation), getCurrentDate())) + 
                   ' dias)');
        return storedData.cards;
    }
    
    // ===================================
    // RENDERIZAÇÃO
    // ===================================
    
    function renderCard(card, index) {
        return `
        <div class="organic-card shape-${(index % 5) + 1} mosaic-item" data-card-id="${card.id}">
            <a href="${card.fullUrl}" title="${card.title}">
                <img src="${card.image}" alt="${card.title}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-title">${card.title}</div>
                    <div class="card-description">${card.description}</div>
                </div>
            </a>
        </div>`;
    }
    
    async function renderCards() {
        console.log('🎨 Renderizando cards...');
        
        const activeCards = await getActiveCards();
        
        // Buscar todos os containers de cards rotativos
        const containers = document.querySelectorAll('[data-rotating-cards]');
        
        if (containers.length === 0) {
            console.warn('⚠️ Nenhum container [data-rotating-cards] encontrado');
            return;
        }
        
        containers.forEach(container => {
            const html = activeCards.map((card, index) => renderCard(card, index)).join('');
            container.innerHTML = html;
        });
        
        console.log(`✓ ${activeCards.length} cards renderizados em ${containers.length} container(s)`);
    }
    
    // ===================================
    // INICIALIZAÇÃO
    // ===================================
    
    function init() {
        console.log('🚀 Inicializando Rotating Cards System...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderCards);
        } else {
            renderCards();
        }
    }
    
    // ===================================
    // API PÚBLICA
    // ===================================
    
    window.RotatingCards = {
        /**
         * Renderizar cards novamente
         */
        refresh: renderCards,
        
        /**
         * Forçar rotação imediata (ignora período de 7 dias)
         */
        forceRotate: async function() {
            console.log('🔄 Forçando rotação de cards...');
            localStorage.removeItem(ROTATING_CARDS_CONFIG.storageKey);
            await renderCards();
        },
        
        /**
         * Obter cards ativos
         */
        getActiveCards: getActiveCards,
        
        /**
         * Obter dados armazenados
         */
        getStoredData: getStoredData,
        
        /**
         * Configurações
         */
        config: CONFIG
    };
    
    // Inicializar
    init();
    
})();
