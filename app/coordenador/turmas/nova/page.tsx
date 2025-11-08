'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export default function NovaTurmaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [professorId, setProfessorId] = useState('')
  const [serie, setSerie] = useState('')
  const [periodo, setPeriodo] = useState<'manha' | 'tarde' | 'noite'>('manha')
  const [anoLetivo, setAnoLetivo] = useState('')
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProfessores, setLoadingProfessores] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfessores()
  }, [])

  const fetchProfessores = async () => {
    try {
      setLoadingProfessores(true)
      
      // 1. Buscar professores ativos
      const { data: professoresData, error: errProfessores } = await supabase
        .from('professores')
        .select('id')
        .eq('status', 'ativo')

      if (errProfessores) throw errProfessores

      if (!professoresData || professoresData.length === 0) {
        setProfessores([])
        return
      }

      const professoresIds = professoresData.map((p) => p.id)

      // 2. Buscar perfis dos professores
      const { data: perfis, error: errPerfis } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', professoresIds)
        .eq('role', 'professor')

      if (errPerfis) throw errPerfis

      const professoresFormatados =
        perfis?.map((perfil) => ({
          id: perfil.id,
          nome: perfil.full_name || perfil.username || 'Professor',
        })) || []

      setProfessores(professoresFormatados)
    } catch (err: any) {
      console.error('Erro ao buscar professores:', err)
    } finally {
      setLoadingProfessores(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nome.trim()) {
      setError('Digite o nome da turma')
      return
    }

    if (!codigo.trim()) {
      setError('Digite o código da turma')
      return
    }

    if (!professorId) {
      setError('Selecione um professor')
      return
    }

    setIsLoading(true)

    try {
      // Verificar se código já existe
      const { data: codigoExistente, error: errCodigo } = await supabase
        .from('turmas')
        .select('id')
        .eq('codigo', codigo.trim())
        .single()

      if (errCodigo && errCodigo.code !== 'PGRST116') {
        throw errCodigo
      }

      if (codigoExistente) {
        setError('Este código de turma já está em uso')
        setIsLoading(false)
        return
      }

      // Criar turma
      const { error: err } = await supabase.from('turmas').insert({
        nome: nome.trim(),
        codigo: codigo.trim(),
        professor_id: professorId,
        serie: serie.trim() || null,
        periodo: periodo,
        ano_letivo: anoLetivo.trim() || null,
        ativo: true,
      })

      if (err) throw err

      // Redirecionar de volta à lista
      router.push('/coordenador/turmas')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar turma')
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
          Nova Turma
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nome */}
          <div>
            <Input
              label="Nome da Turma"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Turma 301 - Manhã"
              required
            />
          </div>

          {/* Código */}
          <div>
            <Input
              label="Código da Turma"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: TURMA-301-M"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Código único para identificar a turma</p>
          </div>

          {/* Professor */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Professor Responsável</label>
            {loadingProfessores ? (
              <div className="flex items-center justify-center py-4">
                <span className="material-symbols-outlined animate-spin text-2xl text-white">
                  refresh
                </span>
              </div>
            ) : (
              <select
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione um professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
            )}
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

          {/* Período */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Período</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'manha', label: 'Manhã', icon: 'wb_sunny' },
                { value: 'tarde', label: 'Tarde', icon: 'brightness_4' },
                { value: 'noite', label: 'Noite', icon: 'nights_stay' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriodo(option.value as any)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-colors ${
                    periodo === option.value
                      ? 'bg-primary text-background-dark'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{option.icon}</span>
                  <p className="text-sm font-bold">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ano Letivo */}
          <div>
            <Input
              label="Ano Letivo (opcional)"
              value={anoLetivo}
              onChange={(e) => setAnoLetivo(e.target.value)}
              placeholder="Ex: 2024"
            />
          </div>

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
              disabled={isLoading || !nome.trim() || !codigo.trim() || !professorId}
              className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Criando...
                </span>
              ) : (
                'Criar Turma'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

