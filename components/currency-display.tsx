"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { type Currency, formatCurrency, convertCurrency, getExchangeRate } from "@/lib/currency"

interface CurrencyDisplayProps {
  value: number | null
  currency: Currency
  showConversion?: boolean
  className?: string
}

export function CurrencyDisplay({ value, currency, showConversion = true, className = "" }: CurrencyDisplayProps) {
  const [showAlternate, setShowAlternate] = useState(false)

  if (value === null) {
    return <span className={className}>-</span>
  }

  const alternateCurrency: Currency = currency === "BRL" ? "USD" : "BRL"
  const exchangeRate = getExchangeRate(currency, alternateCurrency)
  const convertedValue = convertCurrency(value, currency, alternateCurrency)

  if (!showConversion) {
    return <span className={className}>{formatCurrency(value, currency)}</span>
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span>{showAlternate ? formatCurrency(convertedValue, alternateCurrency) : formatCurrency(value, currency)}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 px-1 text-xs text-gray-500 hover:text-gray-700"
        onClick={() => setShowAlternate(!showAlternate)}
      >
        {showAlternate ? currency : alternateCurrency}
      </Button>
      {showAlternate && (
        <span className="text-xs text-gray-500">
          (1 {currency} = {exchangeRate.toFixed(2)} {alternateCurrency})
        </span>
      )}
    </div>
  )
}
