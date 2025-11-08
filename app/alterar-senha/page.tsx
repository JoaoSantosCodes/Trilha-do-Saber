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
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Alterar Senha
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto">
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
            <div className="rounded-xl bg-green-500/20 border border-green-500/50 p-4">
              <p className="text-green-400 text-sm font-medium">
                Senha alterada com sucesso! Redirecionando...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/20 text-white h-14"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Alterando...
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

