// Hook para buscar dados do aluno
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface AlunoData {
  id: string
  data_nascimento: string | null
  serie: string | null
  pontos: number
  moedas: number
  sequencia_atual: number
  cor_fundo_perfil: string
  icone_conquista_favorito: string | null
  created_at: string
  updated_at: string
}

export function useAluno() {
  const { user } = useAuth()
  const [aluno, setAluno] = useState<AlunoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAluno()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAluno = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('alunos')
        .select('*')
        .eq('id', user.id)
        .single()

      if (err) throw err

      setAluno(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar dados do aluno:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAluno = async (updates: Partial<AlunoData>) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { data, error: err } = await supabase
        .from('alunos')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (err) throw err

      setAluno(data)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return { aluno, loading, error, refetch: fetchAluno, updateAluno }
}

