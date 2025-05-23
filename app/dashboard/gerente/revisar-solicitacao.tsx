"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"
import { useToast } from "@/components/ui/use-toast"

interface RevisarSolicitacaoProps {
  solicitacaoId: string
  isOpen: boolean
  onClose: () => void
}

export default function RevisarSolicitacao({ solicitacaoId, isOpen, onClose }: RevisarSolicitacaoProps) {
  const { solicitacoes, atualizarStatus } = useSolicitacoes()
  const [observacao, setObservacao] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Encontrar a solicitação pelo ID de forma segura
  const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId)

  if (!solicitacao) {
    return null
  }

  const handleAprovar = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      atualizarStatus(solicitacaoId, "Aprovado", observacao)

      toast({
        title: "Solicitação aprovada",
        description: "A solicitação foi aprovada com sucesso.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejeitar = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    if (!observacao) {
      toast({
        title: "Observação necessária",
        description: "Por favor, forneça uma justificativa para a rejeição.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      atualizarStatus(solicitacaoId, "Rejeitado", observacao)

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação foi rejeitada com sucesso.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Revisar Solicitação</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Solicitante:</Label>
            <div className="col-span-3 font-medium">{solicitacao.solicitante || "Usuário"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Descrição:</Label>
            <div className="col-span-3">{solicitacao.descricao}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Valor:</Label>
            <div className="col-span-3">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(solicitacao.valor)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data:</Label>
            <div className="col-span-3">{solicitacao.data}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Urgência:</Label>
            <div className="col-span-3 capitalize">{solicitacao.urgencia}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Centro de Custo:</Label>
            <div className="col-span-3 capitalize">{solicitacao.centroCusto}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="justificativa">
              Justificativa:
            </Label>
            <div className="col-span-3">{solicitacao.justificativa}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="observacao">
              Observação:
            </Label>
            <div className="col-span-3">
              <Textarea
                id="observacao"
                placeholder="Adicione uma observação (obrigatório para rejeição)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRejeitar} disabled={isSubmitting} className="gap-2">
            <XCircle className="h-4 w-4" />
            Rejeitar
          </Button>
          <Button onClick={handleAprovar} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 gap-2">
            <CheckCircle className="h-4 w-4" />
            Aprovar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
