"use client"

import type { ReactNode } from "react"
import { SolicitacoesProvider } from "@/contexts/solicitacoes-context"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SolicitacoesProvider>{children}</SolicitacoesProvider>
}
