'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { resetPassword } from '@/lib/auth'
import Link from 'next/link'

export default function EsqueciSenhaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Email é obrigatório')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: resetError } = await resetPassword(email)
      
      if (resetError) {
        setError(resetError)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden" suppressHydrationWarning>
      <div className="flex w-full grow items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <h1 className="text-white dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
            Esqueceu sua senha?
          </h1>
          <p className="text-gray-400 text-base font-normal leading-normal text-center px-4 pb-8">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 px-4">
            <Input
              label="Email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              icon="mail"
              error={error || undefined}
              required
              disabled={isLoading || success}
            />

            {success && (
              <div className="text-green-400 text-sm px-4">
                Link de recuperação enviado para seu email! Verifique sua caixa de entrada.
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
                    Enviando...
                  </span>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </Button>
            </div>
          </form>

          <div className="flex justify-center items-center gap-2 pt-4 pb-8">
            <Link
              href="/login"
              className="text-primary hover:underline text-sm font-bold"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

