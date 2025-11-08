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
      const { data: todasConquistas, error: errTodas } = await supabase
        .from('conquistas')
        .select('*')
        .order('ordem', { ascending: true })

      if (errTodas) throw errTodas

      // Buscar conquistas desbloqueadas pelo aluno
      const { data: conquistasAluno, error: errAluno } = await supabase
        .from('aluno_conquistas')
        .select('conquista_id, data_desbloqueio')
        .eq('aluno_id', targetAlunoId)

      if (errAluno) throw errAluno

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

