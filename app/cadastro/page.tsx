'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function CadastroPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'aluno' as 'aluno' | 'professor' | 'coordenador' | 'pais',
  })
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        role: formData.role,
      })

      if (error) {
        setErrors({ submit: error })
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      setErrors({ submit: error.message || 'Erro ao criar conta. Por favor, tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden" suppressHydrationWarning>
      <div className="flex w-full grow items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <h1 className="text-white dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
            Criar Conta
          </h1>
          <p className="text-gray-400 text-base font-normal leading-normal text-center px-4 pb-8">
            Preencha os dados para criar sua conta.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 px-4">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) {
                  const { name, ...rest } = errors
                  setErrors(rest)
                }
              }}
              icon="person"
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) {
                  const { email, ...rest } = errors
                  setErrors(rest)
                }
              }}
              icon="mail"
              error={errors.email}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (errors.password) {
                  const { password, ...rest } = errors
                  setErrors(rest)
                }
              }}
              icon="lock"
              error={errors.password}
              showPasswordToggle
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                if (errors.confirmPassword) {
                  const { confirmPassword, ...rest } = errors
                  setErrors(rest)
                }
              }}
              icon="lock"
              error={errors.confirmPassword}
              showPasswordToggle
              required
            />

            {errors.submit && (
              <div className="text-red-400 text-sm px-4">{errors.submit}</div>
            )}

            {success && (
              <div className="text-green-400 text-sm px-4">
                Conta criada com sucesso! Redirecionando...
              </div>
            )}

            <div className="flex px-4 py-3 w-full mt-6">
              <Button 
                type="submit" 
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Criando conta...
                  </span>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </div>
          </form>

          <div className="flex justify-center items-center gap-2 pt-4 pb-8">
            <p className="text-gray-400 text-sm font-normal">Já tem uma conta?</p>
            <Link
              href="/login"
              className="text-primary hover:underline text-sm font-bold"
            >
              Faça login aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

