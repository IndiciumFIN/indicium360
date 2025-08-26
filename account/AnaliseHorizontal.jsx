import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Calculator, AlertCircle, CheckCircle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

function AnaliseHorizontal() {
  const [periodoBase, setPeriodoBase] = useState('')
  const [periodoComparacao, setPeriodoComparacao] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [analise, setAnalise] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarAnalise = async () => {
    if (!periodoBase || !periodoComparacao) {
      setError('Período base e período de comparação são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/analises/analise-horizontal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo_base: periodoBase,
          periodo_comparacao: periodoComparacao,
          versao_balancete: versaoBalancete
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalise(data.data)
        setSuccess('Análise horizontal gerada com sucesso!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar análise horizontal: ' + err.message)
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

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'crescimento_forte':
      case 'crescimento_moderado':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decrescimo_forte':
      case 'decrescimo_moderado':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getTendenciaColor = (tendencia) => {
    switch (tendencia) {
      case 'crescimento_forte':
        return 'bg-green-100 text-green-800'
      case 'crescimento_moderado':
        return 'bg-green-50 text-green-700'
      case 'decrescimo_moderado':
        return 'bg-red-50 text-red-700'
      case 'decrescimo_forte':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTendenciaLabel = (tendencia) => {
    const labels = {
      'crescimento_forte': 'Crescimento Forte',
      'crescimento_moderado': 'Crescimento Moderado',
      'decrescimo_moderado': 'Decréscimo Moderado',
      'decrescimo_forte': 'Decréscimo Forte'
    }
    return labels[tendencia] || tendencia
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análise Horizontal</h2>
          <p className="text-gray-600">Comparação entre períodos para identificar tendências</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar Análise Horizontal
          </CardTitle>
          <CardDescription>
            Compare dois períodos para identificar variações e tendências
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="periodoBase">Período Base (YYYY-MM)</Label>
              <Input
                id="periodoBase"
                type="text"
                placeholder="2023-12"
                value={periodoBase}
                onChange={(e) => setPeriodoBase(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <Label htmlFor="periodoComparacao">Período Comparação (YYYY-MM)</Label>
              <Input
                id="periodoComparacao"
                type="text"
                placeholder="2024-12"
                value={periodoComparacao}
                onChange={(e) => setPeriodoComparacao(e.target.value)}
              />
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
          
          <div className="flex gap-2">
            <Button onClick={gerarAnalise} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Análise'}
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

      {/* Resultado da Análise */}
      {analise && (
        <div className="space-y-6">
          {/* Resumo da Análise */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Análise</CardTitle>
              <CardDescription>
                Comparação: {analise.periodo_base} → {analise.periodo_comparacao}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analise.resumo.total_contas}
                  </div>
                  <div className="text-sm text-gray-600">Total de Contas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analise.resumo.contas_crescimento}
                  </div>
                  <div className="text-sm text-gray-600">Contas em Crescimento</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analise.resumo.contas_decrescimo}
                  </div>
                  <div className="text-sm text-gray-600">Contas em Decréscimo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maiores Variações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maiores Crescimentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Maiores Crescimentos</CardTitle>
                <CardDescription>
                  Top 5 contas com maior crescimento percentual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analise.resumo.maiores_crescimentos.slice(0, 5).map((conta, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{conta.nome_conta}</div>
                        <div className="text-sm text-gray-600">Código: {conta.codigo_conta}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatPercentage(conta.variacao_percentual)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(conta.variacao_absoluta)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maiores Decréscimos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Maiores Decréscimos</CardTitle>
                <CardDescription>
                  Top 5 contas com maior decréscimo percentual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analise.resumo.maiores_decrescimos.slice(0, 5).map((conta, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{conta.nome_conta}</div>
                        <div className="text-sm text-gray-600">Código: {conta.codigo_conta}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          {formatPercentage(conta.variacao_percentual)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(conta.variacao_absoluta)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Completa */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Horizontal Completa</CardTitle>
              <CardDescription>
                Todas as contas com suas respectivas variações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome da Conta</TableHead>
                      <TableHead className="text-right">Saldo Base</TableHead>
                      <TableHead className="text-right">Saldo Comparação</TableHead>
                      <TableHead className="text-right">Variação Absoluta</TableHead>
                      <TableHead className="text-right">Variação %</TableHead>
                      <TableHead className="text-center">Tendência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analise.analise_horizontal.slice(0, 50).map((conta, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{conta.codigo_conta}</TableCell>
                        <TableCell className="font-medium">{conta.nome_conta}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(conta.saldo_base)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(conta.saldo_comparacao)}
                        </TableCell>
                        <TableCell className={`text-right font-mono ${conta.variacao_absoluta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(conta.variacao_absoluta)}
                        </TableCell>
                        <TableCell className={`text-right font-mono font-semibold ${conta.variacao_percentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(conta.variacao_percentual)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {getTendenciaIcon(conta.tendencia)}
                            <Badge className={getTendenciaColor(conta.tendencia)} variant="outline">
                              {getTendenciaLabel(conta.tendencia)}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {analise.analise_horizontal.length > 50 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  Mostrando 50 de {analise.analise_horizontal.length} contas. 
                  Use filtros para refinar a visualização.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AnaliseHorizontal

