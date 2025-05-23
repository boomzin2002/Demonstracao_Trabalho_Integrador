"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Cotacao {
  id: string
  fornecedor: string
  valor: number
  moeda: string
  prazoEntrega: string
  observacoes?: string
  selecionada: boolean
}

export interface Aprovacao {
  aprovadorId: string
  aprovadorNome: string
  data: string
  observacao?: string
  nivel: 1 | 2
}

export interface Solicitacao {
  id: string
  data: string
  descricao: string
  valor: number | null
  justificativa: string
  urgencia: "normal" | "alta"
  centroCusto: string
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Parcialmente Aprovado"
  solicitante?: string
  observacao?: string
  aprovacoes: Aprovacao[]
  nivelAtualAprovacao?: 1 | 2
  dataAprovacao?: string
  valorDecidido?: boolean
  cotacoes?: Cotacao[]
  moeda?: string
}

interface SolicitacoesContextType {
  solicitacoes: Solicitacao[]
  adicionarSolicitacao: (solicitacao: Omit<Solicitacao, "id" | "data" | "status" | "aprovacoes">) => void
  atualizarStatus: (id: string, status: "Pendente" | "Aprovado" | "Rejeitado", observacao?: string) => void
  aprovarSolicitacao: (id: string, aprovadorId: string, aprovadorNome: string, observacao?: string) => void
  rejeitarSolicitacao: (id: string, aprovadorId: string, aprovadorNome: string, observacao: string) => void
  selecionarCotacao: (solicitacaoId: string, cotacaoId: string) => void
}

const SolicitacoesContext = createContext<SolicitacoesContextType | undefined>(undefined)

// Dados iniciais de exemplo com cotações
const dadosIniciais: Solicitacao[] = [
  {
    id: "#PED-2023-0156",
    data: "15/10/2023",
    descricao: "Material de escritório",
    valor: 350.0,
    justificativa: "Reposição de material de escritório para o departamento",
    urgencia: "normal",
    centroCusto: "rh",
    status: "Aprovado",
    solicitante: "Carlos Silva",
    aprovacoes: [
      {
        aprovadorId: "gerente1@empresa.com",
        aprovadorNome: "Roberto Silva",
        data: "16/10/2023",
        nivel: 1,
        observacao: "Aprovado conforme orçamento",
      },
      {
        aprovadorId: "gerente2@empresa.com",
        aprovadorNome: "Mariana Costa",
        data: "16/10/2023",
        nivel: 2,
        observacao: "Aprovação final",
      },
    ],
    nivelAtualAprovacao: 2,
    valorDecidido: true,
    moeda: "BRL",
    cotacoes: [
      {
        id: "COT-001",
        fornecedor: "Papelaria Central",
        valor: 350.0,
        moeda: "BRL",
        prazoEntrega: "5 dias úteis",
        observacoes: "Inclui entrega gratuita",
        selecionada: true,
      },
      {
        id: "COT-002",
        fornecedor: "Office Supply",
        valor: 380.0,
        moeda: "BRL",
        prazoEntrega: "3 dias úteis",
        observacoes: "Produtos importados",
        selecionada: false,
      },
    ],
  },
  {
    id: "#PED-2023-0155",
    data: "12/10/2023",
    descricao: "Licença de software",
    valor: 1200.0,
    justificativa: "Renovação anual da licença de software de design",
    urgencia: "alta",
    centroCusto: "ti",
    status: "Aprovado",
    solicitante: "Carlos Silva",
    aprovacoes: [
      {
        aprovadorId: "gerente1@empresa.com",
        aprovadorNome: "Roberto Silva",
        data: "13/10/2023",
        nivel: 1,
        observacao: "Aprovado conforme necessidade",
      },
      {
        aprovadorId: "gerente2@empresa.com",
        aprovadorNome: "Mariana Costa",
        data: "13/10/2023",
        nivel: 2,
        observacao: "Aprovação final",
      },
    ],
    nivelAtualAprovacao: 2,
    valorDecidido: true,
    moeda: "BRL",
    cotacoes: [
      {
        id: "COT-003",
        fornecedor: "Software House",
        valor: 1200.0,
        moeda: "BRL",
        prazoEntrega: "Imediato",
        observacoes: "Licença anual",
        selecionada: true,
      },
    ],
  },
  {
    id: "#PED-2023-0157",
    data: "15/10/2023",
    descricao: "Licença de software para design",
    valor: null,
    justificativa: "Necessário para o novo projeto de marketing",
    urgencia: "normal",
    centroCusto: "marketing",
    status: "Pendente",
    solicitante: "Ana Oliveira",
    aprovacoes: [],
    nivelAtualAprovacao: 1,
    valorDecidido: false,
    moeda: "USD",
    cotacoes: [
      {
        id: "COT-004",
        fornecedor: "Design Pro",
        valor: 230.0,
        moeda: "USD",
        prazoEntrega: "Imediato",
        observacoes: "Versão mais recente",
        selecionada: false,
      },
      {
        id: "COT-005",
        fornecedor: "Creative Tools",
        valor: 240.0,
        moeda: "USD",
        prazoEntrega: "Imediato",
        observacoes: "Inclui plugins adicionais",
        selecionada: false,
      },
      {
        id: "COT-006",
        fornecedor: "Art Software",
        valor: 220.0,
        moeda: "USD",
        prazoEntrega: "2 dias úteis",
        observacoes: "Versão básica",
        selecionada: false,
      },
    ],
  },
  {
    id: "#PED-2023-0158",
    data: "14/10/2023",
    descricao: "Equipamento para videoconferência",
    valor: null,
    justificativa: "Melhorar a qualidade das reuniões remotas",
    urgencia: "alta",
    centroCusto: "ti",
    status: "Pendente",
    solicitante: "João Mendes",
    aprovacoes: [],
    nivelAtualAprovacao: 1,
    valorDecidido: false,
    moeda: "USD",
    cotacoes: [
      {
        id: "COT-007",
        fornecedor: "Tech Store",
        valor: 670.0,
        moeda: "USD",
        prazoEntrega: "7 dias úteis",
        observacoes: "Modelo premium",
        selecionada: false,
      },
      {
        id: "COT-008",
        fornecedor: "Office Tech",
        valor: 615.0,
        moeda: "USD",
        prazoEntrega: "10 dias úteis",
        observacoes: "Sem garantia estendida",
        selecionada: false,
      },
      {
        id: "COT-009",
        fornecedor: "Eletrônicos Pro",
        valor: 730.0,
        moeda: "USD",
        prazoEntrega: "5 dias úteis",
        observacoes: "Inclui instalação",
        selecionada: false,
      },
    ],
  },
  {
    id: "#PED-2023-0159",
    data: "16/10/2023",
    descricao: "Serviços de consultoria em marketing",
    valor: 4500.0,
    justificativa: "Desenvolvimento de nova estratégia de marketing digital",
    urgencia: "normal",
    centroCusto: "marketing",
    status: "Parcialmente Aprovado",
    solicitante: "Fernanda Lima",
    aprovacoes: [
      {
        aprovadorId: "gerente1@empresa.com",
        aprovadorNome: "Roberto Silva",
        data: "17/10/2023",
        nivel: 1,
        observacao: "Aprovado na primeira etapa",
      },
    ],
    nivelAtualAprovacao: 2,
    valorDecidido: true,
    moeda: "BRL",
    cotacoes: [
      {
        id: "COT-010",
        fornecedor: "Marketing Experts",
        valor: 4500.0,
        moeda: "BRL",
        prazoEntrega: "30 dias",
        observacoes: "Inclui relatório final",
        selecionada: true,
      },
      {
        id: "COT-011",
        fornecedor: "Digital Marketing Co.",
        valor: 4800.0,
        moeda: "BRL",
        prazoEntrega: "25 dias",
        observacoes: "Inclui implementação",
        selecionada: false,
      },
    ],
  },
  {
    id: "#PED-2023-0152",
    data: "10/10/2023",
    descricao: "Mobiliário de escritório",
    valor: 2800.0,
    justificativa: "Substituição de cadeiras ergonômicas",
    urgencia: "normal",
    centroCusto: "rh",
    status: "Rejeitado",
    solicitante: "Maria Santos",
    observacao: "Orçamento acima do limite permitido para este tipo de item",
    aprovacoes: [
      {
        aprovadorId: "gerente1@empresa.com",
        aprovadorNome: "Roberto Silva",
        data: "11/10/2023",
        nivel: 1,
        observacao: "Rejeitado por exceder o orçamento",
      },
    ],
    nivelAtualAprovacao: 1,
    valorDecidido: true,
    moeda: "BRL",
    cotacoes: [
      {
        id: "COT-012",
        fornecedor: "Móveis Corporativos",
        valor: 2800.0,
        moeda: "BRL",
        prazoEntrega: "15 dias úteis",
        observacoes: "Cadeiras ergonômicas premium",
        selecionada: true,
      },
    ],
  },
]

export function SolicitacoesProvider({ children }: { children: ReactNode }) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Carregar solicitações do localStorage apenas uma vez ao iniciar
  useEffect(() => {
    if (isInitialized) return

    try {
      const storedSolicitacoes = localStorage.getItem("portalSolicitacoes")
      if (storedSolicitacoes) {
        const parsed = JSON.parse(storedSolicitacoes)
        // Garantir que todas as solicitações tenham os campos necessários
        const normalized = parsed.map((s: any) => ({
          ...s,
          aprovacoes: s.aprovacoes || [],
          nivelAtualAprovacao: s.nivelAtualAprovacao || 1,
          valorDecidido: s.valorDecidido !== undefined ? s.valorDecidido : true,
          cotacoes: s.cotacoes || [],
          moeda: s.moeda || "BRL",
        }))
        setSolicitacoes(normalized)
      } else {
        setSolicitacoes(dadosIniciais)
        localStorage.setItem("portalSolicitacoes", JSON.stringify(dadosIniciais))
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error)
      setSolicitacoes(dadosIniciais)
    }

    setIsInitialized(true)
  }, [isInitialized])

  // Salvar solicitações no localStorage quando houver mudanças
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem("portalSolicitacoes", JSON.stringify(solicitacoes))
    } catch (error) {
      console.error("Erro ao salvar solicitações:", error)
    }
  }, [solicitacoes, isInitialized])

  // Função para adicionar uma nova solicitação
  const adicionarSolicitacao = (novaSolicitacao: Omit<Solicitacao, "id" | "data" | "status" | "aprovacoes">) => {
    try {
      console.log("=== INÍCIO DA ADIÇÃO DE SOLICITAÇÃO ===")
      console.log("Nova solicitação:", novaSolicitacao)

      // Gerar ID único para a solicitação
      const dataAtual = new Date()
      const ano = dataAtual.getFullYear()
      const numeroAleatorio = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0")
      const id = `#PED-${ano}-${numeroAleatorio}`

      // Formatar data atual
      const dia = dataAtual.getDate().toString().padStart(2, "0")
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0")
      const dataFormatada = `${dia}/${mes}/${ano}`

      // Obter nome do solicitante do localStorage ou usar valor padrão
      let solicitante = novaSolicitacao.solicitante || "Usuário"
      try {
        const userDataString = localStorage.getItem("portalUser")
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          solicitante = userData?.name || solicitante
        }
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error)
      }

      // Criar objeto da nova solicitação
      const solicitacaoCompleta: Solicitacao = {
        ...novaSolicitacao,
        id,
        data: dataFormatada,
        status: "Pendente",
        solicitante,
        aprovacoes: [],
        nivelAtualAprovacao: 1,
        valorDecidido: false,
        valor: null,
      }

      console.log("Solicitação completa criada:", solicitacaoCompleta)

      // Adicionar à lista de solicitações
      setSolicitacoes((prev) => {
        const novaLista = [solicitacaoCompleta, ...prev]
        console.log("Nova lista de solicitações:", novaLista)

        // Forçar atualização do localStorage
        try {
          localStorage.setItem("portalSolicitacoes", JSON.stringify(novaLista))
          console.log("=== DADOS SALVOS NO LOCALSTORAGE ===")
        } catch (error) {
          console.error("Erro ao salvar no localStorage:", error)
        }

        return novaLista
      })

      console.log("=== SOLICITAÇÃO ADICIONADA COM SUCESSO ===")
      return solicitacaoCompleta
    } catch (error) {
      console.error("=== ERRO AO ADICIONAR SOLICITAÇÃO ===", error)
      throw error
    }
  }

  // Função para atualizar o status de uma solicitação
  const atualizarStatus = (id: string, status: "Pendente" | "Aprovado" | "Rejeitado", observacao?: string) => {
    try {
      setSolicitacoes((prev) =>
        prev.map((solicitacao) =>
          solicitacao.id === id
            ? { ...solicitacao, status, observacao: observacao || solicitacao.observacao }
            : solicitacao,
        ),
      )
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      throw error
    }
  }

  // Função para aprovar uma solicitação (primeira ou segunda aprovação)
  const aprovarSolicitacao = (id: string, aprovadorId: string, aprovadorNome: string, observacao?: string) => {
    try {
      console.log("=== INÍCIO DA APROVAÇÃO ===")
      console.log("ID da solicitação:", id)
      console.log("Aprovador:", aprovadorId, aprovadorNome)

      // Verificar se a solicitação existe
      const solicitacaoExistente = solicitacoes.find((s) => s.id === id)
      if (!solicitacaoExistente) {
        console.error("Solicitação não encontrada:", id)
        throw new Error("Solicitação não encontrada")
      }

      console.log("Solicitação encontrada:", solicitacaoExistente)
      console.log("Status atual:", solicitacaoExistente.status)
      console.log("Nível atual:", solicitacaoExistente.nivelAtualAprovacao)
      console.log("Valor decidido:", solicitacaoExistente.valorDecidido)

      // Verificar se o valor foi decidido
      if (!solicitacaoExistente.valorDecidido) {
        console.error("Valor não decidido para solicitação:", id)
        throw new Error("Não é possível aprovar uma solicitação sem selecionar uma cotação")
      }

      // Verificar se o mesmo aprovador já aprovou neste nível
      const nivelAtual = solicitacaoExistente.nivelAtualAprovacao || 1
      const jaAprovouNesteNivel = solicitacaoExistente.aprovacoes.some(
        (a) => a.aprovadorId === aprovadorId && a.nivel === nivelAtual,
      )

      if (jaAprovouNesteNivel) {
        console.error("Aprovador já aprovou neste nível:", aprovadorId, nivelAtual)
        throw new Error("O mesmo aprovador não pode aprovar duas vezes a mesma solicitação no mesmo nível")
      }

      // Formatar data atual
      const dataAtual = new Date()
      const dia = dataAtual.getDate().toString().padStart(2, "0")
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0")
      const ano = dataAtual.getFullYear()
      const dataFormatada = `${dia}/${mes}/${ano}`

      // Criar nova aprovação
      const novaAprovacao: Aprovacao = {
        aprovadorId,
        aprovadorNome,
        data: dataFormatada,
        observacao,
        nivel: nivelAtual as 1 | 2,
      }

      console.log("Nova aprovação criada:", novaAprovacao)

      // Determinar o novo status e nível
      let novoStatus: "Pendente" | "Aprovado" | "Rejeitado" | "Parcialmente Aprovado"
      let novoNivel = nivelAtual
      let dataAprovacao: string | undefined

      if (nivelAtual === 1) {
        // Primeira aprovação
        novoStatus = "Parcialmente Aprovado"
        novoNivel = 2 // Avança para o próximo nível
        console.log("=== PRIMEIRA APROVAÇÃO ===")
        console.log("Novo status: Parcialmente Aprovado")
        console.log("Novo nível: 2")
      } else if (nivelAtual === 2) {
        // Segunda aprovação (final)
        novoStatus = "Aprovado"
        dataAprovacao = dataFormatada
        console.log("=== SEGUNDA APROVAÇÃO (FINAL) ===")
        console.log("Novo status: Aprovado")
        console.log("Data de aprovação:", dataAprovacao)
      } else {
        throw new Error("Nível de aprovação inválido")
      }

      // Atualizar a lista de solicitações
      const novasSolicitacoes = solicitacoes.map((solicitacao) => {
        if (solicitacao.id === id) {
          const solicitacaoAtualizada = {
            ...solicitacao,
            status: novoStatus,
            aprovacoes: [...solicitacao.aprovacoes, novaAprovacao],
            nivelAtualAprovacao: novoNivel,
            dataAprovacao: dataAprovacao,
          }
          console.log("=== SOLICITAÇÃO ATUALIZADA ===")
          console.log("Status:", solicitacaoAtualizada.status)
          console.log("Nível:", solicitacaoAtualizada.nivelAtualAprovacao)
          console.log("Data aprovação:", solicitacaoAtualizada.dataAprovacao)
          console.log("Aprovações:", solicitacaoAtualizada.aprovacoes)
          return solicitacaoAtualizada
        }
        return solicitacao
      })

      console.log("=== ATUALIZANDO ESTADO ===")
      setSolicitacoes(novasSolicitacoes)

      // Forçar atualização do localStorage
      try {
        localStorage.setItem("portalSolicitacoes", JSON.stringify(novasSolicitacoes))
        console.log("=== DADOS SALVOS NO LOCALSTORAGE ===")
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error)
      }

      console.log("=== APROVAÇÃO CONCLUÍDA COM SUCESSO ===")
      return true
    } catch (error) {
      console.error("=== ERRO NA APROVAÇÃO ===", error)
      throw error
    }
  }

  // Função para rejeitar uma solicitação
  const rejeitarSolicitacao = (id: string, aprovadorId: string, aprovadorNome: string, observacao: string) => {
    try {
      // Formatar data atual
      const dataAtual = new Date()
      const dia = dataAtual.getDate().toString().padStart(2, "0")
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0")
      const ano = dataAtual.getFullYear()
      const dataFormatada = `${dia}/${mes}/${ano}`

      const novasSolicitacoes = solicitacoes.map((solicitacao) => {
        if (solicitacao.id === id) {
          // Verificar o nível atual de aprovação
          const nivelAtual = solicitacao.nivelAtualAprovacao || 1

          // Criar nova rejeição
          const novaRejeicao: Aprovacao = {
            aprovadorId,
            aprovadorNome,
            data: dataFormatada,
            observacao,
            nivel: nivelAtual as 1 | 2,
          }

          // Adicionar a rejeição à lista de aprovações
          const novasAprovacoes = [...solicitacao.aprovacoes, novaRejeicao]

          return {
            ...solicitacao,
            status: "Rejeitado",
            aprovacoes: novasAprovacoes,
            observacao,
          }
        }
        return solicitacao
      })

      setSolicitacoes(novasSolicitacoes)
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error)
      throw error
    }
  }

  const selecionarCotacao = (solicitacaoId: string, cotacaoId: string) => {
    try {
      console.log("Selecionando cotação:", cotacaoId, "para solicitação:", solicitacaoId)

      const novasSolicitacoes = solicitacoes.map((solicitacao) => {
        if (solicitacao.id === solicitacaoId) {
          // Encontrar a cotação selecionada
          const cotacaoSelecionada = solicitacao.cotacoes?.find((c) => c.id === cotacaoId)

          if (!cotacaoSelecionada) {
            console.error("Cotação não encontrada:", cotacaoId)
            return solicitacao
          }

          // Atualizar todas as cotações para desmarcar as anteriores e marcar a nova
          const cotacoesAtualizadas = solicitacao.cotacoes?.map((c) => ({
            ...c,
            selecionada: c.id === cotacaoId,
          }))

          console.log("Cotação selecionada:", cotacaoSelecionada)
          console.log("Cotações atualizadas:", cotacoesAtualizadas)

          return {
            ...solicitacao,
            cotacoes: cotacoesAtualizadas,
            valor: cotacaoSelecionada.valor,
            moeda: cotacaoSelecionada.moeda,
            valorDecidido: true,
          }
        }
        return solicitacao
      })

      setSolicitacoes(novasSolicitacoes)
    } catch (error) {
      console.error("Erro ao selecionar cotação:", error)
      throw error
    }
  }

  const contextValue = {
    solicitacoes,
    adicionarSolicitacao,
    atualizarStatus,
    aprovarSolicitacao,
    rejeitarSolicitacao,
    selecionarCotacao,
  }

  return <SolicitacoesContext.Provider value={contextValue}>{children}</SolicitacoesContext.Provider>
}

export function useSolicitacoes() {
  const context = useContext(SolicitacoesContext)
  if (context === undefined) {
    throw new Error("useSolicitacoes must be used within a SolicitacoesProvider")
  }
  return context
}
