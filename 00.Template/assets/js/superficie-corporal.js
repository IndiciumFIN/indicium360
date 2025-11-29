/**
 * ============================================================
 * CALCULADORA DE SUPERFÍCIE CORPORAL (MOSTELLER)
 * ============================================================
 * Módulo JavaScript para cálculo de superfície corporal
 * Fórmula: SC = √[(Peso × Altura) / 3600]
 * Versão: 2.0.0
 * Última Atualização: 29/11/2025
 * ============================================================
 */

(function() {
    'use strict';
    
    /**
     * CONFIGURAÇÃO DA CALCULADORA
     * Todos os dados específicos centralizados
     */
    const CONFIG = {
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
                    ano: '2013'
                }
            ],
            versao: '2.0.0',
            ultimaAtualizacao: '29/11/2025',
            desenvolvedor: 'Calculadoras de Enfermagem'
        }
    };
    
    /**
     * RENDERIZA O FORMULÁRIO DA CALCULADORA
     */
    function renderFormulario() {
        return `
            <!-- Seção: Dados do Paciente -->
            <div class="mb-6">
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
                        >
                    </div>
                </div>
            </div>
            
            <!-- Seção: Parâmetros -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4" style="color: #1A3E74;">
                    Parâmetros
                </h2>
                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label" for="peso">Peso (kg)</label>
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
                        <label class="form-label" for="altura">Altura (cm)</label>
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
            
            <!-- Botões -->
            <div class="space-y-3">
                <button 
                    onclick="SuperficieCorporal.calcular()" 
                    class="w-full bg-[#1A3E74] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#152E5A] transition duration-300 shadow-md flex items-center justify-center gap-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    Calcular
                </button>
                
                <button 
                    onclick="SuperficieCorporal.limpar()" 
                    class="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center gap-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Limpar
                </button>
            </div>
        `;
    }
    
    /**
     * RENDERIZA A SIDEBAR
     */
    function renderSidebar() {
        return `
            <!-- Acesso Rápido será renderizado como botão flutuante -->
        `;
    }
    
    /**
     * FUNÇÃO DE CÁLCULO PRINCIPAL
     */
    function calcular() {
        // Captura dados do paciente
        const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        
        // Captura parâmetros
        const peso = CalculatorActions.validarCampoNumerico('peso', 'um peso válido', 0.1, 500);
        const altura = CalculatorActions.validarCampoNumerico('altura', 'uma altura válida', 30, 250);
        
        if (!peso || !altura) return;
        
        // Captura dose prescrita (opcional)
        const dosePrescritaInput = document.getElementById('dosePrescrita').value;
        const dosePrescrita = dosePrescritaInput ? parseFloat(dosePrescritaInput) : null;
        
        // Cálculo da SC
        const sc = Math.sqrt((peso * altura) / 3600);
        const imc = peso / Math.pow(altura / 100, 2);
        
        // Armazena resultados
        const inputsData = {
            'Peso': `${peso} kg`,
            'Altura': `${altura} cm`,
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
        
        // Exibe resultado
        exibirResultado(sc, peso, altura, imc, nomeCompleto, dataNascimento, dosePrescrita);
        
        // Registra auditoria
        const registro = AuditoriaCalculo.registrarCalculo({
            tipoCalculo: 'Superfície Corporal (Mosteller)',
            paciente: { nome: nomeCompleto, dataNascimento: dataNascimento },
            inputs: { peso, altura, dosePrescrita: dosePrescrita || 'N/A' },
            resultado: sc,
            resumo: `SC: ${sc.toFixed(2)} m² (Peso: ${peso}kg, Altura: ${altura}cm)${dosePrescrita ? ` - Dose: ${(dosePrescrita * sc).toFixed(1)}mg` : ''}`
        });
        
        // Injeta seções modulares (após cálculo)
        CalculatorMain.injectModularSections({
            registro: registro,
            contextoClinico: `superfície corporal ${sc.toFixed(2)} m² quimioterapia dosagem`
        });
    }
    
    /**
     * EXIBE O RESULTADO DO CÁLCULO
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
                    <p><strong>Peso:</strong> ${peso} kg</p>
                    <p><strong>Altura:</strong> ${altura} cm</p>
                    <p><strong>IMC:</strong> ${imc.toFixed(1)} kg/m²</p>
                </div>
                ${doseCalculadaHTML}
            </div>
        `;
        
        CalculatorMain.showResults();
    }
    
    /**
     * LIMPA O FORMULÁRIO
     */
    function limpar() {
        CalculatorActions.limparFormulario(
            ['nomeCompleto', 'dataNascimento', 'peso', 'altura', 'dosePrescrita'],
            ['calculator-result-content']
        );
    }
    
    /**
     * INICIALIZA A CALCULADORA
     */
    function init() {
        // Inicializa Calculator Main
        CalculatorMain.init(CONFIG);
        
        // Injeta conteúdo do formulário
        CalculatorMain.injectFormContent(renderFormulario);
        
        // Injeta conteúdo da sidebar
        CalculatorMain.injectSidebarContent(renderSidebar);
        
        console.log('✓ Calculadora de Superfície Corporal inicializada');
    }
    
    // Exporta para o escopo global
    window.SuperficieCorporal = {
        init: init,
        calcular: calcular,
        limpar: limpar,
        renderFormulario: renderFormulario,
        renderSidebar: renderSidebar,
        config: CONFIG
    };
    
    // Auto-inicialização quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
