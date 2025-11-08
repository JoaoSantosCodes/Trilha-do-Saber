// Hook para buscar progresso do aluno
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface ProgressoLicao {
  id: string
  aluno_id: string
  licao_id: string
  status: 'bloqueada' | 'disponivel' | 'em_andamento' | 'concluida'
  pontos_ganhos: number
  moedas_ganhas: number
  tentativas: number
  acertos: number
  erros: number
  tempo_total_segundos: number
  data_inicio: string | null
  data_conclusao: string | null
  created_at: string
  updated_at: string
}

export interface ProgressoSemanal {
  id: string
  aluno_id: string
  semana_inicio: string
  tempo_estudo_minutos: number
  licoes_completadas: number
  pontos_ganhos: number
  acertos_percentual: number
  created_at: string
  updated_at: string
}

export function useProgresso() {
  const { user } = useAuth()
  const [progressoLicoes, setProgressoLicoes] = useState<ProgressoLicao[]>([])
  const [progressoSemanal, setProgressoSemanal] = useState<ProgressoSemanal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchProgresso()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchProgresso = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar progresso das lições
      // Tentar student_subject_performance primeiro, depois progresso_licoes (fallback)
      let licoesData: any[] | null = null
      let licoesError: any = null
      
      const performanceResult = await supabase
        .from('student_subject_performance')
        .select('*')
        .eq('student_id', user.id)

      if (performanceResult.error && performanceResult.error.message?.includes('does not exist')) {
        const progressoResult = await supabase
          .from('progresso_licoes')
          .select('*')
          .eq('aluno_id', user.id)
        licoesData = progressoResult.data
        licoesError = progressoResult.error
      } else {
        licoesData = performanceResult.data
        licoesError = performanceResult.error
      }

      if (licoesError && !licoesError.message?.includes('does not exist')) throw licoesError

      setProgressoLicoes(licoesData || [])

      // Buscar progresso semanal (semana atual)
      // Tentar student_stats primeiro, depois progresso_semanal (fallback)
      const semanaAtual = new Date()
      semanaAtual.setDate(semanaAtual.getDate() - semanaAtual.getDay()) // Domingo da semana
      semanaAtual.setHours(0, 0, 0, 0)

      let semanalData: any = null
      let semanalError: any = null
      
      const statsResult = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', user.id)
        .eq('week_start', semanaAtual.toISOString().split('T')[0])
        .single()

      if (statsResult.error && statsResult.error.message?.includes('does not exist')) {
        const semanalResult = await supabase
          .from('progresso_semanal')
          .select('*')
          .eq('aluno_id', user.id)
          .eq('semana_inicio', semanaAtual.toISOString().split('T')[0])
          .single()
        semanalData = semanalResult.data
        semanalError = semanalResult.error
      } else {
        semanalData = statsResult.data
        semanalError = statsResult.error
      }

      if (semanalError && semanalError.code !== 'PGRST116' && !semanalError.message?.includes('does not exist')) {
        // PGRST116 = nenhum resultado encontrado (não é erro)
        throw semanalError
      }

      setProgressoSemanal(semanalData || null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar progresso:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProgressoLicao = (licaoId: string) => {
    return progressoLicoes.find((p) => p.licao_id === licaoId)
  }

  const atualizarProgressoLicao = async (
    licaoId: string,
    updates: Partial<ProgressoLicao>
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const progressoExistente = progressoLicoes.find((p) => p.licao_id === licaoId)

      if (progressoExistente) {
        // Atualizar progresso existente
        // Tentar student_subject_performance primeiro, depois progresso_licoes (fallback)
        let data: any = null
        let err: any = null
        
        const performanceResult = await supabase
          .from('student_subject_performance')
          .update(updates)
          .eq('id', progressoExistente.id)
          .select()
          .single()

        if (performanceResult.error && performanceResult.error.message?.includes('does not exist')) {
          const progressoResult = await supabase
            .from('progresso_licoes')
            .update(updates)
            .eq('id', progressoExistente.id)
            .select()
            .single()
          data = progressoResult.data
          err = progressoResult.error
        } else {
          data = performanceResult.data
          err = performanceResult.error
        }

        if (err && !err.message?.includes('does not exist')) throw err

        setProgressoLicoes((prev) =>
          prev.map((p) => (p.id === progressoExistente.id ? data : p))
        )

        return { data, error: null }
      } else {
        // Criar novo progresso
        // Tentar student_subject_performance primeiro, depois progresso_licoes (fallback)
        let data: any = null
        let err: any = null
        
        const performanceResult = await supabase
          .from('student_subject_performance')
          .insert({
            student_id: user.id,
            lesson_plan_id: licaoId,
            ...updates,
          })
          .select()
          .single()

        if (performanceResult.error && performanceResult.error.message?.includes('does not exist')) {
          const progressoResult = await supabase
            .from('progresso_licoes')
            .insert({
              aluno_id: user.id,
              licao_id: licaoId,
              ...updates,
            })
            .select()
            .single()
          data = progressoResult.data
          err = progressoResult.error
        } else {
          data = performanceResult.data
          err = performanceResult.error
        }

        if (err && !err.message?.includes('does not exist')) throw err

        setProgressoLicoes((prev) => [...prev, data])
        return { data, error: null }
      }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return {
    progressoLicoes,
    progressoSemanal,
    loading,
    error,
    refetch: fetchProgresso,
    getProgressoLicao,
    atualizarProgressoLicao,
  }
}

