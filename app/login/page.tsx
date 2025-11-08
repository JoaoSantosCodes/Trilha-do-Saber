'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import LoginErrorModal from '@/components/LoginErrorModal'
import { useAuth } from '@/contexts/AuthContext'

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && !authLoading) {
      // Redirecionar baseado no role (aceita inglês e português)
      const role = user.user_metadata?.role || 'aluno'
      
      // Mapear roles em inglês para português
      const roleMap: Record<string, string> = {
        'student': 'aluno',
        'teacher': 'professor',
        'coordinator': 'coordenador',
        'parent': 'pais',
        'aluno': 'aluno',
        'professor': 'professor',
        'coordenador': 'coordenador',
        'pais': 'pais'
      }
      
      const normalizedRole = roleMap[role] || role
      
      if (normalizedRole === 'aluno' || normalizedRole === 'student') {
        router.push('/aluno/materias')
      } else if (normalizedRole === 'professor' || normalizedRole === 'teacher') {
        router.push('/professor/painel')
      } else if (normalizedRole === 'coordenador' || normalizedRole === 'coordinator') {
        router.push('/coordenador/painel')
      } else if (normalizedRole === 'pais' || normalizedRole === 'parent') {
        router.push('/pais/painel')
      }
    }
  }, [user, authLoading, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
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
      const result = await signIn(email, password)
      
      if (result.error) {
        setErrorMessage('A senha ou o email que você digitou não estão corretos. Por favor, tente novamente.')
        setShowErrorModal(true)
        return
      }

      // O redirecionamento será feito pelo useEffect quando o user for atualizado
      // Não precisa fazer nada aqui, o useEffect vai detectar a mudança
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer login. Por favor, tente novamente.')
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden" suppressHydrationWarning>
        <div className="flex w-full grow items-center justify-center p-4">
          <div className="flex w-full max-w-md flex-col items-center">
            {/* Logo/Imagem da Coruja */}
            <div className="flex w-full max-w-[200px] sm:max-w-[240px] p-3 sm:p-4">
              <div className="w-full aspect-square rounded-xl flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKVi2FO6VtsPO08Bgvh5SpP4Ja1rgDyQQsUJJB6KGtWxofOabwqAYhpm5r4ocAfqPNO02Cav7R7VNa5T9S1hClzBjOVdHN3FFMUUXWXBJUWcx5wRFB95AmKyR2uHXVryLxV0kbGkqGh79uYaPZx-hrUpfQcQgWhfSiTDcald6GoPCE3GvIdKydZSLIQZKDrOm46VepW-_9aAYMLjqGVREqW72fKBGxTM4CwHEj7XnFArS-2cwW3YlFr0a8gxXi_uYoBVyzL6wWlt7O')"
                  }}
                  role="img"
                  aria-label="Ilustração de uma coruja amigável, mascote do aplicativo, segurando uma chave dourada."
                />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-white dark:text-white tracking-light text-2xl sm:text-[32px] font-bold leading-tight px-4 text-center pb-2 sm:pb-3 pt-4 sm:pt-6">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-400 text-sm sm:text-base font-normal leading-normal text-center px-4 pb-6 sm:pb-8">
              Entre para continuar sua jornada de aprendizado.
            </p>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 px-4">
              <Input
                label="Email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined })
                  }
                }}
                icon="mail"
                error={errors.email}
                required
                disabled={isLoading}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined })
                  }
                }}
                icon="lock"
                error={errors.password}
                showPasswordToggle
                required
                disabled={isLoading}
              />

              <Link
                href="/esqueci-senha"
                className="text-primary/80 hover:text-primary text-sm font-medium text-right mt-1 px-1 transition-colors"
              >
                Esqueceu sua senha?
              </Link>

              <div className="flex px-4 py-3 w-full mt-6">
                <Button 
                  type="submit" 
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || authLoading}
                >
                  {isLoading || authLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Entrando...
                    </span>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </div>
            </form>

            {/* Link de cadastro */}
            <div className="flex justify-center items-center gap-2 pt-4 pb-8">
              <p className="text-gray-400 text-sm font-normal">Ainda não tem uma conta?</p>
              <Link
                href="/cadastro"
                className="text-primary hover:underline text-sm font-bold transition-colors"
              >
                Crie uma aqui
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Erro de Login */}
      <LoginErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </>
  )
}

