/**
 * CALCULATOR ACTIONS - Ações Comuns de Calculadoras
 * Funções reutilizáveis: Calcular, Limpar, Copiar, Exportar PDF
 * Autor: Matrix Agent
 * Data: 2025-11-29
 */

const CalculatorActions = {
    // Armazena resultados calculados
    currentResults: null,
    
    // Armazena configuração da calculadora atual
    config: null,
    
    /**
     * Inicializa o módulo com configuração da calculadora
     * @param {Object} calculatorConfig - Configuração específica da calculadora
     */
    init(calculatorConfig) {
        this.config = calculatorConfig;
        console.log('✓ Calculator Actions inicializado:', calculatorConfig.name);
    },
    
    /**
     * Armazena resultados do cálculo
     * @param {Object} results - Objeto com resultados calculados
     */
    setResults(results) {
        this.currentResults = {
            ...results,
            timestamp: this.formatarData(),
            calculatorName: this.config?.name || 'Calculadora'
        };
    },
    
    /**
     * Formata data e hora atual
     * @returns {String} Data formatada (DD/MM/YYYY às HH:MM)
     */
    formatarData() {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
    },
    
    /**
     * Copia resultados para área de transferência
     */
    copiarResultado() {
        if (!this.currentResults) {
            mostrarModalFeedback('⚠️ Nenhum resultado para copiar', 'error');
            return;
        }
        
        // Gera texto formatado dos resultados
        const texto = this.gerarTextoResultados();
        
        navigator.clipboard.writeText(texto)
            .then(() => {
                mostrarModalFeedback('✅ Resultados copiados com sucesso!', 'success');
            })
            .catch(() => {
                mostrarModalFeedback('❌ Erro ao copiar resultados', 'error');
            });
    },
    
    /**
     * Gera texto formatado dos resultados para copiar
     * @returns {String} Texto formatado
     */
    gerarTextoResultados() {
        if (!this.currentResults || !this.config) return '';
        
        // Obtém configurações
        const userConfig = typeof CalculatorTabs !== 'undefined' 
            ? CalculatorTabs.getConfiguracoes() 
            : null;
        
        let texto = `${this.config.title.toUpperCase()}\n`;
        texto += '═'.repeat(this.config.title.length) + '\n\n';
        
        // Dados do Profissional (se configurado)
        if (userConfig?.pdfProfissional && (userConfig.nomeProfissional || userConfig.coren)) {
            texto += 'DADOS DO PROFISSIONAL:\n';
            if (userConfig.nomeProfissional) {
                texto += `• Nome: ${userConfig.nomeProfissional}\n`;
            }
            if (userConfig.coren) {
                texto += `• COREN: ${userConfig.coren}\n`;
            }
            texto += '\n';
        }
        
        // Adiciona dados do paciente (se configurado)
        if (userConfig?.pdfPaciente && this.currentResults.paciente) {
            texto += 'DADOS DO PACIENTE:\n';
            for (const [key, value] of Object.entries(this.currentResults.paciente)) {
                texto += `• ${key}: ${value}\n`;
            }
            texto += '\n';
        }
        
        // Adiciona parâmetros (se configurado)
        if (userConfig?.pdfParametros && this.currentResults.inputs) {
            texto += 'PARÂMETROS:\n';
            for (const [key, value] of Object.entries(this.currentResults.inputs)) {
                texto += `• ${key}: ${value}\n`;
            }
            texto += '\n';
        }
        
        // Resultado (sempre incluído - obrigatório)
        if (this.currentResults.mainResult) {
            texto += 'RESULTADO:\n';
            texto += `• ${this.currentResults.mainResult}\n\n`;
        }
        
        // Interpretação
        if (this.currentResults.interpretation) {
            texto += 'INTERPRETAÇÃO:\n';
            texto += `${this.currentResults.interpretation}\n\n`;
        }
        
        // Data e hora (sempre incluído - obrigatório)
        texto += `Data do cálculo: ${this.currentResults.timestamp}\n`;
        texto += 'Fonte: Calculadoras de Enfermagem - www.calculadorasdeenfermagem.com.br\n';
        
        return texto.trim();
    },
    
    /**
     * Exporta resultados para PDF
     */
    exportarPDF() {
        if (!this.currentResults) {
            mostrarModalFeedback('⚠️ Nenhum resultado para exportar', 'error');
            return;
        }
        
        if (typeof window.jspdf === 'undefined') {
            mostrarModalFeedback('❌ Biblioteca jsPDF não carregada', 'error');
            return;
        }
        
        try {
            // Obtém configurações do usuário
            const userConfig = typeof CalculatorTabs !== 'undefined' 
                ? CalculatorTabs.getConfiguracoes() 
                : null;
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configurações
            const margemEsq = 20;
            const larguraUtil = 170;
            let y = 20;
            
            // ====== CABEÇALHO COM LOGO ======
            doc.setFillColor(26, 62, 116);
            doc.rect(0, 0, 210, 40, 'F');
            
            // Adicionar logo (com fallback caso não carregue)
            try {
                const logoUrl = 'https://www.calculadorasdeenfermagem.com.br/iconpages.webp';
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = logoUrl;
                // Logo à esquerda: x=15, y=8, largura=30, altura=auto
                doc.addImage(img, 'WEBP', 15, 8, 30, 24);
            } catch (error) {
                console.warn('Logo não pôde ser carregado no PDF');
            }
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(this.config.title.toUpperCase(), 105, 18, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Calculadoras de Enfermagem', 105, 28, { align: 'center' });
            
            y = 50;
            
            // Linha separadora
            doc.setDrawColor(26, 62, 116);
            doc.setLineWidth(0.5);
            doc.line(margemEsq, y, 190, y);
            y += 10;
            
            // ====== DADOS DO PROFISSIONAL ======
            if (userConfig?.pdfProfissional && (userConfig.nomeProfissional || userConfig.coren)) {
                doc.setTextColor(26, 62, 116);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Dados do Profissional de Enfermagem', margemEsq, y);
                y += 8;
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                if (userConfig.nomeProfissional) {
                    doc.text(`Nome: ${userConfig.nomeProfissional}`, margemEsq, y);
                    y += 6;
                }
                if (userConfig.coren) {
                    doc.text(`COREN: ${userConfig.coren}`, margemEsq, y);
                    y += 6;
                }
                y += 6;
            }
            
            // ====== DADOS DO PACIENTE ======
            if (userConfig?.pdfPaciente && this.currentResults.paciente) {
                doc.setTextColor(26, 62, 116);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Dados do Paciente', margemEsq, y);
                y += 8;
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                for (const [key, value] of Object.entries(this.currentResults.paciente)) {
                    doc.text(`${key}: ${value}`, margemEsq, y);
                    y += 6;
                }
                y += 6;
            }
            
            // ====== PARÂMETROS ======
            if (userConfig?.pdfParametros && this.currentResults.inputs) {
                doc.setTextColor(26, 62, 116);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Parâmetros', margemEsq, y);
                y += 8;
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                for (const [key, value] of Object.entries(this.currentResults.inputs)) {
                    doc.text(`${key}: ${value}`, margemEsq, y);
                    y += 6;
                }
                y += 6;
            }
            
            // ====== RESULTADO (OBRIGATÓRIO) ======
            if (this.currentResults.mainResult) {
                doc.setTextColor(26, 62, 116);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Resultado', margemEsq, y);
                y += 8;
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.text(this.currentResults.mainResult, margemEsq, y);
                y += 10;
            }
            
            // Interpretação
            if (this.currentResults.interpretation) {
                doc.setTextColor(26, 62, 116);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Interpretação', margemEsq, y);
                y += 8;
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                
                const linhasInterpretacao = doc.splitTextToSize(this.currentResults.interpretation, larguraUtil);
                doc.text(linhasInterpretacao, margemEsq, y);
                y += (linhasInterpretacao.length * 5) + 10;
            }
            
            // ====== METAS DE SEGURANÇA ======
            if (userConfig?.pdfMetasSeguranca) {
                this.adicionarMetasSeguranca(doc, margemEsq, y, larguraUtil);
                y += 40; // Espaço reservado para metas
            }
            
            // ====== 9 ACERTOS ======
            if (userConfig?.pdf9Acertos) {
                this.adicionar9Acertos(doc, margemEsq, y, larguraUtil);
                y += 40; // Espaço reservado para 9 acertos
            }
            
            // ====== AUDITORIA ======
            if (userConfig?.pdfAuditoria) {
                this.adicionarAuditoria(doc, margemEsq, y, larguraUtil);
                y += 30; // Espaço reservado para auditoria
            }
            
            // ====== OBSERVAÇÕES ======
            if (userConfig?.pdfObservacoes) {
                this.adicionarCampoObservacoes(doc, margemEsq, y, larguraUtil);
                y += 25; // Espaço reservado para observações
            }
            
            // ====== AVISO LEGAL E DECLARAÇÃO DE CIÊNCIA (OBRIGATÓRIO) ======
            // Verificar se precisa de nova página
            if (y > 230) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFillColor(255, 245, 245);
            doc.rect(margemEsq - 5, y, larguraUtil + 10, 40, 'F');
            
            doc.setDrawColor(220, 38, 38);
            doc.setLineWidth(1);
            doc.line(margemEsq - 5, y, margemEsq - 5, y + 40);
            
            doc.setTextColor(153, 27, 27);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('⚠ Aviso Legal e Declaração de Ciência', margemEsq, y + 8);
            
            doc.setTextColor(80, 80, 80);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const avisoTexto = [
                'Esta calculadora é uma ferramenta auxiliar de apoio à decisão clínica. Os resultados devem',
                'ser sempre interpretados por profissional habilitado e confrontados com a avaliação clínica',
                'do paciente. O uso inadequado desta ferramenta pode resultar em erros terapêuticos.',
                '',
                'Declaro que conferi os dados inseridos e assumo total responsabilidade pela utilização',
                'dos resultados obtidos na prática clínica.'
            ];
            
            let avisoY = y + 15;
            avisoTexto.forEach(linha => {
                doc.text(linha, margemEsq, avisoY);
                avisoY += 5;
            });
            
            y += 45;
            
            // ====== QR CODE ======
            if (userConfig?.pdfQRCode) {
                // Reserva espaço para QR Code (implementação futura)
                doc.setTextColor(150, 150, 150);
                doc.setFontSize(9);
                doc.text('[QR Code - Em desenvolvimento]', margemEsq, y);
                y += 20;
            }
            
            // ====== RODAPÉ (TIMESTAMP OBRIGATÓRIO) ======
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margemEsq, 270, 190, 270);
            
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`Data: ${this.currentResults.timestamp}`, margemEsq, 278);
            doc.text('Calculadoras de Enfermagem - www.calculadorasdeenfermagem.com.br', margemEsq, 285);
            
            // Salvar PDF
            const nomeArquivo = `${this.config.filename || 'resultado'}.pdf`;
            doc.save(nomeArquivo);
            
            mostrarModalFeedback('✅ PDF gerado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            mostrarModalFeedback('❌ Erro ao gerar PDF', 'error');
        }
    },
    
    /**
     * Adiciona Metas de Segurança ao PDF
     */
    adicionarMetasSeguranca(doc, x, y, largura) {
        doc.setTextColor(26, 62, 116);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Metas Internacionais de Segurança do Paciente', x, y);
        y += 7;
        
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const texto = doc.splitTextToSize(
            '1. Identificar pacientes corretamente | 2. Melhorar comunicação | 3. Melhorar segurança de medicamentos | ' +
            '4. Assegurar cirurgias corretas | 5. Reduzir risco de infecções | 6. Reduzir risco de quedas',
            largura
        );
        doc.text(texto, x, y);
    },
    
    /**
     * Adiciona 9 Acertos de Medicamentos ao PDF
     */
    adicionar9Acertos(doc, x, y, largura) {
        doc.setTextColor(26, 62, 116);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('9 Acertos de Medicamentos', x, y);
        y += 7;
        
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const texto = doc.splitTextToSize(
            '1. Paciente certo | 2. Medicamento certo | 3. Via certa | 4. Hora certa | 5. Dose certa | ' +
            '6. Registro certo | 7. Orientação certa | 8. Forma certa | 9. Resposta certa',
            largura
        );
        doc.text(texto, x, y);
    },
    
    /**
     * Adiciona Auditoria ao PDF
     */
    adicionarAuditoria(doc, x, y, largura) {
        doc.setTextColor(26, 62, 116);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Auditoria do Cálculo', x, y);
        y += 7;
        
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Cálculo realizado em: ${this.currentResults.timestamp}`, x, y);
        y += 5;
        doc.text(`Calculadora: ${this.config.title}`, x, y);
        y += 5;
        doc.text('Resultado conferido: [ ] Sim [ ] Não', x, y);
    },
    
    /**
     * Adiciona Campo de Observações ao PDF
     */
    adicionarCampoObservacoes(doc, x, y, largura) {
        doc.setTextColor(26, 62, 116);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Observações', x, y);
        y += 7;
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        // Desenha linhas para observações
        for (let i = 0; i < 3; i++) {
            doc.line(x, y + (i * 6), x + largura, y + (i * 6));
        }
    },
    
    /**
     * Limpa formulário e resultados
     * @param {Array} fieldIds - IDs dos campos a limpar
     * @param {Array} resultContainers - IDs dos containers de resultado a resetar
     */
    limparFormulario(fieldIds = [], resultContainers = []) {
        // Limpa campos de entrada
        fieldIds.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = false;
                } else {
                    field.value = '';
                }
            }
        });
        
        // Reseta containers de resultado
        resultContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400">Preencha os dados para calcular</div>';
                container.classList.add('hidden');
            }
        });
        
        // Esconde botões de ação
        const botoesAcao = document.getElementById('action-buttons');
        if (botoesAcao) {
            botoesAcao.classList.add('hidden');
        }
        
        // Limpa resultados armazenados
        this.currentResults = null;
        
        console.log('✓ Formulário limpo');
    },
    
    /**
     * Valida campo numérico
     * @param {String} fieldId - ID do campo
     * @param {String} label - Nome do campo para mensagem
     * @param {Number} min - Valor mínimo (opcional)
     * @param {Number} max - Valor máximo (opcional)
     * @returns {Number|null} Valor validado ou null se inválido
     */
    validarCampoNumerico(fieldId, label, min = null, max = null) {
        const valor = parseFloat(document.getElementById(fieldId)?.value);
        
        if (isNaN(valor) || valor === null || valor === undefined) {
            alert(`Por favor, insira ${label}`);
            return null;
        }
        
        if (min !== null && valor < min) {
            alert(`${label} deve ser maior ou igual a ${min}`);
            return null;
        }
        
        if (max !== null && valor > max) {
            alert(`${label} deve ser menor ou igual a ${max}`);
            return null;
        }
        
        return valor;
    },
    
    /**
     * Valida campo obrigatório
     * @param {String} fieldId - ID do campo
     * @param {String} label - Nome do campo para mensagem
     * @returns {String|null} Valor ou null se vazio
     */
    validarCampoObrigatorio(fieldId, label) {
        const valor = document.getElementById(fieldId)?.value;
        
        if (!valor || valor.trim() === '') {
            alert(`Por favor, selecione ${label}`);
            return null;
        }
        
        return valor;
    }
};

// Exporta para uso global
window.CalculatorActions = CalculatorActions;

console.log('✓ Módulo Calculator Actions carregado');