
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Indicium360",
          "url": "https://indiciumfin.github.io/indicium360/index.html",
          "logo": "https://indiciumfin.github.io/indicium360/assets/images/indicium360-logo.webp",
          "description": "Software de demonstrações financeiras com dashboards interativos.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "São Paulo",
            "addressRegion": "SP",
            "addressCountry": "BR"
          },
          "areaServed": "Brasil",
          "makesOffer": {
            "@type": "OfferCatalog",
            "name": "Serviços Financeiros",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Relatórios Contábeis"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Dashboards Interativos"
                }
              }
            ]
          }
        }
    

        // Inicialização do AOS
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        });

        // Accessibility Widget Controller
        class AccessibilityController {
            constructor() {
                this.settings = {
                    fontSize: 'normal',
                    textStyle: 'normal',
                    lineHeight: 'normal',
                    letterSpacing: 'normal',
                    readingMode: false,
                    readingMask: 'off',
                    readingGuide: 'off',
                    highlightLinks: false,
                    magnifier: false,
                    contrast: 'normal',
                    saturation: 'normal',
                    bigCursor: false,
                    pageStructure: false,
                    highlightTitles: false,
                    pauseAnimations: false,
                    hideImages: false,
                    colorblind: 'normal',
                    dyslexia: 'normal',
                    virtualKeyboard: false,
                    textReader: 'off'
                };
                
                this.speechSynthesis = window.speechSynthesis;
                this.currentUtterance = null;
                this.readingSpeed = 1;
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.loadSettings();
                this.setupTextReader();
                this.setupMagnifier();
                this.setupReadingGuide();
                this.setupVirtualKeyboard();
            }

            bindEvents() {
                // Toggle menu
                document.getElementById('accessibility-button').addEventListener('click', () => {
                    this.toggleMenu();
                });

                document.getElementById('accessibility-backdrop').addEventListener('click', () => {
                    this.closeMenu();
                });

                document.querySelector('.accessibility-close').addEventListener('click', () => {
                    this.closeMenu();
                });

                // Control buttons
                document.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const action = e.target.dataset.action;
                        const value = e.target.dataset.value;
                        this.handleAction(action, value, e.target);
                    });
                });

                // Toggle switches
                document.querySelectorAll('.accessibility-toggle').forEach(toggle => {
                    toggle.addEventListener('click', (e) => {
                        const action = e.target.dataset.action;
                        this.handleToggle(action, e.target);
                    });
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    this.handleKeyboardShortcuts(e);
                });
            }

            toggleMenu() {
                const backdrop = document.getElementById('accessibility-backdrop');
                const menu = document.getElementById('accessibility-menu');
                
                backdrop.classList.toggle('open');
                menu.classList.toggle('open');
            }

            closeMenu() {
                const backdrop = document.getElementById('accessibility-backdrop');
                const menu = document.getElementById('accessibility-menu');
                
                backdrop.classList.remove('open');
                menu.classList.remove('open');
            }

            handleAction(action, value, button) {
                switch (action) {
                    case 'font-size':
                        this.setFontSize(value, button);
                        break;
                    case 'text-style':
                        this.setTextStyle(value, button);
                        break;
                    case 'line-height':
                        this.setLineHeight(value, button);
                        break;
                    case 'letter-spacing':
                        this.setLetterSpacing(value, button);
                        break;
                    case 'text-reader':
                        this.setTextReader(value, button);
                        break;
                    case 'reading-mask':
                        this.setReadingMask(value, button);
                        break;
                    case 'reading-guide':
                        this.setReadingGuide(value, button);
                        break;
                    case 'contrast':
                        this.setContrast(value, button);
                        break;
                    case 'saturation':
                        this.setSaturation(value, button);
                        break;
                    case 'colorblind':
                        this.setColorblind(value, button);
                        break;
                    case 'dyslexia':
                        this.setDyslexia(value, button);
                        break;
                    case 'show-shortcuts':
                        this.showShortcuts();
                        break;
                }
                
                this.saveSettings();
            }

            handleToggle(action, toggle) {
                const isActive = toggle.classList.contains('active');
                
                switch (action) {
                    case 'reading-mode':
                        this.toggleReadingMode(!isActive, toggle);
                        break;
                    case 'highlight-links':
                        this.toggleHighlightLinks(!isActive, toggle);
                        break;
                    case 'magnifier':
                        this.toggleMagnifier(!isActive, toggle);
                        break;
                    case 'big-cursor':
                        this.toggleBigCursor(!isActive, toggle);
                        break;
                    case 'page-structure':
                        this.togglePageStructure(!isActive, toggle);
                        break;
                    case 'highlight-titles':
                        this.toggleHighlightTitles(!isActive, toggle);
                        break;
                    case 'pause-animations':
                        this.togglePauseAnimations(!isActive, toggle);
                        break;
                    case 'hide-images':
                        this.toggleHideImages(!isActive, toggle);
                        break;
                    case 'virtual-keyboard':
                        this.toggleVirtualKeyboard(!isActive, toggle);
                        break;
                }
                
                this.saveSettings();
            }

            setFontSize(value, button) {
                // Remove active class from siblings
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Remove existing font size classes
                document.body.classList.remove('zoom-120', 'zoom-150', 'zoom-200');
                
                if (value !== 'reset') {
                    document.body.classList.add(`zoom-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.fontSize = value;
            }

            setTextStyle(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('serif-font', 'bold-text', 'serif-bold');
                
                if (value !== 'reset') {
                    document.body.classList.add(`${value}-font`);
                    button.classList.add('active');
                }
                
                this.settings.textStyle = value;
            }

            setLineHeight(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('line-height-120', 'line-height-150', 'line-height-200');
                
                if (value !== 'reset') {
                    document.body.classList.add(`line-height-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.lineHeight = value;
            }

            setLetterSpacing(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('letter-spacing-120', 'letter-spacing-150', 'letter-spacing-200');
                
                if (value !== 'reset') {
                    document.body.classList.add(`letter-spacing-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.letterSpacing = value;
            }

            setTextReader(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                if (value === 'stop') {
                    this.stopReading();
                } else {
                    this.readingSpeed = value === 'fast' ? 1.5 : value === 'slow' ? 0.5 : 1;
                    button.classList.add('active');
                }
                
                this.settings.textReader = value;
            }

            setReadingMask(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('reading-mask-on', 'reading-mask-small', 'reading-mask-medium', 'reading-mask-large');
                
                if (value !== 'off') {
                    document.body.classList.add('reading-mask-on', `reading-mask-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.readingMask = value;
            }

            setReadingGuide(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                const guide = document.getElementById('reading-guide');
                document.body.classList.remove('reading-guide-active');
                guide.classList.remove('reading-guide-orange', 'reading-guide-yellow', 'reading-guide-black');
                
                if (value !== 'off') {
                    document.body.classList.add('reading-guide-active');
                    guide.classList.add(`reading-guide-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.readingGuide = value;
            }

            setContrast(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('high-contrast');
                document.body.style.filter = '';
                
                if (value === 'high') {
                    document.body.classList.add('high-contrast');
                    button.classList.add('active');
                } else if (value === 'invert') {
                    document.body.style.filter = 'invert(1)';
                    button.classList.add('active');
                }
                
                this.settings.contrast = value;
            }

            setSaturation(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('low-saturation', 'high-saturation', 'monochrome');
                
                if (value !== 'reset') {
                    const className = value === 'low' ? 'low-saturation' : 
                                    value === 'high' ? 'high-saturation' : 'monochrome';
                    document.body.classList.add(className);
                    button.classList.add('active');
                }
                
                this.settings.saturation = value;
            }

            setColorblind(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
                
                if (value !== 'reset') {
                    document.body.classList.add(value);
                    button.classList.add('active');
                }
                
                this.settings.colorblind = value;
            }

            setDyslexia(value, button) {
                button.parentElement.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.body.classList.remove('dyslexia-regular', 'dyslexia-sylexiad');
                
                if (value !== 'reset') {
                    document.body.classList.add(`dyslexia-${value}`);
                    button.classList.add('active');
                }
                
                this.settings.dyslexia = value;
            }

            toggleReadingMode(active, toggle) {
                if (active) {
                    document.body.classList.add('reading-mode');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('reading-mode');
                    toggle.classList.remove('active');
                }
                
                this.settings.readingMode = active;
            }

            toggleHighlightLinks(active, toggle) {
                if (active) {
                    document.body.classList.add('highlight-links');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('highlight-links');
                    toggle.classList.remove('active');
                }
                
                this.settings.highlightLinks = active;
            }

            toggleMagnifier(active, toggle) {
                if (active) {
                    document.body.classList.add('magnifier-active');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('magnifier-active');
                    toggle.classList.remove('active');
                }
                
                this.settings.magnifier = active;
            }

            toggleBigCursor(active, toggle) {
                if (active) {
                    document.body.classList.add('big-cursor');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('big-cursor');
                    toggle.classList.remove('active');
                }
                
                this.settings.bigCursor = active;
            }

            togglePageStructure(active, toggle) {
                if (active) {
                    document.body.classList.add('page-structure-active');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('page-structure-active');
                    toggle.classList.remove('active');
                }
                
                this.settings.pageStructure = active;
            }

            toggleHighlightTitles(active, toggle) {
                if (active) {
                    document.body.classList.add('highlight-titles');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('highlight-titles');
                    toggle.classList.remove('active');
                }
                
                this.settings.highlightTitles = active;
            }

            togglePauseAnimations(active, toggle) {
                if (active) {
                    document.body.classList.add('pause-animations');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('pause-animations');
                    toggle.classList.remove('active');
                }
                
                this.settings.pauseAnimations = active;
            }

            toggleHideImages(active, toggle) {
                if (active) {
                    document.body.classList.add('hide-images');
                    toggle.classList.add('active');
                } else {
                    document.body.classList.remove('hide-images');
                    toggle.classList.remove('active');
                }
                
                this.settings.hideImages = active;
            }

            toggleVirtualKeyboard(active, toggle) {
                const keyboard = document.getElementById('virtual-keyboard');
                
                if (active) {
                    keyboard.classList.add('active');
                    toggle.classList.add('active');
                } else {
                    keyboard.classList.remove('active');
                    toggle.classList.remove('active');
                }
                
                this.settings.virtualKeyboard = active;
            }

            setupTextReader() {
                document.addEventListener('click', (e) => {
                    if (this.settings.textReader !== 'off' && this.settings.textReader !== 'stop') {
                        const text = e.target.textContent || e.target.alt || '';
                        if (text.trim()) {
                            this.readText(text);
                        }
                    }
                });
            }

            readText(text) {
                this.stopReading();
                
                this.currentUtterance = new SpeechSynthesisUtterance(text);
                this.currentUtterance.rate = this.readingSpeed;
                this.currentUtterance.lang = 'pt-BR';
                
                this.speechSynthesis.speak(this.currentUtterance);
            }

            stopReading() {
                if (this.speechSynthesis.speaking) {
                    this.speechSynthesis.cancel();
                }
            }

            setupMagnifier() {
                const lens = document.getElementById('magnifier-lens');
                
                document.addEventListener('mousemove', (e) => {
                    if (this.settings.magnifier) {
                        lens.style.left = (e.clientX - 50) + 'px';
                        lens.style.top = (e.clientY - 50) + 'px';
                        lens.style.display = 'block';
                    } else {
                        lens.style.display = 'none';
                    }
                });
            }

            setupReadingGuide() {
                const guide = document.getElementById('reading-guide');
                
                document.addEventListener('mousemove', (e) => {
                    if (this.settings.readingGuide !== 'off') {
                        guide.style.top = (e.clientY - 15) + 'px';
                    }
                });
            }

            setupVirtualKeyboard() {
                document.querySelectorAll('.keyboard-key').forEach(key => {
                    key.addEventListener('click', (e) => {
                        const keyValue = e.target.dataset.key;
                        const activeElement = document.activeElement;
                        
                        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                            if (keyValue === 'Backspace') {
                                const start = activeElement.selectionStart;
                                const end = activeElement.selectionEnd;
                                const value = activeElement.value;
                                activeElement.value = value.slice(0, start - 1) + value.slice(end);
                                activeElement.setSelectionRange(start - 1, start - 1);
                            } else if (keyValue === 'Enter') {
                                activeElement.value += '\n';
                            } else {
                                const start = activeElement.selectionStart;
                                const end = activeElement.selectionEnd;
                                const value = activeElement.value;
                                activeElement.value = value.slice(0, start) + keyValue + value.slice(end);
                                activeElement.setSelectionRange(start + keyValue.length, start + keyValue.length);
                            }
                        }
                    });
                });
            }

            showShortcuts() {
                const modal = document.getElementById('shortcuts-modal');
                modal.classList.add('active');
                
                // Close modal events
                const closeBtn = modal.querySelector('.shortcuts-close');
                const closeModal = () => {
                    modal.classList.remove('active');
                };
                
                closeBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal();
                    }
                });
            }

            handleKeyboardShortcuts(e) {
                // Alt + A: Open accessibility menu
                if (e.altKey && e.key === 'a') {
                    e.preventDefault();
                    this.toggleMenu();
                }
                
                // Esc: Close accessibility menu
                if (e.key === 'Escape') {
                    this.closeMenu();
                    document.getElementById('shortcuts-modal').classList.remove('active');
                }
            }

            saveSettings() {
                localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
            }

            loadSettings() {
                const saved = localStorage.getItem('accessibility-settings');
                if (saved) {
                    this.settings = { ...this.settings, ...JSON.parse(saved) };
                    this.applySettings();
                }
            }

            applySettings() {
                // Apply all saved settings
                Object.keys(this.settings).forEach(key => {
                    const value = this.settings[key];
                    
                    switch (key) {
                        case 'fontSize':
                            if (value !== 'normal' && value !== 'reset') {
                                document.body.classList.add(`zoom-${value}`);
                            }
                            break;
                        case 'textStyle':
                            if (value !== 'normal' && value !== 'reset') {
                                document.body.classList.add(`${value}-font`);
                            }
                            break;
                        case 'lineHeight':
                            if (value !== 'normal' && value !== 'reset') {
                                document.body.classList.add(`line-height-${value}`);
                            }
                            break;
                        case 'letterSpacing':
                            if (value !== 'normal' && value !== 'reset') {
                                document.body.classList.add(`letter-spacing-${value}`);
                            }
                            break;
                        case 'readingMode':
                            if (value) {
                                document.body.classList.add('reading-mode');
                            }
                            break;
                        case 'highlightLinks':
                            if (value) {
                                document.body.classList.add('highlight-links');
                            }
                            break;
                        case 'magnifier':
                            if (value) {
                                document.body.classList.add('magnifier-active');
                            }
                            break;
                        case 'bigCursor':
                            if (value) {
                                document.body.classList.add('big-cursor');
                            }
                            break;
                        case 'pageStructure':
                            if (value) {
                                document.body.classList.add('page-structure-active');
                            }
                            break;
                        case 'highlightTitles':
                            if (value) {
                                document.body.classList.add('highlight-titles');
                            }
                            break;
                        case 'pauseAnimations':
                            if (value) {
                                document.body.classList.add('pause-animations');
                            }
                            break;
                        case 'hideImages':
                            if (value) {
                                document.body.classList.add('hide-images');
                            }
                            break;
                        case 'virtualKeyboard':
                            if (value) {
                                document.getElementById('virtual-keyboard').classList.add('active');
                            }
                            break;
                    }
                });
                
                // Update UI to reflect current settings
                this.updateUI();
            }

            updateUI() {
                // Update buttons and toggles to reflect current settings
                document.querySelectorAll('.accessibility-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.querySelectorAll('.accessibility-toggle').forEach(toggle => {
                    toggle.classList.remove('active');
                });
                
                // Set active states based on current settings
                Object.keys(this.settings).forEach(key => {
                    const value = this.settings[key];
                    
                    if (typeof value === 'boolean' && value) {
                        const toggle = document.querySelector(`[data-action="${this.camelToKebab(key)}"]`);
                        if (toggle && toggle.classList.contains('accessibility-toggle')) {
                            toggle.classList.add('active');
                        }
                    } else if (typeof value === 'string' && value !== 'normal' && value !== 'reset' && value !== 'off') {
                        const button = document.querySelector(`[data-action="${this.camelToKebab(key)}"][data-value="${value}"]`);
                        if (button) {
                            button.classList.add('active');
                        }
                    }
                });
            }

            camelToKebab(str) {
                return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            }
        }

        // Initialize accessibility controller
        const accessibilityController = new AccessibilityController();

        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            // Add mobile menu functionality here
            console.log('Mobile menu clicked');
        });

        // Language selector
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('[data-lang]').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                // Add language switching functionality here
                console.log('Language changed to:', this.dataset.lang);
            });
        });

        // Hero animation (simple canvas animation)
        const canvas = document.getElementById('hero-animation-canvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Simple floating particles animation
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < 50; i++) {
                const x = (Math.sin(time + i) * 100) + canvas.width / 2;
                const y = (Math.cos(time + i * 0.5) * 50) + canvas.height / 2;
                const size = Math.sin(time + i) * 2 + 3;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(46, 196, 182, ${0.1 + Math.sin(time + i) * 0.1})`;
                ctx.fill();
            }
            
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        // Form submission
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            alert('Mensagem enviada com sucesso!');
        });
    
