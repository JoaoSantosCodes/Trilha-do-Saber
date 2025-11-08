// Hook para buscar conquistas do aluno
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Conquista {
  id: string
  nome: string
  descricao: string | null
  icone: string
  cor_gradiente: string | null
  tipo: string | null
  criterio_valor: number | null
  imagem_url: string | null
  ordem: number
  desbloqueada: boolean
  data_desbloqueio?: string
}

export function useConquistas(alunoId?: string) {
  const { user } = useAuth()
  const [conquistas, setConquistas] = useState<Conquista[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const targetAlunoId = alunoId || user?.id

  useEffect(() => {
    if (targetAlunoId) {
      fetchConquistas()
    } else {
      setLoading(false)
    }
  }, [targetAlunoId])

  const fetchConquistas = async () => {
    if (!targetAlunoId) return

    try {
      setLoading(true)
      setError(null)

      // Buscar todas as conquistas
      // Tentar achievements primeiro, depois conquistas (fallback)
      let todasConquistas: any[] | null = null
      let errTodas: any = null
      
      const achievementsResult = await supabase
        .from('achievements')
        .select('*')
        .order('order', { ascending: true })

      if (achievementsResult.error && achievementsResult.error.message?.includes('does not exist')) {
        const conquistasResult = await supabase
          .from('conquistas')
          .select('*')
          .order('ordem', { ascending: true })
        todasConquistas = conquistasResult.data
        errTodas = conquistasResult.error
      } else {
        todasConquistas = achievementsResult.data
        errTodas = achievementsResult.error
      }

      if (errTodas && !errTodas.message?.includes('does not exist')) throw errTodas

      // Buscar conquistas desbloqueadas pelo aluno
      // Tentar student_achievements primeiro, depois aluno_conquistas (fallback)
      let conquistasAluno: any[] | null = null
      let errAluno: any = null
      
      const studentAchievementsResult = await supabase
        .from('student_achievements')
        .select('achievement_id as conquista_id, unlocked_at as data_desbloqueio')
        .eq('student_id', targetAlunoId)

      if (studentAchievementsResult.error && studentAchievementsResult.error.message?.includes('does not exist')) {
        const alunoConquistasResult = await supabase
          .from('aluno_conquistas')
          .select('conquista_id, data_desbloqueio')
          .eq('aluno_id', targetAlunoId)
        conquistasAluno = alunoConquistasResult.data
        errAluno = alunoConquistasResult.error
      } else {
        conquistasAluno = studentAchievementsResult.data
        errAluno = studentAchievementsResult.error
      }

      if (errAluno && !errAluno.message?.includes('does not exist')) throw errAluno

      const conquistasDesbloqueadas = new Set(
        conquistasAluno?.map((ac) => ac.conquista_id) || []
      )

      // Combinar dados
      const conquistasComStatus = (todasConquistas || []).map((conquista) => {
        const desbloqueada = conquistasDesbloqueadas.has(conquista.id)
        const alunoConquista = conquistasAluno?.find((ac) => ac.conquista_id === conquista.id)

        return {
          ...conquista,
          desbloqueada,
          data_desbloqueio: alunoConquista?.data_desbloqueio,
        }
      })

      setConquistas(conquistasComStatus)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar conquistas:', err)
    } finally {
      setLoading(false)
    }
  }

  return { conquistas, loading, error, refetch: fetchConquistas }
}

