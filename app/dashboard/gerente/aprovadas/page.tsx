"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getSolicitacoesPorStatus, type Solicitacao } from "@/lib/solicitacoes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SolicitacoesAprovadasPage() {
  const router = useRouter()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [filtroMes, setFiltroMes] = useState<string>("todos")
  const [filtroCentroCusto, setFiltroCentroCusto] = useState<string>("todos")

  useEffect(() => {
    // Carregar solicitações aprovadas ao montar o componente
    const aprovadas = getSolicitacoesPorStatus("Aprovado")
    setSolicitacoes(aprovadas)
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

    // Filtrar por centro de custo
    if (filtroCentroCusto !== "todos" && solicitacao.centroCusto !== filtroCentroCusto) {
      return false
    }

    return true
  })

  // Calcular valor total aprovado
  const valorTotalAprovado = solicitacoesFiltradas.reduce((total, solicitacao) => total + solicitacao.valor, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Solicitações Aprovadas</h1>
          <p className="text-gray-500">Histórico de solicitações aprovadas</p>
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
          <Select value={filtroCentroCusto} onValueChange={setFiltroCentroCusto}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por centro de custo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os centros</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="ti">TI</SelectItem>
              <SelectItem value="rh">RH</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="operacoes">Operações</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {solicitacoesFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma solicitação aprovada encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Data Aprovação</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>{solicitacao.dataAprovacao || "-"}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{solicitacao.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Total Aprovado</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(valorTotalAprovado)}{" "}
                em solicitações aprovadas{filtroMes !== "todos" ? " neste mês" : ""}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
