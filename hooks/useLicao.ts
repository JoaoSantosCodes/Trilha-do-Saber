// Hook para buscar lição e questões
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface OpcaoResposta {
  id: string
  texto: string
  emoji: string | null
  correta: boolean
  ordem: number
}

export interface Questao {
  id: string
  texto: string
  ordem: number
  mensagem_mascote: string | null
  opcoes: OpcaoResposta[]
}

export interface LicaoData {
  id: string
  titulo: string
  descricao: string | null
  tipo: 'licao' | 'desafio'
  pontos_recompensa: number
  moedas_recompensa: number
  questoes: Questao[]
}

export function useLicao(licaoId: string) {
  const { user } = useAuth()
  const [licao, setLicao] = useState<LicaoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (licaoId && user) {
      fetchLicao()
    } else {
      setLoading(false)
    }
  }, [licaoId, user])

  const fetchLicao = async () => {
    if (!user || !licaoId) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar dados da lição
      // Tentar lesson_plans primeiro, depois licoes (fallback)
      let licaoData: any = null
      let licaoError: any = null
      
      const lessonPlansResult = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('id', licaoId)
        .single()

      if (lessonPlansResult.error && lessonPlansResult.error.message?.includes('does not exist')) {
        const licoesResult = await supabase
          .from('licoes')
          .select('*')
          .eq('id', licaoId)
          .single()
        licaoData = licoesResult.data
        licaoError = licoesResult.error
      } else {
        licaoData = lessonPlansResult.data
        licaoError = lessonPlansResult.error
      }

      if (licaoError && !licaoError.message?.includes('No rows')) throw licaoError
      if (!licaoData) throw new Error('Lição não encontrada')

      // 2. Buscar questões da lição
      // Tentar questions primeiro, depois questoes (fallback)
      let questoesData: any[] | null = null
      let questoesError: any = null
      
      const questionsResult = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_plan_id', licaoId)
        .order('order', { ascending: true })

      if (questionsResult.error && questionsResult.error.message?.includes('does not exist')) {
        const questoesResult = await supabase
          .from('questoes')
          .select('*')
          .eq('licao_id', licaoId)
          .order('ordem', { ascending: true })
        questoesData = questoesResult.data
        questoesError = questoesResult.error
      } else {
        questoesData = questionsResult.data
        questoesError = questionsResult.error
      }

      if (questoesError && !questoesError.message?.includes('does not exist')) throw questoesError

      // 3. Buscar opções de resposta para cada questão
      const questoesComOpcoes: Questao[] = await Promise.all(
        (questoesData || []).map(async (questao) => {
          // Tentar quiz_questions primeiro, depois opcoes_resposta (fallback)
          let opcoesData: any[] | null = null
          let opcoesError: any = null
          
          const quizQuestionsResult = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('question_id', questao.id)
            .order('order', { ascending: true })

          if (quizQuestionsResult.error && quizQuestionsResult.error.message?.includes('does not exist')) {
            const opcoesResult = await supabase
              .from('opcoes_resposta')
              .select('*')
              .eq('questao_id', questao.id)
              .order('ordem', { ascending: true })
            opcoesData = opcoesResult.data
            opcoesError = opcoesResult.error
          } else {
            opcoesData = quizQuestionsResult.data
            opcoesError = quizQuestionsResult.error
          }

          if (opcoesError && !opcoesError.message?.includes('does not exist')) throw opcoesError

          return {
            id: questao.id,
            texto: questao.texto,
            ordem: questao.ordem,
            mensagem_mascote: questao.mensagem_mascote,
            opcoes: (opcoesData || []).map((opcao) => ({
              id: opcao.id,
              texto: opcao.texto,
              emoji: opcao.emoji,
              correta: opcao.correta,
              ordem: opcao.ordem,
            })),
          }
        })
      )

      setLicao({
        id: licaoData.id,
        titulo: licaoData.titulo,
        descricao: licaoData.descricao,
        tipo: licaoData.tipo,
        pontos_recompensa: licaoData.pontos_recompensa,
        moedas_recompensa: licaoData.moedas_recompensa,
        questoes: questoesComOpcoes,
      })
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar lição:', err)
    } finally {
      setLoading(false)
    }
  }

  return { licao, loading, error, refetch: fetchLicao }
}

