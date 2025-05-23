"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Solicitacao {
  id: string
  data: string
  descricao: string
  valor: number
  status: "Aprovado" | "Pendente" | "Rejeitado"
}

export default function MinhasSolicitacoes() {
  const router = useRouter()

  // Dados de exemplo - em uma aplicação real, estes viriam de uma API
  const [solicitacoes] = useState<Solicitacao[]>([
    {
      id: "#PED-2023-0156",
      data: "15/10/2023",
      descricao: "Material de escritório",
      valor: 350.0,
      status: "Aprovado",
    },
    {
      id: "#PED-2023-0155",
      data: "12/10/2023",
      descricao: "Licença de software",
      valor: 1200.0,
      status: "Aprovado",
    },
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-gray-500">Acompanhe o status das suas solicitações</p>
        </div>
        <Button onClick={() => router.push("/dashboard/cliente")} className="bg-indigo-600 hover:bg-indigo-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitacoes.map((solicitacao) => (
              <TableRow key={solicitacao.id}>
                <TableCell className="font-medium">{solicitacao.id}</TableCell>
                <TableCell>{solicitacao.data}</TableCell>
                <TableCell>{solicitacao.descricao}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(solicitacao.valor)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      solicitacao.status === "Aprovado"
                        ? "success"
                        : solicitacao.status === "Pendente"
                          ? "warning"
                          : "destructive"
                    }
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
      </div>
    </div>
  )
}
