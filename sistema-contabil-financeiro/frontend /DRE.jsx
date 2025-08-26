import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TrendingUp, Calculator, AlertCircle, CheckCircle } from 'lucide-react'

function DRE() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [dre, setDre] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarDre = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/dre/gerar', {
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
        setDre(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar DRE: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarDre = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/dre/${periodo}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setDre(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar DRE: ' + err.message)
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

  const renderLinhaDre = (linha, index) => {
    const getStyleByTipo = (tipo) => {
      switch (tipo) {
        case 'titulo':
          return 'text-lg font-bold text-gray-900 bg-gray-50 p-3 rounded'
        case 'subtotal':
          return 'text-base font-semibold text-gray-800 border-t pt-2'
        case 'resultado':
          return 'text-base font-semibold text-blue-600 border-t pt-2'
        case 'resultado_final':
          return 'text-lg font-bold text-green-600 bg-green-50 p-3 rounded border-2 border-green-200'
        case 'grupo':
          return 'text-sm text-gray-600 ml-4'
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

  const renderGrupoContas = (grupos, titulo, cor = 'blue') => {
    if (!grupos || grupos.length === 0) {
      return (
        <div className="text-gray-500 text-sm">
          Nenhuma conta encontrada para {titulo}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {grupos.map((grupo, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{grupo.nome}</h4>
              <Badge variant="outline" className={`text-${cor}-600`}>
                {formatCurrency(grupo.saldo)}
              </Badge>
            </div>
            
            {grupo.subgrupos && Object.keys(grupo.subgrupos).length > 0 && (
              <div className="space-y-2 ml-4">
                {Object.values(grupo.subgrupos).map((subgrupo, subIndex) => (
                  <div key={subIndex} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="font-medium text-sm">{subgrupo.nome}</h5>
                      <span className="text-sm text-gray-600">{formatCurrency(subgrupo.saldo)}</span>
                    </div>
                    
                    {subgrupo.contas && Object.keys(subgrupo.contas).length > 0 && (
                      <div className="space-y-1 ml-4">
                        {Object.values(subgrupo.contas).map((conta, contaIndex) => (
                          <div key={contaIndex} className="flex justify-between text-xs">
                            <span className="text-gray-700">{conta.nome}</span>
                            <span className="text-gray-600">{formatCurrency(conta.saldo)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DRE - Demonstração do Resultado do Exercício</h2>
          <p className="text-gray-600">Geração e visualização da DRE</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar DRE
          </CardTitle>
          <CardDescription>
            Informe os parâmetros para gerar ou carregar a DRE
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
            <Button onClick={gerarDre} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DRE'}
            </Button>
            <Button variant="outline" onClick={carregarDre} disabled={loading}>
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

      {/* Resultado da DRE */}
      {dre && (
        <div className="space-y-6">
          {/* Indicadores Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Indicadores Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dre.indicadores.receita_bruta)}
                  </div>
                  <div className="text-sm text-gray-600">Receita Bruta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(dre.indicadores.lucro_bruto)}
                  </div>
                  <div className="text-sm text-gray-600">Lucro Bruto</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(dre.indicadores.lucro_operacional)}
                  </div>
                  <div className="text-sm text-gray-600">Lucro Operacional</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dre.indicadores.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dre.indicadores.lucro_liquido)}
                  </div>
                  <div className="text-sm text-gray-600">Lucro Líquido</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DRE Estruturada */}
          <Card>
            <CardHeader>
              <CardTitle>DRE Estruturada</CardTitle>
              <CardDescription>
                Demonstração do Resultado do Exercício no formato tradicional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dre.estrutura_dre && dre.estrutura_dre.linhas && dre.estrutura_dre.linhas.map((linha, index) => 
                  renderLinhaDre(linha, index)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento por Grupos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Receitas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">RECEITAS</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dre.receitas.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderGrupoContas(dre.receitas.grupos, 'Receitas', 'blue')}
              </CardContent>
            </Card>

            {/* Custos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">CUSTOS</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dre.custos.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderGrupoContas(dre.custos.grupos, 'Custos', 'red')}
              </CardContent>
            </Card>

            {/* Despesas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">DESPESAS</CardTitle>
                <CardDescription>
                  Total: {formatCurrency(dre.despesas.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderGrupoContas(dre.despesas.grupos, 'Despesas', 'orange')}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default DRE

