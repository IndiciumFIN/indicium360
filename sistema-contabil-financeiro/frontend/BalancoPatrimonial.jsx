import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileText, Download, Calculator, AlertCircle, CheckCircle } from 'lucide-react'

function BalancoPatrimonial() {
  const [periodo, setPeriodo] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [balanco, setBalanco] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarBalanco = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/balanco-patrimonial/gerar', {
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
        setBalanco(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar Balanço Patrimonial: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarBalanco = async () => {
    if (!periodo) {
      setError('Período é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/balanco-patrimonial/${periodo}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setBalanco(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar Balanço Patrimonial: ' + err.message)
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

  const renderGrupoContas = (grupos, titulo) => {
    if (!grupos || grupos.length === 0) {
      return (
        <div className="text-gray-500 text-sm">
          Nenhuma conta encontrada para {titulo}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {grupos.map((grupo, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">{grupo.nome}</h4>
              <Badge variant="outline">{formatCurrency(grupo.saldo)}</Badge>
            </div>
            
            {grupo.subgrupos && Object.keys(grupo.subgrupos).length > 0 && (
              <div className="space-y-2 ml-4">
                {Object.values(grupo.subgrupos).map((subgrupo, subIndex) => (
                  <div key={subIndex} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">{subgrupo.nome}</h5>
                      <span className="text-sm text-gray-600">{formatCurrency(subgrupo.saldo)}</span>
                    </div>
                    
                    {subgrupo.contas && Object.keys(subgrupo.contas).length > 0 && (
                      <div className="space-y-1 ml-4">
                        {Object.values(subgrupo.contas).map((conta, contaIndex) => (
                          <div key={contaIndex} className="flex justify-between text-sm">
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
          <h2 className="text-2xl font-bold text-gray-900">Balanço Patrimonial</h2>
          <p className="text-gray-600">Geração e visualização do Balanço Patrimonial</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar Balanço Patrimonial
          </CardTitle>
          <CardDescription>
            Informe os parâmetros para gerar ou carregar o Balanço Patrimonial
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
            <Button onClick={gerarBalanco} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Balanço'}
            </Button>
            <Button variant="outline" onClick={carregarBalanco} disabled={loading}>
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

      {/* Resultado do Balanço */}
      {balanco && (
        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Resumo do Balanço Patrimonial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(balanco.ativo.total)}
                  </div>
                  <div className="text-sm text-gray-600">Total do Ativo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(balanco.passivo.total)}
                  </div>
                  <div className="text-sm text-gray-600">Total do Passivo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(balanco.patrimonio_liquido.total)}
                  </div>
                  <div className="text-sm text-gray-600">Patrimônio Líquido</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <div className="flex items-center justify-center">
                  {balanco.equilibrado ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={balanco.equilibrado ? 'text-green-600' : 'text-red-600'}>
                    {balanco.equilibrado ? 'Balanço Equilibrado' : 'Balanço Desequilibrado'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total Passivo + PL: {formatCurrency(balanco.total_passivo_pl)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ativo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">ATIVO</CardTitle>
              <CardDescription>
                Total: {formatCurrency(balanco.ativo.total)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderGrupoContas(balanco.ativo.grupos, 'Ativo')}
            </CardContent>
          </Card>

          {/* Passivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">PASSIVO</CardTitle>
              <CardDescription>
                Total: {formatCurrency(balanco.passivo.total)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderGrupoContas(balanco.passivo.grupos, 'Passivo')}
            </CardContent>
          </Card>

          {/* Patrimônio Líquido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">PATRIMÔNIO LÍQUIDO</CardTitle>
              <CardDescription>
                Total: {formatCurrency(balanco.patrimonio_liquido.total)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderGrupoContas(balanco.patrimonio_liquido.grupos, 'Patrimônio Líquido')}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default BalancoPatrimonial

