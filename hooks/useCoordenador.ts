// Hook para buscar estatísticas e gerenciar recursos do coordenador
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface EstatisticasCoordenador {
  total_professores: number
  total_turmas: number
  total_alunos: number
  professores_ativos: number
  turmas_ativas: number
  alunos_ativos: number
}

export interface DadosEngajamento {
  semana: string
  licoes_completadas: number
  altura_percentual: number
  atual: boolean
}

export function useCoordenador() {
  const { user } = useAuth()
  const [estatisticas, setEstatisticas] = useState<EstatisticasCoordenador | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchEstatisticas()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchEstatisticas = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar total de professores
      // Tentar teachers primeiro, depois professores (fallback)
      let totalProfessores = 0
      let professoresAtivos = 0
      
      const teachersResult = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })

      if (teachersResult.error) {
        // Se erro for "does not exist", tentar fallback
        if (teachersResult.error.message?.includes('does not exist') || teachersResult.error.code === '42P01') {
          const professoresResult = await supabase
            .from('professores')
            .select('*', { count: 'exact', head: true })
          totalProfessores = professoresResult.count || 0
          
          const professoresAtivosResult = await supabase
            .from('professores')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ativo')
          professoresAtivos = professoresAtivosResult.count || 0
        } else {
          // Outro erro (RLS, etc) - logar mas não quebrar
          console.warn('Erro ao buscar professores:', teachersResult.error)
          totalProfessores = 0
          professoresAtivos = 0
        }
      } else {
        totalProfessores = teachersResult.count || 0
        professoresAtivos = totalProfessores // teachers não tem status, considerar todos ativos
      }

      // 3. Buscar total de turmas
      const { count: totalTurmas, error: errTurmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })

      if (errTurmas) throw errTurmas

      // 4. Buscar turmas ativas
      const { count: turmasAtivas, error: errTurmasAtivas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)

      if (errTurmasAtivas) throw errTurmasAtivas

      // 5. Buscar total de alunos
      // Tentar students primeiro, depois alunos (fallback)
      let totalAlunos = 0
      
      const studentsResult = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      if (studentsResult.error) {
        // Se erro for "does not exist", tentar fallback
        if (studentsResult.error.message?.includes('does not exist') || studentsResult.error.code === '42P01') {
          const alunosResult = await supabase
            .from('alunos')
            .select('*', { count: 'exact', head: true })
          totalAlunos = alunosResult.count || 0
        } else {
          // Outro erro (RLS, etc) - logar mas não quebrar
          console.warn('Erro ao buscar alunos:', studentsResult.error)
          totalAlunos = 0
        }
      } else {
        totalAlunos = studentsResult.count || 0
      }

      // 6. Buscar alunos ativos (que estão em turmas ativas)
      const { data: alunoTurmas, error: errAlunoTurmas } = await supabase
        .from('aluno_turma')
        .select('aluno_id')
        .eq('ativo', true)

      if (errAlunoTurmas) throw errAlunoTurmas

      const alunosAtivosIds = [...new Set(alunoTurmas?.map((at) => at.aluno_id) || [])]
      const alunosAtivos = alunosAtivosIds.length

      setEstatisticas({
        total_professores: totalProfessores || 0,
        total_turmas: totalTurmas || 0,
        total_alunos: totalAlunos || 0,
        professores_ativos: professoresAtivos || 0,
        turmas_ativas: turmasAtivas || 0,
        alunos_ativos: alunosAtivos,
      })
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar estatísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const buscarEngajamento = async (semanas: number = 6): Promise<DadosEngajamento[]> => {
    if (!user) return []

    try {
      const dados: DadosEngajamento[] = []
      const hoje = new Date()

      for (let i = semanas - 1; i >= 0; i--) {
        // Calcular início da semana (domingo)
        const dataSemana = new Date(hoje)
        dataSemana.setDate(hoje.getDate() - i * 7)
        const diaSemana = dataSemana.getDay()
        const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana
        const domingo = new Date(dataSemana)
        domingo.setDate(dataSemana.getDate() - diasAteDomingo)
        domingo.setHours(0, 0, 0, 0)
        const semanaInicio = domingo.toISOString().split('T')[0]

        // Buscar lições completadas nesta semana
        const { data: progressoSemanal, error: errProgresso } = await supabase
          .from('progresso_semanal')
          .select('licoes_completadas')
          .eq('semana_inicio', semanaInicio)

        if (errProgresso && errProgresso.code !== 'PGRST116') {
          throw errProgresso
        }

        const totalLicoes = progressoSemanal?.reduce((acc, p) => acc + (p.licoes_completadas || 0), 0) || 0

        // Calcular altura percentual (normalizar para 0-100)
        // Assumindo que 100 lições = 100%
        const alturaPercentual = Math.min((totalLicoes / 100) * 100, 100)

        const isAtual = i === 0

        dados.push({
          semana: isAtual ? 'Atual' : `Sem ${semanas - i}`,
          licoes_completadas: totalLicoes,
          altura_percentual: Math.round(alturaPercentual),
          atual: isAtual,
        })
      }

      return dados
    } catch (err: any) {
      console.error('Erro ao buscar engajamento:', err)
      return []
    }
  }

  const enviarComunicado = async (
    titulo: string,
    conteudo: string,
    tipo: 'geral' | 'turma' | 'escola',
    turmaId?: string
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error: err } = await supabase.from('comunicados').insert({
        coordenador_id: user.id,
        titulo,
        conteudo,
        tipo,
        turma_id: turmaId || null,
        enviado_em: new Date().toISOString(),
      })

      if (err) throw err
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const buscarTurmas = async () => {
    try {
      const { data: turmas, error: err } = await supabase
        .from('turmas')
        .select('*, professor_id!profiles(full_name, username)')
        .order('nome', { ascending: true })

      if (err) throw err

      return turmas?.map((turma: any) => ({
        id: turma.id,
        nome: turma.nome,
        codigo: turma.codigo,
        professor: turma.professor_id?.full_name || turma.professor_id?.username || 'Sem professor',
        alunos: 0, // Será calculado separadamente
        serie: turma.serie,
        periodo: turma.periodo,
        ativo: turma.ativo,
      })) || []
    } catch (err: any) {
      console.error('Erro ao buscar turmas:', err)
      return []
    }
  }

  const buscarProfessores = async () => {
    try {
      const { data: professores, error: err } = await supabase
        .from('professores')
        .select('*, id!profiles(full_name, username, avatar_url)')
        .order('created_at', { ascending: false })

      if (err) throw err

      // Buscar turmas de cada professor
      const professoresComTurmas = await Promise.all(
        (professores || []).map(async (prof: any) => {
          const { data: turmas, error: errTurmas } = await supabase
            .from('turmas')
            .select('nome')
            .eq('professor_id', prof.id)
            .eq('ativo', true)

          const turmasNomes = turmas?.map((t) => t.nome).join(', ') || 'Sem turmas'

          return {
            id: prof.id,
            nome: prof.id?.full_name || prof.id?.username || 'Professor',
            turmas: turmasNomes ? `Turmas: ${turmasNomes}` : 'Sem turmas',
            status: prof.status,
            avatar: prof.id?.avatar_url || '',
          }
        })
      )

      return professoresComTurmas
    } catch (err: any) {
      console.error('Erro ao buscar professores:', err)
      return []
    }
  }

  const buscarAlunos = async () => {
    try {
      const { data: alunos, error: err } = await supabase
        .from('alunos')
        .select('*, id!profiles(full_name, username, avatar_url)')
        .order('created_at', { ascending: false })

      if (err) throw err

      // Buscar turmas e responsáveis de cada aluno
      const alunosCompletos = await Promise.all(
        (alunos || []).map(async (aluno: any) => {
          // Buscar turma do aluno
          const { data: alunoTurma, error: errTurma } = await supabase
            .from('aluno_turma')
            .select('turma_id, turmas(nome)')
            .eq('aluno_id', aluno.id)
            .eq('ativo', true)
            .limit(1)
            .single()

          const turmaNome = (alunoTurma?.turmas as any)?.nome || 'Sem turma'

          // Buscar responsáveis
          const { data: responsaveis, error: errResponsaveis } = await supabase
            .from('aluno_pais')
            .select('pais_id!profiles(full_name)')
            .eq('aluno_id', aluno.id)
            .limit(1)

          const responsavelNome =
            responsaveis && responsaveis.length > 0
              ? (responsaveis[0].pais_id as any)?.full_name || 'Sem responsável'
              : 'Sem responsável'

          return {
            id: aluno.id,
            nome: aluno.id?.full_name || aluno.id?.username || 'Aluno',
            turma: turmaNome ? `Turma: ${turmaNome}` : 'Sem turma',
            responsavel: `Responsável: ${responsavelNome}`,
            avatar: aluno.id?.avatar_url || '',
          }
        })
      )

      return alunosCompletos
    } catch (err: any) {
      console.error('Erro ao buscar alunos:', err)
      return []
    }
  }

  return {
    estatisticas,
    loading,
    error,
    refetch: fetchEstatisticas,
    buscarEngajamento,
    enviarComunicado,
    buscarTurmas,
    buscarProfessores,
    buscarAlunos,
  }
}

