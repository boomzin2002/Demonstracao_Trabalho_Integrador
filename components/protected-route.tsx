"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

type UserRole = "cliente" | "gerente"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (!isLoading && user && !allowedRoles.includes(user.role as UserRole)) {
      // Redirecionar para o dashboard apropriado se o usuário tentar acessar uma rota não permitida
      if (user.role === "cliente") {
        router.push("/dashboard/cliente")
      } else if (user.role === "gerente") {
        router.push("/dashboard/gerente")
      }
    }
  }, [user, isLoading, router, allowedRoles])

  // Mostrar nada enquanto verifica a autenticação
  if (isLoading || !user || !allowedRoles.includes(user.role as UserRole)) {
    return null
  }

  return <>{children}</>
}
