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
      const { data: licaoData, error: licaoError } = await supabase
        .from('licoes')
        .select('*')
        .eq('id', licaoId)
        .single()

      if (licaoError) throw licaoError
      if (!licaoData) throw new Error('Lição não encontrada')

      // 2. Buscar questões da lição
      const { data: questoesData, error: questoesError } = await supabase
        .from('questoes')
        .select('*')
        .eq('licao_id', licaoId)
        .order('ordem', { ascending: true })

      if (questoesError) throw questoesError

      // 3. Buscar opções de resposta para cada questão
      const questoesComOpcoes: Questao[] = await Promise.all(
        (questoesData || []).map(async (questao) => {
          const { data: opcoesData, error: opcoesError } = await supabase
            .from('opcoes_resposta')
            .select('*')
            .eq('questao_id', questao.id)
            .order('ordem', { ascending: true })

          if (opcoesError) throw opcoesError

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

