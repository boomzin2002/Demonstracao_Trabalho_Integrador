"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, User, Users, ShoppingBag } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
        })

        // Redirecionamento baseado no email
        if (email.includes("cliente")) {
          router.push("/dashboard/cliente")
        } else if (email.includes("gerente")) {
          router.push("/dashboard/gerente")
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    setIsLoading(true)

    try {
      const success = await login(userEmail, userPassword)
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
        })

        // Redirecionamento baseado no email
        if (userEmail.includes("cliente")) {
          router.push("/dashboard/cliente")
        } else if (userEmail.includes("gerente")) {
          router.push("/dashboard/gerente")
        }
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Login */}
        <Card className="w-full shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Portal de Compras</CardTitle>
              <p className="text-sm text-gray-500 mt-2">Sistema de Gestão de Solicitações</p>
              <Badge variant="outline" className="mt-2">
                Versão 7.0 - Dupla Validação
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Usuários de Demonstração */}
        <div className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Carlos Silva</p>
                      <p className="text-xs text-gray-500">cliente@empresa.com</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Marketing
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => quickLogin("cliente@empresa.com", "cliente")}>
                      Usar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Roberto Silva</p>
                      <p className="text-xs text-gray-500">gerente1@empresa.com</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Operações
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => quickLogin("gerente1@empresa.com", "gerente1")}>
                      Usar
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Mariana Costa</p>
                      <p className="text-xs text-gray-500">gerente2@empresa.com</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Financeiro
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => quickLogin("gerente2@empresa.com", "gerente2")}>
                      Usar
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Ana Rodrigues</p>
                      <p className="text-xs text-gray-500">gerente3@empresa.com</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Tecnologia
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => quickLogin("gerente3@empresa.com", "gerente3")}>
                      Usar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-medium text-yellow-800 mb-2">Sistema de Dupla Validação</h3>
                <p className="text-sm text-yellow-700">
                  Cada solicitação precisa ser aprovada por dois gerentes diferentes para garantir maior controle e
                  segurança no processo de compras.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
