"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchLiveExchangeRate, type ExchangeRate } from "@/lib/exchange-api"

export function CurrencyConverter() {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [brlValue, setBrlValue] = useState("")
  const [usdValue, setUsdValue] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [lastEditedField, setLastEditedField] = useState<"brl" | "usd">("brl")

  useEffect(() => {
    const fetchRate = async () => {
      try {
        console.log("🔄 Buscando taxa de câmbio...")
        const rate = await fetchLiveExchangeRate()
        console.log("✅ Taxa de câmbio obtida:", rate)
        setExchangeRate(rate)
      } catch (error) {
        console.error("❌ Erro ao buscar taxa de câmbio:", error)
      }
    }
    fetchRate()
  }, [])

  const convertBrlToUsd = (brlAmount: string) => {
    if (!exchangeRate || !brlAmount || brlAmount === "") return ""
    const amount = Number.parseFloat(brlAmount.replace(",", "."))
    if (isNaN(amount) || amount < 0) return ""
    const converted = amount / exchangeRate.rate
    console.log(`💱 Convertendo BRL ${amount} para USD: ${converted.toFixed(2)}`)
    return converted.toFixed(2)
  }

  const convertUsdToBrl = (usdAmount: string) => {
    if (!exchangeRate || !usdAmount || usdAmount === "") return ""
    const amount = Number.parseFloat(usdAmount.replace(",", "."))
    if (isNaN(amount) || amount < 0) return ""
    const converted = amount * exchangeRate.rate
    console.log(`💱 Convertendo USD ${amount} para BRL: ${converted.toFixed(2)}`)
    return converted.toFixed(2)
  }

  const handleBrlChange = (value: string) => {
    console.log("📝 BRL input changed:", value)
    setBrlValue(value)
    setLastEditedField("brl")
    if (value === "") {
      setUsdValue("")
    } else {
      const convertedUsd = convertBrlToUsd(value)
      setUsdValue(convertedUsd)
    }
  }

  const handleUsdChange = (value: string) => {
    console.log("📝 USD input changed:", value)
    setUsdValue(value)
    setLastEditedField("usd")
    if (value === "") {
      setBrlValue("")
    } else {
      const convertedBrl = convertUsdToBrl(value)
      setBrlValue(convertedBrl)
    }
  }

  const swapValues = () => {
    console.log("🔄 Iniciando swap de valores...")
    console.log("Valores antes do swap - BRL:", brlValue, "USD:", usdValue)

    setIsConverting(true)

    // Trocar os valores diretamente
    const tempBrl = brlValue
    const tempUsd = usdValue

    setBrlValue(tempUsd)
    setUsdValue(tempBrl)

    // Inverter o campo que foi editado por último
    setLastEditedField(lastEditedField === "brl" ? "usd" : "brl")

    console.log("Valores após o swap - BRL:", tempUsd, "USD:", tempBrl)

    setTimeout(() => {
      setIsConverting(false)
      console.log("✅ Swap concluído")
    }, 300)
  }

  const clearValues = () => {
    console.log("🧹 Limpando valores...")
    setBrlValue("")
    setUsdValue("")
    setLastEditedField("brl")
  }

  const setPresetValue = (currency: "brl" | "usd", value: string) => {
    console.log(`🎯 Definindo valor preset: ${currency} = ${value}`)
    if (currency === "brl") {
      handleBrlChange(value)
    } else {
      handleUsdChange(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Conversor de Moedas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brl-input">Real Brasileiro (BRL)</Label>
            <Input
              id="brl-input"
              type="text"
              placeholder="0,00"
              value={brlValue}
              onChange={(e) => handleBrlChange(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapValues}
              className={`transition-transform duration-300 ${isConverting ? "rotate-180" : ""}`}
              disabled={!exchangeRate || (brlValue === "" && usdValue === "")}
              title="Trocar valores entre BRL e USD"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usd-input">Dólar Americano (USD)</Label>
            <Input
              id="usd-input"
              type="text"
              placeholder="0.00"
              value={usdValue}
              onChange={(e) => handleUsdChange(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>

        {exchangeRate && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Taxa atual:</span>
                <span className="font-medium">1 USD = R$ {exchangeRate.rate.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa inversa:</span>
                <span className="font-medium">1 BRL = $ {(1 / exchangeRate.rate).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Atualizado em:</span>
                <span>{exchangeRate.lastUpdate}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearValues} className="flex-1">
            Limpar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPresetValue("brl", "1000")} className="flex-1">
            R$ 1.000
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPresetValue("usd", "100")} className="flex-1">
            $ 100
          </Button>
        </div>

        {!exchangeRate && <div className="text-center text-sm text-gray-500">Carregando taxa de câmbio...</div>}
      </CardContent>
    </Card>
  )
}
