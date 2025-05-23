"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Plus, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Currency, formatCurrency, convertCurrency } from "@/lib/currency"
import { useSolicitacoes } from "@/contexts/solicitacoes-context"

interface CotacaoForm {
  fornecedor: string
  valor: string
  moeda: Currency
  prazoEntrega: string
  observacoes: string
}

export default function NovaSolicitacaoPage() {
  const [descricao, setDescricao] = useState("")
  const [justificativa, setJustificativa] = useState("")
  const [urgencia, setUrgencia] = useState<"normal" | "alta">("normal")
  const [centroCusto, setCentroCusto] = useState("")
  const [moedaPadrao, setMoedaPadrao] = useState<Currency>("BRL")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { adicionarSolicitacao } = useSolicitacoes()

  // Estado para as cotações - começamos com uma cotação vazia
  const [cotacoes, setCotacoes] = useState<CotacaoForm[]>([
    { fornecedor: "", valor: "", moeda: "BRL", prazoEntrega: "", observacoes: "" },
  ])

  // Atualizar uma cotação específica
  const atualizarCotacao = (index: number, campo: keyof CotacaoForm, valor: string | Currency) => {
    const novasCotacoes = [...cotacoes]
    novasCotacoes[index] = { ...novasCotacoes[index], [campo]: valor }
    setCotacoes(novasCotacoes)
  }

  // Adicionar nova cotação
  const adicionarCotacao = () => {
    setCotacoes([...cotacoes, { fornecedor: "", valor: "", moeda: moedaPadrao, prazoEntrega: "", observacoes: "" }])
  }

  // Remover cotação
  const removerCotacao = (index: number) => {
    if (cotacoes.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "É necessário pelo menos uma cotação para enviar a solicitação.",
        variant: "destructive",
      })
      return
    }
    const novasCotacoes = cotacoes.filter((_, i) => i !== index)
    setCotacoes(novasCotacoes)
  }

  // Verificar se pelo menos uma cotação está preenchida
  const cotacoesValidas = () => {
    return cotacoes.some(
      (cotacao) =>
        cotacao.fornecedor.trim() !== "" && cotacao.valor.trim() !== "" && cotacao.prazoEntrega.trim() !== "",
    )
  }

  // Atualizar a moeda padrão de todas as cotações
  const atualizarMoedaPadrao = (novaMoeda: Currency) => {
    setMoedaPadrao(novaMoeda)
    // Perguntar ao usuário se deseja atualizar todas as cotações
    if (cotacoes.some((c) => c.valor.trim() !== "")) {
      const confirmar = window.confirm("Deseja converter os valores de todas as cotações para a nova moeda?")
      if (confirmar) {
        const cotacoesAtualizadas = cotacoes.map((cotacao) => {
          if (cotacao.valor.trim() === "") {
            return { ...cotacao, moeda: novaMoeda }
          }
          const valorNumerico = Number.parseFloat(cotacao.valor)
          if (isNaN(valorNumerico)) {
            return { ...cotacao, moeda: novaMoeda }
          }
          const valorConvertido = convertCurrency(valorNumerico, cotacao.moeda, novaMoeda)
          return {
            ...cotacao,
            valor: valorConvertido.toFixed(2),
            moeda: novaMoeda,
          }
        })
        setCotacoes(cotacoesAtualizadas)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("=== INÍCIO DO ENVIO DE SOLICITAÇÃO ===")

      // Validar campos básicos
      if (!descricao || !justificativa || !centroCusto) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Validar cotações - pelo menos uma cotação válida
      if (!cotacoesValidas()) {
        toast({
          title: "Cotações incompletas",
          description: "É necessário fornecer pelo menos uma cotação completa.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Preparar cotações para envio
      const cotacoesFormatadas = cotacoes
        .filter((c) => c.fornecedor.trim() !== "" && c.valor.trim() !== "" && c.prazoEntrega.trim() !== "")
        .map((c) => ({
          id: `COT-TEMP-${Math.random().toString(36).substring(2, 9)}`, // ID temporário
          fornecedor: c.fornecedor,
          valor: Number.parseFloat(c.valor),
          moeda: c.moeda,
          prazoEntrega: c.prazoEntrega,
          observacoes: c.observacoes || undefined,
          selecionada: false,
        }))

      console.log("Cotações formatadas:", cotacoesFormatadas)

      // Adicionar nova solicitação usando o contexto
      const novaSolicitacao = {
        descricao,
        justificativa,
        urgencia,
        centroCusto,
        solicitante: "Carlos Silva", // Nome fixo para simplificar
        cotacoes: cotacoesFormatadas,
        moeda: moedaPadrao,
      }

      console.log("Enviando nova solicitação:", novaSolicitacao)

      // Usar a função do contexto para adicionar a solicitação
      await adicionarSolicitacao(novaSolicitacao)

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada para aprovação com sucesso!",
      })

      // Redirecionar para a página de solicitações
      setTimeout(() => {
        router.push("/dashboard/cliente/minhas-solicitacoes")
      }, 1000)
    } catch (error) {
      console.error("=== ERRO AO ENVIAR SOLICITAÇÃO ===", error)
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nova Solicitação de Compra</h1>
          <p className="text-gray-500">Preencha os dados para criar uma nova solicitação</p>
        </div>
        <Button onClick={() => router.push("/dashboard/cliente")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="moedaPadrao">Moeda Padrão</Label>
                <Select value={moedaPadrao} onValueChange={(value: Currency) => atualizarMoedaPadrao(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cotações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cotações
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={adicionarCotacao}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar Cotação
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cotacoes.map((cotacao, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerCotacao(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Remover cotação</span>
                    </Button>
                  </div>

                  <h3 className="font-medium mb-3">Cotação {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`fornecedor-${index}`}>Fornecedor</Label>
                      <Input
                        id={`fornecedor-${index}`}
                        placeholder="Nome do fornecedor"
                        value={cotacao.fornecedor}
                        onChange={(e) => atualizarCotacao(index, "fornecedor", e.target.value)}
                        required={index === 0} // Apenas a primeira cotação é obrigatória
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`valor-${index}`}>Valor</Label>
                        <Input
                          id={`valor-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={cotacao.valor}
                          onChange={(e) => atualizarCotacao(index, "valor", e.target.value)}
                          required={index === 0} // Apenas a primeira cotação é obrigatória
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`moeda-${index}`}>Moeda</Label>
                        <Select
                          value={cotacao.moeda}
                          onValueChange={(value: Currency) => atualizarCotacao(index, "moeda", value)}
                        >
                          <SelectTrigger id={`moeda-${index}`}>
                            <SelectValue placeholder="Moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Real (R$)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`prazo-${index}`}>Prazo de Entrega</Label>
                      <Input
                        id={`prazo-${index}`}
                        placeholder="Ex: 5 dias úteis"
                        value={cotacao.prazoEntrega}
                        onChange={(e) => atualizarCotacao(index, "prazoEntrega", e.target.value)}
                        required={index === 0} // Apenas a primeira cotação é obrigatória
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`observacoes-${index}`}>Observações</Label>
                      <Input
                        id={`observacoes-${index}`}
                        placeholder="Observações adicionais"
                        value={cotacao.observacoes}
                        onChange={(e) => atualizarCotacao(index, "observacoes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Tabela comparativa de cotações */}
              {cotacoes.some((c) => c.fornecedor && c.valor) && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Comparativo de Cotações</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cotacoes
                        .filter((c) => c.fornecedor && c.valor)
                        .map((cotacao, index) => (
                          <TableRow key={index}>
                            <TableCell>{cotacao.fornecedor}</TableCell>
                            <TableCell>
                              {cotacao.valor && (
                                <div className="flex items-center gap-1">
                                  {formatCurrency(Number.parseFloat(cotacao.valor), cotacao.moeda)}
                                  {cotacao.moeda !== moedaPadrao && (
                                    <span className="text-xs text-gray-500">
                                      (≈{" "}
                                      {formatCurrency(
                                        convertCurrency(Number.parseFloat(cotacao.valor), cotacao.moeda, moedaPadrao),
                                        moedaPadrao,
                                      )}
                                      )
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{cotacao.prazoEntrega}</TableCell>
                            <TableCell>{cotacao.observacoes || "-"}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
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
                    <h3 className="text-sm font-medium text-blue-800">Informação</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Adicione uma ou mais cotações para sua solicitação. Você pode especificar valores em diferentes
                        moedas. O gerente irá analisar as cotações e selecionar a mais adequada durante o processo de
                        aprovação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/cliente")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            disabled={isSubmitting || !cotacoesValidas()}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
          </Button>
        </div>
      </form>
    </div>
  )
}
