'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export default function InserirCodigoTurmaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [codigo, setCodigo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!codigo.trim()) {
      setError('Digite o código da turma')
      return
    }

    if (!user) {
      setError('Usuário não autenticado')
      return
    }

    setIsLoading(true)

    try {
      // 1. Buscar turma pelo código
      const { data: turma, error: errTurma } = await supabase
        .from('turmas')
        .select('id, nome, ativo')
        .eq('codigo', codigo.trim())
        .single()

      if (errTurma || !turma) {
        setError('Código de turma inválido')
        setIsLoading(false)
        return
      }

      if (!turma.ativo) {
        setError('Esta turma está inativa')
        setIsLoading(false)
        return
      }

      // 2. Verificar se aluno já está na turma
      const { data: jaNaTurma, error: errJaNaTurma } = await supabase
        .from('aluno_turma')
        .select('id')
        .eq('aluno_id', user.id)
        .eq('turma_id', turma.id)
        .single()

      if (errJaNaTurma && errJaNaTurma.code !== 'PGRST116') {
        throw errJaNaTurma
      }

      if (jaNaTurma) {
        setError('Você já está nesta turma')
        setIsLoading(false)
        return
      }

      // 3. Adicionar aluno à turma
      const { error: errAdicionar } = await supabase.from('aluno_turma').insert({
        aluno_id: user.id,
        turma_id: turma.id,
        ativo: true,
        data_entrada: new Date().toISOString().split('T')[0],
      })

      if (errAdicionar) throw errAdicionar

      setSuccess(true)
      setTimeout(() => {
        router.push('/aluno/materias')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar na turma')
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
          Entrar na Turma
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {/* Info Card */}
          <div className="rounded-xl bg-primary/20 border border-primary/50 p-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">info</span>
              <div className="flex-1">
                <h3 className="text-white text-base font-bold mb-2">Como obter o código?</h3>
                <p className="text-white/80 text-sm">
                  Peça o código da turma para seu professor ou coordenador. O código é único para
                  cada turma.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Código */}
            <div>
              <Input
                label="Código da Turma"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ex: TURMA-301-M"
                required
                className="text-center text-2xl font-bold tracking-wider"
              />
            </div>

            {/* Success Message */}
            {success && (
              <div className="rounded-xl bg-green-500/20 border border-green-500/50 p-4">
                <p className="text-green-400 text-sm font-medium">
                  Você entrou na turma com sucesso! Redirecionando...
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
                disabled={isLoading || success || !codigo.trim()}
                className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Entrando...
                  </span>
                ) : (
                  'Entrar na Turma'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

