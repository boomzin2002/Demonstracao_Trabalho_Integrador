"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, ClipboardList, TrendingUp, Calendar, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getSolicitacoes, type Solicitacao } from "@/lib/solicitacoes"
import { LiveExchangeWidget } from "@/components/live-exchange-widget"
import { CurrencyConverter } from "@/components/currency-converter"

export default function DashboardCliente() {
  const router = useRouter()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])

  useEffect(() => {
    // Carregar solicitações ao montar o componente
    const todasSolicitacoes = getSolicitacoes()
    // Filtrar apenas para o usuário atual (simulado como "Carlos Silva")
    const solicitacoesDoUsuario = todasSolicitacoes.filter((s) => s.solicitante === "Carlos Silva" || !s.solicitante)
    setSolicitacoes(solicitacoesDoUsuario)
  }, [])

  // Calcular estatísticas
  const totalSolicitacoes = solicitacoes.length
  const solicitacoesPendentes = solicitacoes.filter((s) => s.status === "Pendente")
  const solicitacoesAprovadas = solicitacoes.filter((s) => s.status === "Aprovado")
  const solicitacoesRejeitadas = solicitacoes.filter((s) => s.status === "Rejeitado")

  // Calcular valores
  const valorTotalSolicitado = solicitacoes.reduce((total, s) => total + s.valor, 0)
  const valorAprovado = solicitacoesAprovadas.reduce((total, s) => total + s.valor, 0)
  const valorPendente = solicitacoesPendentes.reduce((total, s) => total + s.valor, 0)

  // Obter solicitações recentes (últimas 5)
  const solicitacoesRecentes = [...solicitacoes]
    .sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split("/").map(Number)
      const [diaB, mesB, anoB] = b.data.split("/").map(Number)
      const dateA = new Date(anoA, mesA - 1, diaA)
      const dateB = new Date(anoB, mesB - 1, diaB)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  // Calcular estatísticas por centro de custo
  const estatisticasPorCentro = solicitacoes.reduce(
    (acc, s) => {
      if (!acc[s.centroCusto]) {
        acc[s.centroCusto] = { total: 0, valor: 0 }
      }
      acc[s.centroCusto].total += 1
      acc[s.centroCusto].valor += s.valor
      return acc
    },
    {} as Record<string, { total: number; valor: number }>,
  )

  const handleNovasolicitacao = () => {
    router.push("/dashboard/cliente/nova-solicitacao")
  }

  const handleVerSolicitacoes = () => {
    router.push("/dashboard/cliente/minhas-solicitacoes")
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl p-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard do Cliente</h1>
            <p className="text-gray-600">Bem-vindo, Carlos! Aqui está um resumo das suas solicitações.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {/* Cards de Ação */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Nova Solicitação</CardTitle>
                <PlusCircle className="w-8 h-8" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-blue-100">Crie uma nova solicitação de compra rapidamente</p>
              <Button
                className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                onClick={handleNovasolicitacao}
              >
                Criar Solicitação
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Minhas Solicitações</CardTitle>
                <ClipboardList className="w-8 h-8" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-purple-100">Acompanhe o status de todas as suas solicitações</p>
              <Button
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                onClick={handleVerSolicitacoes}
              >
                Ver Todas ({totalSolicitacoes})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Solicitações</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSolicitacoes}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-amber-600">{solicitacoesPendentes.length}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-3xl font-bold text-green-600">{solicitacoesAprovadas.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(valorTotalSolicitado)}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Cotação e Conversão */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <LiveExchangeWidget autoRefresh={true} refreshInterval={300} />
          <CurrencyConverter />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Solicitações Recentes */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Solicitações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {solicitacoesRecentes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Você ainda não possui solicitações.</p>
                    <Button onClick={handleNovasolicitacao} className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                      Criar sua primeira solicitação
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nº Pedido</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {solicitacoesRecentes.map((solicitacao) => (
                          <TableRow key={solicitacao.id}>
                            <TableCell className="font-medium text-sm">{solicitacao.id}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{solicitacao.descricao}</TableCell>
                            <TableCell className="text-sm">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(solicitacao.valor)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  solicitacao.status === "Aprovado"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : solicitacao.status === "Pendente"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {solicitacao.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {solicitacoes.length > 5 && (
                      <div className="mt-4 text-center">
                        <Button variant="outline" onClick={handleVerSolicitacoes}>
                          Ver todas as solicitações
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo Financeiro e Estatísticas */}
          <div className="space-y-6">
            {/* Resumo Financeiro */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Solicitado</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorTotalSolicitado)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Aprovado</span>
                  <span className="font-semibold text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorAprovado)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Pendente</span>
                  <span className="font-semibold text-amber-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorPendente)}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Taxa de Aprovação</span>
                    <span className="font-bold text-lg">
                      {totalSolicitacoes > 0 ? Math.round((solicitacoesAprovadas.length / totalSolicitacoes) * 100) : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas por Centro de Custo */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Por Centro de Custo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(estatisticasPorCentro).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhuma solicitação ainda</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(estatisticasPorCentro).map(([centro, stats]) => (
                      <div key={centro} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium capitalize">{centro}</p>
                          <p className="text-xs text-gray-500">{stats.total} solicitações</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(stats.valor)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status das Solicitações */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>Status Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-semibold">{solicitacoesPendentes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Aprovadas</span>
                  </div>
                  <span className="font-semibold">{solicitacoesAprovadas.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm">Rejeitadas</span>
                  </div>
                  <span className="font-semibold">{solicitacoesRejeitadas.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
