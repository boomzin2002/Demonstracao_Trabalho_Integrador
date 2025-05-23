"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Solicitacao } from "@/contexts/solicitacoes-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SolicitacoesPendentesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [solicitacoesPrimeiraAprovacao, setSolicitacoesPrimeiraAprovacao] = useState<Solicitacao[]>([])
  const [solicitacoesSegundaAprovacao, setSolicitacoesSegundaAprovacao] = useState<Solicitacao[]>([])
  const [activeTab, setActiveTab] = useState("primeira")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filteredPrimeira, setFilteredPrimeira] = useState<Solicitacao[]>([])
  const [filteredSegunda, setFilteredSegunda] = useState<Solicitacao[]>([])
  const { solicitacoes } = useSolicitacoes()

  // Verificar se há uma preferência de aba salva
  useEffect(() => {
    const savedTab = localStorage.getItem("gerentePendentesTab")
    if (savedTab === "primeira" || savedTab === "segunda") {
      setActiveTab(savedTab)
    }
  }, [])

  // Salvar a preferência de aba quando mudar
  useEffect(() => {
    localStorage.setItem("gerentePendentesTab", activeTab)
  }, [activeTab])

  useEffect(() => {
    console.log("=== ATUALIZANDO LISTAS DE PENDENTES ===")
    console.log("Total de solicitações:", solicitacoes.length)
    console.log("Usuário logado:", user?.name, user?.email)

    // Filtrar solicitações por nível de aprovação
    const primeiraAprovacao = solicitacoes.filter((s) => {
      const isPendente = s.status === "Pendente"
      const isNivel1 = s.nivelAtualAprovacao === 1
      const naoAprovouAinda = !s.aprovacoes.some((a) => a.aprovadorId === user?.email && a.nivel === 1)

      console.log(`${s.id} - Primeira: isPendente=${isPendente}, isNivel1=${isNivel1}, naoAprovou=${naoAprovouAinda}`)
      return isPendente && isNivel1 && naoAprovouAinda
    })

    const segundaAprovacao = solicitacoes.filter((s) => {
      const isParcial = s.status === "Parcialmente Aprovado"
      const isNivel2 = s.nivelAtualAprovacao === 2
      const naoAprovouAinda = !s.aprovacoes.some((a) => a.aprovadorId === user?.email && a.nivel === 2)

      console.log(`${s.id} - Segunda: isParcial=${isParcial}, isNivel2=${isNivel2}, naoAprovou=${naoAprovouAinda}`)
      return isParcial && isNivel2 && naoAprovouAinda
    })

    console.log(
      "Primeira aprovação filtrada:",
      primeiraAprovacao.map((s) => s.id),
    )
    console.log(
      "Segunda aprovação filtrada:",
      segundaAprovacao.map((s) => s.id),
    )

    setSolicitacoesPrimeiraAprovacao(primeiraAprovacao)
    setSolicitacoesSegundaAprovacao(segundaAprovacao)
    setFilteredPrimeira(primeiraAprovacao)
    setFilteredSegunda(segundaAprovacao)
  }, [solicitacoes, user])

  // Aplicar filtros e ordenação
  useEffect(() => {
    // Função para filtrar solicitações
    const filterSolicitacoes = (solicitacoes: Solicitacao[]) => {
      return solicitacoes.filter(
        (s) =>
          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.solicitante && s.solicitante.toLowerCase().includes(searchTerm.toLowerCase())) ||
          s.centroCusto.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Função para ordenar solicitações
    const sortSolicitacoes = (solicitacoes: Solicitacao[]) => {
      if (!sortField) return solicitacoes

      return [...solicitacoes].sort((a, b) => {
        let valueA: any
        let valueB: any

        switch (sortField) {
          case "id":
            valueA = a.id
            valueB = b.id
            break
          case "solicitante":
            valueA = a.solicitante || ""
            valueB = b.solicitante || ""
            break
          case "descricao":
            valueA = a.descricao
            valueB = b.descricao
            break
          case "valor":
            valueA = a.valor || 0
            valueB = b.valor || 0
            break
          case "data":
            // Converter data DD/MM/YYYY para formato ordenável
            const partsA = a.data.split("/")
            const partsB = b.data.split("/")
            valueA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`)
            valueB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`)
            break
          case "urgencia":
            valueA = a.urgencia === "alta" ? 1 : 0
            valueB = b.urgencia === "alta" ? 1 : 0
            break
          case "cotacoes":
            valueA = a.cotacoes?.length || 0
            valueB = b.cotacoes?.length || 0
            break
          default:
            return 0
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    // Aplicar filtro e ordenação
    const filteredPrimeiraList = filterSolicitacoes(solicitacoesPrimeiraAprovacao)
    const filteredSegundaList = filterSolicitacoes(solicitacoesSegundaAprovacao)

    setFilteredPrimeira(sortSolicitacoes(filteredPrimeiraList))
    setFilteredSegunda(sortSolicitacoes(filteredSegundaList))
  }, [searchTerm, sortField, sortDirection, solicitacoesPrimeiraAprovacao, solicitacoesSegundaAprovacao])

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Inverter direção se o mesmo campo for clicado novamente
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Novo campo, começar com desc
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const formatCurrency = (valor: number | null, moeda = "BRL") => {
    if (valor === null) return "N/A"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: moeda === "USD" ? "USD" : "BRL",
    }).format(valor)
  }

  const getUrgencyColor = (urgencia: string) => {
    return urgencia === "alta" ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Parcialmente Aprovado":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <SortAsc className="h-3 w-3 text-gray-400" />
    return sortDirection === "asc" ? (
      <SortAsc className="h-3 w-3 text-indigo-600" />
    ) : (
      <SortDesc className="h-3 w-3 text-indigo-600" />
    )
  }

  const renderEmptyState = (isSegundaAprovacao = false) => {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação pendente</h3>
          <p className="text-gray-500 mb-4">
            {isSegundaAprovacao
              ? "Não há solicitações aguardando segunda aprovação no momento."
              : "Não há solicitações aguardando primeira aprovação no momento."}
          </p>
          <Button onClick={() => router.push("/dashboard/gerente")} className="bg-indigo-600 hover:bg-indigo-700">
            Voltar ao Dashboard
          </Button>
        </div>
      </Card>
    )
  }

  const renderSolicitacoesTable = (solicitacoes: Solicitacao[], isSegundaAprovacao = false) => {
    if (solicitacoes.length === 0) {
      return renderEmptyState(isSegundaAprovacao)
    }

    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg flex items-center gap-2">
            {isSegundaAprovacao ? (
              <>
                <Shield className="h-5 w-5 text-blue-600" />
                Segunda Aprovação
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-yellow-600" />
                Primeira Aprovação
              </>
            )}
            <Badge variant="outline" className="ml-2">
              {solicitacoes.length} {solicitacoes.length === 1 ? "solicitação" : "solicitações"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("id")}
                    >
                      Pedido {renderSortIcon("id")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("solicitante")}
                    >
                      Solicitante {renderSortIcon("solicitante")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("descricao")}
                    >
                      Descrição {renderSortIcon("descricao")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("valor")}
                    >
                      Valor {renderSortIcon("valor")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("data")}
                    >
                      Data {renderSortIcon("data")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("urgencia")}
                    >
                      Urgência {renderSortIcon("urgencia")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 -ml-2 font-semibold"
                      onClick={() => handleSort("cotacoes")}
                    >
                      Cotações {renderSortIcon("cotacoes")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitacoes.map((solicitacao) => (
                  <TableRow key={solicitacao.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm font-medium">{solicitacao.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-600">
                            {solicitacao.solicitante?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{solicitacao.solicitante}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{solicitacao.descricao}</p>
                        <p className="text-sm text-gray-500 capitalize">{solicitacao.centroCusto}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {solicitacao.valorDecidido && solicitacao.valor ? (
                        <div className="font-semibold text-green-700">
                          {formatCurrency(solicitacao.valor, solicitacao.moeda || "BRL")}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Aguardando
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{solicitacao.data}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(solicitacao.urgencia)}>
                        {solicitacao.urgencia === "alta" ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alta
                          </>
                        ) : (
                          "Normal"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(solicitacao.status)}>
                        {isSegundaAprovacao ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            2ª Etapa
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            1ª Etapa
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {solicitacao.cotacoes?.length || 0}
                        </Badge>
                        <span className="text-xs text-gray-500">cotações</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                        onClick={() => router.push(`/dashboard/gerente/revisar/${solicitacao.id.replace("#PED-", "")}`)}
                      >
                        <Eye className="h-4 w-4" />
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalPendentes = filteredPrimeira.length + filteredSegunda.length
  const urgentesCount = [...filteredPrimeira, ...filteredSegunda].filter((s) => s.urgencia === "alta").length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações Pendentes</h1>
          <p className="text-gray-600 mt-1">Analise e aprove as solicitações que aguardam sua validação</p>
        </div>
        <Button onClick={() => router.push("/dashboard/gerente")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar solicitação..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSearchTerm("")}>Limpar filtros</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("alta")}>Urgência alta</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("ti")}>Centro de custo: TI</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("rh")}>Centro de custo: RH</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("marketing")}>Centro de custo: Marketing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("data")}>Por data</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("urgencia")}>Por urgência</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("valor")}>Por valor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("solicitante")}>Por solicitante</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Primeira Aprovação</p>
                <p className="text-2xl font-bold text-yellow-600">{filteredPrimeira.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Segunda Aprovação</p>
                <p className="text-2xl font-bold text-blue-600">{filteredSegunda.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Urgência Alta</p>
                <p className="text-2xl font-bold text-red-600">{urgentesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Sistema de Dupla Validação</h3>
              <p className="text-sm text-blue-800 mt-1">
                Cada solicitação precisa ser aprovada por dois gerentes diferentes. Na primeira etapa, o gerente
                seleciona a cotação e aprova inicialmente. Na segunda etapa, outro gerente revisa e dá a aprovação
                final.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="primeira" className="relative gap-2">
            <Clock className="h-4 w-4" />
            Primeira Aprovação
            {filteredPrimeira.length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs">{filteredPrimeira.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="segunda" className="relative gap-2">
            <Shield className="h-4 w-4" />
            Segunda Aprovação
            {filteredSegunda.length > 0 && (
              <Badge className="ml-2 bg-blue-500 text-white text-xs">{filteredSegunda.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primeira">{renderSolicitacoesTable(filteredPrimeira, false)}</TabsContent>

        <TabsContent value="segunda">{renderSolicitacoesTable(filteredSegunda, true)}</TabsContent>
      </Tabs>

      {/* Alert for urgent requests */}
      {urgentesCount > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Atenção: Solicitações Urgentes</h3>
                <p className="text-sm text-red-800 mt-1">
                  Existem {urgentesCount} solicitação(ões) com urgência alta que precisam de atenção imediata.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>Primeira Aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Segunda Aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Urgência Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-600" />
              <span>Cotações Disponíveis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
