"use client"

import type React from "react"

import { useState } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"

interface NovaSolicitacaoProps {
  isOpen: boolean
  onClose: () => void
}

export default function NovaSolicitacao({ isOpen, onClose }: NovaSolicitacaoProps) {
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [justificativa, setJustificativa] = useState("")
  const [urgencia, setUrgencia] = useState<"normal" | "alta">("normal")
  const [centroCusto, setCentroCusto] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { adicionarSolicitacao } = useSolicitacoes()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validar campos
    if (!descricao || !valor || !justificativa || !centroCusto) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Adicionar nova solicitação
    try {
      adicionarSolicitacao({
        descricao,
        valor: Number.parseFloat(valor),
        justificativa,
        urgencia,
        centroCusto,
      })

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada para aprovação com sucesso!",
      })

      // Limpar o formulário
      setDescricao("")
      setValor("")
      setJustificativa("")
      setUrgencia("normal")
      setCentroCusto("")

      onClose()

      // Redirecionar para a página de solicitações após um breve delay
      setTimeout(() => {
        router.push("/dashboard/cliente/minhas-solicitacoes")
      }, 500)
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Nova Solicitação de Compra</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição da Compra</Label>
            <Input
              id="descricao"
              placeholder="Descreva o que você precisa comprar..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor Estimado (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justificativa">Justificativa</Label>
            <Textarea
              id="justificativa"
              placeholder="Por que esta compra é necessária?"
              rows={4}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Urgência</Label>
            <RadioGroup
              value={urgencia}
              onValueChange={(value) => setUrgencia(value as "normal" | "alta")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alta" id="alta" />
                <Label htmlFor="alta">Alta</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="centroCusto">Centro de Custo</Label>
            <Select value={centroCusto} onValueChange={setCentroCusto} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um centro de custo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                <SelectItem value="rh">Recursos Humanos</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="operacoes">Operações</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
