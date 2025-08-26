import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Calculator, AlertCircle, CheckCircle, TrendingUp, DollarSign, Activity, Shield } from 'lucide-react'

function IndicadoresFinanceiros() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [indicadores, setIndicadores] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarIndicadores = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/analises/indicadores-financeiros', {
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
        setIndicadores(data.data)
        setSuccess('Indicadores financeiros calculados com sucesso!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao calcular indicadores financeiros: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getIndicadorColor = (valor, tipo) => {
    // Definir cores baseadas no tipo de indicador e valor
    switch (tipo) {
      case 'liquidez':
        if (valor >= 1.5) return 'text-green-600'
        if (valor >= 1.0) return 'text-yellow-600'
        return 'text-red-600'
      case 'rentabilidade':
        if (valor >= 15) return 'text-green-600'
        if (valor >= 5) return 'text-yellow-600'
        return 'text-red-600'
      case 'endividamento':
        if (valor <= 30) return 'text-green-600'
        if (valor <= 50) return 'text-yellow-600'
        return 'text-red-600'
      case 'atividade':
        if (valor >= 2.0) return 'text-green-600'
        if (valor >= 1.0) return 'text-yellow-600'
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusColor = (interpretacao) => {
    if (interpretacao.includes('excelente') || interpretacao.includes('boa') || interpretacao.includes('saudável')) {
      return 'bg-green-100 text-green-800'
    }
    if (interpretacao.includes('adequada') || interpretacao.includes('moderada')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (interpretacao.includes('baixa') || interpretacao.includes('alta') || interpretacao.includes('atenção')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const renderIndicadorCard = (titulo, icone, indicadoresGrupo, tipo) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {icone}
            <span className="ml-2">{titulo}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(indicadoresGrupo).map(([key, indicador]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-lg font-bold ${getIndicadorColor(indicador.valor, tipo)}`}>
                    {tipo === 'rentabilidade' || tipo === 'endividamento' ? 
                      `${indicador.valor}%` : 
                      indicador.valor.toFixed(2)
                    }
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {indicador.interpretacao}
                </div>
                
                <Badge className={getStatusColor(indicador.interpretacao)} variant="outline">
                  {indicador.interpretacao.split(' ')[0]}
                </Badge>
                
                {/* Barra de progresso visual para alguns indicadores */}
                {(tipo === 'liquidez' || tipo === 'rentabilidade') && (
                  <Progress 
                    value={Math.min(indicador.valor * (tipo === 'liquidez' ? 50 : 5), 100)} 
                    className="h-2" 
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderInterpretacao = (interpretacao) => {
    const getSituacaoColor = (situacao) => {
      if (situacao.includes('Boa') || situacao.includes('Excelente')) return 'text-green-600'
      if (situacao.includes('Adequada') || situacao.includes('Moderada')) return 'text-yellow-600'
      return 'text-red-600'
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Interpretação Geral</CardTitle>
          <CardDescription>
            Análise consolidada dos indicadores financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Situação Geral */}
            <div>
              <h4 className={`font-semibold ${getSituacaoColor(interpretacao.situacao_geral)}`}>
                {interpretacao.situacao_geral}
              </h4>
            </div>

            {/* Pontos Fortes */}
            {interpretacao.pontos_fortes.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Pontos Fortes</h4>
                <ul className="space-y-1">
                  {interpretacao.pontos_fortes.map((ponto, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pontos de Atenção */}
            {interpretacao.pontos_atencao.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Pontos de Atenção</h4>
                <ul className="space-y-1">
                  {interpretacao.pontos_atencao.map((ponto, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendações */}
            {interpretacao.recomendacoes.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Recomendações</h4>
                <ul className="space-y-1">
                  {interpretacao.recomendacoes.map((recomendacao, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                      {recomendacao}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Indicadores Financeiros</h2>
          <p className="text-gray-600">Análise de liquidez, rentabilidade, endividamento e atividade</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Calcular Indicadores Financeiros
          </CardTitle>
          <CardDescription>
            Calcule os principais indicadores financeiros para análise da empresa
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
            <Button onClick={gerarIndicadores} disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Indicadores'}
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

      {/* Resultado dos Indicadores */}
      {indicadores && (
        <div className="space-y-6">
          {/* Informações do Período */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores Financeiros - {indicadores.periodo}</CardTitle>
              <CardDescription>
                Análise dos principais indicadores de desempenho financeiro
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Grid de Indicadores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Indicadores de Liquidez */}
            {renderIndicadorCard(
              'Indicadores de Liquidez',
              <DollarSign className="h-5 w-5 text-blue-600" />,
              indicadores.indicadores.liquidez,
              'liquidez'
            )}

            {/* Indicadores de Rentabilidade */}
            {renderIndicadorCard(
              'Indicadores de Rentabilidade',
              <TrendingUp className="h-5 w-5 text-green-600" />,
              indicadores.indicadores.rentabilidade,
              'rentabilidade'
            )}

            {/* Indicadores de Endividamento */}
            {renderIndicadorCard(
              'Indicadores de Endividamento',
              <Shield className="h-5 w-5 text-red-600" />,
              indicadores.indicadores.endividamento,
              'endividamento'
            )}

            {/* Indicadores de Atividade */}
            {renderIndicadorCard(
              'Indicadores de Atividade',
              <Activity className="h-5 w-5 text-purple-600" />,
              indicadores.indicadores.atividade,
              'atividade'
            )}
          </div>

          {/* Interpretação Geral */}
          {renderInterpretacao(indicadores.interpretacao)}

          {/* Resumo dos Indicadores */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Indicadores</CardTitle>
              <CardDescription>
                Visão consolidada de todos os indicadores calculados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Categoria</th>
                      <th className="text-left py-2">Indicador</th>
                      <th className="text-right py-2">Valor</th>
                      <th className="text-left py-2">Interpretação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(indicadores.indicadores).map(([categoria, indicadoresGrupo]) =>
                      Object.entries(indicadoresGrupo).map(([indicador, dados]) => (
                        <tr key={`${categoria}-${indicador}`} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium capitalize">{categoria}</td>
                          <td className="py-2 capitalize">{indicador.replace(/_/g, ' ')}</td>
                          <td className={`py-2 text-right font-mono font-semibold ${getIndicadorColor(dados.valor, categoria)}`}>
                            {categoria === 'rentabilidade' || categoria === 'endividamento' ? 
                              `${dados.valor}%` : 
                              dados.valor.toFixed(2)
                            }
                          </td>
                          <td className="py-2">
                            <Badge className={getStatusColor(dados.interpretacao)} variant="outline">
                              {dados.interpretacao}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default IndicadoresFinanceiros

