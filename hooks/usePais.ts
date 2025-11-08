// Hook para buscar dados dos filhos e gerenciar tarefas
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Filho {
  id: string
  aluno_id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  pontos: number
  moedas: number
}

export interface ProgressoFilho {
  tempo_estudo_minutos: number
  licoes_completadas: number
  media_acertos: number
  progresso_por_materia: Array<{
    materia_id: string
    materia_nome: string
    progresso: number
  }>
}

export interface TarefaPais {
  id: string
  descricao: string
  tipo: 'licoes' | 'tempo' | 'pontos' | 'personalizada'
  meta_valor: number
  unidade: string | null
  progresso_atual: number
  concluida: boolean
  recompensa: string | null
  data_limite: string | null
  semana_inicio: string | null
}

export function usePais() {
  const { user } = useAuth()
  const [filhos, setFilhos] = useState<Filho[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchFilhos()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchFilhos = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar relação aluno_pais onde o usuário é o pai
      const { data: relacoes, error: errRelacoes } = await supabase
        .from('aluno_pais')
        .select('aluno_id')
        .eq('pais_id', user.id)

      if (errRelacoes) throw errRelacoes

      if (!relacoes || relacoes.length === 0) {
        setFilhos([])
        return
      }

      const alunosIds = relacoes.map((r) => r.aluno_id)

      // 2. Buscar perfis dos filhos
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, username, name as full_name, avatar_url, role')
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
          username: u.username,
          full_name: u.name || u.full_name,
          avatar_url: u.avatar_url
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

      // 4. Combinar dados
      const filhosCompletos: Filho[] = (perfis || []).map((perfil) => {
        const dadosAluno = dadosAlunos?.find((da) => da.id === perfil.id)

        return {
          id: perfil.id,
          aluno_id: perfil.id,
          username: perfil.username,
          full_name: perfil.full_name,
          avatar_url: perfil.avatar_url,
          pontos: dadosAluno?.pontos || 0,
          moedas: dadosAluno?.moedas || 0,
        }
      })

      setFilhos(filhosCompletos)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar filhos:', err)
    } finally {
      setLoading(false)
    }
  }

  const buscarProgressoFilho = async (alunoId: string): Promise<ProgressoFilho | null> => {
    if (!user) return null

    try {
      // Calcular início da semana (domingo)
      const hoje = new Date()
      const diaSemana = hoje.getDay()
      const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
      const domingo = new Date(hoje)
      domingo.setDate(hoje.getDate() - diasAteDomingo)
      domingo.setHours(0, 0, 0, 0)
      const semanaInicio = domingo.toISOString().split('T')[0]

      // 1. Buscar progresso semanal
      const { data: progressoSemanal, error: errProgresso } = await supabase
        .from('progresso_semanal')
        .select('tempo_estudo_minutos, licoes_completadas, pontos_ganhos')
        .eq('aluno_id', alunoId)
        .eq('semana_inicio', semanaInicio)
        .single()

      if (errProgresso && errProgresso.code !== 'PGRST116') {
        // PGRST116 = nenhum resultado encontrado
        throw errProgresso
      }

      // 2. Calcular média de acertos (buscar respostas da semana)
      const inicioSemana = new Date(semanaInicio)
      const { data: respostas, error: errRespostas } = await supabase
        .from('respostas_aluno')
        .select('correta')
        .eq('aluno_id', alunoId)
        .gte('created_at', inicioSemana.toISOString())

      if (errRespostas) throw errRespostas

      const totalRespostas = respostas?.length || 0
      const acertos = respostas?.filter((r) => r.correta).length || 0
      const mediaAcertos = totalRespostas > 0 ? (acertos / totalRespostas) * 100 : 0

      // 3. Buscar progresso por matéria (lições concluídas por matéria)
      const { data: materias, error: errMaterias } = await supabase
        .from('materias')
        .select('id, nome')
        .eq('ativo', true)

      if (errMaterias) throw errMaterias

      const progressoPorMateria = await Promise.all(
        (materias || []).map(async (materia) => {
          // Buscar trilhas da matéria
          const { data: trilhas, error: errTrilhas } = await supabase
            .from('trilhas')
            .select('id')
            .eq('materia_id', materia.id)

          if (errTrilhas) throw errTrilhas

          const trilhasIds = trilhas?.map((t) => t.id) || []

          if (trilhasIds.length === 0) {
            return {
              materia_id: materia.id,
              materia_nome: materia.nome,
              progresso: 0,
            }
          }

          // Buscar total de lições da matéria
          const { count: totalLicoes, error: errTotal } = await supabase
            .from('licoes')
            .select('id', { count: 'exact', head: true })
            .in('trilha_id', trilhasIds)

          if (errTotal) throw errTotal

          // Buscar lições concluídas do aluno nesta matéria
          const { data: progressoLicoes, error: errProgresso } = await supabase
            .from('progresso_licoes')
            .select('licao_id')
            .eq('aluno_id', alunoId)
            .eq('status', 'concluida')

          if (errProgresso) throw errProgresso

          const licoesConcluidasIds = progressoLicoes?.map((p) => p.licao_id) || []

          if (licoesConcluidasIds.length === 0) {
            return {
              materia_id: materia.id,
              materia_nome: materia.nome,
              progresso: 0,
            }
          }

          // Buscar lições concluídas que pertencem a esta matéria
          const { data: licoesConcluidas, error: errLicoes } = await supabase
            .from('licoes')
            .select('id, trilha_id')
            .in('id', licoesConcluidasIds)
            .in('trilha_id', trilhasIds)

          if (errLicoes) throw errLicoes

          const total = totalLicoes || 0
          const concluidas = licoesConcluidas?.length || 0
          const progresso = total > 0 ? (concluidas / total) * 100 : 0

          return {
            materia_id: materia.id,
            materia_nome: materia.nome,
            progresso: Math.round(progresso),
          }
        })
      )

      return {
        tempo_estudo_minutos: progressoSemanal?.tempo_estudo_minutos || 0,
        licoes_completadas: progressoSemanal?.licoes_completadas || 0,
        media_acertos: Math.round(mediaAcertos),
        progresso_por_materia: progressoPorMateria,
      }
    } catch (err: any) {
      console.error('Erro ao buscar progresso do filho:', err)
      return null
    }
  }

  const buscarTarefas = async (alunoId: string): Promise<TarefaPais[]> => {
    if (!user) return []

    try {
      // Calcular início da semana (domingo)
      const hoje = new Date()
      const diaSemana = hoje.getDay()
      const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
      const domingo = new Date(hoje)
      domingo.setDate(hoje.getDate() - diasAteDomingo)
      domingo.setHours(0, 0, 0, 0)
      const semanaInicio = domingo.toISOString().split('T')[0]

      const { data: tarefas, error: err } = await supabase
        .from('tarefas_pais')
        .select('*')
        .eq('aluno_id', alunoId)
        .eq('pais_id', user.id)
        .eq('semana_inicio', semanaInicio)
        .order('created_at', { ascending: false })

      if (err) throw err

      return tarefas || []
    } catch (err: any) {
      console.error('Erro ao buscar tarefas:', err)
      return []
    }
  }

  const criarTarefa = async (
    alunoId: string,
    descricao: string,
    tipo: 'licoes' | 'tempo' | 'pontos' | 'personalizada',
    metaValor: number,
    unidade: string | null,
    recompensa: string | null,
    dataLimite: string | null
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // Calcular início da semana (domingo)
      const hoje = new Date()
      const diaSemana = hoje.getDay()
      const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
      const domingo = new Date(hoje)
      domingo.setDate(hoje.getDate() - diasAteDomingo)
      domingo.setHours(0, 0, 0, 0)
      const semanaInicio = domingo.toISOString().split('T')[0]

      const { error: err } = await supabase.from('tarefas_pais').insert({
        aluno_id: alunoId,
        pais_id: user.id,
        descricao,
        tipo,
        meta_valor: metaValor,
        unidade,
        progresso_atual: 0,
        concluida: false,
        recompensa,
        data_limite: dataLimite,
        semana_inicio: semanaInicio,
      })

      if (err) throw err
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    filhos,
    loading,
    error,
    refetch: fetchFilhos,
    buscarProgressoFilho,
    buscarTarefas,
    criarTarefa,
  }
}

