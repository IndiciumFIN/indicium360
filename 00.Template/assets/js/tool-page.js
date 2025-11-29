/**
 * JAVASCRIPT MODULAR - PÁGINA DE FERRAMENTA
 * Calculadoras de Enfermagem
 * 
 * Funcionalidades:
 * - Sistema de animações ao scroll
 * - Tabs NANDA/NIC/NOC
 * - Validação e cálculo de formulário
 * - Geração de PDF
 * - Interações suaves
 */

(function() {
    'use strict';
    
    /* ====================================
       CONSTANTES E CONFIGURAÇÕES
       ==================================== */
    
    const ANIMATION_CONFIG = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    /* ====================================
       SISTEMA DE ANIMAÇÕES AO SCROLL
       ==================================== */
    
    /**
     * Inicializa Intersection Observer para animações ao scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (!animatedElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Opcional: parar de observar após animação
                    // observer.unobserve(entry.target);
                }
            });
        }, ANIMATION_CONFIG);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        console.log(`✓ ${animatedElements.length} elementos com animação ao scroll inicializados`);
    }
    
    /* ====================================
       SISTEMA DE TABS (NANDA/NIC/NOC)
       ==================================== */
    
    /**
     * Inicializa sistema de tabs para diagnósticos de enfermagem
     */
    function initTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (!tabButtons.length || !tabContents.length) {
            console.warn('⚠️ Sistema de tabs não encontrado');
            return;
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remover active de todos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Ativar o selecionado
                button.classList.add('active');
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Animação suave
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });
        
        console.log('✓ Sistema de tabs inicializado');
    }
    
    /* ====================================
       FORMULÁRIO E CÁLCULO
       ==================================== */
    
    /**
     * Inicializa sistema de formulário e cálculo
     */
    function initFormSystem() {
        const form = document.getElementById('tool-form');
        const resultBox = document.getElementById('result-box');
        const resultValue = document.getElementById('result-value');
        const resultInterpretation = document.getElementById('result-interpretation');
        
        if (!form) {
            console.warn('⚠️ Formulário não encontrado');
            return;
        }
        
        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Adicionar loading state
            const submitButton = form.querySelector('.btn-calculate');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculando...';
            submitButton.disabled = true;
            
            // Simular processamento (substituir pela lógica real)
            setTimeout(() => {
                const resultado = performCalculation();
                displayResult(resultado);
                
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Scroll suave até resultado
                if (resultBox) {
                    resultBox.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 1000);
        });
        
        // Reset do formulário
        form.addEventListener('reset', () => {
            if (resultBox) {
                resultBox.classList.remove('show');
            }
            
            // Animação suave
            form.style.opacity = '0.5';
            setTimeout(() => {
                form.style.opacity = '1';
            }, 200);
        });
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });
        
        console.log('✓ Sistema de formulário inicializado');
    }
    
    /**
     * Valida um campo específico
     */
    function validateField(field) {
        if (!field.checkValidity()) {
            field.classList.add('invalid');
            field.style.borderColor = '#dc3545';
            
            // Adicionar mensagem de erro se não existir
            let errorMsg = field.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('span');
                errorMsg.classList.add('error-message');
                errorMsg.style.color = '#dc3545';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.style.display = 'block';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
            errorMsg.textContent = field.validationMessage || 'Campo obrigatório';
        } else {
            field.classList.remove('invalid');
            field.style.borderColor = '';
            
            // Remover mensagem de erro
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    }
    
    /**
     * Realiza o cálculo (IMPLEMENTAR LÓGICA ESPECÍFICA)
     */
    function performCalculation() {
        // EXEMPLO: Substituir pela lógica real da ferramenta
        const campo1 = parseFloat(document.getElementById('campo1')?.value) || 0;
        const campo2 = parseFloat(document.getElementById('campo2')?.value) || 0;
        
        const resultado = campo1 + campo2;
        
        return {
            value: resultado,
            interpretation: interpretarResultado(resultado)
        };
    }
    
    /**
     * Interpreta o resultado (IMPLEMENTAR LÓGICA ESPECÍFICA)
     */
    function interpretarResultado(valor) {
        // EXEMPLO: Substituir pela lógica real da ferramenta
        if (valor <= 10) {
            return 'Resultado dentro dos parâmetros normais. Manter monitoramento de rotina.';
        } else if (valor <= 20) {
            return 'Resultado requer atenção. Avaliar necessidade de intervenções preventivas.';
        } else {
            return 'Resultado crítico. Intervenção imediata necessária conforme protocolo institucional.';
        }
    }
    
    /**
     * Exibe o resultado na interface
     */
    function displayResult(resultado) {
        const resultBox = document.getElementById('result-box');
        const resultValue = document.getElementById('result-value');
        const resultInterpretation = document.getElementById('result-interpretation');
        
        if (!resultBox || !resultValue || !resultInterpretation) return;
        
        resultValue.textContent = resultado.value.toFixed(2);
        resultInterpretation.textContent = resultado.interpretation;
        resultBox.classList.add('show');
        
        // Adicionar classe de cor baseada no resultado
        resultValue.style.color = getResultColor(resultado.value);
    }
    
    /**
     * Determina cor do resultado baseado no valor
     */
    function getResultColor(valor) {
        if (valor <= 10) return '#28a745'; // Verde
        if (valor <= 20) return '#ffc107'; // Amarelo
        return '#dc3545'; // Vermelho
    }
    
    /* ====================================
       GERAÇÃO DE PDF
       ==================================== */
    
    /**
     * Inicializa sistema de geração de PDF
     */
    function initPDFGeneration() {
        const pdfButton = document.getElementById('btn-generate-pdf');
        
        if (!pdfButton) return;
        
        pdfButton.addEventListener('click', () => {
            generatePDF();
        });
        
        console.log('✓ Sistema de PDF inicializado');
    }
    
    /**
     * Gera PDF com os resultados
     */
    function generatePDF() {
        // Verificar se resultado está disponível
        const resultBox = document.getElementById('result-box');
        if (!resultBox || !resultBox.classList.contains('show')) {
            showNotification('Por favor, realize o cálculo antes de gerar o PDF.', 'warning');
            return;
        }
        
        // TODO: Implementar geração de PDF com jsPDF ou similar
        // Exemplo básico:
        /*
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Resultado da Calculadora', 10, 10);
        
        doc.setFontSize(12);
        const resultValue = document.getElementById('result-value').textContent;
        const resultInterpretation = document.getElementById('result-interpretation').textContent;
        
        doc.text(`Valor: ${resultValue}`, 10, 30);
        doc.text(resultInterpretation, 10, 40, { maxWidth: 180 });
        
        doc.save('resultado-calculadora.pdf');
        */
        
        showNotification('Funcionalidade de PDF em desenvolvimento. Integre a biblioteca jsPDF para ativar.', 'info');
    }
    
    /* ====================================
       NOTIFICAÇÕES
       ==================================== */
    
    /**
     * Exibe notificação temporária
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'info' ? '#17a2b8' : type === 'warning' ? '#ffc107' : '#dc3545'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        `;
        
        const icon = type === 'info' ? 'fa-info-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle';
        notification.innerHTML = `
            <i class="fa-solid ${icon}" style="margin-right: 0.5rem;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    /* ====================================
       SMOOTH SCROLL
       ==================================== */
    
    /**
     * Inicializa smooth scroll para links internos
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /* ====================================
       EFEITOS VISUAIS INTERATIVOS
       ==================================== */
    
    /**
     * Adiciona efeito de parallax suave aos elementos
     */
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.tool-header, .info-card');
        
        if (!parallaxElements.length) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed) / 10;
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    /**
     * Adiciona efeito hover nos cards
     */
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.info-card, .related-card, .diagnosis-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }
    
    /**
     * Adiciona efeito ripple nos botões
     */
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn-action, .tab-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Adicionar CSS da animação se não existir
        if (!document.getElementById('ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
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
    }
    
    /* ====================================
       CONTADOR ANIMADO
       ==================================== */
    
    /**
     * Anima números do resultado
     */
    function animateNumber(element, finalValue, duration = 1000) {
        const startValue = 0;
        const increment = finalValue / (duration / 16); // 60fps
        let currentValue = startValue;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = currentValue.toFixed(2);
        }, 16);
    }
    
    /* ====================================
       UTILITÁRIOS
       ==================================== */
    
    /**
     * Debounce function para performance
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /* ====================================
       INICIALIZAÇÃO PRINCIPAL
       ==================================== */
    
    /**
     * Inicializa todos os sistemas quando DOM estiver pronto
     */
    function initialize() {
        console.log('🚀 Inicializando sistema de ferramenta...');
        
        // Inicializar todos os módulos
        initScrollAnimations();
        initTabSystem();
        initFormSystem();
        initPDFGeneration();
        initSmoothScroll();
        initCardHoverEffects();
        initRippleEffect();
        
        // Parallax com debounce para performance
        const debouncedParallax = debounce(initParallaxEffect, 100);
        debouncedParallax();
        
        console.log('✅ Sistema de ferramenta inicializado com sucesso!');
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    /* ====================================
       API PÚBLICA
       ==================================== */
    
    // Exportar funções úteis para uso externo
    window.ToolPageAPI = {
        showNotification,
        animateNumber,
        displayResult,
        validateField
    };
    
})();
