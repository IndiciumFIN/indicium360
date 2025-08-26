import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Calculator, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

function DMPL() {
  const [periodoInicial, setPeriodoInicial] = useState('')
  const [periodoFinal, setPeriodoFinal] = useState('')
  const [versaoBalancete, setVersaoBalancete] = useState('1.0')
  const [versaoPlanoContas, setVersaoPlanoContas] = useState('1.0')
  const [dmpl, setDmpl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const gerarDmpl = async () => {
    if (!periodoInicial || !periodoFinal) {
      setError('Período inicial e final são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/demonstracoes/dmpl/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo_inicial: periodoInicial,
          periodo_final: periodoFinal,
          versao_balancete: versaoBalancete,
          versao_plano_contas: versaoPlanoContas
        })
      })

      const data = await response.json()

      if (data.success) {
        setDmpl(data.data)
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao gerar DMPL: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const carregarDmpl = async () => {
    if (!periodoInicial || !periodoFinal) {
      setError('Período inicial e final são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/demonstracoes/dmpl/${periodoInicial}/${periodoFinal}?versao_balancete=${versaoBalancete}`)
      const data = await response.json()

      if (data.success) {
        setDmpl(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar DMPL: ' + err.message)
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

  const renderTabelaDmpl = () => {
    if (!dmpl || !dmpl.estrutura_dmpl || !dmpl.estrutura_dmpl.linhas) {
      return null
    }

    const linhas = dmpl.estrutura_dmpl.linhas
    const colunas = dmpl.colunas || []

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Descrição</TableHead>
              {colunas.map((coluna, index) => (
                <TableHead key={index} className="text-right min-w-[120px]">
                  {coluna.nome}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.map((linha, index) => (
              <TableRow key={index} className={getRowStyle(linha.tipo)}>
                <TableCell className="font-medium">
                  {linha.descricao}
                </TableCell>
                {colunas.map((coluna, colIndex) => (
                  <TableCell key={colIndex} className="text-right font-mono">
                    {linha[coluna.codigo] !== undefined ? formatCurrency(linha[coluna.codigo]) : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const getRowStyle = (tipo) => {
    switch (tipo) {
      case 'saldo_inicial':
        return 'bg-blue-50 font-semibold'
      case 'saldo_final':
        return 'bg-green-50 font-semibold border-t-2'
      case 'movimentacao':
        return 'hover:bg-gray-50'
      default:
        return ''
    }
  }

  const renderResumoMovimentacoes = () => {
    if (!dmpl || !dmpl.movimentacoes) {
      return null
    }

    const tiposMovimentacao = [
      { key: 'aumentos_capital', label: 'Aumentos de Capital', color: 'text-green-600' },
      { key: 'reducoes_capital', label: 'Reduções de Capital', color: 'text-red-600' },
      { key: 'lucro_exercicio', label: 'Lucro do Exercício', color: 'text-blue-600' },
      { key: 'dividendos_distribuidos', label: 'Dividendos Distribuídos', color: 'text-orange-600' },
      { key: 'constituicao_reservas', label: 'Constituição de Reservas', color: 'text-purple-600' },
      { key: 'reversao_reservas', label: 'Reversão de Reservas', color: 'text-indigo-600' },
      { key: 'outras_movimentacoes', label: 'Outras Movimentações', color: 'text-gray-600' }
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiposMovimentacao.map((tipo) => {
          const movimentacoes = dmpl.movimentacoes[tipo.key]
          const totalMovimentacoes = Object.values(movimentacoes).reduce((sum, mov) => sum + (mov.valor || 0), 0)
          
          if (Object.keys(movimentacoes).length === 0) {
            return null
          }

          return (
            <Card key={tipo.key}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${tipo.color}`}>
                  {tipo.label}
                </CardTitle>
                <div className={`text-lg font-bold ${tipo.color}`}>
                  {formatCurrency(totalMovimentacoes)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {Object.values(movimentacoes).map((mov, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate">{mov.nome}</span>
                      <span className="font-mono">{formatCurrency(mov.valor)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DMPL - Demonstração das Mutações do Patrimônio Líquido</h2>
          <p className="text-gray-600">Geração e visualização da DMPL</p>
        </div>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Gerar DMPL
          </CardTitle>
          <CardDescription>
            Informe os períodos para comparação e gerar a DMPL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Button onClick={gerarDmpl} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DMPL'}
            </Button>
            <Button variant="outline" onClick={carregarDmpl} disabled={loading}>
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

      {/* Resultado da DMPL */}
      {dmpl && (
        <div className="space-y-6">
          {/* Informações do Período */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {dmpl.periodo_inicial}
                  </div>
                  <div className="text-sm text-gray-600">Período Inicial</div>
                </div>
                <div className="text-center">
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {dmpl.periodo_final}
                  </div>
                  <div className="text-sm text-gray-600">Período Final</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo das Movimentações */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Movimentações</CardTitle>
              <CardDescription>
                Principais movimentações identificadas no patrimônio líquido
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderResumoMovimentacoes()}
            </CardContent>
          </Card>

          {/* DMPL Estruturada */}
          <Card>
            <CardHeader>
              <CardTitle>DMPL Estruturada</CardTitle>
              <CardDescription>
                Demonstração das Mutações do Patrimônio Líquido no formato tabular
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTabelaDmpl()}
            </CardContent>
          </Card>

          {/* Detalhamento das Colunas */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento das Colunas</CardTitle>
              <CardDescription>
                Contas que compõem cada coluna da DMPL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dmpl.colunas && dmpl.colunas.map((coluna, index) => (
                  <Card key={index} className="border-l-4 border-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{coluna.nome}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {coluna.contas && coluna.contas.length > 0 ? (
                        <div className="space-y-1">
                          {coluna.contas.map((conta, contaIndex) => (
                            <div key={contaIndex} className="text-sm">
                              <div className="font-medium">{conta.nome}</div>
                              <div className="text-gray-600 text-xs">Código: {conta.codigo}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Nenhuma conta mapeada
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DMPL

