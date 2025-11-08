// Hook para buscar turmas e alunos do professor
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface TurmaProfessor {
  id: string
  nome: string
  codigo: string
  serie: string | null
  periodo: string | null
  ano_letivo: string | null
}

export interface AlunoTurma {
  id: string
  aluno_id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  pontos: number
  moedas: number
  progresso_geral: number
  licoes_completadas: number
  media_acertos: number
}

export interface EstatisticasTurma {
  media_licoes_semana: number
  melhor_desempenho: string | null
  precisam_atencao: number
}

export function useProfessor() {
  const { user } = useAuth()
  const [turmas, setTurmas] = useState<TurmaProfessor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchTurmas()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchTurmas = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar turmas do professor
      const { data: turmasData, error: errTurmas } = await supabase
        .from('turmas')
        .select('*')
        .eq('professor_id', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (errTurmas) throw errTurmas

      setTurmas(turmasData || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar turmas:', err)
    } finally {
      setLoading(false)
    }
  }

  const buscarAlunosTurma = async (turmaId: string): Promise<AlunoTurma[]> => {
    if (!user) return []

    try {
      // 1. Buscar relação aluno_turma
      const { data: relacoes, error: errRelacoes } = await supabase
        .from('aluno_turma')
        .select('aluno_id')
        .eq('turma_id', turmaId)
        .eq('ativo', true)

      if (errRelacoes) throw errRelacoes

      if (!relacoes || relacoes.length === 0) return []

      const alunosIds = relacoes.map((r) => r.aluno_id)

      // 2. Buscar perfis dos alunos
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url, role')
        .in('id', alunosIds)
        .eq('role', 'student')

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', alunosIds)
          .eq('role', 'aluno')
        perfis = profilesResult.data
        errPerfis = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          username: u.name?.split(' ')[0] || null,
          full_name: u.name || null,
          avatar_url: u.avatar_url || null
        })) || null
        errPerfis = usersResult.error
      }

      if (errPerfis && !errPerfis.message?.includes('does not exist')) throw errPerfis

      // 3. Buscar dados dos alunos
      // Tentar students primeiro, depois alunos (fallback)
      let dadosAlunos: any[] | null = null
      let errAlunos: any = null
      
      const studentsResult = await supabase
        .from('students')
        .select('user_id as id, total_points as pontos')
        .in('user_id', alunosIds)

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .select('id, pontos, moedas')
          .in('id', alunosIds)
        dadosAlunos = alunosResult.data
        errAlunos = alunosResult.error
      } else {
        dadosAlunos = studentsResult.data?.map((s: any) => ({
          id: s.id,
          pontos: s.pontos || 0,
          moedas: 0 // students não tem moedas
        })) || null
        errAlunos = studentsResult.error
      }

      if (errAlunos && !errAlunos.message?.includes('does not exist')) throw errAlunos

      // 4. Buscar progresso das lições
      const { data: progressoLicoes, error: errProgresso } = await supabase
        .from('progresso_licoes')
        .select('aluno_id, status, acertos, erros')
        .in('aluno_id', alunosIds)

      if (errProgresso) throw errProgresso

      // 5. Calcular início da semana (domingo)
      const hoje = new Date()
      const diaSemana = hoje.getDay()
      const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
      const domingo = new Date(hoje)
      domingo.setDate(hoje.getDate() - diasAteDomingo)
      domingo.setHours(0, 0, 0, 0)
      const semanaInicio = domingo.toISOString().split('T')[0]

      // 6. Buscar progresso semanal
      const { data: progressoSemanal, error: errProgressoSemanal } = await supabase
        .from('progresso_semanal')
        .select('aluno_id, licoes_completadas')
        .eq('semana_inicio', semanaInicio)
        .in('aluno_id', alunosIds)

      if (errProgressoSemanal) throw errProgressoSemanal

      // 7. Combinar dados
      const alunosCompletos: AlunoTurma[] = (perfis || []).map((perfil) => {
        const dadosAluno = dadosAlunos?.find((da) => da.id === perfil.id)
        const progressoAluno = progressoLicoes?.filter((p) => p.aluno_id === perfil.id) || []
        const progressoSemanalAluno = progressoSemanal?.find((p) => p.aluno_id === perfil.id)

        const totalRespostas = progressoAluno.reduce((acc, p) => acc + p.acertos + p.erros, 0)
        const totalAcertos = progressoAluno.reduce((acc, p) => acc + p.acertos, 0)
        const mediaAcertos = totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0

        const licoesConcluidas = progressoAluno.filter((p) => p.status === 'concluida').length
        const totalLicoes = progressoAluno.length
        const progressoGeral = totalLicoes > 0 ? (licoesConcluidas / totalLicoes) * 100 : 0

        return {
          id: perfil.id,
          aluno_id: perfil.id,
          username: perfil.username,
          full_name: perfil.full_name,
          avatar_url: perfil.avatar_url,
          pontos: dadosAluno?.pontos || 0,
          moedas: dadosAluno?.moedas || 0,
          progresso_geral: Math.round(progressoGeral),
          licoes_completadas: progressoSemanalAluno?.licoes_completadas || 0,
          media_acertos: Math.round(mediaAcertos),
        }
      })

      return alunosCompletos.sort((a, b) => b.progresso_geral - a.progresso_geral)
    } catch (err: any) {
      console.error('Erro ao buscar alunos da turma:', err)
      return []
    }
  }

  const buscarEstatisticasTurma = async (turmaId: string): Promise<EstatisticasTurma | null> => {
    if (!user) return null

    try {
      // 1. Buscar alunos da turma
      const alunos = await buscarAlunosTurma(turmaId)

      if (alunos.length === 0) {
        return {
          media_licoes_semana: 0,
          melhor_desempenho: null,
          precisam_atencao: 0,
        }
      }

      // 2. Calcular média de lições por semana
      const totalLicoes = alunos.reduce((acc, aluno) => acc + aluno.licoes_completadas, 0)
      const mediaLicoes = totalLicoes / alunos.length

      // 3. Buscar melhor desempenho (matéria com mais progresso)
      // Por enquanto, vamos usar uma lógica simplificada
      const melhorDesempenho = 'Matemática' // TODO: Implementar lógica real

      // 4. Contar alunos que precisam de atenção (progresso < 50%)
      const precisamAtencao = alunos.filter((aluno) => aluno.progresso_geral < 50).length

      return {
        media_licoes_semana: Math.round(mediaLicoes * 10) / 10,
        melhor_desempenho: melhorDesempenho,
        precisam_atencao: precisamAtencao,
      }
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas da turma:', err)
      return null
    }
  }

  return {
    turmas,
    loading,
    error,
    refetch: fetchTurmas,
    buscarAlunosTurma,
    buscarEstatisticasTurma,
  }
}

