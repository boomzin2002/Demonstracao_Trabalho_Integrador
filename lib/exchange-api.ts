// Serviço para obter cotações de câmbio ao vivo
export interface ExchangeRate {
  currency: string
  rate: number
  lastUpdate: string
  source: string
}

export interface ExchangeApiResponse {
  success: boolean
  rates: {
    USD: number
    BRL: number
  }
  timestamp: number
  base: string
}

// Função para buscar cotação ao vivo (usando API gratuita)
export async function fetchLiveExchangeRate(): Promise<ExchangeRate | null> {
  try {
    // Usando a API do exchangerate-api.com (gratuita)
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

    if (!response.ok) {
      throw new Error("Falha ao buscar cotação")
    }

    const data = await response.json()

    // A API retorna BRL como taxa de conversão de USD para BRL
    const usdToBrl = data.rates.BRL

    return {
      currency: "USD/BRL",
      rate: usdToBrl,
      lastUpdate: new Date().toLocaleString("pt-BR"),
      source: "ExchangeRate API",
    }
  } catch (error) {
    console.error("Erro ao buscar cotação ao vivo:", error)

    // Fallback para cotação simulada se a API falhar
    return {
      currency: "USD/BRL",
      rate: 5.2 + (Math.random() - 0.5) * 0.2, // Simula variação
      lastUpdate: new Date().toLocaleString("pt-BR"),
      source: "Simulado (API indisponível)",
    }
  }
}

// Função para buscar múltiplas cotações (para expansão futura)
export async function fetchMultipleExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL")

    if (!response.ok) {
      throw new Error("Falha ao buscar cotações")
    }

    const data = await response.json()
    const timestamp = new Date().toLocaleString("pt-BR")

    return [
      {
        currency: "USD/BRL",
        rate: 1 / data.rates.USD, // Converter de BRL para USD para USD para BRL
        lastUpdate: timestamp,
        source: "ExchangeRate API",
      },
      {
        currency: "EUR/BRL",
        rate: 1 / data.rates.EUR,
        lastUpdate: timestamp,
        source: "ExchangeRate API",
      },
    ]
  } catch (error) {
    console.error("Erro ao buscar cotações:", error)

    // Fallback para cotações simuladas
    const timestamp = new Date().toLocaleString("pt-BR")
    return [
      {
        currency: "USD/BRL",
        rate: 5.2 + (Math.random() - 0.5) * 0.2,
        lastUpdate: timestamp,
        source: "Simulado (API indisponível)",
      },
      {
        currency: "EUR/BRL",
        rate: 5.65 + (Math.random() - 0.5) * 0.25,
        lastUpdate: timestamp,
        source: "Simulado (API indisponível)",
      },
    ]
  }
}

// Função para calcular variação percentual (para implementação futura)
export function calculateVariation(current: number, previous: number): number {
  return ((current - previous) / previous) * 100
}
