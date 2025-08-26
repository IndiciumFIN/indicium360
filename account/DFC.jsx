import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, AlertCircle, CheckCircle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

function DFC() {
  const [periodoInicial, setPeriodoInicial] = useState('')
  const [periodoFinal, setPeriodoFinal] = useState('')
  const [metodo, setMetodo] = useState('indireto')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [dfc, setDfc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarDfc = async () => {
    if (!periodoInicial || !periodoFinal) {
      setError('Período inicial e final são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/dfc/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo_inicial: periodoInicial,
          periodo_final: periodoFinal,
          metodo: metodo,
          versao_balancete: versaoBalancete,
          versao_plano_contas: versaoPlanoContas
        })
      })

      const data = await response.json()

      if (data.success) {
        setDfc(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar DFC: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarDfc = async () => {
    if (!periodoInicial || !periodoFinal) {
      setError('Período inicial e final são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/dfc/${periodoInicial}/${periodoFinal}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setDfc(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar DFC: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const renderLinhaDfc = (linha, index) => {
    const getStyleByTipo = (tipo) => {
      switch (tipo) {
        case 'titulo_secao':
          return 'text-lg font-bold text-gray-900 bg-gray-50 p-3 rounded mt-4'
        case 'subtitulo':
          return 'text-base font-semibold text-gray-800 bg-gray-100 p-2 rounded'
        case 'item':
          return 'text-sm text-gray-700'
        case 'total_secao':
          return 'text-base font-semibold text-blue-600 border-t pt-2 bg-blue-50 p-2 rounded'
        case 'resultado':
          return 'text-lg font-bold text-purple-600 border-t-2 pt-3'
        case 'saldo':
          return 'text-base font-semibold text-green-600'
        default:
          return 'text-sm text-gray-700'
      }
    }

    return (
      <div key={index} className={`flex justify-between items-center py-2 ${getStyleByTipo(linha.tipo)}`}>
        <span className={linha.nivel > 1 ? `ml-${(linha.nivel - 1) * 4}` : ''}>
          {linha.descricao}
        </span>
        {linha.valor !== null && linha.valor !== undefined && (
          <span className="font-mono">
            {formatCurrency(linha.valor)}
          </span>
        )}
      </div>
    )
  }

  const renderFluxoDetalhado = (fluxo, titulo, cor) => {
    if (!fluxo || !fluxo.itens || fluxo.itens.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          Nenhum item encontrado para {titulo}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {fluxo.itens.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{item.descricao}</div>
              <div className="text-sm text-gray-600">
                Código: {item.codigo} | Tipo: {item.tipo}
              </div>
            </div>
            <div className={`font-mono font-semibold ${item.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(item.valor)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DFC - Demonstração do Fluxo de Caixa</h2>
          <p className="text-gray-600">Geração e visualização da DFC</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar DFC
          </CardTitle>
          <CardDescription>
            Informe os períodos para comparação e gerar a DFC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="periodoInicial">Período Inicial (YYYY-MM)</Label>
              <Input
                id="periodoInicial"
                type="text"
                placeholder="2023-12"
                value={periodoInicial}
                onChange={(e) => setPeriodoInicial(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <Label htmlFor="periodoFinal">Período Final (YYYY-MM)</Label>
              <Input
                id="periodoFinal"
                type="text"
                placeholder="2024-12"
                value={periodoFinal}
                onChange={(e) => setPeriodoFinal(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="metodo">Método</Label>
              <Select value={metodo} onValueChange={setMetodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indireto">Método Indireto</SelectItem>
                  <SelectItem value="direto" disabled>Método Direto (Em breve)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="versaoBalancete">Versão do Balancete</Label>
              <Input
                id="versaoBalancete"
                type="text"
                value={versaoBalancete}
                onChange={(e) => setVersaoBalancete(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="versaoPlanoContas">Versão do Plano de Contas</Label>
            <Input
              id="versaoPlanoContas"
              type="text"
              value={versaoPlanoContas}
              onChange={(e) => setVersaoPlanoContas(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={gerarDfc} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DFC'}
            </Button>
            <Button variant="outline" onClick={carregarDfc} disabled={loading}>
              Carregar Existente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Resultado da DFC */}
      {dfc && (
        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resumo do Fluxo de Caixa
              </CardTitle>
              <CardDescription>
                Método: {dfc.metodo} | Período: {dfc.periodo_inicial} → {dfc.periodo_final}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className={`text-lg font-bold ${dfc.fluxo_operacional.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dfc.fluxo_operacional.total)}
                  </div>
                  <div className="text-sm text-gray-600">Fluxo Operacional</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${dfc.fluxo_investimento.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dfc.fluxo_investimento.total)}
                  </div>
                  <div className="text-sm text-gray-600">Fluxo Investimento</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${dfc.fluxo_financiamento.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dfc.fluxo_financiamento.total)}
                  </div>
                  <div className="text-sm text-gray-600">Fluxo Financiamento</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${dfc.variacao_caixa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dfc.variacao_caixa)}
                  </div>
                  <div className="text-sm text-gray-600">Variação Caixa</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(dfc.saldo_final_caixa)}
                  </div>
                  <div className="text-sm text-gray-600">Saldo Final</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DFC Estruturada */}
          <Card>
            <CardHeader>
              <CardTitle>DFC Estruturada</CardTitle>
              <CardDescription>
                Demonstração do Fluxo de Caixa pelo método {dfc.metodo}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dfc.estrutura_dfc && dfc.estrutura_dfc.linhas && dfc.estrutura_dfc.linhas.map((linha, index) => 
                  renderLinhaDfc(linha, index)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento dos Fluxos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fluxo Operacional Detalhado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fluxo Operacional</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dfc.fluxo_operacional.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Lucro Líquido Base</h4>
                    <div className="text-lg font-mono text-blue-600">
                      {formatCurrency(dfc.fluxo_operacional.lucro_liquido)}
                    </div>
                  </div>
                  
                  {dfc.fluxo_operacional.ajustes && dfc.fluxo_operacional.ajustes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Ajustes</h4>
                      <div className="space-y-2">
                        {dfc.fluxo_operacional.ajustes.map((ajuste, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{ajuste.descricao}</span>
                            <span className="font-mono">{formatCurrency(ajuste.valor)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Variações Capital de Giro</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Ativo Circulante</span>
                        <span className="font-mono">{formatCurrency(dfc.fluxo_operacional.variacoes_capital_giro.variacao_ativo_circulante)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passivo Circulante</span>
                        <span className="font-mono">{formatCurrency(dfc.fluxo_operacional.variacoes_capital_giro.variacao_passivo_circulante)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fluxo de Investimento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Fluxo de Investimento</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dfc.fluxo_investimento.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFluxoDetalhado(dfc.fluxo_investimento, 'Investimentos', 'purple')}
              </CardContent>
            </Card>

            {/* Fluxo de Financiamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Fluxo de Financiamento</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dfc.fluxo_financiamento.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFluxoDetalhado(dfc.fluxo_financiamento, 'Financiamentos', 'orange')}
              </CardContent>
            </Card>
          </div>

          {/* Evolução do Caixa */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Caixa</CardTitle>
              <CardDescription>
                Movimentação do caixa e equivalentes no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dfc.saldo_inicial_caixa)}
                  </div>
                  <div className="text-sm text-gray-600">Saldo Inicial</div>
                  <div className="text-xs text-gray-500">{dfc.periodo_inicial}</div>
                </div>
                
                <div className="text-center">
                  {dfc.variacao_caixa >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600 mx-auto" />
                  )}
                  <div className={`text-lg font-semibold ${dfc.variacao_caixa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dfc.variacao_caixa)}
                  </div>
                  <div className="text-sm text-gray-600">Variação</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(dfc.saldo_final_caixa)}
                  </div>
                  <div className="text-sm text-gray-600">Saldo Final</div>
                  <div className="text-xs text-gray-500">{dfc.periodo_final}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DFC

