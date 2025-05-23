// Tipos de moeda suportados
export type Currency = "BRL" | "USD"

// Taxa de câmbio (em uma aplicação real, isso viria de uma API)
const exchangeRates = {
  USD_BRL: 5.2, // 1 USD = 5.20 BRL
  BRL_USD: 0.19, // 1 BRL = 0.19 USD
}

// Função para converter valores entre moedas
export function convertCurrency(value: number, fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) {
    return value
  }

  if (fromCurrency === "USD" && toCurrency === "BRL") {
    return value * exchangeRates.USD_BRL
  }

  if (fromCurrency === "BRL" && toCurrency === "USD") {
    return value * exchangeRates.BRL_USD
  }

  return value
}

// Função para formatar valores monetários
export function formatCurrency(value: number | null, currency: Currency): string {
  if (value === null) {
    return "-"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(value)
}

// Função para obter o símbolo da moeda
export function getCurrencySymbol(currency: Currency): string {
  return currency === "BRL" ? "R$" : "$"
}

// Função para obter a taxa de câmbio atual
export function getExchangeRate(fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) {
    return 1
  }

  if (fromCurrency === "USD" && toCurrency === "BRL") {
    return exchangeRates.USD_BRL
  }

  if (fromCurrency === "BRL" && toCurrency === "USD") {
    return exchangeRates.BRL_USD
  }

  return 1
}
