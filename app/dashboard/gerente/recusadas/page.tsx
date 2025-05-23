"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getSolicitacoesPorStatus, type Solicitacao } from "@/lib/solicitacoes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SolicitacoesRecusadasPage() {
  const router = useRouter()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [filtroMes, setFiltroMes] = useState<string>("todos")
  const [filtroMotivo, setFiltroMotivo] = useState<string>("todos")

  useEffect(() => {
    // Carregar solicitações recusadas ao montar o componente
    const recusadas = getSolicitacoesPorStatus("Rejeitado")
    setSolicitacoes(recusadas)
  }, [])

  // Aplicar filtros
  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    // Filtrar por mês
    if (filtroMes !== "todos") {
      const [dia, mes, ano] = solicitacao.data.split("/").map(Number)
      const mesSolicitacao = mes.toString().padStart(2, "0")
      if (filtroMes !== mesSolicitacao) {
        return false
      }
    }

    // Filtrar por motivo (simplificado)
    if (filtroMotivo !== "todos") {
      const observacao = solicitacao.observacao?.toLowerCase() || ""
      if (!observacao.includes(filtroMotivo.toLowerCase())) {
        return false
      }
    }

    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Solicitações Recusadas</h1>
          <p className="text-gray-500">Histórico de solicitações recusadas com justificativas</p>
        </div>
        <Button onClick={() => router.push("/dashboard/gerente")} className="bg-indigo-600 hover:bg-indigo-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="w-48">
          <Select value={filtroMes} onValueChange={setFiltroMes}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              <SelectItem value="10">Outubro</SelectItem>
              <SelectItem value="09">Setembro</SelectItem>
              <SelectItem value="08">Agosto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={filtroMotivo} onValueChange={setFiltroMotivo}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os motivos</SelectItem>
              <SelectItem value="orçamento">Orçamento</SelectItem>
              <SelectItem value="escopo">Escopo</SelectItem>
              <SelectItem value="justificativa">Justificativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {solicitacoesFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma solicitação recusada encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitacoesFiltradas.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell className="font-medium">{solicitacao.id}</TableCell>
                  <TableCell>{solicitacao.solicitante}</TableCell>
                  <TableCell>{solicitacao.descricao}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(solicitacao.valor)}
                  </TableCell>
                  <TableCell>{solicitacao.data}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      {solicitacao.observacao || "Sem justificativa"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Principais Motivos de Recusa</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Orçamento excedido (40%)</li>
                  <li>Fora do escopo do projeto (30%)</li>
                  <li>Justificativa insuficiente (20%)</li>
                  <li>Documentação incompleta (10%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Dicas para Solicitantes</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Para evitar recusas, certifique-se de incluir justificativas detalhadas, verificar o orçamento
                  disponível e alinhar com os objetivos do projeto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
