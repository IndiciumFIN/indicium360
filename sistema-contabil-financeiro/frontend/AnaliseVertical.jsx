import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Calculator, AlertCircle, CheckCircle, PieChart } from 'lucide-react'

function AnaliseVertical() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [analise, setAnalise] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarAnalise = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/analises/analise-vertical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo,
          versao_balancete: versaoBalancete
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalise(data.data)
        setSuccess('Análise vertical gerada com sucesso!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar análise vertical: ' + err.message)
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
    return `${value.toFixed(1)}%`
  }

  const getElementoLabel = (elemento) => {
    const labels = {
      'ativo': 'Ativo',
      'passivo': 'Passivo',
      'patrimonio_liquido': 'Patrimônio Líquido',
      'receita': 'Receitas',
      'custo': 'Custos',
      'despesa': 'Despesas'
    }
    return labels[elemento] || elemento
  }

  const getElementoColor = (elemento) => {
    const colors = {
      'ativo': 'blue',
      'passivo': 'red',
      'patrimonio_liquido': 'green',
      'receita': 'purple',
      'custo': 'orange',
      'despesa': 'pink'
    }
    return colors[elemento] || 'gray'
  }

  const getRelevanciaColor = (classificacao) => {
    const colors = {
      'muito_relevante': 'bg-red-100 text-red-800',
      'relevante': 'bg-orange-100 text-orange-800',
      'moderadamente_relevante': 'bg-yellow-100 text-yellow-800',
      'pouco_relevante': 'bg-gray-100 text-gray-800'
    }
    return colors[classificacao] || 'bg-gray-100 text-gray-800'
  }

  const getRelevanciaLabel = (classificacao) => {
    const labels = {
      'muito_relevante': 'Muito Relevante',
      'relevante': 'Relevante',
      'moderadamente_relevante': 'Moderadamente Relevante',
      'pouco_relevante': 'Pouco Relevante'
    }
    return labels[classificacao] || classificacao
  }

  const renderElementoCard = (elemento, dados) => {
    const cor = getElementoColor(elemento)
    const label = getElementoLabel(elemento)
    
    return (
      <Card key={elemento} className={`border-l-4 border-${cor}-500`}>
        <CardHeader>
          <CardTitle className={`text-${cor}-600 flex items-center`}>
            <PieChart className="h-5 w-5 mr-2" />
            {label}
          </CardTitle>
          <CardDescription>
            Total: {formatCurrency(dados.total)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Resumo do Elemento */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">{analise.resumo[elemento]?.total_contas || 0}</div>
                <div className="text-gray-600">Total de Contas</div>
              </div>
              <div>
                <div className="font-semibold">{analise.resumo[elemento]?.contas_relevantes || 0}</div>
                <div className="text-gray-600">Contas Relevantes</div>
              </div>
            </div>

            {/* Top 5 Contas */}
            <div>
              <h4 className="font-semibold mb-3">Principais Contas</h4>
              <div className="space-y-3">
                {dados.contas.slice(0, 5).map((conta, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{conta.nome_conta}</div>
                        <div className="text-xs text-gray-600">Código: {conta.codigo_conta}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatPercentage(conta.percentual)}</div>
                        <div className="text-xs text-gray-600">{formatCurrency(conta.saldo)}</div>
                      </div>
                    </div>
                    <Progress value={conta.percentual} className="h-2" />
                    <div className="flex justify-end">
                      <Badge 
                        className={getRelevanciaColor(conta.classificacao)} 
                        variant="outline"
                      >
                        {getRelevanciaLabel(conta.classificacao)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concentração Top 3 */}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Concentração Top 3:</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(analise.resumo[elemento]?.concentracao_top3 || 0)}
                </span>
              </div>
              <Progress 
                value={analise.resumo[elemento]?.concentracao_top3 || 0} 
                className="h-2 mt-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análise Vertical</h2>
          <p className="text-gray-600">Análise da composição percentual das contas</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar Análise Vertical
          </CardTitle>
          <CardDescription>
            Analise a composição percentual das contas para um período específico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodo">Período (YYYY-MM)</Label>
              <Input
                id="periodo"
                type="text"
                placeholder="2024-12"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
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
          {/* Informações do Período */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Vertical - {analise.periodo}</CardTitle>
              <CardDescription>
                Composição percentual das contas por elemento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analise.resumo).map(([elemento, resumo]) => (
                  <div key={elemento} className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {resumo.total_contas}
                    </div>
                    <div className="text-sm text-gray-600">{getElementoLabel(elemento)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {resumo.contas_relevantes} relevantes
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise por Elemento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(analise.analise_vertical).map(([elemento, dados]) => 
              renderElementoCard(elemento, dados)
            )}
          </div>

          {/* Detalhamento Completo */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento Completo</CardTitle>
              <CardDescription>
                Todas as contas com seus respectivos percentuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(analise.analise_vertical).map(([elemento, dados]) => (
                  <div key={elemento}>
                    <h3 className={`text-lg font-semibold text-${getElementoColor(elemento)}-600 mb-3`}>
                      {getElementoLabel(elemento)} - {formatCurrency(dados.total)}
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Código</th>
                            <th className="text-left py-2">Nome da Conta</th>
                            <th className="text-right py-2">Saldo</th>
                            <th className="text-right py-2">Percentual</th>
                            <th className="text-center py-2">Relevância</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dados.contas.map((conta, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-2 font-mono text-xs">{conta.codigo_conta}</td>
                              <td className="py-2 font-medium">{conta.nome_conta}</td>
                              <td className="py-2 text-right font-mono">{formatCurrency(conta.saldo)}</td>
                              <td className="py-2 text-right font-mono font-semibold">
                                {formatPercentage(conta.percentual)}
                              </td>
                              <td className="py-2 text-center">
                                <Badge 
                                  className={getRelevanciaColor(conta.classificacao)} 
                                  variant="outline"
                                >
                                  {getRelevanciaLabel(conta.classificacao)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AnaliseVertical

