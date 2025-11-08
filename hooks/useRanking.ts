// Hook para buscar ranking semanal
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface AlunoRanking {
  id: string
  aluno_id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  pontos_xp: number
  posicao: number
  isCurrentUser?: boolean
}

export function useRanking(tipo: 'amigos' | 'global' = 'global') {
  const { user } = useAuth()
  const [ranking, setRanking] = useState<AlunoRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchRanking()
    } else {
      setLoading(false)
    }
  }, [user, tipo])

  const fetchRanking = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Calcular início da semana (domingo)
      const hoje = new Date()
      const diaSemana = hoje.getDay() // 0 = domingo, 1 = segunda, etc.
      const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
      const domingo = new Date(hoje)
      domingo.setDate(hoje.getDate() - diasAteDomingo)
      domingo.setHours(0, 0, 0, 0)

      const semanaInicio = domingo.toISOString().split('T')[0]

      if (tipo === 'amigos') {
        // Buscar ranking apenas de amigos
        // 1. Buscar IDs dos amigos
        const { data: amizades, error: amizadesError } = await supabase
          .from('amizades')
          .select('aluno_id, amigo_id')
          .or(`aluno_id.eq.${user.id},amigo_id.eq.${user.id}`)
          .eq('status', 'aceita')

        if (amizadesError) throw amizadesError

        const amigosIds = new Set<string>()
        amigosIds.add(user.id) // Incluir o próprio usuário

        amizades?.forEach((amizade) => {
          if (amizade.aluno_id === user.id) {
            amigosIds.add(amizade.amigo_id)
          } else {
            amigosIds.add(amizade.aluno_id)
          }
        })

        // 2. Buscar pontos semanais dos amigos (usar progresso_semanal como fallback)
        const { data: progressoSemanal, error: progressoError } = await supabase
          .from('progresso_semanal')
          .select('aluno_id, pontos_ganhos')
          .eq('semana_inicio', semanaInicio)
          .in('aluno_id', Array.from(amigosIds))

        if (progressoError) throw progressoError

        // 3. Buscar perfis dos alunos
        const alunosIds = Array.from(amigosIds)
        const { data: perfis, error: perfisError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', alunosIds)
          .eq('role', 'aluno')

        if (perfisError) throw perfisError

        // 4. Combinar dados e calcular posições
        const rankingCompleto: AlunoRanking[] = perfis
          ?.map((perfil) => {
            const progresso = progressoSemanal?.find((p) => p.aluno_id === perfil.id)
            return {
              id: perfil.id,
              aluno_id: perfil.id,
              username: perfil.username || null,
              full_name: perfil.full_name || null,
              avatar_url: perfil.avatar_url || null,
              pontos_xp: progresso?.pontos_ganhos || 0,
              posicao: 0, // Será calculado depois
              isCurrentUser: perfil.id === user.id,
            }
          })
          .sort((a, b) => b.pontos_xp - a.pontos_xp)
          .map((entry, index) => ({
            ...entry,
            posicao: index + 1,
          })) || []

        setRanking(rankingCompleto)
      } else {
        // Buscar ranking global (usar progresso_semanal)
        const { data: progressoSemanal, error: progressoError } = await supabase
          .from('progresso_semanal')
          .select('aluno_id, pontos_ganhos')
          .eq('semana_inicio', semanaInicio)
          .order('pontos_ganhos', { ascending: false })
          .limit(100)

        if (progressoError) throw progressoError

        // Buscar perfis dos alunos
        const alunosIds = progressoSemanal?.map((p) => p.aluno_id) || []
        if (alunosIds.length === 0) {
          setRanking([])
          return
        }

        const { data: perfis, error: perfisError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', alunosIds)
          .eq('role', 'aluno')

        if (perfisError) throw perfisError

        // Combinar dados e calcular posições
        const rankingCompleto: AlunoRanking[] = (progressoSemanal || [])
          .map((progresso, index) => {
            const perfil = perfis?.find((p) => p.id === progresso.aluno_id)
            return {
              id: progresso.aluno_id,
              aluno_id: progresso.aluno_id,
              username: perfil?.username || null,
              full_name: perfil?.full_name || null,
              avatar_url: perfil?.avatar_url || null,
              pontos_xp: progresso.pontos_ganhos || 0,
              posicao: index + 1,
              isCurrentUser: progresso.aluno_id === user.id,
            }
          })
          .sort((a, b) => b.pontos_xp - a.pontos_xp)
          .map((entry, index) => ({
            ...entry,
            posicao: index + 1,
          }))

        setRanking(rankingCompleto)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar ranking:', err)
    } finally {
      setLoading(false)
    }
  }

  return { ranking, loading, error, refetch: fetchRanking }
}

