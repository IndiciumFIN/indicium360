# Sistema de Demonstrações Financeiras

Sistema completo para elaboração de demonstrações financeiras com funcionalidades de cadastro de plano de contas, importação de balancetes, geração de relatórios contábeis e análises financeiras.

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Demonstrações Financeiras
- **Balanço Patrimonial** - Geração automática com verificação de equilíbrio
- **DRE (Demonstração do Resultado do Exercício)** - Estruturada e detalhada
- **DRA (Demonstração do Resultado Abrangente)** - Conforme normas contábeis
- **DMPL (Demonstração das Mutações do Patrimônio Líquido)** - Movimentações do PL
- **DFC (Demonstração do Fluxo de Caixa)** - Método indireto
- **DVA (Demonstração do Valor Adicionado)** - Distribuição detalhada

### ✅ Análises Financeiras
- **Análise Horizontal** - Comparação entre períodos
- **Análise Vertical** - Participação percentual
- **Indicadores Financeiros** - Liquidez, rentabilidade, endividamento e atividade

### ✅ Cadastro de Empresas
- **Consulta CNPJ** - Integração com APIs da Receita Federal (ReceitaWS, BrasilAPI, CNPJ.ws)
- **Validação de CNPJ** - Algoritmo de validação oficial
- **Armazenamento de dados** - Histórico de consultas e dados empresariais
- **Gerenciamento** - CRUD completo de empresas

### 🔄 Em Desenvolvimento
- Cadastro de Plano de Contas (5 níveis hierárquicos)
- Importação de Balancetes (até 36 versões)
- Geração de Notas Explicativas

## ESTADO ATUAL DO PROJETO:

### ✅ Já Implementado:
- **Backend completo** - Flask com SQLAlchemy
- **Frontend completo** - React com Tailwind CSS e shadcn/ui
- **Modelos de dados** - Empresa, Plano de Contas, Balancetes, Demonstrações
- **APIs RESTful** - Demonstrações, análises e empresas
- **Serviços de negócio** - Geração de todas as demonstrações financeiras
- **Integração RFB** - Consulta automática de CNPJ com múltiplas APIs
- **Interface responsiva** - Todas as páginas funcionais
- **Validações** - CNPJ e dados de entrada

### 🔄 Próximos Passos:
1. Implementar cadastro completo de Plano de Contas
2. Desenvolver importação de Balancetes
3. Criar geração de Notas Explicativas
4. Adicionar exportação para PDF
5. Implementar comparativos entre períodos

## TECNOLOGIAS UTILIZADAS:
- Backend: Flask (Python)
- Frontend: React com Tailwind CSS e shadcn/ui
- Banco de dados: SQLite (para desenvolvimento)

## ESTRUTURA DE DIRETÓRIOS:
- financial_statements_app/
  - backend/
    - financial_statements/ (aplicação Flask)
  - frontend/
    - financial-statements-frontend/ (aplicação React)

## INSTRUÇÕES PARA EXECUÇÃO:
1.  Para o backend:
    ```bash
    cd financial_statements_app/backend/financial_statements
    source venv/bin/activate
    python src/main.py
    ```

2.  Para o frontend:
    ```bash
    cd financial_statements_app/frontend/financial-statements-frontend
    pnpm run dev --host
    ```

3.  Acesse a aplicação em: http://localhost:5173


