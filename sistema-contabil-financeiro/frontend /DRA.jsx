import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TrendingUp, Calculator, AlertCircle, CheckCircle } from 'lucide-react'

function DRA() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [dra, setDra] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarDra = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/dra/gerar', {
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
        setDra(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar DRA: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarDra = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/dra/${periodo}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setDra(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar DRA: ' + err.message)
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

  const renderLinhaDra = (linha, index) => {
    const getStyleByTipo = (tipo) => {
      switch (tipo) {
        case 'resultado_base':
          return 'text-lg font-bold text-blue-600 bg-blue-50 p-3 rounded'
        case 'titulo_secao':
          return 'text-base font-semibold text-gray-800 bg-gray-50 p-2 rounded mt-4'
        case 'item_ora':
          return 'text-sm text-gray-700 ml-4'
        case 'subtotal':
          return 'text-base font-semibold text-purple-600 border-t pt-2'
        case 'resultado_final':
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

  const getTipoOraLabel = (tipo) => {
    const labels = {
      'ajuste_conversao': 'Ajuste de Conversão',
      'ajuste_avaliacao': 'Ajuste de Avaliação Patrimonial',
      'nenhum': 'Nenhum'
    }
    return labels[tipo] || tipo
  }

  const getTipoOraColor = (tipo) => {
    const colors = {
      'ajuste_conversao': 'bg-blue-100 text-blue-800',
      'ajuste_avaliacao': 'bg-purple-100 text-purple-800',
      'nenhum': 'bg-gray-100 text-gray-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DRA - Demonstração do Resultado Abrangente</h2>
          <p className="text-gray-600">Geração e visualização da DRA</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar DRA
          </CardTitle>
          <CardDescription>
            Informe os parâmetros para gerar ou carregar a DRA
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
            <Button onClick={gerarDra} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DRA'}
            </Button>
            <Button variant="outline" onClick={carregarDra} disabled={loading}>
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

      {/* Resultado da DRA */}
      {dra && (
        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resumo da DRA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dra.lucro_liquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(dra.lucro_liquido)}
                  </div>
                  <div className="text-sm text-gray-600">Lucro Líquido do Exercício</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dra.total_outros_resultados >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                    {formatCurrency(dra.total_outros_resultados)}
                  </div>
                  <div className="text-sm text-gray-600">Outros Resultados Abrangentes</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dra.resultado_abrangente_total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dra.resultado_abrangente_total)}
                  </div>
                  <div className="text-sm text-gray-600">Resultado Abrangente Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DRA Estruturada */}
          <Card>
            <CardHeader>
              <CardTitle>DRA Estruturada</CardTitle>
              <CardDescription>
                Demonstração do Resultado Abrangente no formato padrão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dra.estrutura_dra && dra.estrutura_dra.linhas && dra.estrutura_dra.linhas.map((linha, index) => 
                  renderLinhaDra(linha, index)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento dos Outros Resultados Abrangentes */}
          <Card>
            <CardHeader>
              <CardTitle>Outros Resultados Abrangentes</CardTitle>
              <CardDescription>
                Detalhamento dos itens que compõem os outros resultados abrangentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dra.outros_resultados_abrangentes && dra.outros_resultados_abrangentes.length > 0 ? (
                <div className="space-y-3">
                  {dra.outros_resultados_abrangentes.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.descricao}</div>
                        {item.codigo !== 'N/A' && (
                          <div className="text-sm text-gray-600">Código: {item.codigo}</div>
                        )}
                        <Badge className={getTipoOraColor(item.tipo)} variant="outline">
                          {getTipoOraLabel(item.tipo)}
                        </Badge>
                      </div>
                      <div className={`font-mono font-semibold ${item.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(item.valor)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Nenhum outro resultado abrangente identificado no período
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações da DRE Base */}
          {dra.dre_base && (
            <Card>
              <CardHeader>
                <CardTitle>Informações da DRE Base</CardTitle>
                <CardDescription>
                  Dados da DRE utilizados como base para a DRA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(dra.dre_base.indicadores.receita_bruta)}
                    </div>
                    <div className="text-sm text-gray-600">Receita Bruta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {formatCurrency(dra.dre_base.indicadores.lucro_bruto)}
                    </div>
                    <div className="text-sm text-gray-600">Lucro Bruto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {formatCurrency(dra.dre_base.indicadores.lucro_operacional)}
                    </div>
                    <div className="text-sm text-gray-600">Lucro Operacional</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${dra.dre_base.indicadores.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(dra.dre_base.indicadores.lucro_liquido)}
                    </div>
                    <div className="text-sm text-gray-600">Lucro Líquido</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default DRA

