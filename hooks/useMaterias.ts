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

      // Tentar subjects primeiro, depois materias (fallback)
      let data: any[] | null = null
      let err: any = null
      
      const subjectsResult = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true })

      if (subjectsResult.error && subjectsResult.error.message?.includes('does not exist')) {
        const materiasResult = await supabase
          .from('materias')
          .select('*')
          .eq('ativo', true)
          .order('ordem', { ascending: true })
        data = materiasResult.data
        err = materiasResult.error
      } else {
        // Mapear subjects para formato de materias
        data = subjectsResult.data?.map((s: any) => ({
          id: s.id,
          nome: s.name || s.nome,
          slug: s.slug,
          descricao: s.description || s.descricao,
          cor_primaria: s.primary_color || s.cor_primaria,
          cor_secundaria: s.secondary_color || s.cor_secundaria,
          imagem_url: s.image_url || s.imagem_url,
          icone: s.icon || s.icone,
          ordem: s.order || s.ordem,
          ativo: s.is_active !== undefined ? s.is_active : s.ativo
        })) || null
        err = subjectsResult.error
      }

      if (err && !err.message?.includes('does not exist')) throw err

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

