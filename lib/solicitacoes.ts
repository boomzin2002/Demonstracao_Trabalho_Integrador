import type { Currency } from "./currency"

// Atualize a interface Cotacao para incluir a moeda
export interface Cotacao {
  id: string
  fornecedor: string
  valor: number
  moeda: Currency
  prazoEntrega: string
  observacoes?: string
  selecionada?: boolean
}

// Novo tipo para status que inclui aprovação parcial
export type StatusSolicitacao = "Pendente" | "Parcialmente Aprovado" | "Aprovado" | "Rejeitado"

// Interface para rastrear aprovações
export interface Aprovacao {
  aprovadorId: string
  aprovadorNome: string
  data: string
  observacao?: string
  nivel: 1 | 2 // Nível 1 = primeira aprovação, Nível 2 = segunda aprovação
}

// Atualize a interface Solicitacao para incluir a moeda e aprovações
export interface Solicitacao {
  id: string
  data: string
  descricao: string
  valor: number | null
  moeda: Currency
  justificativa: string
  urgencia: "normal" | "alta"
  centroCusto: string
  status: StatusSolicitacao
  solicitante: string
  observacao?: string
  dataAprovacao?: string
  cotacoes: Cotacao[]
  valorDecidido?: boolean
  aprovacoes: Aprovacao[] // Lista de aprovações
  nivelAtualAprovacao?: 1 | 2 // Nível atual de aprovação (1 ou 2)
}

// Atualize os dados iniciais para incluir a moeda e aprovações
const dadosIniciais: Solicitacao[] = [
  {
    id: "#PED-2023-0156",
    data: "15/10/2023",
    descricao: "Material de escritório",
    valor: 350.0,
    moeda: "BRL",
    justificativa: "Reposição de material de escritório para o departamento",
    urgencia: "normal",
    centroCusto: "rh",
    status: "Aprovado",
    solicitante: "Carlos Silva",
    dataAprovacao: "16/10/2023",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente1",
        aprovadorNome: "Roberto Silva",
        data: "16/10/2023",
        nivel: 1,
        observacao: "Aprovado conforme orçamento",
      },
      {
        aprovadorId: "gerente2",
        aprovadorNome: "Mariana Costa",
        data: "16/10/2023",
        nivel: 2,
        observacao: "Aprovação final",
      },
    ],
    nivelAtualAprovacao: 2,
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
      },
      {
        id: "COT-003",
        fornecedor: "Mega Papelaria",
        valor: 365.0,
        moeda: "BRL",
        prazoEntrega: "7 dias úteis",
        observacoes: "Desconto para pagamento à vista",
      },
    ],
  },
  {
    id: "#PED-2023-0155",
    data: "12/10/2023",
    descricao: "Licença de software",
    valor: 1200.0,
    moeda: "BRL",
    justificativa: "Renovação anual da licença de software de design",
    urgencia: "alta",
    centroCusto: "ti",
    status: "Aprovado",
    solicitante: "Carlos Silva",
    dataAprovacao: "13/10/2023",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente1",
        aprovadorNome: "Roberto Silva",
        data: "13/10/2023",
        nivel: 1,
        observacao: "Aprovado conforme necessidade do departamento",
      },
      {
        aprovadorId: "gerente2",
        aprovadorNome: "Mariana Costa",
        data: "13/10/2023",
        nivel: 2,
        observacao: "Aprovação final",
      },
    ],
    nivelAtualAprovacao: 2,
    cotacoes: [
      {
        id: "COT-004",
        fornecedor: "Software House",
        valor: 1200.0,
        moeda: "BRL",
        prazoEntrega: "Imediato",
        observacoes: "Licença anual",
        selecionada: true,
      },
      {
        id: "COT-005",
        fornecedor: "Tech Solutions",
        valor: 1350.0,
        moeda: "BRL",
        prazoEntrega: "Imediato",
        observacoes: "Inclui suporte premium",
      },
      {
        id: "COT-006",
        fornecedor: "Digital Tools",
        valor: 1180.0,
        moeda: "BRL",
        prazoEntrega: "1 dia útil",
        observacoes: "Sem suporte técnico",
      },
    ],
  },
  {
    id: "#PED-2023-0157",
    data: "15/10/2023",
    descricao: "Licença de software para design",
    valor: null,
    moeda: "USD",
    justificativa: "Necessário para o novo projeto de marketing",
    urgencia: "normal",
    centroCusto: "marketing",
    status: "Pendente",
    solicitante: "Ana Oliveira",
    valorDecidido: false,
    aprovacoes: [],
    nivelAtualAprovacao: 1,
    cotacoes: [
      {
        id: "COT-007",
        fornecedor: "Design Pro",
        valor: 230.0,
        moeda: "USD",
        prazoEntrega: "Imediato",
        observacoes: "Versão mais recente",
      },
      {
        id: "COT-008",
        fornecedor: "Creative Tools",
        valor: 240.0,
        moeda: "USD",
        prazoEntrega: "Imediato",
        observacoes: "Inclui plugins adicionais",
      },
      {
        id: "COT-009",
        fornecedor: "Art Software",
        valor: 220.0,
        moeda: "USD",
        prazoEntrega: "2 dias úteis",
        observacoes: "Versão básica",
      },
    ],
  },
  {
    id: "#PED-2023-0158",
    data: "14/10/2023",
    descricao: "Equipamento para videoconferência",
    valor: null,
    moeda: "USD",
    justificativa: "Melhorar a qualidade das reuniões remotas",
    urgencia: "alta",
    centroCusto: "ti",
    status: "Pendente",
    solicitante: "João Mendes",
    valorDecidido: false,
    aprovacoes: [],
    nivelAtualAprovacao: 1,
    cotacoes: [
      {
        id: "COT-010",
        fornecedor: "Tech Store",
        valor: 670.0,
        moeda: "USD",
        prazoEntrega: "7 dias úteis",
        observacoes: "Modelo premium",
      },
      {
        id: "COT-011",
        fornecedor: "Office Tech",
        valor: 615.0,
        moeda: "USD",
        prazoEntrega: "10 dias úteis",
        observacoes: "Sem garantia estendida",
      },
      {
        id: "COT-012",
        fornecedor: "Eletrônicos Pro",
        valor: 730.0,
        moeda: "USD",
        prazoEntrega: "5 dias úteis",
        observacoes: "Inclui instalação",
      },
    ],
  },
  {
    id: "#PED-2023-0159",
    data: "16/10/2023",
    descricao: "Serviços de consultoria em marketing",
    valor: 4500.0,
    moeda: "BRL",
    justificativa: "Desenvolvimento de nova estratégia de marketing digital",
    urgencia: "normal",
    centroCusto: "marketing",
    status: "Parcialmente Aprovado",
    solicitante: "Fernanda Lima",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente1",
        aprovadorNome: "Roberto Silva",
        data: "17/10/2023",
        nivel: 1,
        observacao: "Aprovado na primeira etapa, aguardando segunda aprovação",
      },
    ],
    nivelAtualAprovacao: 2,
    cotacoes: [
      {
        id: "COT-013",
        fornecedor: "Marketing Experts",
        valor: 4500.0,
        moeda: "BRL",
        prazoEntrega: "30 dias",
        observacoes: "Inclui relatório final",
        selecionada: true,
      },
      {
        id: "COT-014",
        fornecedor: "Digital Marketing Co.",
        valor: 4800.0,
        moeda: "BRL",
        prazoEntrega: "25 dias",
        observacoes: "Inclui implementação",
      },
    ],
  },
  {
    id: "#PED-2023-0152",
    data: "10/10/2023",
    descricao: "Mobiliário de escritório",
    valor: 2800.0,
    moeda: "BRL",
    justificativa: "Substituição de cadeiras ergonômicas",
    urgencia: "normal",
    centroCusto: "rh",
    status: "Rejeitado",
    solicitante: "Maria Santos",
    observacao: "Orçamento acima do limite permitido para este tipo de item",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente1",
        aprovadorNome: "Roberto Silva",
        data: "11/10/2023",
        nivel: 1,
        observacao: "Rejeitado por exceder o orçamento",
      },
    ],
    nivelAtualAprovacao: 1,
    cotacoes: [
      {
        id: "COT-015",
        fornecedor: "Móveis Corporativos",
        valor: 2800.0,
        moeda: "BRL",
        prazoEntrega: "15 dias úteis",
        observacoes: "Cadeiras ergonômicas premium",
        selecionada: true,
      },
      {
        id: "COT-016",
        fornecedor: "Office Design",
        valor: 2600.0,
        moeda: "BRL",
        prazoEntrega: "20 dias úteis",
        observacoes: "Modelo básico",
      },
      {
        id: "COT-017",
        fornecedor: "Ergonomia Total",
        valor: 3100.0,
        moeda: "BRL",
        prazoEntrega: "12 dias úteis",
        observacoes: "Inclui montagem",
      },
    ],
  },
  {
    id: "#PED-2023-0151",
    data: "08/10/2023",
    descricao: "Consultoria externa",
    valor: 5000.0,
    moeda: "BRL",
    justificativa: "Análise de mercado para novo produto",
    urgencia: "alta",
    centroCusto: "marketing",
    status: "Rejeitado",
    solicitante: "Pedro Costa",
    observacao: "Fora do escopo do projeto atual",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente2",
        aprovadorNome: "Mariana Costa",
        data: "09/10/2023",
        nivel: 1,
        observacao: "Rejeitado por estar fora do escopo atual",
      },
    ],
    nivelAtualAprovacao: 1,
    cotacoes: [
      {
        id: "COT-018",
        fornecedor: "Consultoria ABC",
        valor: 5000.0,
        moeda: "BRL",
        prazoEntrega: "30 dias",
        observacoes: "Análise completa",
        selecionada: true,
      },
      {
        id: "COT-019",
        fornecedor: "Market Experts",
        valor: 5500.0,
        moeda: "BRL",
        prazoEntrega: "25 dias",
        observacoes: "Inclui pesquisa de campo",
      },
      {
        id: "COT-020",
        fornecedor: "Business Advisors",
        valor: 4800.0,
        moeda: "BRL",
        prazoEntrega: "35 dias",
        observacoes: "Sem pesquisa de campo",
      },
    ],
  },
  {
    id: "#PED-2023-0150",
    data: "05/10/2023",
    descricao: "Treinamento especializado",
    valor: 1800.0,
    moeda: "BRL",
    justificativa: "Capacitação da equipe em novas tecnologias",
    urgencia: "normal",
    centroCusto: "ti",
    status: "Rejeitado",
    solicitante: "Lucas Ferreira",
    observacao: "Solicitar novamente no próximo trimestre",
    valorDecidido: true,
    aprovacoes: [
      {
        aprovadorId: "gerente1",
        aprovadorNome: "Roberto Silva",
        data: "06/10/2023",
        nivel: 1,
        observacao: "Rejeitado por restrições orçamentárias",
      },
    ],
    nivelAtualAprovacao: 1,
    cotacoes: [
      {
        id: "COT-021",
        fornecedor: "Tech Training",
        valor: 1800.0,
        moeda: "BRL",
        prazoEntrega: "Próximo mês",
        observacoes: "Treinamento presencial",
        selecionada: true,
      },
      {
        id: "COT-022",
        fornecedor: "Learn IT",
        valor: 1650.0,
        moeda: "BRL",
        prazoEntrega: "Duas semanas",
        observacoes: "Treinamento online",
      },
      {
        id: "COT-023",
        fornecedor: "Edu Tech",
        valor: 2000.0,
        moeda: "BRL",
        prazoEntrega: "Próxima semana",
        observacoes: "Inclui certificação internacional",
      },
    ],
  },
]

// Atualize a função adicionarSolicitacao para incluir a moeda e aprovações
export function adicionarSolicitacao(
  novaSolicitacao: Omit<
    Solicitacao,
    "id" | "data" | "status" | "cotacoes" | "valor" | "valorDecidido" | "moeda" | "aprovacoes" | "nivelAtualAprovacao"
  > & {
    cotacoes: Omit<Cotacao, "id">[]
    moeda: Currency
  },
): Solicitacao {
  try {
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

    // Gerar IDs para as cotações
    const cotacoesComId = novaSolicitacao.cotacoes.map((cotacao, index) => ({
      ...cotacao,
      id: `COT-${numeroAleatorio}-${index + 1}`,
      selecionada: false, // Nenhuma cotação selecionada inicialmente
    }))

    // Criar objeto da nova solicitação
    const solicitacaoCompleta: Solicitacao = {
      ...novaSolicitacao,
      id,
      data: dataFormatada,
      status: "Pendente",
      cotacoes: cotacoesComId,
      valor: null, // Valor indefinido até que o gerente decida
      valorDecidido: false, // Indica que o valor ainda não foi decidido
      moeda: novaSolicitacao.moeda, // Usar a moeda fornecida
      aprovacoes: [], // Inicialmente sem aprovações
      nivelAtualAprovacao: 1, // Começa no nível 1 de aprovação
    }

    // Adicionar à lista de solicitações
    const solicitacoes = getSolicitacoes()
    const novaLista = [solicitacaoCompleta, ...solicitacoes]
    localStorage.setItem("portalSolicitacoes", JSON.stringify(novaLista))

    return solicitacaoCompleta
  } catch (error) {
    console.error("Erro ao adicionar solicitação:", error)
    throw error
  }
}

// Atualize a função selecionarCotacao para manter a moeda da cotação selecionada
export function selecionarCotacao(solicitacaoId: string, cotacaoId: string): Solicitacao[] {
  try {
    const solicitacoes = getSolicitacoes()

    const novaLista = solicitacoes.map((solicitacao) => {
      if (solicitacao.id === solicitacaoId) {
        // Encontrar a cotação selecionada
        const cotacaoSelecionada = solicitacao.cotacoes.find((c) => c.id === cotacaoId)

        if (!cotacaoSelecionada) {
          return solicitacao
        }

        // Atualizar todas as cotações para desmarcar as anteriores e marcar a nova
        const cotacoesAtualizadas = solicitacao.cotacoes.map((c) => ({
          ...c,
          selecionada: c.id === cotacaoId,
        }))

        return {
          ...solicitacao,
          cotacoes: cotacoesAtualizadas,
          valor: cotacaoSelecionada.valor,
          moeda: cotacaoSelecionada.moeda, // Usar a moeda da cotação selecionada
          valorDecidido: true,
        }
      }
      return solicitacao
    })

    localStorage.setItem("portalSolicitacoes", JSON.stringify(novaLista))
    return novaLista
  } catch (error) {
    console.error("Erro ao selecionar cotação:", error)
    throw error
  }
}

// Nova função para aprovar uma solicitação (primeira ou segunda aprovação)
export function aprovarSolicitacao(
  id: string,
  aprovadorId: string,
  aprovadorNome: string,
  observacao?: string,
): Solicitacao[] {
  try {
    const solicitacoes = getSolicitacoes()

    // Formatar data atual
    const dataAtual = new Date()
    const dia = dataAtual.getDate().toString().padStart(2, "0")
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0")
    const ano = dataAtual.getFullYear()
    const dataFormatada = `${dia}/${mes}/${ano}`

    const novaLista = solicitacoes.map((solicitacao) => {
      if (solicitacao.id === id) {
        // Verificar se o valor foi decidido antes de aprovar
        if (!solicitacao.valorDecidido) {
          throw new Error("Não é possível aprovar uma solicitação sem selecionar uma cotação")
        }

        // Verificar o nível atual de aprovação
        const nivelAtual = solicitacao.nivelAtualAprovacao || 1

        // Verificar se o mesmo aprovador está tentando aprovar novamente
        const jaAprovouNesteNivel = solicitacao.aprovacoes.some(
          (a) => a.aprovadorId === aprovadorId && a.nivel === nivelAtual,
        )

        if (jaAprovouNesteNivel) {
          throw new Error("O mesmo aprovador não pode aprovar duas vezes a mesma solicitação no mesmo nível")
        }

        // Criar nova aprovação
        const novaAprovacao: Aprovacao = {
          aprovadorId,
          aprovadorNome,
          data: dataFormatada,
          observacao,
          nivel: nivelAtual as 1 | 2,
        }

        // Adicionar a nova aprovação à lista
        const novasAprovacoes = [...solicitacao.aprovacoes, novaAprovacao]

        // Determinar o novo status e nível
        let novoStatus: StatusSolicitacao = solicitacao.status
        let novoNivel = nivelAtual

        if (nivelAtual === 1) {
          // Primeira aprovação
          novoStatus = "Parcialmente Aprovado"
          novoNivel = 2 // Avança para o próximo nível
        } else if (nivelAtual === 2) {
          // Segunda aprovação (final)
          novoStatus = "Aprovado"
          // Nível permanece 2 (concluído)
        }

        return {
          ...solicitacao,
          status: novoStatus,
          aprovacoes: novasAprovacoes,
          nivelAtualAprovacao: novoNivel,
          dataAprovacao: novoStatus === "Aprovado" ? dataFormatada : undefined,
        }
      }
      return solicitacao
    })

    localStorage.setItem("portalSolicitacoes", JSON.stringify(novaLista))
    return novaLista
  } catch (error) {
    console.error("Erro ao aprovar solicitação:", error)
    throw error
  }
}

// Função para rejeitar uma solicitação (pode ser rejeitada em qualquer nível)
export function rejeitarSolicitacao(
  id: string,
  aprovadorId: string,
  aprovadorNome: string,
  observacao: string,
): Solicitacao[] {
  try {
    const solicitacoes = getSolicitacoes()

    // Formatar data atual
    const dataAtual = new Date()
    const dia = dataAtual.getDate().toString().padStart(2, "0")
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0")
    const ano = dataAtual.getFullYear()
    const dataFormatada = `${dia}/${mes}/${ano}`

    const novaLista = solicitacoes.map((solicitacao) => {
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

    localStorage.setItem("portalSolicitacoes", JSON.stringify(novaLista))
    return novaLista
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error)
    throw error
  }
}

// Função para obter todas as solicitações
export function getSolicitacoes(): Solicitacao[] {
  if (typeof window === "undefined") return dadosIniciais

  try {
    const storedSolicitacoes = localStorage.getItem("portalSolicitacoes")
    if (storedSolicitacoes) {
      const parsedSolicitacoes = JSON.parse(storedSolicitacoes)

      // Ensure all solicitações have the cotacoes property, moeda, and aprovacoes
      const normalizedSolicitacoes = parsedSolicitacoes.map((solicitacao: any) => ({
        ...solicitacao,
        cotacoes: solicitacao.cotacoes || [],
        valorDecidido: solicitacao.valorDecidido !== undefined ? solicitacao.valorDecidido : true,
        moeda: solicitacao.moeda || "BRL", // Default to BRL if not specified
        aprovacoes: solicitacao.aprovacoes || [],
        nivelAtualAprovacao: solicitacao.nivelAtualAprovacao || 1,
      }))

      return normalizedSolicitacoes
    } else {
      localStorage.setItem("portalSolicitacoes", JSON.stringify(dadosIniciais))
      return dadosIniciais
    }
  } catch (error) {
    console.error("Erro ao obter solicitações:", error)
    return dadosIniciais
  }
}

// Função para obter solicitações por status
export function getSolicitacoesPorStatus(status: StatusSolicitacao): Solicitacao[] {
  const solicitacoes = getSolicitacoes()
  return solicitacoes.filter((s) => s.status === status)
}

// Função para obter solicitações por nível de aprovação
export function getSolicitacoesPorNivelAprovacao(nivel: 1 | 2): Solicitacao[] {
  const solicitacoes = getSolicitacoes()
  return solicitacoes.filter((s) => s.nivelAtualAprovacao === nivel && s.status !== "Rejeitado")
}

export function getSolicitacaoPorId(id: string): Solicitacao | undefined {
  const solicitacoes = getSolicitacoes()
  return solicitacoes.find((s) => s.id === id)
}

export function getSolicitacoesPorSolicitante(solicitante: string): Solicitacao[] {
  const solicitacoes = getSolicitacoes()
  return solicitacoes.filter((s) => s.solicitante === solicitante)
}
