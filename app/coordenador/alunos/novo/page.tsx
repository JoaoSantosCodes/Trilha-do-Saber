'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { supabase } from '@/supabase/config'

export default function NovoAlunoPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [serie, setSerie] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTurmas, setLoadingTurmas] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTurmas()
  }, [])

  const fetchTurmas = async () => {
    try {
      setLoadingTurmas(true)
      
      // Verificar se há sessão válida antes de fazer queries
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !session.access_token) {
        console.warn('Nenhuma sessão válida encontrada')
        setTurmas([])
        setLoadingTurmas(false)
        return
      }
      
      // Tentar classrooms primeiro, depois turmas (fallback)
      let turmasList: { id: string; nome: string }[] = []
      
      const classroomsResult = await supabase
        .from('classrooms')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
        .limit(100)

      if (classroomsResult.error) {
        // Se erro for "does not exist", "schema cache", "PGRST205" ou RLS, tentar fallback
        if (classroomsResult.error.message?.includes('does not exist') || 
            classroomsResult.error.code === '42P01' ||
            classroomsResult.error.code === 'PGRST205' ||
            classroomsResult.error.message?.includes('schema cache') ||
            classroomsResult.error.message?.includes('permission denied') ||
            classroomsResult.error.message?.includes('row-level security')) {
          // Fallback para turmas
          const turmasResult = await supabase
            .from('turmas')
            .select('id, nome')
            .eq('ativo', true)
            .order('nome')
          
          if (!turmasResult.error && turmasResult.data) {
            turmasList = turmasResult.data.map((t: any) => ({
              id: t.id,
              nome: t.nome || t.name || 'Turma',
            }))
          } else {
            console.warn('Erro ao buscar turmas (fallback):', turmasResult.error)
          }
        } else {
          console.warn('Erro ao buscar classrooms:', classroomsResult.error)
        }
      } else {
        // Se classrooms funcionou, usar name
        turmasList = classroomsResult.data?.map((c: any) => ({
          id: c.id,
          nome: c.name || c.nome || 'Turma',
        })) || []
      }

      setTurmas(turmasList)
    } catch (err: any) {
      console.error('Erro ao buscar turmas:', err)
      setTurmas([])
    } finally {
      setLoadingTurmas(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nome.trim()) {
      setError('Digite o nome do aluno')
      return
    }

    if (!email.trim()) {
      setError('Digite o email do aluno')
      return
    }

    if (!senha.trim() || senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Chamar API route para criar aluno
      const response = await fetch('/api/admin/criar-aluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha: senha,
          dataNascimento: dataNascimento || null,
          serie: serie.trim() || null,
          turmaId: turmaId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar aluno')
      }

      // Redirecionar de volta à lista
      router.push('/coordenador/alunos')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar aluno')
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
          Novo Aluno
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {/* Nome */}
          <div>
            <Input
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao.silva@escola.com"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <p className="text-gray-400 text-xs mt-1">O aluno poderá alterar a senha após o primeiro login</p>
          </div>

          {/* Data de Nascimento */}
          <div>
            <Input
              label="Data de Nascimento (opcional)"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>

          {/* Série */}
          <div>
            <Input
              label="Série (opcional)"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              placeholder="Ex: 3º Ano, 1º Ano"
            />
          </div>

          {/* Turma */}
          <div>
            <label className="text-white text-xs sm:text-sm font-medium mb-2 block">Turma (opcional)</label>
            {loadingTurmas ? (
              <div className="flex items-center justify-center py-3 sm:py-4">
                <span className="material-symbols-outlined animate-spin text-xl sm:text-2xl text-white">
                  refresh
                </span>
              </div>
            ) : (
              <select
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
              >
                <option value="">Selecione uma turma (opcional)</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4">
              <p className="text-red-400 text-xs sm:text-sm font-medium">{error}</p>
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
              disabled={isLoading || !nome.trim() || !email.trim() || !senha.trim()}
              className="flex-1 bg-primary text-background-dark h-12 sm:h-14 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
                  <span className="text-xs sm:text-sm">Criando...</span>
                </span>
              ) : (
                'Criar Aluno'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

