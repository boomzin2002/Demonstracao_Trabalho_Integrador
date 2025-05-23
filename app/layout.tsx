import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { SolicitacoesProvider } from "@/contexts/solicitacoes-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portal de Compras",
  description: "Sistema de gerenciamento de solicitações de compras",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <SolicitacoesProvider>
            {children}
            <Toaster />
          </SolicitacoesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
