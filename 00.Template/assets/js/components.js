/**
 * CALCULADORAS DE ENFERMAGEM - COMPONENTES REUTILIZÁVEIS
 * Versão 6.0 - Sistema de Componentes Modulares
 * =============================================
 */

// ===================================
// COMPONENTE: SKIP LINKS
// ===================================
function renderSkipLinks() {
    return `
    <nav class="skip-links" aria-label="Links de navegação rápida">
        <a href="#main-content">Início do conteúdo</a>
        <a href="#main-nav">Navegação Principal</a>
        <a href="#main-footer">Rodapé</a>
    </nav>`;
}

// ===================================
// COMPONENTE: TOP BAR
// ===================================
function renderTopBar() {
    return `
    <div class="top-bar">
        <div class="container">
            <div class="util-actions">
                <!-- Controle de Fonte -->
                <div class="font-controls" role="group" aria-label="Controle de tamanho da fonte">
                    <button class="font-btn" id="btnFontDecrease" title="Diminuir fonte" aria-label="Diminuir tamanho da fonte">A-</button>
                    <button class="font-btn" id="btnFontIncrease" title="Aumentar fonte" aria-label="Aumentar tamanho da fonte">A+</button>
                </div>
                
                <!-- Theme Switcher -->
                <div class="theme-switcher" role="group" aria-label="Alternar tema">
                    <button class="theme-btn active" id="btnLight" title="Tema claro" aria-label="Ativar tema claro"><i class="fa-solid fa-sun" aria-hidden="true"></i></button>
                    <button class="theme-btn" id="btnDark" title="Tema escuro" aria-label="Ativar tema escuro"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>
                </div>

                <a href="https://www.calculadorasdeenfermagem.com.br/institucional/acessorestrito.html" style="display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700;">
                    <i class="fa-regular fa-user" aria-hidden="true"></i> Área Restrita
                </a>
            </div>
        </div>
    </div>`;
}

// ===================================
// COMPONENTE: MAIN HEADER
// ===================================
function renderHeader() {
    return `
    <header class="main-header" id="main-nav">
        <div class="container">
            <!-- Logo à esquerda -->
            <a href="https://www.calculadorasdeenfermagem.com.br/" class="header-logo">
                <img src="https://www.calculadorasdeenfermagem.com.br/icontopbar1.webp" alt="Calculadoras de Enfermagem" class="no-click">
            </a>

            <nav class="nav-menu" aria-label="Menu principal">
                <!-- INÍCIO -->
                <div class="nav-item">
                    <a href="https://www.calculadorasdeenfermagem.com.br/" class="nav-link">Início</a>
                </div>

                <!-- SOBRE NÓS -->
                <div class="nav-item">
                    <span class="nav-link">Sobre Nós</span>
                    <div class="mega-menu-wrapper">
                        <div class="mm-container">
                            <div class="mm-sidebar-layout">
                                <!-- NAVEGAÇÃO À ESQUERDA -->
                                <div class="mm-nav-sidebar">
                                    <div class="mm-nav-item" data-target="section-institucional">
                                        Institucional
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-acessibilidade">
                                        Acessibilidade Digital
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-sustentabilidade">
                                        Sustentabilidade Digital
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-politicas">
                                        Políticas do Site
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-admin">
                                        Acesso Administrativo
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                </div>

                                <!-- CONTEÚDO CENTRAL -->
                                <div class="mm-content-area">
                                    <!-- INSTITUCIONAL -->
                                    <div id="section-institucional" class="mm-section-content">
                                        <div class="mm-section-title">Institucional</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/missao.html" class="mm-link-item">Missão, Visão e Valores <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/objetivo.html" class="mm-link-item">Objetivo do Site <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/mapa-do-site.html" class="mm-link-item">Mapa do Site <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- ACESSIBILIDADE DIGITAL -->
                                    <div id="section-acessibilidade" class="mm-section-content">
                                        <div class="mm-section-title">Acessibilidade Digital</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/politicadeacessibilidade.html" class="mm-link-item">Política de Acessibilidade <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/recursos-assistivos.html" class="mm-link-item">Recursos Assistivos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- SUSTENTABILIDADE DIGITAL -->
                                    <div id="section-sustentabilidade" class="mm-section-content">
                                        <div class="mm-section-title">Sustentabilidade Digital</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/nossocompromisso.html" class="mm-link-item">Nosso Compromisso <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/impactodigital.html" class="mm-link-item">Relatório de Impacto <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/tecnologiaverde.html" class="mm-link-item">Tecnologia Verde <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- POLÍTICAS DO SITE -->
                                    <div id="section-politicas" class="mm-section-content">
                                        <div class="mm-section-title">Políticas do Site</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/politica.html" class="mm-link-item">Política de Privacidade <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/termos.html" class="mm-link-item">Termos e Condições de Uso <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/notificacoes-legais.html" class="mm-link-item">Notificações Legais <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- ACESSO ADMINISTRATIVO -->
                                    <div id="section-admin" class="mm-section-content">
                                        <div class="mm-section-title">Acesso Administrativo</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/institucional/acessorestrito.html" class="mm-link-item">Área Restrita <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>

                                <!-- IMAGEM À DIREITA -->
                                <div class="mm-sidebar-image">
                                    <img src="https://www.calculadorasdeenfermagem.com.br/imgs/sobre-nos-equipe_2.jpg" alt="Equipe de Enfermagem">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FERRAMENTAS -->
                <div class="nav-item">
                    <span class="nav-link">Ferramentas</span>
                    <div class="mega-menu-wrapper">
                        <div class="mm-container">
                            <div class="mm-sidebar-layout">
                                <!-- NAVEGAÇÃO À ESQUERDA -->
                                <div class="mm-nav-sidebar">
                                    <div class="mm-nav-item" data-target="section-calculadoras">
                                        Calculadoras Clínicas
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-vacinal">
                                        Calendário Vacinal
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-escalas">
                                        Escalas Clínicas
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-notificacao">
                                        Notificação de Enfermagem
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-plano">
                                        Plano de Enfermagem
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                </div>

                                <!-- CONTEÚDO À DIREITA -->
                                <div class="mm-content-area">
                                    <!-- CALCULADORAS CLÍNICAS -->
                                    <div id="section-calculadoras" class="mm-section-content">
                                        <div class="mm-section-title">Calculadoras Clínicas</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/calculadoras-de-enfermagem.html" class="mm-link-item" style="font-weight: 700; color: var(--color-cyan); display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-calculator" style="font-size: 1.1em;"></i> Ver Todas as Calculadoras Clínicas <i class="fa-solid fa-chevron-right" style="margin-left: auto;"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/heparina.html" class="mm-link-item">Aspiração de Heparina <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/insulina.html" class="mm-link-item">Aspiração de Insulina <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/balancohidrico.html" class="mm-link-item">Balanço Hídrico <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/gasometria.html" class="mm-link-item">Cálculo de Gasometria <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/gotejamento.html" class="mm-link-item">Cálculo de Gotejamento <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/medicamentos.html" class="mm-link-item">Cálculo de Medicamentos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/dimensionamento.html" class="mm-link-item">Dimensionamento da Equipe <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/gestacional.html" class="mm-link-item">Idade Gestacional e DPP <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/imc.html" class="mm-link-item">Índice de Massa Corporal (IMC) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- CALENDÁRIO VACINAL -->
                                    <div id="section-vacinal" class="mm-section-content">
                                        <div class="mm-section-title">Calendário Vacinal</div>
                                        <a href="#" class="mm-link-item">Prematuro <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Crianças (0 a <10 anos) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Adolescentes (10 a 19 anos) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Adultos (20 a 59 anos) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Idosos (mais de 60 anos) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Gestantes <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Pacientes Especiais <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Ocupacional <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="#" class="mm-link-item">Vacinas Pneumocócicas <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- ESCALAS CLÍNICAS -->
                                    <div id="section-escalas" class="mm-section-content">
                                        <div class="mm-section-title">Escalas Clínicas</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/escalas-de-enfermagem.html" class="mm-link-item" style="font-weight: 700; color: var(--color-cyan); display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-chart-line" style="font-size: 1.1em;"></i> Ver Todas as Escalas Clínicas <i class="fa-solid fa-chevron-right" style="margin-left: auto;"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/aldrete.html" class="mm-link-item">Escala de Aldrete e Kroulik <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/apache.html" class="mm-link-item">Escala de APACHE II <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/apgar.html" class="mm-link-item">Escala de Apgar <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/asa.html" class="mm-link-item">Classificação ASA <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/ballard.html" class="mm-link-item">Escala de Ballard <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/barthel.html" class="mm-link-item">Escala de Barthel <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/berg.html" class="mm-link-item">Escala de Berg <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/bishop.html" class="mm-link-item">Escala de Bishop <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/braden.html" class="mm-link-item">Escala de Braden <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/bps.html" class="mm-link-item">Escala de BPS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/cam.html" class="mm-link-item">Escala CAM - UTI <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/capurro.html" class="mm-link-item">Escala de Capurro <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/cincinnati.html" class="mm-link-item">Escala de Cincinnati <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/cornell.html" class="mm-link-item">Escala de Cornell <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/cries.html" class="mm-link-item">Escala de CRIES <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/curb-65.html" class="mm-link-item">Escala de CURB-65 <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/gds.html" class="mm-link-item">Escala de Depressão Geriátrica (GDS) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/downton.html" class="mm-link-item">Escala de Downton <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/escalanumerica.html" class="mm-link-item">Escala de Dor (Numérica) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/elpo.html" class="mm-link-item">Escala de ELPO <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/fast.html" class="mm-link-item">Escala de FAST (AVC) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/flacc.html" class="mm-link-item">Escala de FLACC <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/four.html" class="mm-link-item">Escala de FOUR <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/fugulin.html" class="mm-link-item">Escala de Fugulin (SCP) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/glasgow.html" class="mm-link-item">Escala de Coma de Glasgow <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/gosnell.html" class="mm-link-item">Escala de Gosnell <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/hamilton.html" class="mm-link-item">Escala de Hamilton <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/humpty.html" class="mm-link-item">Escala de Humpty Dumpty <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/johns.html" class="mm-link-item">Escala Johns Hopkins <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/jouvet.html" class="mm-link-item">Escala de Jouvet <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/katz.html" class="mm-link-item">Escala Katz <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/lachs.html" class="mm-link-item">Escala de Lachs <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/lanss.html" class="mm-link-item">Escala LANSS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/lawton.html" class="mm-link-item">Escala de Lawton <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/manchester.html" class="mm-link-item">Protocolo de Manchester <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/meem.html" class="mm-link-item">Escala de MEEM <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/meows.html" class="mm-link-item">Escala de MEOWS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/morse.html" class="mm-link-item">Escala de Morse <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/news.html" class="mm-link-item">Escala de NEWS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/nihss.html" class="mm-link-item">Escala de NIHSS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/nips.html" class="mm-link-item">Escala de NIPS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/norton.html" class="mm-link-item">Escala de Norton <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/ofras.html" class="mm-link-item">Escala de OFRAS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/painad.html" class="mm-link-item">Escala de Painad <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/pelod.html" class="mm-link-item">Escala de PELOD <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/perroca.html" class="mm-link-item">Escala de Perroca (SCP) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/pews.html" class="mm-link-item">Escala de PEWS <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/prism.html" class="mm-link-item">Escala de PRISM <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/qsofa.html" class="mm-link-item">Escala de qSOFA <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/rancholosamigos.html" class="mm-link-item">Escala Rancho Los Amigos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/ramsay.html" class="mm-link-item">Escala de Ramsay (Sedação) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/richmond.html" class="mm-link-item">Escala de Richmond (RASS) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/saps.html" class="mm-link-item">Escala de SAPS III <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/silverman.html" class="mm-link-item">Escala de Silverman-Anderson <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/sofa.html" class="mm-link-item">Escala de SOFA <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/tinetti.html" class="mm-link-item">Escala de Tinetti <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/waterlow.html" class="mm-link-item">Escala de Waterlow <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/downes.html" class="mm-link-item">Escala de Wood e Downes <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/zarit.html" class="mm-link-item">Escala de Zarit <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- NOTIFICAÇÃO DE ENFERMAGEM -->
                                    <div id="section-notificacao" class="mm-section-content">
                                        <div class="mm-section-title">Notificação de Enfermagem</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/notificacao-eventos.html" class="mm-link-item">Notificação de Eventos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- PLANO DE ENFERMAGEM -->
                                    <div id="section-plano" class="mm-section-content">
                                        <div class="mm-section-title">Plano de Enfermagem</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/plano-cuidados.html" class="mm-link-item">Plano de Cuidados <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>

                                <!-- IMAGEM À DIREITA -->
                                <div class="mm-sidebar-image">
                                    <img src="https://www.calculadorasdeenfermagem.com.br/imgs/ferramentas-menu_6.jpg" alt="Profissional de Enfermagem com Ferramentas Clínicas">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BIBLIOTECA DE ENFERMAGEM -->
                <div class="nav-item">
                    <span class="nav-link">Biblioteca de Enfermagem</span>
                    <div class="mega-menu-wrapper">
                        <div class="mm-container">
                            <div class="mm-sidebar-layout">
                                <!-- NAVEGAÇÃO À ESQUERDA -->
                                <div class="mm-nav-sidebar">
                                    <div class="mm-nav-item" data-target="section-seguranca">
                                        Segurança do Paciente
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-medicamentos">
                                        Medicamentos
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-vigilancia">
                                        Vigilância Epidemiológica
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-legislacao">
                                        Legislação
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-sistematizacao">
                                        Sistematização
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                </div>

                                <!-- CONTEÚDO À DIREITA -->
                                <div class="mm-content-area">
                                    <!-- SEGURANÇA DO PACIENTE -->
                                    <div id="section-seguranca" class="mm-section-content">
                                        <div class="mm-section-title">Segurança do Paciente</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/dupla-tripla-checagem.html" class="mm-link-item">Dupla e Tripla Checagem <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/metas-internacionais.html" class="mm-link-item">Metas Internacionais de Segurança <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- MEDICAMENTOS -->
                                    <div id="section-medicamentos" class="mm-section-content">
                                        <div class="mm-section-title">Medicamentos</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/manual-medicamentos.html" class="mm-link-item">Manual de Uso Seguro <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/medicacao-alta-vigilancia.html" class="mm-link-item">Medicação de Alta Vigilância (MAV) <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- VIGILÂNCIA EPIDEMIOLÓGICA -->
                                    <div id="section-vigilancia" class="mm-section-content">
                                        <div class="mm-section-title">Vigilância Epidemiológica</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/doencas-notificacao.html" class="mm-link-item">Doenças de Notificação Compulsória <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- LEGISLAÇÃO -->
                                    <div id="section-legislacao" class="mm-section-content">
                                        <div class="mm-section-title">Legislação</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/legislacoes.html" class="mm-link-item">Legislações e Pareceres <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- SISTEMATIZAÇÃO -->
                                    <div id="section-sistematizacao" class="mm-section-content">
                                        <div class="mm-section-title">Sistematização</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/nanda-nic-noc.html" class="mm-link-item">O que é NANDA, NIC e NOC? <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>

                                <!-- IMAGEM À DIREITA -->
                                <div class="mm-sidebar-image">
                                    <img src="https://www.calculadorasdeenfermagem.com.br/imgs/biblioteca-estudante_3.png" alt="Estudante de Enfermagem Estudando">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CARREIRAS -->
                <div class="nav-item">
                    <span class="nav-link">Carreiras</span>
                    <div class="mega-menu-wrapper">
                        <div class="mm-container">
                            <div class="mm-sidebar-layout">
                                <!-- NAVEGAÇÃO À ESQUERDA -->
                                <div class="mm-nav-sidebar">
                                    <div class="mm-nav-item" data-target="section-carreiras">
                                        Desenvolvimento Profissional
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                </div>

                                <!-- CONTEÚDO À DIREITA -->
                                <div class="mm-content-area">
                                    <!-- DESENVOLVIMENTO PROFISSIONAL -->
                                    <div id="section-carreiras" class="mm-section-content">
                                        <div class="mm-section-title">Desenvolvimento Profissional</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/curriculos.html" class="mm-link-item">Currículos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/cursos.html" class="mm-link-item">Buscar Cursos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/concursos-publicos.html" class="mm-link-item">Buscar Concursos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/site-de-vagas.html" class="mm-link-item">Buscar Vagas <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/carreiras.html" class="mm-link-item">Guia de Carreiras <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>

                                <!-- IMAGEM À DIREITA -->
                                <div class="mm-sidebar-image">
                                    <img src="https://www.calculadorasdeenfermagem.com.br/imgs/carreiras-profissional_8.jpg" alt="Profissional de Enfermagem">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FALE CONOSCO -->
                <div class="nav-item">
                    <span class="nav-link">Fale Conosco</span>
                    <div class="mega-menu-wrapper">
                        <div class="mm-container">
                            <div class="mm-sidebar-layout">
                                <!-- NAVEGAÇÃO À ESQUERDA -->
                                <div class="mm-nav-sidebar">
                                    <div class="mm-nav-item" data-target="section-contato">
                                        Contato
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-suporte">
                                        Suporte
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="mm-nav-item" data-target="section-comunidade">
                                        Comunidade
                                        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                </div>

                                <!-- CONTEÚDO CENTRAL -->
                                <div class="mm-content-area">
                                    <!-- CONTATO -->
                                    <div id="section-contato" class="mm-section-content">
                                        <div class="mm-section-title">Contato</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/fale.html" class="mm-link-item">Contate-nos <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/doacoes.html" class="mm-link-item">Contribua <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- SUPORTE -->
                                    <div id="section-suporte" class="mm-section-content">
                                        <div class="mm-section-title">Suporte</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/faq.html" class="mm-link-item">Perguntas Frequentes <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/ajuda.html" class="mm-link-item">Central de Ajuda <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>

                                    <!-- COMUNIDADE -->
                                    <div id="section-comunidade" class="mm-section-content">
                                        <div class="mm-section-title">Comunidade</div>
                                        <a href="https://www.calculadorasdeenfermagem.com.br/forum.html" class="mm-link-item">Fórum <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>

                                <!-- IMAGEM À DIREITA -->
                                <div class="mm-sidebar-image">
                                    <img src="https://www.calculadorasdeenfermagem.com.br/imgs/contato-comunicacao_3.jpeg" alt="Profissional de Enfermagem em Atendimento">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="header-right">
                <!-- Mobile Menu Toggle (PRIMEIRA POSIÇÃO NO MOBILE) -->
                <button class="mobile-menu-toggle" aria-label="Abrir menu" aria-expanded="false">
                    <i class="fa-solid fa-bars" aria-hidden="true"></i>
                </button>
                
                <!-- Language Selector -->
                <div class="lang-selector">
                    <div class="lang-trigger" id="langTrigger">
                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-brasil.webp" alt="PT-BR" class="lang-flag">
                        <span>PT</span>
                        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </div>

                    <!-- MEGA MENU IDIOMAS -->
                    <div class="mega-menu-wrapper lang-mega-menu" id="langMegaMenu">
                        <div class="mm-container">
                            <div class="mm-grid-full" style="grid-template-columns: repeat(5, 1fr);">
                                <!-- AMÉRICA -->
                                <div class="mm-col">
                                    <div class="mm-title">América</div>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-brasil.webp" alt="Brasil">
                                        <span>Português (BR)</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/en/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-eua.webp" alt="USA">
                                        <span>English (US)</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/es/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-espanha.webp" alt="España">
                                        <span>Español</span>
                                    </a>
                                </div>
                                
                                <!-- EUROPA OCIDENTAL -->
                                <div class="mm-col">
                                    <div class="mm-title">Europa Ocidental</div>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/fr/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-franca.webp" alt="France">
                                        <span>Français</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/de/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-alemanha.webp" alt="Deutschland">
                                        <span>Deutsch</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/it/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-italia.webp" alt="Italia">
                                        <span>Italiano</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/nl/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-holanda.webp" alt="Nederland">
                                        <span>Nederlands</span>
                                    </a>
                                </div>
                                
                                <!-- EUROPA ORIENTAL -->
                                <div class="mm-col">
                                    <div class="mm-title">Europa Oriental</div>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/ru/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-russia.webp" alt="Россия">
                                        <span>Русский</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/pl/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-polonia.webp" alt="Polska">
                                        <span>Polski</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/uk/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-ucrania.webp" alt="Україна">
                                        <span>Українська</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/sv/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-suecia.webp" alt="Sverige">
                                        <span>Svenska</span>
                                    </a>
                                </div>
                                
                                <!-- ÁSIA -->
                                <div class="mm-col">
                                    <div class="mm-title">Ásia</div>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/zh/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-china.webp" alt="中国">
                                        <span>中文 (简体)</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/ja/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-japao.webp" alt="日本">
                                        <span>日本語</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/ko/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-coreia.webp" alt="한국">
                                        <span>한국어</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/hi/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-india.webp" alt="India">
                                        <span>हिन्दी</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/id/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-indonesia.webp" alt="Indonesia">
                                        <span>Bahasa Indonesia</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/vi/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-vietna.webp" alt="Việt Nam">
                                        <span>Tiếng Việt</span>
                                    </a>
                                </div>
                                
                                <!-- ORIENTE MÉDIO & NORTE DA ÁFRICA -->
                                <div class="mm-col">
                                    <div class="mm-title">Oriente Médio</div>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/ar/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-arabia.webp" alt="العربية">
                                        <span>العربية</span>
                                    </a>
                                    <a href="https://www.calculadorasdeenfermagem.com.br/tr/" class="lang-item">
                                        <img src="https://www.calculadorasdeenfermagem.com.br/bandeira-turquia.webp" alt="Türkiye">
                                        <span>Türkçe</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="search-wrap">
                    <input type="search" class="search-input" placeholder="Buscar no site..." aria-label="Buscar no site">
                    <button class="search-close" aria-label="Fechar busca">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                    <button class="search-btn" aria-label="Realizar busca">
                        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>`;
}

// ===================================
// COMPONENTE: FOOTER
// ===================================
function renderFooter() {
    return `
    <footer class="main-footer" id="main-footer">
        <!-- Onda Superior SVG -->
        <svg class="footer-wave-top" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="var(--footer-bg)"></path>
        </svg>
        <svg style="position: absolute; top: -60px; left: 0; width: 100%; height: 60px; z-index: 2; pointer-events: none;" preserveAspectRatio="none" viewBox="0 0 1440 60">
             <path d="M0,60 C480,0 960,0 1440,60 L1440,0 L0,0 Z" fill="white"></path>
        </svg>

        <div class="container footer-content">
            <!-- Logo -->
            <div class="footer-logo-row">
                <img src="https://www.calculadorasdeenfermagem.com.br/iconrodape1.webp" alt="Calculadoras de Enfermagem" style="height: 48px; width: auto;" class="no-click" onerror="this.style.display='none'">
            </div>
            <hr class="footer-divider">

            <div class="footer-links-grid">
                <!-- Coluna 1: Institucional -->
                <div class="f-col">
                    <span class="f-group-title">Institucional</span>
                    <ul class="f-link-list">
                        <li><a href="https://www.calculadorasdeenfermagem.com.br/">Início</a></li>
                        <li><a href="#" data-modal="missao">Sobre Nós</a></li>
                        <li><a href="#" data-modal="objetivos">Objetivos da Plataforma</a></li>
                        <li><a href="https://www.calculadorasdeenfermagem.com.br/mapa-do-site.html">Mapa do Site</a></li>
                    </ul>
                </div>
                
                <!-- Coluna 2: Sustentabilidade Digital + Acessibilidade -->
                <div class="f-col">
                    <div>
                        <span class="f-group-title">Sustentabilidade Digital</span>
                        <ul class="f-link-list">
                            <li><a href="#" data-modal="compromisso">Nosso Compromisso</a></li>
                            <li><a href="https://www.calculadorasdeenfermagem.com.br/impactodigital.html">Relatório de Impacto</a></li>
                            <li><a href="https://www.calculadorasdeenfermagem.com.br/tecnologiaverde.html">Tecnologia Verde</a></li>
                        </ul>
                    </div>
                    <div style="margin-top: 30px;">
                        <span class="f-group-title">Acessibilidade</span>
                        <ul class="f-link-list">
                            <li><a href="#" data-modal="acessibilidade">Política de Acessibilidade</a></li>
                            <li><a href="#" data-modal="recursos-assistivos">Recursos de Acessibilidade</a></li>
                        </ul>
                    </div>
                </div>
                
                <!-- Coluna 3: Nosso Compromisso + Selos -->
                <div class="f-col">
                    <span class="f-group-title">Nosso Compromisso</span>
                    <p class="footer-commitment-text">Nosso site adota como princípio de governança, o comprometimento com elevados padrões de acessibilidade digital, sustentabilidade digital e proteção de dados.</p>
                    <div class="footer-seals">
                        <img src="https://www.calculadorasdeenfermagem.com.br/seloacessibilidade.webp" alt="Acessibilidade" class="no-click" onerror="this.style.display='none'">
                        <img src="https://www.calculadorasdeenfermagem.com.br/selosustentabilidade.webp" alt="Sustentabilidade" class="no-click" onerror="this.style.display='none'">
                        <img src="https://www.calculadorasdeenfermagem.com.br/selolgpd.webp" alt="LGPD" class="no-click" onerror="this.style.display='none'">
                    </div>
                </div>
                
                <!-- Coluna 4: Siga-nos -->
                <div class="f-col">
                    <span class="f-group-title">Siga-nos</span>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/company/calculadoras-de-enfermagem" target="_blank" class="s-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
                        <a href="https://www.instagram.com/calculadorasdeenfermagem/" target="_blank" class="s-icon" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                        <a href="https://www.tiktok.com/@calculadorasdeenf" target="_blank" class="s-icon" aria-label="TikTok"><i class="fab fa-tiktok" aria-hidden="true"></i></a>
                        <a href="https://www.youtube.com/channel/UC_6runTDHz8u5S1Yab842pg" target="_blank" class="s-icon" aria-label="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>

            <!-- Botão Gerenciar Cookies - Centralizado -->
            <div class="footer-cookie-manage-wrapper">
                <button id="manage-cookies-footer-btn" class="btn-cookie">Gerenciar Preferências de Cookies</button>
            </div>

            <!-- Bottom Bar com Copyright, Links e Voltar ao Topo -->
            <div class="footer-bottom-bar">
                <div class="footer-bottom-left">
                    <p class="footer-copyright">© 2025-2026 Calculadoras de Enfermagem. Todos os direitos reservados.</p>
                    <div class="footer-bottom-links">
                        <a href="https://www.calculadorasdeenfermagem.com.br/termos.html" class="footer-text-link">Configurações</a>
                        <a href="https://www.calculadorasdeenfermagem.com.br/politica.html" class="footer-text-link">Central de Privacidade</a>
                        <a href="https://www.calculadorasdeenfermagem.com.br/notificacoes-legais.html" class="footer-text-link">Notificações Legais</a>
                    </div>
                </div>
                
                <div class="footer-bottom-right">
                    <!-- Botão Voltar ao Topo -->
                    <button id="backToTopBtn" class="back-to-top-btn" aria-label="Voltar ao topo">
                        <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    </footer>`;
}

// ===================================
// COMPONENTE: CONSENT BANNER (MODULAR)
// ===================================
// NOTA: O componente de cookies é importado de cookie-banner-component.js
// Mantém-se uma função stub para compatibilidade com código legado
function renderConsentBanner() {
    // Verifica se o componente modular está disponível
    if (typeof renderCookieBanner === 'function') {
        return renderCookieBanner();
    }
    
    // Fallback simples caso o arquivo não seja carregado
    console.warn('⚠️ cookie-banner-component.js não carregado, usando fallback');
    return `
    <div id="cookie-banner" class="cookie-banner">
        <div class="banner-content">
            <div class="banner-text">
                <strong>Cookies e Privacidade</strong><br>
                Utilizamos cookies para melhorar sua experiência. 
                <a href="https://www.calculadorasdeenfermagem.com.br/politica.html">Saiba mais</a>
            </div>
        </div>
        <div class="banner-actions">
            <button class="btn-cookie btn-outline" id="banner-options">Personalizar</button>
            <button class="btn-cookie btn-primary" id="banner-accept">Aceitar</button>
        </div>
    </div>
    <button id="cookie-fab" class="cookie-fab" style="display:none;">🍪</button>
    <div id="cookie-overlay" class="cookie-overlay"></div>`;
}

// ===================================
// COMPONENTE: VLIBRAS WIDGET
// ===================================
function renderVLibras() {
    return `
    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    </div>`;
}

// ===================================
// COMPONENTE: HERO SECTIONS
// ===================================

/**
 * Função genérica para renderizar Hero Section
 * @param {Object} config - Configurações do hero
 * @param {string} config.title - Título principal
 * @param {string} config.subtitle - Subtítulo/descrição
 * @param {string} config.image - Caminho da imagem
 * @param {string} config.primaryBtnText - Texto do botão primário
 * @param {string} config.primaryBtnLink - Link do botão primário
 * @param {string} config.secondaryBtnText - Texto do botão secundário (opcional)
 * @param {string} config.secondaryBtnLink - Link do botão secundário (opcional)
 * @param {string} config.badge - Texto do badge (opcional)
 * @returns {string} HTML do hero
 */
function renderHero(config) {
    const {
        title,
        subtitle,
        image,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText = null,
        secondaryBtnLink = null,
        badge = null
    } = config;

    return `
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    ${badge ? `<span class="hero-badge"><svg class="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${badge}</span>` : ''}
                    <h1 class="hero-title">${title}</h1>
                    <p class="hero-subtitle">${subtitle}</p>
                    <div class="hero-buttons">
                        <a href="${primaryBtnLink}" class="btn btn-primary">
                            ${primaryBtnText} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </a>
                        ${secondaryBtnText ? `<a href="${secondaryBtnLink}" class="btn btn-secondary">${secondaryBtnText}</a>` : ''}
                    </div>
                </div>
                <div class="hero-image">
                    <img src="${image}" alt="${title}" loading="eager">
                </div>
            </div>
        </div>
    </section>`;
}

/**
 * Hero Section: Calculadoras Clínicas
 */
function renderHeroCalculadorasClinicas() {
    return renderHero({
        title: 'Calculadoras Clínicas de Enfermagem',
        subtitle: 'Ferramentas validadas e precisas para cálculos essenciais no cuidado ao paciente. Simplifique cálculos de medicamentos, gotejamento, balanço hídrico e muito mais.',
        image: 'imgs/calculadoras-clinicas_3.webp',
        primaryBtnText: 'Explorar Calculadoras',
        primaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/calculadoras.html',
        secondaryBtnText: 'Ver Tutoriais',
        secondaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/ajuda.html',
        badge: 'Ferramentas Validadas'
    });
}

/**
 * Hero Section: Escalas Clínicas
 */
function renderHeroEscalasClinicas() {
    return renderHero({
        title: 'Escalas de Avaliação Clínica',
        subtitle: 'Mais de 50 escalas clínicas validadas para avaliação sistematizada de pacientes. De Glasgow a Braden, todas as escalas essenciais em um só lugar.',
        image: 'imgs/escalas-avaliacao_9.jpg',
        primaryBtnText: 'Acessar Escalas',
        primaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/escalas-clinicas.html',
        secondaryBtnText: 'Guia de Uso',
        secondaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/ajuda.html',
        badge: '+50 Escalas Disponíveis'
    });
}

/**
 * Hero Section: Plano de Enfermagem
 */
function renderHeroPlanoEnfermagem() {
    return renderHero({
        title: 'Plano de Cuidados de Enfermagem',
        subtitle: 'Sistematize seus diagnósticos, intervenções e resultados com base em NANDA, NIC e NOC. Ferramenta completa para Sistematização da Assistência de Enfermagem (SAE).',
        image: 'imgs/ferramentas-menu_6.jpg',
        primaryBtnText: 'Criar Plano de Cuidados',
        primaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/plano-cuidados.html',
        secondaryBtnText: 'Saiba Mais sobre SAE',
        secondaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/nanda-nic-noc.html',
        badge: 'NANDA | NIC | NOC'
    });
}

/**
 * Hero Section: Buscar Vagas de Emprego
 */
function renderHeroBuscarVagas() {
    return renderHero({
        title: 'Oportunidades de Emprego em Enfermagem',
        subtitle: 'Encontre as melhores vagas de emprego para profissionais de enfermagem em todo o Brasil. Hospitais, clínicas, home care e muito mais.',
        image: 'imgs/carreiras-oportunidades_2.png',
        primaryBtnText: 'Buscar Vagas',
        primaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/site-de-vagas.html',
        secondaryBtnText: 'Criar Currículo',
        secondaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/curriculos.html',
        badge: 'Atualizadas Diariamente'
    });
}

/**
 * Hero Section: Buscar Concursos
 */
function renderHeroBuscarConcursos() {
    return renderHero({
        title: 'Concursos Públicos de Enfermagem',
        subtitle: 'Acompanhe todos os concursos públicos abertos e previstos para enfermeiros, técnicos e auxiliares de enfermagem. Prepare-se para sua aprovação!',
        image: 'imgs/explorar-carreiras_1.webp',
        primaryBtnText: 'Ver Concursos Abertos',
        primaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/concursos-publicos.html',
        secondaryBtnText: 'Materiais de Estudo',
        secondaryBtnLink: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-de-enfermagem.html',
        badge: 'Atualizados Semanalmente'
    });
}

// ===================================
// NOTA: A INICIALIZAÇÃO DOS COMPONENTES
// ===================================
// A inicialização é feita pelo script inline no index.html (linhas 144-223)
// Este arquivo apenas define as funções render*() que são chamadas pelo index.html


// ===================================
// COMPONENTE: INFINITE SCROLL HERO
// ===================================

/**
 * Hero com rolagem infinita de cards de ferramentas
 * @returns {string} HTML do hero com rolagem infinita
 */
function renderInfiniteScrollHero() {
    const ferramentas = [
        {
            icon: 'fa-calculator',
            titulo: 'Calculadoras Clínicas',
            descricao: 'Cálculos precisos para gotejamento, medicamentos e mais',
            link: 'https://www.calculadorasdeenfermagem.com.br/calculadoras.html'
        },
        {
            icon: 'fa-chart-line',
            titulo: 'Escalas de Avaliação',
            descricao: 'Mais de 50 escalas clínicas validadas',
            link: 'https://www.calculadorasdeenfermagem.com.br/escalas-clinicas.html'
        },
        {
            icon: 'fa-book-medical',
            titulo: 'Biblioteca Digital',
            descricao: 'Protocolos, guias e materiais educativos',
            link: 'https://www.calculadorasdeenfermagem.com.br/biblioteca-de-enfermagem.html'
        },
        {
            icon: 'fa-syringe',
            titulo: 'Calendário Vacinal',
            descricao: 'Esquemas vacinais completos por faixa etária',
            link: 'https://www.calculadorasdeenfermagem.com.br/calendario-vacinal.html'
        },
        {
            icon: 'fa-notes-medical',
            titulo: 'Plano de Cuidados',
            descricao: 'SAE com NANDA, NIC e NOC',
            link: 'https://www.calculadorasdeenfermagem.com.br/plano-cuidados.html'
        },
        {
            icon: 'fa-briefcase',
            titulo: 'Carreiras',
            descricao: 'Vagas, concursos e desenvolvimento profissional',
            link: 'https://www.calculadorasdeenfermagem.com.br/carreiras.html'
        },
        {
            icon: 'fa-graduation-cap',
            titulo: 'Educação Continuada',
            descricao: 'Cursos e materiais para atualização profissional',
            link: 'https://www.calculadorasdeenfermagem.com.br/cursos.html'
        },
        {
            icon: 'fa-shield-alt',
            titulo: 'Segurança do Paciente',
            descricao: 'Protocolos e metas de segurança',
            link: 'https://www.calculadorasdeenfermagem.com.br/metas-internacionais.html'
        }
    ];

    // Duplicar ferramentas para rolagem infinita suave
    const todasFerramentas = [...ferramentas, ...ferramentas, ...ferramentas];

    const cardsHTML = todasFerramentas.map(ferramenta => `
        <a href="${ferramenta.link}" class="infinite-scroll-card">
            <div class="isc-icon">
                <i class="fa-solid ${ferramenta.icon}" aria-hidden="true"></i>
            </div>
            <h3 class="isc-titulo">${ferramenta.titulo}</h3>
            <p class="isc-descricao">${ferramenta.descricao}</p>
            <div class="isc-arrow">
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </div>
        </a>
    `).join('');

    return `
    <section class="infinite-scroll-hero">
        <div class="ish-header">
            <h2 class="ish-title">Ferramentas essenciais para profissionais de enfermagem</h2>
            <p class="ish-subtitle">Explore nosso conjunto completo de recursos desenvolvidos para apoiar sua prática clínica</p>
        </div>
        <div class="ish-scroll-container">
            <div class="ish-scroll-track">
                ${cardsHTML}
            </div>
        </div>
    </section>`;
}

// Inicializar animação de rolagem infinita (chamar após DOM carregar)
function initInfiniteScroll() {
    const track = document.querySelector('.ish-scroll-track');
    if (!track) return;

    const cards = track.querySelectorAll('.infinite-scroll-card');
    if (cards.length === 0) return;

    // Calcular largura total de um conjunto de cards
    const cardWidth = cards[0].offsetWidth;
    const gap = 20; // gap entre cards
    const totalSetWidth = (cardWidth + gap) * (cards.length / 3); // dividido por 3 porque duplicamos 3 vezes

    // Pausar animação ao hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });

    // Atualizar a duração da animação baseada no tamanho
    const duration = totalSetWidth / 50; // 50px por segundo
    track.style.animationDuration = `${duration}s`;
}

// ===================================
// COMPONENTE: SELETOR DE UNIDADES
// ===================================
function renderUnitSelector() {
    return `
    <div class="unit-selector-container">
        <div class="unit-selector-header">
            <i class="fa-solid fa-ruler-combined" aria-hidden="true"></i>
            <span class="unit-selector-title">Sistema de Medidas</span>
        </div>
        <div class="unit-selector-content">
            <label for="unit-system-select" class="visually-hidden">Selecione o sistema de medidas</label>
            <select id="unit-system-select" class="unit-system-dropdown">
                <option value="pt-BR">Sistema Internacional (SI) - Português</option>
                <option value="en">Imperial System (US) - English</option>
                <option value="en-GB">Imperial System (UK) - English</option>
                <option value="es">Sistema Internacional (SI) - Español</option>
                <option value="fr">Système International (SI) - Français</option>
                <option value="de">Internationales Einheitensystem (SI) - Deutsch</option>
                <option value="it">Sistema Internazionale (SI) - Italiano</option>
                <option value="ja">国際単位系 (SI) - 日本語</option>
                <option value="ko">국제 단위계 (SI) - 한국어</option>
                <option value="zh">国际单位制 (SI) - 中文</option>
                <option value="hi">अंतर्राष्ट्रीय प्रणाली (SI) - हिन्दी</option>
                <option value="ru">Международная система единиц (SI) - Русский</option>
                <option value="tr">Uluslararası Birim Sistemi (SI) - Türkçe</option>
                <option value="nl">Internationaal Stelsel (SI) - Nederlands</option>
                <option value="pl">Układ SI - Polski</option>
                <option value="sv">Internationella måttenhetssystemet (SI) - Svenska</option>
                <option value="uk">Міжнародна система одиниць (SI) - Українська</option>
                <option value="id">Sistem Internasional (SI) - Indonesia</option>
                <option value="vi">Hệ đo lường quốc tế (SI) - Tiếng Việt</option>
                <option value="ar">النظام الدولي للوحدات - العربية</option>
            </select>
            <div class="unit-selector-info">
                <i class="fa-solid fa-info-circle" aria-hidden="true"></i>
                <span class="unit-info-text">Os valores serão convertidos automaticamente</span>
            </div>
        </div>
    </div>`;
}

// ===================================
// COMPONENTE: INDICADORES DE UNIDADE
// ===================================
function renderUnitIndicators(type) {
    const indicators = {
        weight: `<span class="unit-indicator" data-unit-type="weight">kg</span>`,
        height: `<span class="unit-indicator" data-unit-type="height">cm</span>`,
        temperature: `<span class="unit-indicator" data-unit-type="temperature">°C</span>`,
        volume: `<span class="unit-indicator" data-unit-type="volume">mL</span>`,
        pressure: `<span class="unit-indicator" data-unit-type="pressure">mmHg</span>`
    };
    
    return indicators[type] || '';
}

console.log('✓ Componentes modulares carregados');
