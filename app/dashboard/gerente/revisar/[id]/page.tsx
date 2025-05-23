"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  AlertTriangle,
  Shield,
  User,
  Clock,
  Building,
  DollarSign,
  Calendar,
  Package,
  MessageSquare,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Solicitacao } from "@/contexts/solicitacoes-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type Currency, formatCurrency, convertCurrency } from "@/lib/currency"
import { useAuth } from "@/contexts/auth-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"
import { Separator } from "@/components/ui/separator"

export default function RevisarSolicitacaoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null)
  const [observacao, setObservacao] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cotacaoSelecionadaId, setCotacaoSelecionadaId] = useState<string | null>(null)
  const [moedaVisualizacao, setMoedaVisualizacao] = useState<Currency>("BRL")
  const [historicoExpanded, setHistoricoExpanded] = useState(false)
  const { solicitacoes, aprovarSolicitacao, rejeitarSolicitacao, selecionarCotacao } = useSolicitacoes()

  // Verificar se o usuário atual já aprovou esta solicitação no nível atual
  const jaAprovouNesteNivel =
    solicitacao?.aprovacoes.some((a) => a.aprovadorId === user?.email && a.nivel === solicitacao.nivelAtualAprovacao) ||
    false

  // Verificar se é uma segunda aprovação
  const isSegundaAprovacao = solicitacao?.nivelAtualAprovacao === 2

  useEffect(() => {
    const id = `#PED-${params.id}`
    const solicitacaoEncontrada = solicitacoes.find((s) => s.id === id)

    console.log("=== CARREGANDO PÁGINA DE REVISÃO ===")
    console.log("ID procurado:", id)
    console.log("Solicitação encontrada:", solicitacaoEncontrada)

    if (solicitacaoEncontrada) {
      setSolicitacao(solicitacaoEncontrada)
      setMoedaVisualizacao((solicitacaoEncontrada.moeda as Currency) || "BRL")

      // Se já tiver uma cotação selecionada, selecionar ela no radio button
      const cotacaoSelecionada = solicitacaoEncontrada.cotacoes?.find((c) => c.selecionada)
      if (cotacaoSelecionada) {
        setCotacaoSelecionadaId(cotacaoSelecionada.id)
      }

      // Se a solicitação foi processada, mostrar mensagem e redirecionar
      if (solicitacaoEncontrada.status === "Aprovado" || solicitacaoEncontrada.status === "Rejeitado") {
        toast({
          title: "Solicitação já processada",
          description: `Esta solicitação já foi ${solicitacaoEncontrada.status.toLowerCase()}.`,
        })
        setTimeout(() => {
          router.push("/dashboard/gerente/pendentes")
        }, 2000)
      }
    } else {
      toast({
        title: "Solicitação não encontrada",
        description: "A solicitação que você está tentando revisar não foi encontrada.",
        variant: "destructive",
      })
      router.push("/dashboard/gerente/pendentes")
    }
  }, [params.id, router, toast, solicitacoes])

  const handleSelecionarCotacao = (cotacaoId: string) => {
    if (!solicitacao) return

    try {
      console.log("Selecionando cotação:", cotacaoId)
      selecionarCotacao(solicitacao.id, cotacaoId)
      setCotacaoSelecionadaId(cotacaoId)

      toast({
        title: "Cotação selecionada",
        description: "A cotação foi selecionada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao selecionar cotação:", error)
      toast({
        title: "Erro ao selecionar cotação",
        description: "Ocorreu um erro ao selecionar a cotação.",
        variant: "destructive",
      })
    }
  }

  const handleAprovar = async () => {
    if (!solicitacao || !user) return
    setIsSubmitting(true)

    try {
      console.log("=== INICIANDO APROVAÇÃO ===")

      if (!solicitacao.valorDecidido) {
        toast({
          title: "Cotação não selecionada",
          description: "Por favor, selecione uma cotação antes de aprovar a solicitação.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (jaAprovouNesteNivel) {
        toast({
          title: "Aprovação duplicada",
          description: "Você já aprovou esta solicitação neste nível.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      await aprovarSolicitacao(solicitacao.id, user.email, user.name, observacao || undefined)

      const mensagem = isSegundaAprovacao
        ? "A solicitação foi completamente aprovada e pode ser processada."
        : "A solicitação foi aprovada na primeira etapa e agora aguarda a segunda aprovação."

      toast({
        title: "Solicitação aprovada",
        description: mensagem,
      })

      setTimeout(() => {
        router.push("/dashboard/gerente/pendentes")
      }, 2000)
    } catch (error) {
      console.error("Erro ao aprovar:", error)
      toast({
        title: "Erro ao aprovar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao aprovar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejeitar = () => {
    if (!solicitacao || !user) return
    setIsSubmitting(true)

    if (!observacao.trim()) {
      toast({
        title: "Observação necessária",
        description: "Por favor, forneça uma justificativa para a rejeição.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      rejeitarSolicitacao(solicitacao.id, user.email, user.name, observacao)

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação foi rejeitada com sucesso.",
      })

      setTimeout(() => {
        router.push("/dashboard/gerente/pendentes")
      }, 1500)
    } catch (error) {
      console.error("Erro ao rejeitar:", error)
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      Pendente: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      "Parcialmente Aprovado": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Shield },
      Aprovado: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      Rejeitado: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    }

    const config = configs[status as keyof typeof configs] || configs["Pendente"]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  if (!solicitacao) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes da solicitação...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revisar Solicitação</h1>
          <p className="text-gray-600 mt-1">
            {isSegundaAprovacao
              ? "Segunda etapa de aprovação - Revisão final"
              : "Primeira etapa de aprovação - Análise inicial"}
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/gerente/pendentes")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Status da Aprovação</h3>
                <p className="text-sm text-gray-600">
                  {isSegundaAprovacao
                    ? "Aguardando segunda aprovação (revisão final)"
                    : "Aguardando primeira aprovação (análise inicial)"}
                </p>
              </div>
            </div>
            {getStatusBadge(solicitacao.status)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Número do Pedido</p>
                      <p className="font-mono font-semibold">{solicitacao.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Solicitante</p>
                      <p className="font-semibold">{solicitacao.solicitante}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data da Solicitação</p>
                      <p className="font-semibold">{solicitacao.data}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Centro de Custo</p>
                      <p className="font-semibold capitalize">{solicitacao.centroCusto}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor</p>
                      {solicitacao.valorDecidido && solicitacao.valor ? (
                        <p className="font-semibold text-green-700">
                          {formatCurrency(solicitacao.valor, solicitacao.moeda as Currency)}
                        </p>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 bg-amber-50">
                          <Clock className="w-3 h-3 mr-1" />
                          Aguardando seleção
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Urgência</p>
                      <Badge
                        className={
                          solicitacao.urgencia === "alta" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {solicitacao.urgencia === "alta" ? "Alta" : "Normal"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{solicitacao.descricao}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Justificativa</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{solicitacao.justificativa}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cotações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Cotações
                  <Badge variant="outline">{solicitacao.cotacoes?.length || 0} fornecedores</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMoedaVisualizacao(moedaVisualizacao === "BRL" ? "USD" : "BRL")}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Ver em {moedaVisualizacao === "BRL" ? "USD" : "BRL"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solicitacao.cotacoes && solicitacao.cotacoes.length > 0 ? (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isSegundaAprovacao && solicitacao.valorDecidido
                      ? "Cotação selecionada na primeira aprovação:"
                      : "Selecione a cotação a ser aprovada:"}
                  </Label>

                  <RadioGroup
                    value={cotacaoSelecionadaId || ""}
                    onValueChange={(value) => {
                      setCotacaoSelecionadaId(value)
                      if (!isSegundaAprovacao || !solicitacao.valorDecidido) {
                        handleSelecionarCotacao(value)
                      }
                    }}
                    disabled={isSegundaAprovacao && solicitacao.valorDecidido}
                  >
                    {solicitacao.cotacoes.map((cotacao) => (
                      <div
                        key={cotacao.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          cotacao.selecionada ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={cotacao.id}
                            id={cotacao.id}
                            disabled={isSegundaAprovacao && solicitacao.valorDecidido}
                            className="mt-1"
                          />
                          <Label htmlFor={cotacao.id} className="flex-1 cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-lg">{cotacao.fornecedor}</h4>
                                <div className="text-right">
                                  <p className="font-bold text-xl text-green-700">
                                    {formatCurrency(cotacao.valor, cotacao.moeda as Currency)}
                                  </p>
                                  {cotacao.moeda !== moedaVisualizacao && (
                                    <p className="text-sm text-gray-500">
                                      ≈{" "}
                                      {formatCurrency(
                                        convertCurrency(cotacao.valor, cotacao.moeda as Currency, moedaVisualizacao),
                                        moedaVisualizacao,
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Prazo de entrega:</span>
                                  <p className="font-medium">{cotacao.prazoEntrega}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Observações:</span>
                                  <p className="font-medium">{cotacao.observacoes || "Nenhuma"}</p>
                                </div>
                              </div>

                              {cotacao.selecionada && isSegundaAprovacao && (
                                <Badge className="bg-blue-100 text-blue-800">✓ Selecionada na primeira aprovação</Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  {isSegundaAprovacao && solicitacao.valorDecidido && (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Cotação já selecionada</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              A cotação já foi selecionada na primeira etapa. Revise a escolha e aprove ou rejeite a
                              solicitação.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma cotação disponível para esta solicitação.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Histórico de Aprovações */}
          <Card>
            <Collapsible open={historicoExpanded} onOpenChange={setHistoricoExpanded}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Histórico
                    </div>
                    {historicoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {solicitacao.aprovacoes.length > 0 ? (
                    <div className="space-y-3">
                      {solicitacao.aprovacoes.map((aprovacao, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">{aprovacao.aprovadorNome}</p>
                            <Badge variant="outline" className="text-xs">
                              {aprovacao.nivel === 1 ? "1ª Aprovação" : "2ª Aprovação"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{aprovacao.data}</p>
                          {aprovacao.observacao && (
                            <p className="text-sm bg-gray-50 p-2 rounded text-gray-700">{aprovacao.observacao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Nenhuma aprovação registrada ainda.</p>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Sua Decisão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observacao" className="text-sm font-medium">
                  Observações {!isSegundaAprovacao && "(opcional)"}
                </Label>
                <Textarea
                  id="observacao"
                  placeholder="Adicione suas observações sobre esta solicitação..."
                  rows={4}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAprovar}
                  disabled={isSubmitting || !solicitacao.valorDecidido || jaAprovouNesteNivel}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isSegundaAprovacao ? "Aprovar (Final)" : "Aprovar (1ª Etapa)"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleRejeitar}
                  disabled={isSubmitting || jaAprovouNesteNivel}
                  className="w-full gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Rejeitar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/gerente/pendentes")}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>

              {jaAprovouNesteNivel && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm">Você já aprovou esta solicitação neste nível.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!solicitacao.valorDecidido && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm">Selecione uma cotação antes de aprovar.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">
                    {isSegundaAprovacao ? "Segunda Etapa" : "Primeira Etapa"}
                  </h4>
                  <p className="text-sm text-blue-800 mt-1">
                    {isSegundaAprovacao
                      ? "Revise a cotação selecionada e a aprovação anterior antes de tomar sua decisão final."
                      : "Selecione uma cotação e aprove para enviar para a segunda etapa de validação."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
