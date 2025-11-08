// Hook para buscar trilha e lições de uma matéria
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Licao {
  id: string
  titulo: string
  descricao: string | null
  tipo: 'licao' | 'desafio'
  icone: string | null
  posicao_top: string | null
  posicao_left: string | null
  ordem: number
  pontos_recompensa: number
  moedas_recompensa: number
  status: 'bloqueada' | 'disponivel' | 'em_andamento' | 'concluida'
}

export interface Trilha {
  id: string
  materia_id: string
  titulo: string
  descricao: string | null
  imagem_fundo: string | null
  cor_caminho: string | null
  mascote_imagem: string | null
  mascote_mensagem: string | null
  licoes: Licao[]
}

export function useTrilha(materiaSlug: string) {
  const { user } = useAuth()
  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (materiaSlug && user) {
      fetchTrilha()
    } else {
      setLoading(false)
    }
  }, [materiaSlug, user])

  const fetchTrilha = async () => {
    if (!user || !materiaSlug) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar matéria pelo slug
      // Tentar subjects primeiro, depois materias (fallback)
      let materia: any = null
      let materiaError: any = null
      
      const subjectsResult = await supabase
        .from('subjects')
        .select('id')
        .eq('slug', materiaSlug)
        .single()

      if (subjectsResult.error && subjectsResult.error.message?.includes('does not exist')) {
        const materiasResult = await supabase
          .from('materias')
          .select('id')
          .eq('slug', materiaSlug)
          .single()
        materia = materiasResult.data
        materiaError = materiasResult.error
      } else {
        materia = subjectsResult.data
        materiaError = subjectsResult.error
      }

      if (materiaError && !materiaError.message?.includes('No rows')) throw materiaError
      if (!materia) throw new Error('Matéria não encontrada')

      // 2. Buscar trilha da matéria
      // Tentar learning_materials primeiro, depois trilhas (fallback)
      let trilhaData: any = null
      let trilhaError: any = null
      
      const learningMaterialsResult = await supabase
        .from('learning_materials')
        .select('*')
        .eq('subject_id', materia.id)
        .order('order', { ascending: true })
        .limit(1)
        .single()

      if (learningMaterialsResult.error && learningMaterialsResult.error.message?.includes('does not exist')) {
        const trilhasResult = await supabase
          .from('trilhas')
          .select('*')
          .eq('materia_id', materia.id)
          .order('ordem', { ascending: true })
          .limit(1)
          .single()
        trilhaData = trilhasResult.data
        trilhaError = trilhasResult.error
      } else {
        trilhaData = learningMaterialsResult.data
        trilhaError = learningMaterialsResult.error
      }

      if (trilhaError && !trilhaError.message?.includes('No rows')) throw trilhaError
      if (!trilhaData) throw new Error('Trilha não encontrada')

      // 3. Buscar lições da trilha
      // Tentar lesson_plans primeiro, depois licoes (fallback)
      let licoesData: any[] | null = null
      let licoesError: any = null
      
      const lessonPlansResult = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('learning_material_id', trilhaData.id)
        .order('order', { ascending: true })

      if (lessonPlansResult.error && lessonPlansResult.error.message?.includes('does not exist')) {
        const licoesResult = await supabase
          .from('licoes')
          .select('*')
          .eq('trilha_id', trilhaData.id)
          .order('ordem', { ascending: true })
        licoesData = licoesResult.data
        licoesError = licoesResult.error
      } else {
        licoesData = lessonPlansResult.data
        licoesError = lessonPlansResult.error
      }

      if (licoesError && !licoesError.message?.includes('does not exist')) throw licoesError

      // 4. Buscar progresso do aluno nas lições
      // Tentar student_subject_performance primeiro, depois progresso_licoes (fallback)
      let progressoData: any[] | null = null
      let progressoError: any = null
      
      const performanceResult = await supabase
        .from('student_subject_performance')
        .select('lesson_plan_id as licao_id, status')
        .eq('student_id', user.id)
        .in(
          'lesson_plan_id',
          (licoesData || []).map((l) => l.id)
        )

      if (performanceResult.error && performanceResult.error.message?.includes('does not exist')) {
        const progressoResult = await supabase
          .from('progresso_licoes')
          .select('licao_id, status')
          .eq('aluno_id', user.id)
          .in(
            'licao_id',
            (licoesData || []).map((l) => l.id))
          )
        progressoData = progressoResult.data
        progressoError = progressoResult.error
      } else {
        progressoData = performanceResult.data
        progressoError = performanceResult.error
      }

      if (progressoError && !progressoError.message?.includes('does not exist')) throw progressoError

      const progressoMap = new Map(
        (progressoData || []).map((p) => [p.licao_id, p.status])
      )

      // 5. Combinar lições com progresso e determinar status
      const licoesComStatus: Licao[] = (licoesData || []).map((licao, index) => {
        const progressoStatus = progressoMap.get(licao.id)

        // Determinar status baseado no progresso e ordem
        let status: Licao['status'] = 'bloqueada'

        if (progressoStatus) {
          status = progressoStatus as Licao['status']
        } else {
          // Primeira lição sempre disponível
          if (index === 0) {
            status = 'disponivel'
          } else {
            // Verificar se lição anterior foi concluída
            const licaoAnterior = licoesData[index - 1]
            const statusAnterior = progressoMap.get(licaoAnterior.id)
            if (statusAnterior === 'concluida') {
              status = 'disponivel'
            }
          }
        }

        return {
          ...licao,
          status,
        }
      })

      setTrilha({
        ...trilhaData,
        materia_id: materia.id,
        licoes: licoesComStatus,
      })
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar trilha:', err)
    } finally {
      setLoading(false)
    }
  }

  return { trilha, loading, error, refetch: fetchTrilha }
}

