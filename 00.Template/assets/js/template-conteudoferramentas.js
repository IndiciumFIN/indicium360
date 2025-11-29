/**
 * SISTEMA DE MODAIS INSTITUCIONAIS - MODULAR
 * ==========================================
 * Arquivo compartilhado: template-conteudoferramentas.js
 * Usado por: template-conteudo.html, template-ferramentas.html, template.html (Página Principal)
 */
const ModalInstitucional = {
    // Detecta o caminho base automaticamente
    getBasePath() {
        const path = window.location.pathname;
        // Se está na página principal (01. Página Principal)
        if (path.includes('01.') || path.includes('Página Principal') || path.includes('Pagina')) {
            return '../02. Sobre Nós/';
        }
        // Se está em templates (00.Template)
        if (path.includes('00.') || path.includes('Template')) {
            return '../02. Sobre Nós/';
        }
        // Se está em outras seções (03, 04, 05, 06)
        if (path.match(/0[3-6]\./)) {
            return '../02. Sobre Nós/';
        }
        // Padrão para arquivos na raiz ou estrutura plana
        return '02. Sobre Nós/';
    },
    
    // Configuração completa dos modais com metadados
    modals: {
        'missao': {
            title: 'Missão, Visão e Valores',
            file: 'missao.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/missao.html',
            category: 'institucional',
            tags: ['Sobre Nós', 'Missão', 'Visão', 'Valores', 'Ética em Enfermagem']
        },
        'compromisso': {
            title: 'Sustentabilidade Digital',
            file: 'compromisso.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/compromisso.html',
            category: 'institucional',
            tags: ['Sustentabilidade Digital', 'Web Verde', 'Acessibilidade', 'Responsabilidade Ambiental']
        },
        'acessibilidade': {
            title: 'Política de Acessibilidade',
            file: 'acessibilidade.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/acessibilidade.html',
            category: 'acessibilidade',
            tags: ['Acessibilidade', 'WCAG', 'Inclusão Digital', 'Leitores de Tela']
        },
        'objetivos': {
            title: 'Objetivos da Plataforma',
            file: 'objetivos.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/objetivos.html',
            category: 'institucional',
            tags: ['Objetivos', 'Calculadoras', 'Escalas Clínicas', 'Enfermagem']
        },
        'recursos-assistivos': {
            title: 'Recursos Assistivos',
            file: 'recursos-assistivos.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/recursos-assistivos.html',
            category: 'acessibilidade',
            tags: ['Acessibilidade', 'WCAG', 'Recursos Assistivos', 'VLibras', 'Leitores de Tela']
        },
        'tecnologia-verde': {
            title: 'Tecnologia Verde',
            file: 'tecnologia-verde.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/tecnologia-verde.html',
            category: 'institucional',
            tags: ['Tecnologia Verde', 'Sustentabilidade Digital', 'Eficiência Energética', 'Web Verde', 'Código Otimizado']
        },
        'termos-de-uso': {
            title: 'Termos de Uso',
            file: 'termos-de-uso.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/termos-de-uso.html',
            category: 'legal',
            tags: ['Termos de Uso', 'Condições', 'Direitos Autorais', 'Responsabilidades', 'Legal']
        },
        'politica-de-privacidade': {
            title: 'Política de Privacidade',
            file: 'politica-de-privacidade.html',
            url: 'https://www.calculadorasdeenfermagem.com.br/politica-de-privacidade.html',
            category: 'legal',
            tags: ['Privacidade', 'LGPD', 'Dados Pessoais', 'Cookies', 'Proteção de Dados']
        }
    },
    
    // Gera TOC automaticamente a partir dos H2 do conteúdo
    generateTOC(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const headings = doc.querySelectorAll('h2[id]');
        if (headings.length === 0) return '';
        
        let tocItems = '';
        headings.forEach(h => {
            tocItems += `<li><a href="#${h.id}" style="color: rgba(255,255,255,0.95);">${h.textContent.replace(/^\d+\.\s*/, '')}</a></li>`;
        });
        
        return `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white;">
                <h3 style="color: white;"><i class="fas fa-list" aria-hidden="true"></i> Índice</h3>
                <ul class="toc-list" style="color: rgba(255,255,255,0.95);">${tocItems}</ul>
            </div>
        `;
    },
    
    // Gera botões de compartilhar
    generateShare(config) {
        const encodedUrl = encodeURIComponent(config.url);
        const encodedTitle = encodeURIComponent(config.title + ' - Calculadoras de Enfermagem');
        
        return `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white;">
                <h3 style="color: white;"><i class="fas fa-share-nodes" aria-hidden="true"></i> Compartilhar</h3>
                <div class="share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-btn twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-btn linkedin" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        `;
    },
    
    // Gera tags
    generateTags(tags) {
        if (!tags || tags.length === 0) return '';
        const tagItems = tags.map(t => `<span class="tag">${t}</span>`).join('');
        return `
            <div class="modal-tags" style="margin-top: 2rem;">
                <h4 style="color: var(--color-grey-medium); font-size: 0.875rem; margin-bottom: 1rem;">TAGS</h4>
                <div class="tags-list">${tagItems}</div>
            </div>
        `;
    },
    
    // Gera conteúdo relacionado por categoria
    generateRelated(currentId, category) {
        const related = Object.entries(this.modals)
            .filter(([id, m]) => id !== currentId && m.category === category)
            .slice(0, 3);
        
        if (related.length === 0) return '';
        
        const cards = related.map(([id, m]) => `
            <a href="#" class="related-card-mini" onclick="event.preventDefault(); ModalInstitucional.open('${id}');">
                <i class="fa-solid fa-file-lines"></i>
                <span>${m.title}</span>
            </a>
        `).join('');
        
        return `
            <div class="sidebar-card" style="background: linear-gradient(135deg, #1A3E74 0%, #2E5A9C 100%); color: white;">
                <h3 style="color: white;"><i class="fas fa-book-open" aria-hidden="true"></i> Relacionados</h3>
                <div class="related-mini-list">${cards}</div>
            </div>
        `;
    },
    
    async open(modalId) {
        const config = this.modals[modalId];
        if (!config) return console.error('Modal não encontrado:', modalId);
        
        try {
            // Constrói o caminho completo usando o basePath detectado
            const basePath = this.getBasePath();
            const fullPath = basePath + config.file;
            
            const response = await fetch(fullPath);
            if (!response.ok) throw new Error('Erro ao carregar modal');
            const content = await response.text();
            
            // Gera componentes modulares
            const toc = this.generateTOC(content);
            const share = this.generateShare(config);
            const related = this.generateRelated(modalId, config.category);
            const tags = this.generateTags(config.tags);
            
            // Sidebar completa
            const sidebar = `<aside class="modal-sidebar">${toc}${share}${related}</aside>`;
            
            const modalHTML = `
                <div id="modal-${modalId}" class="modal active" role="dialog" aria-modal="true">
                    <div class="modal-overlay" onclick="ModalInstitucional.close('${modalId}')"></div>
                    <div class="modal-container modal-xl">
                        <div class="modal-header">
                            <h2 class="modal-title">${config.title}</h2>
                            <button class="modal-close" onclick="ModalInstitucional.close('${modalId}')" aria-label="Fechar">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-content-layout">
                                ${content}
                                ${sidebar}
                            </div>
                            ${tags}
                        </div>
                    </div>
                </div>
            `;
            
            // Garante que o container de modais existe
            let container = document.getElementById('modals-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'modals-container';
                document.body.appendChild(container);
            }
            
            container.innerHTML = modalHTML;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', this.handleEsc);
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
    },
    
    close(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleEsc);
    },
    
    handleEsc(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                const modalId = activeModal.id.replace('modal-', '');
                ModalInstitucional.close(modalId);
            }
        }
    }
};

// Ativar links com data-modal usando event delegation (funciona com elementos dinâmicos)
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-modal]');
    if (target) {
        e.preventDefault();
        ModalInstitucional.open(target.dataset.modal);
    }
});
