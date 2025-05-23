"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Search,
  RefreshCw,
  Package,
  Eye,
  Filter,
  FileText,
  Download,
  Shield,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import type { Solicitacao } from "@/contexts/solicitacoes-context"

export default function GerenteDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { solicitacoes } = useSolicitacoes()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    pendentes: 0,
    primeiraAprovacao: 0,
    segundaAprovacao: 0,
    aprovadas: 0,
    rejeitadas: 0,
    urgentes: 0,
    total: 0,
  })

  // Solicitações filtradas por status
  const [solicitacoesPrimeiraAprovacao, setSolicitacoesPrimeiraAprovacao] = useState<Solicitacao[]>([])
  const [solicitacoesSegundaAprovacao, setSolicitacoesSegundaAprovacao] = useState<Solicitacao[]>([])
  const [solicitacoesRecentes, setSolicitacoesRecentes] = useState<Solicitacao[]>([])

  useEffect(() => {
    console.log("=== ATUALIZANDO DASHBOARD GERENTE ===")
    console.log("Total de solicitações:", solicitacoes.length)
    console.log("Usuário logado:", user?.name, user?.email)

    // Filtrar solicitações por status e nível de aprovação
    const primeiraAprovacao = solicitacoes.filter((s) => {
      const isPendente = s.status === "Pendente"
      const isNivel1 = s.nivelAtualAprovacao === 1
      const naoAprovouAinda = !s.aprovacoes.some((a) => a.aprovadorId === user?.email && a.nivel === 1)
      return isPendente && isNivel1 && naoAprovouAinda
    })

    const segundaAprovacao = solicitacoes.filter((s) => {
      const isParcial = s.status === "Parcialmente Aprovado"
      const isNivel2 = s.nivelAtualAprovacao === 2
      const naoAprovouAinda = !s.aprovacoes.some((a) => a.aprovadorId === user?.email && a.nivel === 2)
      return isParcial && isNivel2 && naoAprovouAinda
    })

    const aprovadas = solicitacoes.filter((s) => s.status === "Aprovado")
    const rejeitadas = solicitacoes.filter((s) => s.status === "Rejeitado")
    const urgentes = solicitacoes.filter(
      (s) => s.urgencia === "alta" && (s.status === "Pendente" || s.status === "Parcialmente Aprovado"),
    )

    // Ordenar solicitações recentes por data (mais recentes primeiro)
    const recentes = [...solicitacoes]
      .sort((a, b) => {
        const dataA = a.data.split("/").reverse().join("")
        const dataB = b.data.split("/").reverse().join("")
        return dataB.localeCompare(dataA)
      })
      .slice(0, 5)

    // Atualizar estados
    setSolicitacoesPrimeiraAprovacao(primeiraAprovacao)
    setSolicitacoesSegundaAprovacao(segundaAprovacao)
    setSolicitacoesRecentes(recentes)

    // Atualizar estatísticas
    setStats({
      pendentes: primeiraAprovacao.length + segundaAprovacao.length,
      primeiraAprovacao: primeiraAprovacao.length,
      segundaAprovacao: segundaAprovacao.length,
      aprovadas: aprovadas.length,
      rejeitadas: rejeitadas.length,
      urgentes: urgentes.length,
      total: solicitacoes.length,
    })
  }, [solicitacoes, user, logout])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const formatCurrency = (valor: number | null, moeda = "BRL") => {
    if (valor === null) return "N/A"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: moeda === "USD" ? "USD" : "BRL",
    }).format(valor)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      case "Parcialmente Aprovado":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Parcialmente Aprovado</Badge>
      case "Aprovado":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprovado</Badge>
      case "Rejeitado":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeitado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const renderSolicitacaoCard = (solicitacao: Solicitacao) => {
    return (
      <Card key={solicitacao.id} className="mb-4 overflow-hidden border-l-4 border-l-indigo-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-medium">{solicitacao.descricao}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs">{solicitacao.id}</span>
                {solicitacao.urgencia === "alta" && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgente
                  </Badge>
                )}
              </CardDescription>
            </div>
            {getStatusBadge(solicitacao.status)}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Solicitante:</p>
              <p className="font-medium">{solicitacao.solicitante}</p>
            </div>
            <div>
              <p className="text-gray-500">Valor:</p>
              <p className="font-medium">
                {solicitacao.valor ? formatCurrency(solicitacao.valor, solicitacao.moeda as string) : "Não definido"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Data:</p>
              <p className="font-medium">{solicitacao.data}</p>
            </div>
            <div>
              <p className="text-gray-500">Centro de Custo:</p>
              <p className="font-medium capitalize">{solicitacao.centroCusto}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end">
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            onClick={() => router.push(`/dashboard/gerente/revisar/${solicitacao.id.replace("#PED-", "")}`)}
          >
            <Eye className="h-4 w-4" />
            Revisar
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Gerente</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo, {user?.name || "Gerente"}. Gerencie aprovações e acompanhe solicitações.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            onClick={() => router.push("/dashboard/gerente/pendentes")}
          >
            <Clock className="h-4 w-4" />
            Ver Pendentes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Aguardando Aprovação</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.pendentes}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">1ª Aprovação</span>
                <span className="font-semibold text-indigo-700">{stats.primeiraAprovacao}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">2ª Aprovação</span>
                <span className="font-semibold text-indigo-700">{stats.segundaAprovacao}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Urgentes</span>
                <span className="font-semibold text-red-600">{stats.urgentes}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Aprovadas</p>
                <p className="text-3xl font-bold text-green-900">{stats.aprovadas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-500">Taxa de aprovação</span>
                <span className="font-semibold text-green-700">
                  {stats.total > 0 ? Math.round((stats.aprovadas / stats.total) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={stats.total > 0 ? (stats.aprovadas / stats.total) * 100 : 0}
                className="h-2 bg-green-100"
                indicatorClassName="bg-green-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rejeitadas</p>
                <p className="text-3xl font-bold text-red-900">{stats.rejeitadas}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-500">Taxa de rejeição</span>
                <span className="font-semibold text-red-700">
                  {stats.total > 0 ? Math.round((stats.rejeitadas / stats.total) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={stats.total > 0 ? (stats.rejeitadas / stats.total) * 100 : 0}
                className="h-2 bg-red-100"
                indicatorClassName="bg-red-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Total de Solicitações</p>
                <p className="text-3xl font-bold text-amber-900">{stats.total}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Pendentes</span>
                <span className="font-semibold text-amber-700">{stats.pendentes}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Aprovadas</span>
                <span className="font-semibold text-green-700">{stats.aprovadas}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Rejeitadas</span>
                <span className="font-semibold text-red-700">{stats.rejeitadas}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Primeira Aprovação */}
        <Card className="lg:col-span-1 border-t-4 border-t-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
              Primeira Aprovação
              <Badge variant="outline" className="ml-auto">
                {stats.primeiraAprovacao}
              </Badge>
            </CardTitle>
            <CardDescription>Solicitações aguardando primeira análise</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {solicitacoesPrimeiraAprovacao.length > 0 ? (
              <div className="space-y-4">
                {solicitacoesPrimeiraAprovacao.slice(0, 3).map((solicitacao) => (
                  <Card key={solicitacao.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">{solicitacao.descricao}</h3>
                        {solicitacao.urgencia === "alta" && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Solicitante:</span>
                          <p className="font-medium">{solicitacao.solicitante}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Data:</span>
                          <p className="font-medium">{solicitacao.data}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Centro:</span>
                          <p className="font-medium capitalize">{solicitacao.centroCusto}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Cotações:</span>
                          <p className="font-medium">{solicitacao.cotacoes?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 gap-1"
                          onClick={() =>
                            router.push(`/dashboard/gerente/revisar/${solicitacao.id.replace("#PED-", "")}`)
                          }
                        >
                          <Eye className="h-3 w-3" />
                          Revisar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {solicitacoesPrimeiraAprovacao.length > 3 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-yellow-600 gap-1"
                      onClick={() => router.push("/dashboard/gerente/pendentes")}
                    >
                      Ver todas ({solicitacoesPrimeiraAprovacao.length})
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-yellow-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-gray-500 text-sm">Não há solicitações aguardando primeira aprovação.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 gap-2"
              onClick={() => {
                router.push("/dashboard/gerente/pendentes")
                // Forçar a seleção da aba de primeira aprovação
                localStorage.setItem("gerentePendentesTab", "primeira")
              }}
            >
              <Clock className="h-4 w-4" />
              Gerenciar Primeira Aprovação
            </Button>
          </CardFooter>
        </Card>

        {/* Coluna do Meio - Segunda Aprovação */}
        <Card className="lg:col-span-1 border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Segunda Aprovação
              <Badge variant="outline" className="ml-auto">
                {stats.segundaAprovacao}
              </Badge>
            </CardTitle>
            <CardDescription>Solicitações aguardando aprovação final</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {solicitacoesSegundaAprovacao.length > 0 ? (
              <div className="space-y-4">
                {solicitacoesSegundaAprovacao.slice(0, 3).map((solicitacao) => (
                  <Card key={solicitacao.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">{solicitacao.descricao}</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          2ª Etapa
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Solicitante:</span>
                          <p className="font-medium">{solicitacao.solicitante}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Valor:</span>
                          <p className="font-medium">
                            {solicitacao.valor
                              ? formatCurrency(solicitacao.valor, solicitacao.moeda as string)
                              : "Não definido"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">1ª Aprovação:</span>
                          <p className="font-medium">
                            {solicitacao.aprovacoes.find((a) => a.nivel === 1)?.aprovadorNome || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Data:</span>
                          <p className="font-medium">{solicitacao.data}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 gap-1"
                          onClick={() =>
                            router.push(`/dashboard/gerente/revisar/${solicitacao.id.replace("#PED-", "")}`)
                          }
                        >
                          <Eye className="h-3 w-3" />
                          Revisar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {solicitacoesSegundaAprovacao.length > 3 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 gap-1"
                      onClick={() => router.push("/dashboard/gerente/pendentes")}
                    >
                      Ver todas ({solicitacoesSegundaAprovacao.length})
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-gray-500 text-sm">Não há solicitações aguardando segunda aprovação.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 gap-2"
              onClick={() => {
                router.push("/dashboard/gerente/pendentes")
                // Forçar a seleção da aba de segunda aprovação
                localStorage.setItem("gerentePendentesTab", "segunda")
              }}
            >
              <Shield className="h-4 w-4" />
              Gerenciar Segunda Aprovação
            </Button>
          </CardFooter>
        </Card>

        {/* Coluna da Direita - Solicitações Recentes e Ações Rápidas */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Solicitações Recentes
            </CardTitle>
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar solicitação..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {solicitacoesRecentes
                .filter(
                  (s) =>
                    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .slice(0, 5)
                .map((solicitacao) => (
                  <div
                    key={solicitacao.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-10 rounded-full ${
                          solicitacao.status === "Pendente"
                            ? "bg-yellow-400"
                            : solicitacao.status === "Parcialmente Aprovado"
                              ? "bg-blue-400"
                              : solicitacao.status === "Aprovado"
                                ? "bg-green-400"
                                : "bg-red-400"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{solicitacao.descricao}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-mono">{solicitacao.id}</span>
                          <span>•</span>
                          <span>{solicitacao.data}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(solicitacao.status)}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => router.push(`/dashboard/gerente/revisar/${solicitacao.id.replace("#PED-", "")}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <Separator />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => router.push("/dashboard/gerente/aprovadas")}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-xs">Aprovadas</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => router.push("/dashboard/gerente/recusadas")}
            >
              <XCircle className="h-5 w-5" />
              <span className="text-xs">Recusadas</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Filter className="h-5 w-5" />
              <span className="text-xs">Filtros</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Exportar</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas de Aprovação
          </CardTitle>
          <CardDescription>Visão geral do processo de aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Barras Simulado */}
            <div>
              <h3 className="text-sm font-medium mb-4">Status das Solicitações</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pendentes (1ª Aprovação)</span>
                    <span className="font-medium">{stats.primeiraAprovacao}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${stats.total > 0 ? (stats.primeiraAprovacao / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Parcialmente Aprovadas (2ª Aprovação)</span>
                    <span className="font-medium">{stats.segundaAprovacao}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400"
                      style={{
                        width: `${stats.total > 0 ? (stats.segundaAprovacao / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Aprovadas</span>
                    <span className="font-medium">{stats.aprovadas}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400"
                      style={{
                        width: `${stats.total > 0 ? (stats.aprovadas / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rejeitadas</span>
                    <span className="font-medium">{stats.rejeitadas}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400"
                      style={{
                        width: `${stats.total > 0 ? (stats.rejeitadas / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas Adicionais */}
            <div>
              <h3 className="text-sm font-medium mb-4">Métricas de Aprovação</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Taxa de Aprovação</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.total > 0 ? Math.round((stats.aprovadas / stats.total) * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Taxa de Rejeição</p>
                        <p className="text-2xl font-bold text-red-600">
                          {stats.total > 0 ? Math.round((stats.rejeitadas / stats.total) * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-red-100 p-2 rounded-full">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Pendentes Urgentes</p>
                        <p className="text-2xl font-bold text-amber-600">{stats.urgentes}</p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Total Processadas</p>
                        <p className="text-2xl font-bold text-indigo-600">{stats.aprovadas + stats.rejeitadas}</p>
                      </div>
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
