/**
 * ============================================================
 * CALCULADORA DE SUPERFÍCIE CORPORAL (MOSTELLER)
 * ============================================================
 * Módulo específico para cálculo de superfície corporal
 * Versão: 2.1.0
 * Última Atualização: 29/11/2025
 * ============================================================
 */

(function() {
    'use strict';
    
    // Unidades atuais (padrão: métrico)
    let unidadesPeso = 'kg'; // 'kg' ou 'lb'
    let unidadesAltura = 'cm'; // 'cm' ou 'in'
    
    // Histórico de cálculos (máximo 3)
    let historicoCalculos = JSON.parse(localStorage.getItem('historico-superficie-corporal') || '[]');
    
    // Dark mode state
    let darkMode = localStorage.getItem('dark-mode-superficie-corporal') === 'true';
    
    // Limites de segurança (Range Checks)
    const LIMITES_SEGURANCA = {
        peso: { min: 0.5, max: 300, avisoMin: 3, avisoMax: 200 },
        altura: { min: 30, max: 250, avisoMin: 50, avisoMax: 220 }
    }
    
    /**
     * Configuração da Calculadora de Superfície Corporal
     */
    const calculatorConfig = {
        name: 'superficie-corporal',
        title: 'Calculadora de Superfície Corporal (Mosteller)',
        filename: 'superficie-corporal',
        breadcrumb: [
            { texto: 'Início', url: 'https://www.calculadorasdeenfermagem.com.br/' },
            { texto: 'Calculadoras', url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras' },
            { texto: 'Superfície Corporal', url: null }
        ],
        // Dados para Tags e Ferramentas Relacionadas
        relatedToolsData: {
            tags: [
                'Superfície Corporal',
                'Quimioterapia',
                'Dosagem Medicamentosa',
                'Oncologia',
                'Fórmula de Mosteller',
                'BSA',
                'Enfermagem Oncológica',
                'Cálculos Clínicos'
            ],
            ferramentas: [
                {
                    titulo: 'Calculadora de TFG',
                    descricao: 'Calcule a Taxa de Filtração Glomerular para avaliar função renal',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/tfg',
                    gradient: 'from-green-50 to-emerald-50',
                    iconBg: 'bg-green-100',
                    icon: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de TIMI',
                    descricao: 'Avalie o risco em síndrome coronariana aguda',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/timi',
                    gradient: 'from-red-50 to-pink-50',
                    iconBg: 'bg-red-100',
                    icon: `<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de Wells (TEP)',
                    descricao: 'Escore para avaliação de risco de tromboembolismo pulmonar',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/wells-tep',
                    gradient: 'from-blue-50 to-cyan-50',
                    iconBg: 'bg-blue-100',
                    icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>`
                },
                {
                    titulo: 'Escala de Wells (TVP)',
                    descricao: 'Escore para avaliação de risco de trombose venosa profunda',
                    url: 'https://www.calculadorasdeenfermagem.com.br/calculadoras/wells-tvp',
                    gradient: 'from-purple-50 to-indigo-50',
                    iconBg: 'bg-purple-100',
                    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>`
                }
            ]
        },
        // Configuração das Abas
        tabsConfig: {
            descricao: 'A <strong>Superfície Corporal (SC)</strong> é uma medida calculada a partir do peso e altura do paciente, utilizada principalmente para ajuste de doses de medicamentos quimioterápicos, cálculo de índices hemodinâmicos (índice cardíaco, débito cardíaco indexado) e avaliação de função renal. A <strong>fórmula de Mosteller</strong> é amplamente reconhecida por sua simplicidade e precisão.',
            formula: {
                titulo: 'Fórmula de Mosteller',
                label: 'Superfície Corporal (m²) =',
                equacao: '√[(Peso × Altura) / 3600]',
                observacao: 'Peso em kg, Altura em cm'
            },
            aplicacaoQuimioterapia: {
                titulo: '✓ Aplicação em Quimioterapia',
                descricao: 'A superfície corporal é fundamental para calcular doses de medicamentos quimioterápicos de forma segura e eficaz.',
                formula: 'Dose (mg) = Dose prescrita (mg/m²) × SC (m²)',
                exemplo: 'Exemplo: Para uma dose prescrita de 100 mg/m² e SC de 1,82 m²:<br><strong>Dose total = 100 × 1,82 = 182 mg</strong>'
            },
            valoresReferencia: [
                { label: 'Recém-nascido', valor: '0,25 m²' },
                { label: 'Criança 2 anos', valor: '0,5 m²' },
                { label: 'Criança 9 anos', valor: '1,07 m²' },
                { label: 'Mulher adulta', valor: '1,6 m²' },
                { label: 'Homem adulto', valor: '1,9 m²' }
            ],
            consideracoes: [
                'A SC é mais precisa que o peso isolado para ajuste de doses',
                'Em obesidade mórbida, pode superestimar a SC real',
                'Sempre verificar protocolos institucionais para quimioterapia'
            ],
            referencias: [
                {
                    autores: 'Mosteller RD',
                    titulo: 'Simplified calculation of body-surface area',
                    publicacao: 'N Engl J Med',
                    ano: '1987',
                    detalhes: '317(17):1098',
                    doi: '10.1056/NEJM198710223171717'
                },
                {
                    autores: 'DuBois D, DuBois EF',
                    titulo: 'A formula to estimate the approximate surface area if height and weight be known',
                    publicacao: 'Arch Intern Med',
                    ano: '1916',
                    detalhes: '17:863-871'
                },
                {
                    autores: 'Ministério da Saúde (BR)',
                    titulo: 'Protocolo de Segurança na Prescrição, Uso e Administração de Medicamentos',
                    publicacao: 'Brasília: Ministério da Saúde',
                    ano: '2013',
                    link: 'https://bvsms.saude.gov.br/bvs/publicacoes/protocolo_seguranca_prescricao_uso_administracao_medicamentos.pdf'
                }
            ],
            versao: '2.1.0',
            ultimaAtualizacao: '29/11/2025',
            desenvolvedor: 'Calculadoras de Enfermagem'
        }
    };
    
    /**
     * Alterna unidades de peso
     */
    function toggleUnidadesPeso() {
        const input = document.getElementById('peso');
        const label = document.getElementById('label-peso');
        const btn = document.getElementById('btn-toggle-peso');
        
        if (unidadesPeso === 'kg') {
            unidadesPeso = 'lb';
            label.innerHTML = 'Peso (<span id="unidade-peso">lb</span>)';
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            `;
            btn.setAttribute('title', 'Alternar para kg');
            if (input.value) {
                input.value = (parseFloat(input.value) * 2.20462).toFixed(1);
            }
        } else {
            unidadesPeso = 'kg';
            label.innerHTML = 'Peso (<span id="unidade-peso">kg</span>)';
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            `;
            btn.setAttribute('title', 'Alternar para lb');
            if (input.value) {
                input.value = (parseFloat(input.value) / 2.20462).toFixed(1);
            }
        }
    }
    
    /**
     * Alterna unidades de altura
     */
    function toggleUnidadesAltura() {
        const input = document.getElementById('altura');
        const label = document.getElementById('label-altura');
        const btn = document.getElementById('btn-toggle-altura');
        
        if (unidadesAltura === 'cm') {
            unidadesAltura = 'in';
            label.innerHTML = 'Altura (<span id="unidade-altura">in</span>)';
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            `;
            btn.setAttribute('title', 'Alternar para cm');
            if (input.value) {
                input.value = (parseFloat(input.value) / 2.54).toFixed(1);
            }
        } else {
            unidadesAltura = 'cm';
            label.innerHTML = 'Altura (<span id="unidade-altura">cm</span>)';
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            `;
            btn.setAttribute('title', 'Alternar para in');
            if (input.value) {
                input.value = (parseFloat(input.value) * 2.54).toFixed(1);
            }
        }
    }
    
    /**
     * Calcula idade a partir da data de nascimento
     */
    function calcularIdade() {
        const dataNascInput = document.getElementById('dataNascimento').value;
        const idadeDisplay = document.getElementById('idade-display');
        
        if (!dataNascInput) {
            idadeDisplay.innerHTML = '';
            return;
        }
        
        const hoje = new Date();
        const nascimento = new Date(dataNascInput + 'T00:00:00');
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        if (idade >= 0) {
            idadeDisplay.innerHTML = `<span class="text-red-600 font-semibold text-sm">Idade: ${idade} anos</span>`;
        } else {
            idadeDisplay.innerHTML = `<span class="text-red-600 font-semibold text-sm">Data inválida</span>`;
        }
    }
    
    /**
     * Valida valor com travas de segurança (Range Checks)
     * @param {number} valor - Valor a ser validado
     * @param {string} tipo - 'peso' ou 'altura'
     * @param {HTMLElement} inputElement - Elemento do input
     * @returns {object} - {valido: boolean, mensagem: string, nivel: 'erro'|'aviso'|'ok'}
     */
    function validarComSeguranca(valor, tipo, inputElement) {
        const limites = LIMITES_SEGURANCA[tipo];
        const container = inputElement.parentElement;
        let avisoDiv = container.querySelector('.aviso-validacao');
        
        // Remove aviso anterior
        if (avisoDiv) {
            avisoDiv.remove();
        }
        
        // Validação crítica (erro)
        if (valor < limites.min || valor > limites.max) {
            mostrarAviso(container, `Valor fora do limite válido (${limites.min} - ${limites.max} ${tipo === 'peso' ? 'kg' : 'cm'})`, 'erro');
            return { valido: false, mensagem: `Valor fora do limite válido`, nivel: 'erro' };
        }
        
        // Validação de aviso (valores incomuns)
        if (valor < limites.avisoMin || valor > limites.avisoMax) {
            const unidade = tipo === 'peso' ? 'kg' : 'cm';
            mostrarAviso(container, `⚠️ Valor incomum detectado. Verifique se está correto em ${unidade}.`, 'aviso');
            return { valido: true, mensagem: `Valor incomum`, nivel: 'aviso' };
        }
        
        return { valido: true, mensagem: 'OK', nivel: 'ok' };
    }
    
    /**
     * Mostra aviso visual de validação
     */
    function mostrarAviso(container, mensagem, nivel) {
        const avisoDiv = document.createElement('div');
        avisoDiv.className = `aviso-validacao mt-2 p-3 rounded-lg flex items-start gap-2 ${
            nivel === 'erro' ? 'bg-red-100 border border-red-300' : 'bg-yellow-100 border border-yellow-300'
        }`;
        
        avisoDiv.innerHTML = `
            <svg class="w-5 h-5 ${nivel === 'erro' ? 'text-red-600' : 'text-yellow-600'} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span class="text-sm ${nivel === 'erro' ? 'text-red-800' : 'text-yellow-800'}">${mensagem}</span>
        `;
        
        container.appendChild(avisoDiv);
    }
    
    /**
     * Abre modal de conversor de unidades (peso e altura)
     */
    function abrirConversorUnidades() {
        // Verifica se já está no sistema internacional
        if (unidadesPeso === 'kg' && unidadesAltura === 'cm') {
            alert('Você já está usando o Sistema Internacional (kg, cm). Não é necessário converter.');
            return;
        }
        
        // Cria o modal se não existir
        let modal = document.getElementById('modal-conversor-unidades');
        if (!modal) {
            const modalHTML = `
                <div id="modal-conversor-unidades" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style="display: none;">
                    <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-bold" style="color: #1A3E74;">Conversor de Unidades</h3>
                            <button id="btn-fechar-conversor-unidades" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p class="text-sm text-gray-700">
                                <strong>Conversão de Unidades:</strong> Converta facilmente entre kg ↔ lb e cm ↔ in.
                            </p>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Conversor de Peso -->
                            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 class="font-semibold text-gray-800 mb-3">Peso</h4>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="text-xs text-gray-600 mb-1 block">Quilogramas (kg)</label>
                                        <input type="number" id="conv-peso-kg" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.0" step="0.1">
                                    </div>
                                    <div>
                                        <label class="text-xs text-gray-600 mb-1 block">Libras (lb)</label>
                                        <input type="number" id="conv-peso-lb" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.0" step="0.1">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Conversor de Altura -->
                            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 class="font-semibold text-gray-800 mb-3">Altura</h4>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="text-xs text-gray-600 mb-1 block">Centímetros (cm)</label>
                                        <input type="number" id="conv-altura-cm" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.0" step="0.1">
                                    </div>
                                    <div>
                                        <label class="text-xs text-gray-600 mb-1 block">Polegadas (in)</label>
                                        <input type="number" id="conv-altura-in" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.0" step="0.1">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6 flex gap-3">
                            <button 
                                id="btn-aplicar-conversao"
                                class="flex-1 bg-[#1A3E74] text-white py-3 px-4 rounded-lg hover:bg-[#2a5a9e] transition duration-300 font-semibold"
                            >
                                Aplicar Valores
                            </button>
                            <button 
                                id="btn-cancelar-conversao"
                                class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('modal-conversor-unidades');
            
            // Event listeners para conversão em tempo real
            const convPesoKg = document.getElementById('conv-peso-kg');
            const convPesoLb = document.getElementById('conv-peso-lb');
            const convAlturaCm = document.getElementById('conv-altura-cm');
            const convAlturaIn = document.getElementById('conv-altura-in');
            
            convPesoKg.addEventListener('input', (e) => {
                const kg = parseFloat(e.target.value);
                if (!isNaN(kg)) {
                    convPesoLb.value = (kg * 2.20462).toFixed(1);
                }
            });
            
            convPesoLb.addEventListener('input', (e) => {
                const lb = parseFloat(e.target.value);
                if (!isNaN(lb)) {
                    convPesoKg.value = (lb / 2.20462).toFixed(1);
                }
            });
            
            convAlturaCm.addEventListener('input', (e) => {
                const cm = parseFloat(e.target.value);
                if (!isNaN(cm)) {
                    convAlturaIn.value = (cm / 2.54).toFixed(1);
                }
            });
            
            convAlturaIn.addEventListener('input', (e) => {
                const inches = parseFloat(e.target.value);
                if (!isNaN(inches)) {
                    convAlturaCm.value = (inches * 2.54).toFixed(1);
                }
            });
            
            // Botões
            document.getElementById('btn-fechar-conversor-unidades').addEventListener('click', fecharConversorUnidades);
            document.getElementById('btn-cancelar-conversao').addEventListener('click', fecharConversorUnidades);
            document.getElementById('btn-aplicar-conversao').addEventListener('click', aplicarConversaoUnidades);
            
            // ESC para fechar
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    fecharConversorUnidades();
                }
            });
            
            // Clique fora para fechar
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    fecharConversorUnidades();
                }
            });
            
            // Navegação por teclado (TAB)
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll('input, button');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
        
        modal.style.display = 'flex';
        // Foco no primeiro input
        setTimeout(() => {
            document.getElementById('conv-peso-kg').focus();
        }, 100);
    }
    
    /**
     * Fecha modal de conversor de unidades
     */
    function fecharConversorUnidades() {
        const modal = document.getElementById('modal-conversor-unidades');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * Aplica valores do conversor aos campos do formulário
     */
    function aplicarConversaoUnidades() {
        const pesoKg = document.getElementById('conv-peso-kg').value;
        const alturaCm = document.getElementById('conv-altura-cm').value;
        
        if (pesoKg) {
            document.getElementById('peso').value = pesoKg;
        }
        
        if (alturaCm) {
            document.getElementById('altura').value = alturaCm;
        }
        
        fecharConversorUnidades();
    }
    
    /**
     * Toggle Dark Mode
     */
    function toggleDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem('dark-mode-superficie-corporal', darkMode);
        aplicarDarkMode();
    }
    
    /**
     * Aplica dark mode às seções principais
     */
    function aplicarDarkMode() {
        const mainContent = document.getElementById('calculator-main-content');
        if (!mainContent) return;
        
        if (darkMode) {
            mainContent.classList.add('dark-mode');
            // Atualiza cores do body
            document.body.style.backgroundColor = '#1a202c';
        } else {
            mainContent.classList.remove('dark-mode');
            document.body.style.backgroundColor = '';
        }
        
        // Atualiza ícone do botão
        const btnDarkMode = document.getElementById('btn-toggle-dark-mode');
        if (btnDarkMode) {
            btnDarkMode.innerHTML = darkMode ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span class="ml-2">Modo Claro</span>
            ` : `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <span class="ml-2">Modo Noturno</span>
            `;
        }
    }
    
    /**
     * Adiciona cálculo ao histórico
     */
    function adicionarAoHistorico(calculo) {
        historicoCalculos.unshift(calculo);
        if (historicoCalculos.length > 3) {
            historicoCalculos = historicoCalculos.slice(0, 3);
        }
        localStorage.setItem('historico-superficie-corporal', JSON.stringify(historicoCalculos));
        renderizarHistorico();
    }
    
    /**
     * Renderiza o histórico de cálculos
     */
    function renderizarHistorico() {
        const container = document.getElementById('historico-calculos-container');
        if (!container) return;
        
        if (historicoCalculos.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="text-sm">Nenhum cálculo recente</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="space-y-3">
                ${historicoCalculos.map((calc, index) => `
                    <div class="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer" onclick="SuperficieCorporalCalculator.carregarDoHistorico(${index})">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <p class="text-sm font-semibold text-gray-800">${calc.nome || 'Paciente'}</p>
                                <p class="text-xs text-gray-600 mt-1">SC: <strong>${calc.sc}</strong></p>
                                <p class="text-xs text-gray-500">Peso: ${calc.peso} | Altura: ${calc.altura}</p>
                            </div>
                            <div class="text-xs text-gray-400">
                                ${calc.data}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button 
                onclick="SuperficieCorporalCalculator.limparHistorico()"
                class="mt-3 w-full text-sm text-red-600 hover:text-red-800 font-semibold transition-colors duration-200"
            >
                Limpar Histórico
            </button>
        `;
    }
    
    /**
     * Carrega cálculo do histórico
     */
    function carregarDoHistorico(index) {
        const calc = historicoCalculos[index];
        if (!calc) return;
        
        document.getElementById('nomeCompleto').value = calc.nome || '';
        document.getElementById('peso').value = calc.pesoValor || '';
        document.getElementById('altura').value = calc.alturaValor || '';
        
        if (calc.dose) {
            document.getElementById('dosePrescrita').value = calc.doseValor || '';
        }
        
        alert('Dados carregados do histórico! Clique em "Calcular" para recalcular.');
    }
    
    /**
     * Limpa histórico
     */
    function limparHistorico() {
        if (confirm('Deseja realmente limpar todo o histórico de cálculos?')) {
            historicoCalculos = [];
            localStorage.removeItem('historico-superficie-corporal');
            renderizarHistorico();
        }
    }
    
    /**
     * Copia resultado formatado para área de transferência (Evolução)
     */
    function copiarParaEvolucao(sc, peso, altura, imc, nomeCompleto, dataNascimento, dosePrescrita) {
        const dataHora = new Date().toLocaleString('pt-BR');
        const nome = nomeCompleto || 'Paciente';
        const dataNasc = dataNascimento ? new Date(dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informada';
        
        let texto = `===== CÁLCULO DE SUPERFÍCIE CORPORAL (MOSTELLER) =====\n`;
        texto += `Data/Hora: ${dataHora}\n\n`;
        texto += `PACIENTE:\n`;
        texto += `Nome: ${nome}\n`;
        texto += `Data de Nascimento: ${dataNasc}\n\n`;
        texto += `PARÂMETROS:\n`;
        texto += `Peso: ${peso.toFixed(1)} kg\n`;
        texto += `Altura: ${altura.toFixed(1)} cm\n`;
        texto += `IMC: ${imc.toFixed(1)} kg/m²\n\n`;
        texto += `RESULTADO:\n`;
        texto += `Superfície Corporal: ${sc.toFixed(2)} m²\n`;
        
        if (dosePrescrita) {
            const doseTotal = (dosePrescrita * sc).toFixed(1);
            texto += `\nDOSE QUIMIOTERÁPICA:\n`;
            texto += `Dose Prescrita: ${dosePrescrita} mg/m²\n`;
            texto += `Dose Calculada: ${doseTotal} mg\n`;
        }
        
        texto += `\n✓ Cálculo realizado via www.calculadorasdeenfermagem.com.br\n`;
        texto += `⚠️ ATENÇÃO: Validar manualmente antes de qualquer decisão clínica.\n`;
        
        // Copia para clipboard
        navigator.clipboard.writeText(texto).then(() => {
            mostrarNotificacao('Texto copiado com sucesso! Cole na evolução do paciente.', 'sucesso');
        }).catch(() => {
            // Fallback para navegadores antigos
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            mostrarNotificacao('Texto copiado com sucesso! Cole na evolução do paciente.', 'sucesso');
        });
    }
    
    /**
     * Mostra notificação toast
     */
    function mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const cor = tipo === 'sucesso' ? 'bg-green-500' : tipo === 'aviso' ? 'bg-yellow-500' : 'bg-red-500';
        
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 ${cor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3`;
        toast.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${mensagem}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    /**
     * Renderiza o formulário da calculadora
     */
    function renderFormulario() {
        return `
            <!-- Barra de Ferramentas (Dark Mode + Histórico) -->
            <div class="mb-6 flex flex-wrap gap-3">
                <button 
                    type="button"
                    id="btn-toggle-dark-mode"
                    onclick="SuperficieCorporalCalculator.toggleDarkMode()"
                    class="flex items-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold text-sm"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <span class="ml-2">Modo Noturno</span>
                </button>
                
                <button 
                    type="button"
                    onclick="document.getElementById('historico-sidebar').classList.toggle('hidden')"
                    class="flex items-center px-4 py-3 bg-[#1A3E74] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200 font-semibold text-sm"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="ml-2">Histórico (últimos 3)</span>
                </button>
            </div>
            
            <!-- Histórico (Sidebar Colapsável) -->
            <div id="historico-sidebar" class="mb-6 bg-purple-50 rounded-lg p-5 border-2 border-purple-200 hidden">
                <h3 class="text-lg font-semibold mb-3 flex items-center" style="color: #1A3E74;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Últimos Cálculos
                </h3>
                <div id="historico-calculos-container"></div>
            </div>
            
            <!-- Seção: Declaração de Responsabilidade Técnica -->
            <div class="mb-6 bg-gray-50 rounded-lg p-5">
                <h2 class="text-lg font-semibold mb-3 flex items-center" style="color: #DC2626;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Declaração de Responsabilidade Técnica
                </h2>
                <div class="bg-white rounded-md p-4 border border-gray-200">
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>Aviso de Responsabilidade Técnica:</strong> Ferramenta de apoio clínico e educacional. O uso da(s) ferramenta(s) contidas no site www.calculadorasdeenfermagem.com.br não isenta o profissional da conferência manual e da responsabilidade ética sobre a validação do resultado que é exclusiva do Profissional de Enfermagem. Em caso de divergência, prevalece o protocolo institucional ao qual o profissional está subordinado e o julgamento clínico. Verifique sempre o resultado. Para mais informações acesse <a href="https://www.calculadorasdeenfermagem.com.br/notificacoes-legais.html" target="_blank" class="text-blue-600 hover:underline">Notificações Legais</a>.
                    </p>
                </div>
            </div>
            
            <!-- Seção: Dados do Paciente -->
            <div class="mb-6 bg-blue-50 rounded-lg p-5">
                <h2 class="text-xl font-semibold mb-4" style="color: #1A3E74;">
                    Dados do Paciente
                </h2>
                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label" for="nomeCompleto">Nome Completo</label>
                        <input 
                            type="text" 
                            id="nomeCompleto" 
                            class="form-input"
                            placeholder="Ex: João da Silva"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="dataNascimento">Data de Nascimento</label>
                        <input 
                            type="date" 
                            id="dataNascimento" 
                            class="form-input"
                            onchange="SuperficieCorporalCalculator.calcularIdade()"
                        >
                        <div id="idade-display" class="mt-2"></div>
                    </div>
                </div>
            </div>
            
            <!-- Seção: Parâmetros -->
            <div class="mb-6 bg-green-50 rounded-lg p-5">
                <h2 class="text-xl font-semibold mb-4" style="color: #1A3E74;">
                    Parâmetros
                </h2>
                <div class="space-y-4">
                    <div class="form-group">
                        <div class="flex items-center justify-between mb-1">
                            <label class="form-label mb-0" id="label-peso" for="peso">Peso (<span id="unidade-peso">kg</span>)</label>
                            <button 
                                type="button"
                                id="btn-toggle-peso"
                                onclick="SuperficieCorporalCalculator.toggleUnidadesPeso()"
                                class="bg-[#1A3E74] text-white px-2 py-1 rounded-md hover:bg-[#2a5a9e] transition-colors duration-200 flex items-center gap-1 text-xs"
                                title="Alternar para lb"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                            </button>
                        </div>
                        <input 
                            type="number" 
                            id="peso" 
                            class="form-input"
                            min="0" 
                            step="0.1"
                            placeholder="Ex: 70"
                        >
                    </div>
                    
                    <div class="form-group">
                        <div class="flex items-center justify-between mb-1">
                            <label class="form-label mb-0" id="label-altura" for="altura">Altura (<span id="unidade-altura">cm</span>)</label>
                            <button 
                                type="button"
                                id="btn-toggle-altura"
                                onclick="SuperficieCorporalCalculator.toggleUnidadesAltura()"
                                class="bg-[#1A3E74] text-white px-2 py-1 rounded-md hover:bg-[#2a5a9e] transition-colors duration-200 flex items-center gap-1 text-xs"
                                title="Alternar para in"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                            </button>
                        </div>
                        <input 
                            type="number" 
                            id="altura" 
                            class="form-input"
                            min="0" 
                            step="0.1"
                            placeholder="Ex: 170"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="dosePrescrita">Dose Prescrita (mg/m²)</label>
                        <input 
                            type="number" 
                            id="dosePrescrita" 
                            class="form-input"
                            min="0" 
                            step="0.1"
                            placeholder="Ex: 100"
                        >
                        <p class="text-xs text-gray-500 mt-1">Opcional: para cálculo de dose em quimioterapia</p>
                    </div>
                </div>
            </div>
            
            <!-- Seção: Declaração de Responsabilidade -->
            <div class="mb-6 bg-yellow-50 rounded-lg p-5">
                <h2 class="text-lg font-semibold mb-3 flex items-center" style="color: #D97706;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Declaração de Responsabilidade
                </h2>
                <label class="flex items-start p-3 rounded bg-white border border-yellow-300 cursor-pointer hover:bg-yellow-50 transition-colors duration-200">
                    <input 
                        type="checkbox" 
                        id="checkbox-aviso-legal" 
                        class="mr-3 mt-1 accent-[#1A3E74]"
                        onchange="SuperficieCorporalCalculator.toggleBotaoCalcular()"
                    >
                    <span class="text-sm font-medium text-gray-800">
                        Declaro que conferi os dados inseridos e sei que devo validar o resultado manualmente antes de qualquer decisão clínica.
                    </span>
                </label>
            </div>
            
            <!-- Botões -->
            <div class="space-y-4">
                <button 
                    id="btn-calcular"
                    onclick="SuperficieCorporalCalculator.calcular()" 
                    class="w-full bg-gray-400 text-white font-bold py-5 px-8 rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-3 cursor-not-allowed text-lg"
                    disabled
                >
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span>Calcular Superfície Corporal</span>
                </button>
                
                <button 
                    onclick="SuperficieCorporalCalculator.limpar()" 
                    class="w-full bg-gray-200 text-gray-800 font-bold py-5 px-8 rounded-xl hover:bg-gray-300 transition duration-300 shadow-lg flex items-center justify-center gap-3 text-lg"
                >
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Limpar Formulário</span>
                </button>
            </div>
        `;
    }
    
    /**
     * Toggle do botão Calcular baseado no checkbox
     */
    function toggleBotaoCalcular() {
        const checkbox = document.getElementById('checkbox-aviso-legal');
        const btn = document.getElementById('btn-calcular');
        
        if (checkbox.checked) {
            btn.disabled = false;
            btn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            btn.classList.add('bg-[#1A3E74]', 'hover:bg-[#152E5A]', 'cursor-pointer');
        } else {
            btn.disabled = true;
            btn.classList.add('bg-gray-400', 'cursor-not-allowed');
            btn.classList.remove('bg-[#1A3E74]', 'hover:bg-[#152E5A]', 'cursor-pointer');
        }
    }
    
    /**
     * Renderiza a sidebar (vazia neste caso, pois usa botão flutuante)
     */
    function renderSidebar() {
        return `<!-- Sidebar vazia - usando botão flutuante -->`;
    }
    
    /**
     * Função principal de cálculo
     */
    function calcular() {
        // Verifica checkbox
        const checkbox = document.getElementById('checkbox-aviso-legal');
        if (!checkbox.checked) {
            alert('Por favor, confirme que conferiu os dados antes de calcular.');
            return;
        }
        
        // Captura dados do paciente
        const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        
        // Captura parâmetros e converte para unidades métricas se necessário
        let peso = parseFloat(document.getElementById('peso').value);
        let altura = parseFloat(document.getElementById('altura').value);
        
        if (!peso || peso <= 0) {
            alert('Por favor, insira um peso válido.');
            return;
        }
        
        if (!altura || altura <= 0) {
            alert('Por favor, insira uma altura válida.');
            return;
        }
        
        // Converte para unidades métricas se necessário
        const pesoOriginal = peso;
        const alturaOriginal = altura;
        
        if (unidadesPeso === 'lb') {
            peso = peso / 2.20462;
        }
        
        if (unidadesAltura === 'in') {
            altura = altura * 2.54;
        }
        
        // ========== VALIDAÇÃO COM TRAVAS DE SEGURANÇA ==========
        const inputPeso = document.getElementById('peso');
        const inputAltura = document.getElementById('altura');
        
        const validacaoPeso = validarComSeguranca(peso, 'peso', inputPeso);
        const validacaoAltura = validarComSeguranca(altura, 'altura', inputAltura);
        
        // Se houver erro crítico, não prossegue
        if (!validacaoPeso.valido || !validacaoAltura.valido) {
            return;
        }
        
        // Se houver aviso, confirma com o usuário
        if (validacaoPeso.nivel === 'aviso' || validacaoAltura.nivel === 'aviso') {
            if (!confirm('Valores incomuns detectados. Deseja continuar com o cálculo?')) {
                return;
            }
        }
        
        // Captura dose prescrita (opcional)
        const dosePrescritaInput = document.getElementById('dosePrescrita').value;
        const dosePrescrita = dosePrescritaInput ? parseFloat(dosePrescritaInput) : null;
        
        // Cálculo da SC
        const sc = Math.sqrt((peso * altura) / 3600);
        const imc = peso / Math.pow(altura / 100, 2);
        
        // Armazena resultados
        const inputsData = {
            'Peso': `${peso.toFixed(1)} kg`,
            'Altura': `${altura.toFixed(1)} cm`,
            'IMC': `${imc.toFixed(1)} kg/m²`
        };
        
        if (dosePrescrita) {
            inputsData['Dose Prescrita'] = `${dosePrescrita} mg/m²`;
            inputsData['Dose Calculada'] = `${(dosePrescrita * sc).toFixed(1)} mg`;
        }
        
        CalculatorActions.setResults({
            paciente: {
                'Nome': nomeCompleto || 'Não informado',
                'Data de Nascimento': dataNascimento || 'Não informada'
            },
            inputs: inputsData,
            mainResult: `Superfície Corporal: ${sc.toFixed(2)} m²`,
            interpretation: `SC compatível com valores ${sc < 1.5 ? 'abaixo da média adulta' : sc <= 2.0 ? 'na média adulta' : 'acima da média adulta'}${dosePrescrita ? `. Dose calculada: ${(dosePrescrita * sc).toFixed(1)} mg` : ''}`
        });
        
        // ========== ADICIONA AO HISTÓRICO ==========
        const dataHora = new Date().toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        adicionarAoHistorico({
            nome: nomeCompleto || 'Paciente',
            peso: `${peso.toFixed(1)} kg`,
            pesoValor: pesoOriginal,
            altura: `${altura.toFixed(1)} cm`,
            alturaValor: alturaOriginal,
            sc: `${sc.toFixed(2)} m²`,
            dose: dosePrescrita ? `${(dosePrescrita * sc).toFixed(1)} mg` : null,
            doseValor: dosePrescrita,
            data: dataHora
        });
        
        // Exibe resultado
        exibirResultado(sc, peso, altura, imc, nomeCompleto, dataNascimento, dosePrescrita);
        
        // Registra auditoria
        const registro = AuditoriaCalculo.registrarCalculo({
            tipoCalculo: 'Superfície Corporal (Mosteller)',
            paciente: { nome: nomeCompleto, dataNascimento: dataNascimento },
            inputs: { 
                peso: peso.toFixed(1), 
                altura: altura.toFixed(1), 
                dosePrescrita: dosePrescrita || 'N/A'
            },
            resultado: sc,
            resumo: `SC: ${sc.toFixed(2)} m² (Peso: ${peso.toFixed(1)}kg, Altura: ${altura.toFixed(1)}cm)${dosePrescrita ? ` - Dose: ${(dosePrescrita * sc).toFixed(1)}mg` : ''}`
        });
        
        // Injeta seções modulares (após cálculo)
        CalculatorMain.injectModularSections({
            registro: registro,
            contextoClinico: `superfície corporal ${sc.toFixed(2)} m² quimioterapia dosagem`
        });
    }
    
    /**
     * Exibe o resultado formatado
     */
    function exibirResultado(sc, peso, altura, imc, nomeCompleto, dataNascimento, dosePrescrita) {
        const container = document.getElementById('calculator-result-content');
        
        let categoria, corCategoria;
        if (sc < 1.5) {
            categoria = 'SC abaixo da média adulta';
            corCategoria = '#F59E0B';
        } else if (sc <= 2.0) {
            categoria = 'SC média adulta';
            corCategoria = '#10B981';
        } else {
            categoria = 'SC acima da média adulta';
            corCategoria = '#F59E0B';
        }
        
        // Dados do paciente (se informados)
        const dadosPacienteHTML = (nomeCompleto || dataNascimento) ? `
            <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm font-semibold text-blue-900 mb-2">Dados do Paciente:</p>
                ${nomeCompleto ? `<p class="text-sm text-gray-700"><strong>Nome:</strong> ${nomeCompleto}</p>` : ''}
                ${dataNascimento ? `<p class="text-sm text-gray-700"><strong>Data de Nascimento:</strong> ${new Date(dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</p>` : ''}
            </div>
        ` : '';
        
        // Cálculo de dose (se fornecida)
        const doseCalculadaHTML = dosePrescrita ? `
            <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p class="text-sm font-semibold text-green-900 mb-2">Dose Calculada para Quimioterapia:</p>
                <p class="text-lg font-bold text-green-700">
                    ${(dosePrescrita * sc).toFixed(1)} mg
                </p>
                <p class="text-xs text-gray-600 mt-1">
                    Dose prescrita: ${dosePrescrita} mg/m² × SC: ${sc.toFixed(2)} m²
                </p>
            </div>
        ` : '';
        
        container.innerHTML = `
            ${dadosPacienteHTML}
            
            <div class="result-box">
                <p class="result-label">Superfície Corporal</p>
                <p class="result-value">${sc.toFixed(2)} m²</p>
                <div class="mt-4 p-3 rounded-lg" style="background-color: ${corCategoria}20;">
                    <p class="text-sm font-semibold" style="color: ${corCategoria};">
                        ${categoria}
                    </p>
                </div>
                <div class="mt-4 text-sm text-gray-600 text-left">
                    <p><strong>Peso:</strong> ${peso.toFixed(1)} kg</p>
                    <p><strong>Altura:</strong> ${altura.toFixed(1)} cm</p>
                    <p><strong>IMC:</strong> ${imc.toFixed(1)} kg/m²</p>
                </div>
                ${doseCalculadaHTML}
                
                <!-- Botão Copiar (FAT FINGER FRIENDLY) -->
                <button 
                    onclick="SuperficieCorporalCalculator.copiarParaEvolucao(${sc}, ${peso}, ${altura}, ${imc}, '${nomeCompleto}', '${dataNascimento}', ${dosePrescrita})"
                    class="mt-6 w-full bg-gradient-to-r from-[#1A3E74] to-[#2A5490] text-white font-bold py-5 px-8 rounded-xl hover:from-[#2A5490] hover:to-[#3A6AB0] transition duration-300 shadow-lg flex items-center justify-center gap-3 text-lg"
                >
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    <span>Copiar</span>
                </button>
            </div>
        `;
        
        CalculatorMain.showResults();
    }
    
    /**
     * Limpa o formulário
     */
    function limpar() {
        CalculatorActions.limparFormulario(
            ['nomeCompleto', 'dataNascimento', 'peso', 'altura', 'dosePrescrita', 'checkbox-aviso-legal'],
            ['calculator-result-content', 'idade-display']
        );
        
        // Reseta botão calcular
        toggleBotaoCalcular();
        
        // Reseta unidades
        unidadesPeso = 'kg';
        unidadesAltura = 'cm';
        document.getElementById('label-peso').innerHTML = 'Peso (<span id="unidade-peso">kg</span>)';
        document.getElementById('label-altura').innerHTML = 'Altura (<span id="unidade-altura">cm</span>)';
    }
    

    
    /**
     * Inicialização quando DOM estiver pronto
     */
    function init() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCalculator);
        } else {
            initializeCalculator();
        }
    }
    
    /**
     * Inicializa a calculadora
     */
    function initializeCalculator() {
        // Inicializa Calculator Main
        CalculatorMain.init(calculatorConfig);
        
        // Injeta conteúdo do formulário
        CalculatorMain.injectFormContent(renderFormulario);
        
        // Injeta conteúdo da sidebar
        CalculatorMain.injectSidebarContent(renderSidebar);
        
        // Aplica dark mode se estava ativo
        setTimeout(() => {
            aplicarDarkMode();
            renderizarHistorico();
            
            // Adiciona listeners para validação em tempo real
            const inputPeso = document.getElementById('peso');
            const inputAltura = document.getElementById('altura');
            
            if (inputPeso) {
                inputPeso.addEventListener('blur', function() {
                    const valor = parseFloat(this.value);
                    if (valor && !isNaN(valor)) {
                        let pesoKg = valor;
                        if (unidadesPeso === 'lb') {
                            pesoKg = valor / 2.20462;
                        }
                        validarComSeguranca(pesoKg, 'peso', this);
                    }
                });
            }
            
            if (inputAltura) {
                inputAltura.addEventListener('blur', function() {
                    const valor = parseFloat(this.value);
                    if (valor && !isNaN(valor)) {
                        let alturaCm = valor;
                        if (unidadesAltura === 'in') {
                            alturaCm = valor * 2.54;
                        }
                        validarComSeguranca(alturaCm, 'altura', this);
                    }
                });
            }
        }, 300);
        
        console.log('✓ Calculadora de Superfície Corporal inicializada');
    }
    
    // Exporta para o escopo global
    window.SuperficieCorporalCalculator = {
        init: init,
        calcular: calcular,
        limpar: limpar,
        renderFormulario: renderFormulario,
        renderSidebar: renderSidebar,
        toggleUnidadesPeso: toggleUnidadesPeso,
        toggleUnidadesAltura: toggleUnidadesAltura,
        calcularIdade: calcularIdade,
        toggleBotaoCalcular: toggleBotaoCalcular,
        // Novas funções adicionadas
        abrirConversorUnidades: abrirConversorUnidades,
        fecharConversorUnidades: fecharConversorUnidades,
        aplicarConversaoUnidades: aplicarConversaoUnidades,
        toggleDarkMode: toggleDarkMode,
        aplicarDarkMode: aplicarDarkMode,
        carregarDoHistorico: carregarDoHistorico,
        limparHistorico: limparHistorico,
        copiarParaEvolucao: copiarParaEvolucao,
        validarComSeguranca: validarComSeguranca
    };
    
    // Auto-inicialização
    init();
    
})();
