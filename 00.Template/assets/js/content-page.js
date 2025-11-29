/* ========================================
   CONTENT PAGE - FUNCIONALIDADES INTERATIVAS
   Template para páginas de conteúdo textual
   Autor: MiniMax Agent
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       1. INTERSECTION OBSERVER - ANIMAÇÕES DE SCROLL
       ======================================== */

    /**
     * Configura animações ao rolar a página
     * Elementos aparecem suavemente quando entram no viewport
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Para animações que devem acontecer apenas uma vez
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observa seções do artigo
        const sections = document.querySelectorAll('.article-content > *:not(.animate-in)');
        sections.forEach((section, index) => {
            // Adiciona delay escalonado para efeito cascata
            section.style.animationDelay = `${index * 0.05}s`;
            observer.observe(section);
        });

        // Observa cards relacionados
        const relatedCards = document.querySelectorAll('.related-card');
        relatedCards.forEach(card => observer.observe(card));
    }

    /* ========================================
       2. SMOOTH SCROLL - NAVEGAÇÃO SUAVE
       ======================================== */

    /**
     * Implementa scroll suave para links do índice
     */
    function initSmoothScroll() {
        const tocLinks = document.querySelectorAll('.toc-list a');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Offset para considerar header fixo
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Atualiza link ativo
                    updateActiveTocLink(link);
                }
            });
        });
    }

    /**
     * Atualiza o link ativo no índice
     */
    function updateActiveTocLink(activeLink) {
        document.querySelectorAll('.toc-list a').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /* ========================================
       3. ACTIVE SECTION HIGHLIGHTING
       ======================================== */

    /**
     * Destaca seção ativa no índice enquanto o usuário rola
     */
    function initActiveSectionTracking() {
        const sections = document.querySelectorAll('.article-content h2[id]');
        const tocLinks = document.querySelectorAll('.toc-list a');

        if (sections.length === 0) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* ========================================
       4. READING PROGRESS BAR
       ======================================== */

    /**
     * Cria e atualiza barra de progresso de leitura
     */
    function initReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    /* ========================================
       5. SHARE BUTTONS - COMPARTILHAMENTO
       ======================================== */

    /**
     * Configura botões de compartilhamento em redes sociais
     */
    function initShareButtons() {
        const shareButtons = {
            facebook: document.querySelector('.share-btn.facebook'),
            twitter: document.querySelector('.share-btn.twitter'),
            linkedin: document.querySelector('.share-btn.linkedin'),
            whatsapp: document.querySelector('.share-btn.whatsapp')
        };

        const currentUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        const pageDescription = encodeURIComponent(
            document.querySelector('meta[name="description"]')?.content || ''
        );

        // Facebook
        if (shareButtons.facebook) {
            shareButtons.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
            shareButtons.facebook.addEventListener('click', (e) => {
                e.preventDefault();
                openShareWindow(shareButtons.facebook.href, 'Facebook');
                trackShare('Facebook');
            });
        }

        // Twitter
        if (shareButtons.twitter) {
            shareButtons.twitter.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}`;
            shareButtons.twitter.addEventListener('click', (e) => {
                e.preventDefault();
                openShareWindow(shareButtons.twitter.href, 'Twitter');
                trackShare('Twitter');
            });
        }

        // LinkedIn
        if (shareButtons.linkedin) {
            shareButtons.linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
            shareButtons.linkedin.addEventListener('click', (e) => {
                e.preventDefault();
                openShareWindow(shareButtons.linkedin.href, 'LinkedIn');
                trackShare('LinkedIn');
            });
        }

        // WhatsApp
        if (shareButtons.whatsapp) {
            shareButtons.whatsapp.href = `https://wa.me/?text=${pageTitle}%20${currentUrl}`;
            shareButtons.whatsapp.addEventListener('click', (e) => {
                e.preventDefault();
                openShareWindow(shareButtons.whatsapp.href, 'WhatsApp');
                trackShare('WhatsApp');
            });
        }
    }

    /**
     * Abre janela de compartilhamento
     */
    function openShareWindow(url, network) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            `share-${network}`,
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
        );
    }

    /**
     * Rastreia compartilhamentos (Google Analytics)
     */
    function trackShare(network) {
        if (typeof gtag === 'function') {
            gtag('event', 'share', {
                method: network,
                content_type: 'article',
                item_id: window.location.pathname
            });
        }
    }

    /* ========================================
       6. PDF DOWNLOAD FUNCTIONALITY
       ======================================== */

    /**
     * Implementa funcionalidade de download em PDF
     */
    function initPdfDownload() {
        const pdfButton = document.querySelector('.sidebar-card button');
        
        if (pdfButton) {
            pdfButton.addEventListener('click', () => {
                generatePdf();
            });
        }
    }

    /**
     * Gera PDF do conteúdo (usando window.print)
     */
    function generatePdf() {
        // Rastreamento
        if (typeof gtag === 'function') {
            gtag('event', 'download_pdf', {
                content_type: 'article',
                item_id: window.location.pathname
            });
        }

        // Mostra mensagem
        showNotification('Preparando PDF para download...', 'info');

        // Abre diálogo de impressão (usuário pode salvar como PDF)
        setTimeout(() => {
            window.print();
        }, 500);
    }

    /* ========================================
       7. IMAGE LAZY LOADING & LIGHTBOX
       ======================================== */

    /**
     * Implementa lazy loading nativo e lightbox para imagens
     */
    function initImageEnhancements() {
        const images = document.querySelectorAll('.article-content img');
        
        images.forEach(img => {
            // Lazy loading nativo
            img.loading = 'lazy';
            
            // Lightbox ao clicar
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                openLightbox(img);
            });
        });
    }

    /**
     * Abre lightbox para visualização de imagem em tela cheia
     */
    function openLightbox(img) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            animation: fadeIn 0.3s ease;
        `;

        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 0.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s ease;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.1)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
        });

        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeButton);
        document.body.appendChild(lightbox);

        // Fecha lightbox
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        closeButton.addEventListener('click', closeLightbox);

        // Fecha com ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /* ========================================
       8. TABLE OF CONTENTS AUTO-GENERATION
       ======================================== */

    /**
     * Gera índice automaticamente baseado nos headings do artigo
     */
    function autoGenerateToc() {
        const tocList = document.querySelector('.toc-list');
        const headings = document.querySelectorAll('.article-content h2[id]');

        if (!tocList || headings.length === 0) return;

        // Limpa índice existente
        tocList.innerHTML = '';

        headings.forEach((heading, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent.replace(/^\d+\.\s*/, ''); // Remove numeração se existir
            
            li.appendChild(a);
            tocList.appendChild(li);
        });

        // Reinicializa smooth scroll para novos links
        initSmoothScroll();
    }

    /* ========================================
       9. ESTIMATED READING TIME
       ======================================== */

    /**
     * Calcula e exibe tempo estimado de leitura
     */
    function calculateReadingTime() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        const text = articleContent.textContent;
        const wordsPerMinute = 200; // Média de leitura em português
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);

        // Atualiza elemento de tempo de leitura se existir
        const readingTimeElement = document.querySelector('.article-meta-item:has(.fa-clock) span');
        if (readingTimeElement && readingTimeElement.textContent.includes('min')) {
            readingTimeElement.textContent = `Leitura: ${readingTime} min`;
        }
    }

    /* ========================================
       10. COPY CODE BLOCKS (SE APLICÁVEL)
       ======================================== */

    /**
     * Adiciona botão de copiar em blocos de código
     */
    function initCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            pre.style.position = 'relative';

            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
            copyButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 0.5rem 1rem;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s ease;
            `;

            copyButton.addEventListener('click', () => {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
                    copyButton.style.background = '#28a745';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
                        copyButton.style.background = 'var(--color-primary)';
                    }, 2000);
                });
            });

            pre.appendChild(copyButton);
        });
    }

    /* ========================================
       11. NOTIFICATION SYSTEM
       ======================================== */

    /**
     * Exibe notificações para o usuário
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        `;

        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fa-solid fa-${icon}" style="color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'}; font-size: 1.25rem;"></i>
                <span style="color: var(--color-grey-dark); font-size: 0.95rem;">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /* ========================================
       12. KEYBOARD SHORTCUTS
       ======================================== */

    /**
     * Implementa atalhos de teclado úteis
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + P = Gerar PDF
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                generatePdf();
            }

            // Ctrl/Cmd + K = Abrir compartilhamento
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                showNotification('Use os botões de compartilhamento na sidebar →', 'info');
            }
        });
    }

    /* ========================================
       13. EXTERNAL LINKS - OPEN IN NEW TAB
       ======================================== */

    /**
     * Abre links externos em nova aba
     */
    function initExternalLinks() {
        const articleLinks = document.querySelectorAll('.article-content a');
        
        articleLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Se é link externo (começa com http e não é do mesmo domínio)
            if (href && (href.startsWith('http://') || href.startsWith('https://')) && 
                !href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                // Adiciona ícone de link externo
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-external-link-alt';
                icon.style.cssText = 'margin-left: 0.25rem; font-size: 0.75em; opacity: 0.6;';
                link.appendChild(icon);
            }
        });
    }

    /* ========================================
       14. ANIMATIONS CSS INJECTION
       ======================================== */

    /**
     * Injeta animações CSS necessárias
     */
    function injectAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /* ========================================
       16. COMPONENTES MODULARES - RENDERIZAÇÃO
       ======================================== */

    /**
     * Renderiza background decorativo com formas flutuantes e linhas SVG
     * @returns {string} HTML do background decorativo
     */
    function renderDecorativeBackground() {
        return `
            <!-- Formas Flutuantes Decorativas -->
            <div class="bg-floating-shapes">
                <div class="floating-shape"></div>
                <div class="floating-shape"></div>
                <div class="floating-shape"></div>
            </div>
            
            <!-- Linhas Decorativas SVG -->
            <svg class="bg-lines-decorative" width="100%" height="100%" viewBox="0 0 1440 1000" preserveAspectRatio="none">
                <path d="M-100,200 C300,150 600,350 1500,250" fill="none" stroke="var(--color-cyan)" stroke-width="1.5" />
                <path d="M-100,600 C400,550 800,700 1600,500" fill="none" stroke="var(--color-cyan)" stroke-width="1.5" />
                <path d="M-200,800 C200,750 500,850 1400,780" fill="none" stroke="var(--color-primary)" stroke-width="1" opacity="0.5" />
            </svg>
        `;
    }

    /**
     * Renderiza breadcrumb de navegação
     * @param {Array} items - Array de objetos {label, href}
     * @returns {string} HTML do breadcrumb
     */
    function renderBreadcrumb(items) {
        if (!items || items.length === 0) return '';
        
        let html = '<nav class="breadcrumb" aria-label="Breadcrumb">';
        
        items.forEach((item, index) => {
            if (index > 0) {
                html += '<span class="breadcrumb-separator">›</span>';
            }
            
            if (item.href && index < items.length - 1) {
                html += `<a href="${item.href}">${item.label}</a>`;
            } else {
                html += `<span>${item.label}</span>`;
            }
        });
        
        html += '</nav>';
        return html;
    }

    /**
     * Renderiza índice (Table of Contents) na sidebar
     * @param {Array} sections - Array de objetos {id, title}
     * @returns {string} HTML do índice
     */
    function renderTableOfContents(sections) {
        if (!sections || sections.length === 0) return '';
        
        let html = `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white;">
                <h3 style="color: white;"><i class="fas fa-list" aria-hidden="true"></i> Índice</h3>
                <ul class="toc-list" style="color: rgba(255,255,255,0.95);">
        `;
        
        sections.forEach(section => {
            html += `<li><a href="#${section.id}" style="color: rgba(255,255,255,0.95);">${section.title}</a></li>`;
        });
        
        html += `
                </ul>
            </div>
        `;
        
        return html;
    }

    /**
     * Renderiza botões de compartilhamento em redes sociais
     * @param {Object} config - {url, title}
     * @returns {string} HTML dos botões de compartilhamento
     */
    function renderShareButtons(config) {
        const url = config.url || window.location.href;
        const title = config.title || document.title;
        
        return `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white;">
                <h3 style="color: white;"><i class="fas fa-share-nodes" aria-hidden="true"></i> Compartilhar</h3>
                <div class="share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="share-btn facebook" 
                       title="Facebook" 
                       aria-label="Compartilhar no Facebook">
                        <i class="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="share-btn twitter" 
                       title="Twitter" 
                       aria-label="Compartilhar no Twitter">
                        <i class="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="share-btn linkedin" 
                       title="LinkedIn" 
                       aria-label="Compartilhar no LinkedIn">
                        <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                    </a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="share-btn whatsapp" 
                       title="WhatsApp" 
                       aria-label="Compartilhar no WhatsApp">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza CTA (Call-to-Action) na sidebar
     * @param {Object} config - {title, description, buttonText, buttonUrl, icon}
     * @returns {string} HTML do CTA
     */
    function renderSidebarCTA(config) {
        const title = config.title || 'Conheça Mais';
        const description = config.description || 'Explore nossa plataforma e descubra todas as ferramentas disponíveis';
        const buttonText = config.buttonText || 'Explorar Calculadoras';
        const buttonUrl = config.buttonUrl || '/calculadoras.html';
        const icon = config.icon || 'fa-calculator';
        
        return `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white; position: relative; z-index: 1;">
                <h3 style="color: white; font-size: 1.1rem;"><i class="fas fa-compass" aria-hidden="true"></i> ${title}</h3>
                <p style="font-size: 0.9rem; color: rgba(255,255,255,0.95); margin-bottom: 1rem; line-height: 1.5;">
                    ${description}
                </p>
                <a href="${buttonUrl}" 
                   style="display: block; width: 100%; padding: 0.875rem; background: white; color: #1A3E74; border: none; border-radius: 0.5rem; font-weight: 600; text-align: center; text-decoration: none; transition: all 0.3s ease;" 
                   aria-label="${buttonText}">
                    <i class="fa-solid ${icon}"></i> ${buttonText}
                </a>
            </div>
        `;
    }

    /**
     * Renderiza caixa de informações do autor
     * @param {Object} config - {image, name, description, quote} (opcional, usa padrão)
     * @returns {string} HTML do author box
     */
    function renderAuthorBox(config = {}) {
        const image = config.image || 'https://www.calculadorasdeenfermagem.com.br/icontopbar1.webp';
        const name = config.name || 'Calculadoras de Enfermagem';
        const description = config.description || 'Ferramentas essenciais para profissionais e estudantes de enfermagem, oferecendo calculadoras de escalas clínicas e de dosagem de medicamentos para otimizar a prática diária e a segurança do paciente. São mais de 50 escalas clínicas disponíveis.';
        const quote = config.quote || 'Conhecer e ter domínio em escalas clínicas é fundamental para o enfermeiro, auxilia na tomada de decisões, otimiza a assistência e empodera!';
        
        return `
            <div class="author-box">
                <img src="${image}" 
                     alt="${name}" 
                     class="author-avatar">
                <div class="author-info">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    ${quote ? `
                    <blockquote style="margin-top: 1rem; padding-left: 1rem; border-left: 3px solid var(--color-primary); font-style: italic; color: var(--color-grey-medium);">
                        "${quote}"
                    </blockquote>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza seção de tags
     * @param {Array} tags - Array de objetos {label, href}
     * @returns {string} HTML da seção de tags
     */
    function renderTags(tags) {
        if (!tags || tags.length === 0) return '';
        
        let html = `
            <div style="margin-top: 2rem;">
                <h4 style="color: var(--color-grey-medium); font-size: 0.875rem; margin-bottom: 1rem;">TAGS</h4>
                <div class="tags-list">
        `;
        
        tags.forEach(tag => {
            html += `<a href="${tag.href}" class="tag">${tag.label}</a>`;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Renderiza sidebar completa com componentes modulares
     * @param {Object} config - Configuração dos componentes
     * @returns {string} HTML da sidebar completa
     */
    function renderSidebar(config = {}) {
        const toc = config.toc || [];
        const shareConfig = config.share || {};
        const ctaConfig = config.cta || {};
        
        let html = '<aside class="content-sidebar" style="position: relative; z-index: 10;">';
        
        // Índice
        if (toc.length > 0) {
            html += renderTableOfContents(toc);
        }
        
        // Botões de Compartilhamento
        html += renderShareButtons(shareConfig);
        
        // CTA
        html += renderSidebarCTA(ctaConfig);
        
        html += '</aside>';
        
        return html;
    }

    /* ========================================
       17. EXPORTAR FUNÇÕES MODULARES (GLOBAIS)
       ======================================== */

    // Torna funções disponíveis globalmente para uso em outras páginas
    window.ContentPageModules = {
        renderDecorativeBackground,
        renderBreadcrumb,
        renderTableOfContents,
        renderShareButtons,
        renderSidebarCTA,
        renderAuthorBox,
        renderTags,
        renderSidebar
    };

    /* ========================================
       15. INICIALIZAÇÃO
       ======================================== */

    /**
     * Inicializa todas as funcionalidades quando o DOM estiver pronto
     */
    function initialize() {
        console.log('🚀 Inicializando funcionalidades da página de conteúdo...');

        // Injeta animações CSS
        injectAnimations();

        // Inicializa funcionalidades
        initScrollAnimations();
        initSmoothScroll();
        initActiveSectionTracking();
        initReadingProgressBar();
        initShareButtons();
        initPdfDownload();
        initImageEnhancements();
        initCodeCopyButtons();
        initKeyboardShortcuts();
        initExternalLinks();
        
        // Calcula tempo de leitura
        calculateReadingTime();

        // Gera índice automaticamente se necessário
        // autoGenerateToc(); // Descomente se quiser gerar TOC automaticamente

        console.log('✓ Página de conteúdo carregada com sucesso');
    }

    // Executa quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
