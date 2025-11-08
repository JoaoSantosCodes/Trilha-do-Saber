'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export default function AlterarSenhaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    if (!senhaAtual.trim()) {
      setError('Digite sua senha atual')
      return false
    }

    if (!novaSenha.trim() || novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return false
    }

    if (senhaAtual === novaSenha) {
      setError('A nova senha deve ser diferente da senha atual')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    if (!user) {
      setError('Usuário não autenticado')
      return
    }

    setIsLoading(true)

    try {
      // 1. Verificar senha atual fazendo login
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: senhaAtual,
      })

      if (loginError) {
        setError('Senha atual incorreta')
        setIsLoading(false)
        return
      }

      // 2. Atualizar senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/configuracoes')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/95 p-3 sm:p-4 pb-2 backdrop-blur-sm justify-between safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
          Alterar Senha
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 max-w-md mx-auto">
          {/* Senha Atual */}
          <div>
            <Input
              label="Senha Atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
              required
            />
          </div>

          {/* Nova Senha */}
          <div>
            <Input
              label="Nova Senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <p className="text-gray-400 text-xs mt-1">A senha deve ter pelo menos 6 caracteres</p>
          </div>

          {/* Confirmar Senha */}
          <div>
            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite a nova senha novamente"
              required
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="rounded-xl bg-green-500/20 border border-green-500/50 p-3 sm:p-4">
              <p className="text-green-400 text-xs sm:text-sm font-medium">
                Senha alterada com sucesso! Redirecionando...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4">
              <p className="text-red-400 text-xs sm:text-sm font-medium break-words">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/20 text-white h-12 sm:h-14 text-sm sm:text-base touch-manipulation"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 bg-primary text-background-dark h-12 sm:h-14 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
                  <span className="text-xs sm:text-sm">Alterando...</span>
                </span>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

