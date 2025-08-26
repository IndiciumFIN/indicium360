import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Calculator, AlertCircle, CheckCircle, PieChart, Users, Building, DollarSign } from 'lucide-react'

function DVA() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [dva, setDva] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarDva = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/dva/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo,
          versao_balancete: versaoBalancete,
          versao_plano_contas: versaoPlanoContas
        })
      })

      const data = await response.json()

      if (data.success) {
        setDva(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar DVA: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarDva = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/dva/${periodo}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setDva(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar DVA: ' + err.message)
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

  const formatPercentage = (value, total) => {
    if (!total || total === 0) return '0%'
    return ((value / total) * 100).toFixed(1) + '%'
  }

  const renderLinhaDva = (linha, index) => {
    const getStyleByTipo = (tipo) => {
      switch (tipo) {
        case 'titulo_principal':
          return 'text-xl font-bold text-gray-900 bg-gray-100 p-4 rounded-lg mt-6'
        case 'titulo_secao':
          return 'text-lg font-semibold text-gray-800 bg-gray-50 p-3 rounded'
        case 'item':
          return 'text-sm text-gray-700'
        case 'subtotal':
          return 'text-base font-semibold text-blue-600 border-t pt-2'
        case 'total_principal':
          return 'text-lg font-bold text-green-600 bg-green-50 p-3 rounded border-2 border-green-200'
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

  const renderDistribuicaoCard = (tipo, dados, icon, cor) => {
    if (!dados || dados.valor === 0) return null

    const porcentagem = formatPercentage(dados.valor, dva?.geracao_valor_adicionado?.valor_adicionado_total || 0)

    return (
      <Card className={`border-l-4 border-${cor}-500`}>
        <CardHeader className="pb-3">
          <CardTitle className={`text-${cor}-600 flex items-center text-lg`}>
            {icon}
            <span className="ml-2">{getTipoDistribuicaoLabel(tipo)}</span>
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold text-${cor}-600`}>
              {formatCurrency(dados.valor)}
            </div>
            <Badge variant="outline" className={`text-${cor}-600`}>
              {porcentagem}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress 
            value={(dados.valor / (dva?.geracao_valor_adicionado?.valor_adicionado_total || 1)) * 100} 
            className="mb-3"
          />
          {dados.itens && dados.itens.length > 0 && (
            <div className="space-y-2">
              {dados.itens.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate">{item.descricao}</span>
                  <span className="font-mono">{formatCurrency(item.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const getTipoDistribuicaoLabel = (tipo) => {
    const labels = {
      'pessoal': 'Pessoal',
      'impostos': 'Impostos e Contribuições',
      'remuneracao_capital_terceiros': 'Capital de Terceiros',
      'remuneracao_capital_proprio': 'Capital Próprio'
    }
    return labels[tipo] || tipo
  }

  const getTipoDistribuicaoIcon = (tipo) => {
    const icons = {
      'pessoal': <Users className="h-5 w-5" />,
      'impostos': <Building className="h-5 w-5" />,
      'remuneracao_capital_terceiros': <DollarSign className="h-5 w-5" />,
      'remuneracao_capital_proprio': <PieChart className="h-5 w-5" />
    }
    return icons[tipo] || <DollarSign className="h-5 w-5" />
  }

  const getTipoDistribuicaoCor = (tipo) => {
    const cores = {
      'pessoal': 'blue',
      'impostos': 'red',
      'remuneracao_capital_terceiros': 'orange',
      'remuneracao_capital_proprio': 'green'
    }
    return cores[tipo] || 'gray'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DVA - Demonstração do Valor Adicionado</h2>
          <p className="text-gray-600">Geração e visualização da DVA</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar DVA
          </CardTitle>
          <CardDescription>
            Informe os parâmetros para gerar ou carregar a DVA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <Label htmlFor="versaoPlanoContas">Versão do Plano de Contas</Label>
              <Input
                id="versaoPlanoContas"
                type="text"
                value={versaoPlanoContas}
                onChange={(e) => setVersaoPlanoContas(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={gerarDva} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DVA'}
            </Button>
            <Button variant="outline" onClick={carregarDva} disabled={loading}>
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

      {/* Resultado da DVA */}
      {dva && (
        <div className="space-y-6">
          {/* Status de Balanceamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {dva.balanceado ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                Status da DVA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dva.geracao_valor_adicionado.valor_adicionado_total)}
                  </div>
                  <div className="text-sm text-gray-600">Valor Adicionado Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(dva.total_distribuido)}
                  </div>
                  <div className="text-sm text-gray-600">Total Distribuído</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dva.balanceado ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dva.diferenca_balanceamento)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dva.balanceado ? 'Balanceado' : 'Diferença'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geração do Valor Adicionado */}
          <Card>
            <CardHeader>
              <CardTitle>Geração do Valor Adicionado</CardTitle>
              <CardDescription>
                Processo de formação do valor adicionado pela empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(dva.geracao_valor_adicionado.receitas.total)}
                  </div>
                  <div className="text-sm text-gray-600">Receitas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    -{formatCurrency(dva.geracao_valor_adicionado.insumos_adquiridos.total)}
                  </div>
                  <div className="text-sm text-gray-600">Insumos Adquiridos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    -{formatCurrency(dva.geracao_valor_adicionado.depreciacoes.total)}
                  </div>
                  <div className="text-sm text-gray-600">Depreciações</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(dva.geracao_valor_adicionado.transferencias.total)}
                  </div>
                  <div className="text-sm text-gray-600">Transferências</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(dva.geracao_valor_adicionado.valor_adicionado_total)}
                </div>
                <div className="text-sm text-gray-600">Valor Adicionado Total a Distribuir</div>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição do Valor Adicionado */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição do Valor Adicionado</CardTitle>
              <CardDescription>
                Como o valor adicionado foi distribuído entre os stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(dva.distribuicao_valor_adicionado).map(([tipo, dados]) => 
                  renderDistribuicaoCard(
                    tipo, 
                    dados, 
                    getTipoDistribuicaoIcon(tipo), 
                    getTipoDistribuicaoCor(tipo)
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* DVA Estruturada */}
          <Card>
            <CardHeader>
              <CardTitle>DVA Estruturada</CardTitle>
              <CardDescription>
                Demonstração do Valor Adicionado no formato padrão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dva.estrutura_dva && dva.estrutura_dva.linhas && dva.estrutura_dva.linhas.map((linha, index) => 
                  renderLinhaDva(linha, index)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Análise da Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Análise da Distribuição</CardTitle>
              <CardDescription>
                Percentual de distribuição do valor adicionado por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dva.distribuicao_valor_adicionado).map(([tipo, dados]) => {
                  if (dados.valor === 0) return null
                  
                  const porcentagem = (dados.valor / dva.geracao_valor_adicionado.valor_adicionado_total) * 100
                  
                  return (
                    <div key={tipo} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{getTipoDistribuicaoLabel(tipo)}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(dados.valor)} ({porcentagem.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={porcentagem} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DVA

