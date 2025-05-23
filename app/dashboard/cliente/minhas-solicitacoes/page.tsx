"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, RefreshCw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getSolicitacoes, type Solicitacao } from "@/lib/solicitacoes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CurrencyDisplay } from "@/components/currency-display"
import type { Currency } from "@/lib/currency"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function MinhasSolicitacoesPage() {
  const router = useRouter()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [moedaVisualizacao, setMoedaVisualizacao] = useState<Currency>("BRL")

  useEffect(() => {
    // Carregar solicitações ao montar o componente
    const todasSolicitacoes = getSolicitacoes()
    // Filtrar apenas para o usuário atual (simulado como "Carlos Silva")
    const solicitacoesDoUsuario = todasSolicitacoes.filter((s) => s.solicitante === "Carlos Silva" || !s.solicitante)
    setSolicitacoes(solicitacoesDoUsuario)
  }, [])

  // Ordenar solicitações por data (mais recentes primeiro)
  const solicitacoesOrdenadas = [...solicitacoes].sort((a, b) => {
    // Converter data no formato DD/MM/YYYY para objeto Date
    const [diaA, mesA, anoA] = a.data.split("/").map(Number)
    const [diaB, mesB, anoB] = b.data.split("/").map(Number)

    const dateA = new Date(anoA, mesA - 1, diaA)
    const dateB = new Date(anoB, mesB - 1, diaB)

    return dateB.getTime() - dateA.getTime()
  })

  const verDetalhes = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao)
    setDialogAberto(true)
  }

  const alternarMoedaVisualizacao = () => {
    setMoedaVisualizacao(moedaVisualizacao === "BRL" ? "USD" : "BRL")
  }

  // Encontrar a cotação selecionada para a solicitação selecionada
  const cotacaoSelecionada = solicitacaoSelecionada?.cotacoes?.find((c) => c.selecionada)

  // Renderizar o histórico de aprovações
  const renderHistoricoAprovacoes = () => {
    if (!solicitacaoSelecionada || solicitacaoSelecionada.aprovacoes.length === 0) {
      return <p className="text-sm text-gray-500">Nenhuma aprovação registrada.</p>
    }

    return (
      <div className="space-y-3">
        {solicitacaoSelecionada.aprovacoes.map((aprovacao, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-md border">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">{aprovacao.aprovadorNome}</h4>
              <Badge variant="outline">{aprovacao.nivel === 1 ? "1ª Aprovação" : "2ª Aprovação"}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">{aprovacao.data}</p>
            {aprovacao.observacao && <p className="text-sm mt-2 bg-white p-2 rounded border">{aprovacao.observacao}</p>}
          </div>
        ))}
      </div>
    )
  }

  // Função para obter a classe CSS do status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Parcialmente Aprovado":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Rejeitado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-gray-500">Acompanhe o status das suas solicitações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={alternarMoedaVisualizacao} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Visualizar em {moedaVisualizacao === "BRL" ? "USD" : "BRL"}
          </Button>
          <Button onClick={() => router.push("/dashboard/cliente")} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {solicitacoesOrdenadas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Você ainda não possui solicitações.</p>
            <Button
              onClick={() => router.push("/dashboard/cliente/nova-solicitacao")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              Criar sua primeira solicitação
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cotações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitacoesOrdenadas.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell className="font-medium">{solicitacao.id}</TableCell>
                  <TableCell>{solicitacao.data}</TableCell>
                  <TableCell>{solicitacao.descricao}</TableCell>
                  <TableCell>
                    {solicitacao.valorDecidido ? (
                      <CurrencyDisplay value={solicitacao.valor} currency={solicitacao.moeda} showConversion={false} />
                    ) : (
                      <Badge variant="outline" className="text-amber-600 bg-amber-50">
                        Aguardando decisão
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{solicitacao.moeda === "BRL" ? "R$" : "$"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusClass(solicitacao.status)}>{solicitacao.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{solicitacao.cotacoes?.length || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => verDetalhes(solicitacao)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog para exibir detalhes da solicitação */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação {solicitacaoSelecionada?.id}</DialogTitle>
          </DialogHeader>

          {solicitacaoSelecionada && (
            <div className="space-y-6">
              {/* Status da aprovação */}
              {solicitacaoSelecionada.status === "Parcialmente Aprovado" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Aprovação em Andamento</h3>
                      <p className="text-sm text-gray-600">
                        Sua solicitação foi aprovada na primeira etapa e agora aguarda a aprovação final.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informações Básicas</h3>
                  <dl className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Solicitante:</dt>
                      <dd className="text-sm font-medium">{solicitacaoSelecionada.solicitante}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Data:</dt>
                      <dd className="text-sm font-medium">{solicitacaoSelecionada.data}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Centro de Custo:</dt>
                      <dd className="text-sm font-medium capitalize">{solicitacaoSelecionada.centroCusto}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Urgência:</dt>
                      <dd className="text-sm font-medium capitalize">{solicitacaoSelecionada.urgencia}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Moeda Principal:</dt>
                      <dd className="text-sm font-medium">
                        {solicitacaoSelecionada.moeda === "BRL" ? "Real (R$)" : "Dólar ($)"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <dl className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Situação:</dt>
                      <dd>
                        <Badge className={getStatusClass(solicitacaoSelecionada.status)}>
                          {solicitacaoSelecionada.status}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Valor:</dt>
                      <dd>
                        {solicitacaoSelecionada.valorDecidido ? (
                          <CurrencyDisplay
                            value={solicitacaoSelecionada.valor}
                            currency={solicitacaoSelecionada.moeda}
                            showConversion={true}
                          />
                        ) : (
                          <Badge variant="outline" className="text-amber-600 bg-amber-50">
                            Aguardando decisão
                          </Badge>
                        )}
                      </dd>
                    </div>
                    {solicitacaoSelecionada.dataAprovacao && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Data de Aprovação:</dt>
                        <dd className="text-sm font-medium">{solicitacaoSelecionada.dataAprovacao}</dd>
                      </div>
                    )}
                    {solicitacaoSelecionada.observacao && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Observação:</dt>
                        <dd className="text-sm font-medium">{solicitacaoSelecionada.observacao}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Etapa de Aprovação:</dt>
                      <dd className="text-sm font-medium">
                        {solicitacaoSelecionada.status === "Aprovado"
                          ? "Completamente aprovado"
                          : solicitacaoSelecionada.status === "Parcialmente Aprovado"
                            ? "Aguardando aprovação final"
                            : solicitacaoSelecionada.status === "Rejeitado"
                              ? "Rejeitado"
                              : "Aguardando primeira aprovação"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                <p className="mt-1 text-sm">{solicitacaoSelecionada.descricao}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Justificativa</h3>
                <p className="mt-1 text-sm">{solicitacaoSelecionada.justificativa}</p>
              </div>

              {/* Histórico de Aprovações */}
              {solicitacaoSelecionada.aprovacoes.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="historico">
                    <AccordionTrigger className="text-sm font-medium text-gray-500">
                      Histórico de Aprovações
                    </AccordionTrigger>
                    <AccordionContent>{renderHistoricoAprovacoes()}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cotações</h3>
                {solicitacaoSelecionada.cotacoes && solicitacaoSelecionada.cotacoes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Moeda</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitacaoSelecionada.cotacoes.map((cotacao) => (
                        <TableRow key={cotacao.id}>
                          <TableCell className="font-medium">{cotacao.fornecedor}</TableCell>
                          <TableCell>
                            <CurrencyDisplay value={cotacao.valor} currency={cotacao.moeda} showConversion={false} />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{cotacao.moeda === "BRL" ? "R$" : "$"}</Badge>
                          </TableCell>
                          <TableCell>{cotacao.prazoEntrega}</TableCell>
                          <TableCell>{cotacao.observacoes || "-"}</TableCell>
                          <TableCell>
                            {cotacao.selecionada ? (
                              <Badge className="bg-green-100 text-green-800">Selecionada</Badge>
                            ) : (
                              <Badge variant="outline">Não selecionada</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma cotação disponível para esta solicitação.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
