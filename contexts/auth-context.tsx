"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "cliente" | "gerente" | null
type User = {
  email: string
  name: string
  role: UserRole
  department?: string
} | null

interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("portalUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulação de verificação de credenciais
    // Em uma aplicação real, isso seria uma chamada à API
    if (email === "cliente@empresa.com" && password === "cliente") {
      const userData = {
        email: "cliente@empresa.com",
        name: "Carlos Silva",
        role: "cliente" as UserRole,
        department: "Marketing",
      }
      setUser(userData)
      localStorage.setItem("portalUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    } else if (email === "gerente1@empresa.com" && password === "gerente1") {
      const userData = {
        email: "gerente1@empresa.com",
        name: "Roberto Silva",
        role: "gerente" as UserRole,
        department: "Operações",
      }
      setUser(userData)
      localStorage.setItem("portalUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    } else if (email === "gerente2@empresa.com" && password === "gerente2") {
      const userData = {
        email: "gerente2@empresa.com",
        name: "Mariana Costa",
        role: "gerente" as UserRole,
        department: "Financeiro",
      }
      setUser(userData)
      localStorage.setItem("portalUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    } else if (email === "gerente3@empresa.com" && password === "gerente3") {
      const userData = {
        email: "gerente3@empresa.com",
        name: "Ana Rodrigues",
        role: "gerente" as UserRole,
        department: "Tecnologia",
      }
      setUser(userData)
      localStorage.setItem("portalUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Função de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("portalUser")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
