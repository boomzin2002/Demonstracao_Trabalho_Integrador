"use client"

import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchLiveExchangeRate, type ExchangeRate } from "@/lib/exchange-api"

interface LiveExchangeWidgetProps {
  className?: string
  autoRefresh?: boolean
  refreshInterval?: number // em segundos
}

export function LiveExchangeWidget({
  className = "",
  autoRefresh = true,
  refreshInterval = 300, // 5 minutos por padrão
}: LiveExchangeWidgetProps) {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchRate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const rate = await fetchLiveExchangeRate()
      setExchangeRate(rate)
      setLastRefresh(new Date())
    } catch (err) {
      setError("Erro ao buscar cotação")
      console.error("Erro ao buscar cotação:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar cotação inicial
  useEffect(() => {
    fetchRate()
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchRate, refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value)
  }

  const getVariationIcon = () => {
    // Simulação de variação (em uma implementação real, você compararia com valor anterior)
    const variation = Math.random() > 0.5 ? 1 : -1
    return variation > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getStatusColor = () => {
    if (error) return "text-red-600"
    if (exchangeRate?.source.includes("Simulado")) return "text-amber-600"
    return "text-green-600"
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Cotação USD/BRL
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchRate} disabled={isLoading} className="h-8 w-8 p-0">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : exchangeRate ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{formatCurrency(exchangeRate.rate)}</span>
              <div className="flex items-center gap-1">
                {getVariationIcon()}
                <Badge variant="outline" className="text-xs">
                  Ao vivo
                </Badge>
              </div>
            </div>

            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Última atualização:</span>
                <span>{exchangeRate.lastUpdate}</span>
              </div>
              <div className="flex justify-between">
                <span>Fonte:</span>
                <span className={getStatusColor()}>{exchangeRate.source}</span>
              </div>
              {lastRefresh && (
                <div className="flex justify-between">
                  <span>Próxima atualização:</span>
                  <span>{Math.ceil((refreshInterval * 1000 - (Date.now() - lastRefresh.getTime())) / 1000)}s</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>1 USD =</span>
                  <span className="font-medium">{formatCurrency(exchangeRate.rate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>1 BRL =</span>
                  <span className="font-medium">${(1 / exchangeRate.rate).toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Carregando cotação...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
