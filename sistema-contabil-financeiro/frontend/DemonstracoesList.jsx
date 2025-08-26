import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileText, Calendar, Clock } from 'lucide-react'

function DemonstracoesList() {
  const [demonstracoes, setDemonstracoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDemonstracoes()
  }, [])

  const fetchDemonstracoes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/demonstracoes/listar')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar demonstrações')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setDemonstracoes(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      'BP': 'Balanço Patrimonial',
      'DRE': 'Demonstração do Resultado do Exercício',
      'DRA': 'Demonstração do Resultado Abrangente',
      'DMPL': 'Demonstração das Mutações do Patrimônio Líquido',
      'DFC': 'Demonstração do Fluxo de Caixa',
      'DVA': 'Demonstração do Valor Adicionado'
    }
    return labels[tipo] || tipo
  }

  const getTipoColor = (tipo) => {
    const colors = {
      'BP': 'bg-blue-100 text-blue-800',
      'DRE': 'bg-green-100 text-green-800',
      'DRA': 'bg-purple-100 text-purple-800',
      'DMPL': 'bg-orange-100 text-orange-800',
      'DFC': 'bg-indigo-100 text-indigo-800',
      'DVA': 'bg-pink-100 text-pink-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Carregando demonstrações...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDemonstracoes} className="mt-4">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Demonstrações Financeiras</h2>
          <p className="text-gray-600">Lista de todas as demonstrações geradas</p>
        </div>
        <Button onClick={fetchDemonstracoes}>
          Atualizar Lista
        </Button>
      </div>

      {demonstracoes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma demonstração encontrada
            </h3>
            <p className="text-gray-600">
              Comece gerando suas primeiras demonstrações financeiras
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demonstracoes.map((demo) => (
            <Card key={demo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge className={getTipoColor(demo.tipo_demonstracao)}>
                      {demo.tipo_demonstracao}
                    </Badge>
                    <CardTitle className="mt-2 text-lg">
                      {getTipoLabel(demo.tipo_demonstracao)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Período: {demo.periodo}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Gerado em: {formatDate(demo.data_geracao)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div>Versão Balancete: {demo.versao_balancete}</div>
                    <div>Versão Plano: {demo.versao_plano_contas}</div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const routes = {
                          'BP': '/balanco-patrimonial',
                          'DRE': '/dre',
                          'DRA': '/dra',
                          'DMPL': '/dmpl',
                          'DFC': '/dfc',
                          'DVA': '/dva'
                        }
                        window.location.href = routes[demo.tipo_demonstracao] || '/'
                      }}
                    >
                      Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default DemonstracoesList

