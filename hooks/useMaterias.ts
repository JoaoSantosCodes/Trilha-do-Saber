// Hook para buscar matérias
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'

export interface Materia {
  id: string
  nome: string
  slug: string
  descricao: string | null
  cor_primaria: string | null
  cor_secundaria: string | null
  imagem_url: string | null
  icone: string | null
  ordem: number
  ativo: boolean
}

export function useMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMaterias()
  }, [])

  const fetchMaterias = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('materias')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })

      if (err) throw err

      setMaterias(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar matérias:', err)
    } finally {
      setLoading(false)
    }
  }

  return { materias, loading, error, refetch: fetchMaterias }
}

