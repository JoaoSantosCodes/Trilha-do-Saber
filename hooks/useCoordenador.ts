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
          // Tentar fallback mesmo em caso de erro RLS
          console.warn('Erro ao buscar professores (tentando fallback):', teachersResult.error)
          try {
            const professoresResult = await supabase
              .from('professores')
              .select('*', { count: 'exact', head: true })
            if (!professoresResult.error) {
              totalProfessores = professoresResult.count || 0
              const professoresAtivosResult = await supabase
                .from('professores')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'ativo')
              professoresAtivos = professoresAtivosResult.count || 0
            } else {
              totalProfessores = 0
              professoresAtivos = 0
            }
          } catch (fallbackError) {
            console.warn('Erro no fallback de professores:', fallbackError)
            totalProfessores = 0
            professoresAtivos = 0
          }
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
          // Tentar fallback mesmo em caso de erro RLS
          console.warn('Erro ao buscar alunos (tentando fallback):', studentsResult.error)
          try {
            const alunosResult = await supabase
              .from('alunos')
              .select('*', { count: 'exact', head: true })
            if (!alunosResult.error) {
              totalAlunos = alunosResult.count || 0
            } else {
              totalAlunos = 0
            }
          } catch (fallbackError) {
            console.warn('Erro no fallback de alunos:', fallbackError)
            totalAlunos = 0
          }
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
      // Tentar classrooms primeiro, depois turmas (fallback)
      let turmas: any[] = []
      
      const classroomsResult = await supabase
        .from('classrooms')
        .select('*, teacher_id!teachers(user_id), teacher_id!users(name, email)')
        .order('name', { ascending: true })

      if (classroomsResult.error) {
        // Se erro for "does not exist", tentar fallback
        if (classroomsResult.error.message?.includes('does not exist') || classroomsResult.error.code === '42P01') {
          const turmasResult = await supabase
            .from('turmas')
            .select('*, professor_id!profiles(full_name, username)')
            .order('nome', { ascending: true })
          
          if (turmasResult.error) {
            throw turmasResult.error
          }
          turmas = turmasResult.data || []
        } else {
          // Outro erro (RLS, etc) - tentar fallback mesmo assim
          console.warn('Erro ao buscar classrooms (tentando fallback):', classroomsResult.error)
          try {
            const turmasResult = await supabase
              .from('turmas')
              .select('*, professor_id!profiles(full_name, username)')
              .order('nome', { ascending: true })
            
            if (!turmasResult.error) {
              turmas = turmasResult.data || []
            } else {
              throw turmasResult.error
            }
          } catch (fallbackError) {
            console.error('Erro no fallback de turmas:', fallbackError)
            return []
          }
        }
      } else {
        turmas = classroomsResult.data || []
      }

      return turmas?.map((turma: any) => {
        // Para classrooms, usar teacher_id!users, para turmas usar professor_id!profiles
        const teacherData = turma.teacher_id?.users || turma.teacher_id || turma.professor_id
        const professor = teacherData?.name || teacherData?.full_name || teacherData?.username || 'Sem professor'
        
        return {
          id: turma.id,
          nome: turma.name || turma.nome,
          codigo: turma.code || turma.codigo || '',
          professor: professor,
          alunos: 0, // Será calculado separadamente
          serie: turma.grade_level?.toString() || turma.grade?.toString() || turma.serie || '',
          periodo: turma.shift || turma.periodo || '',
          ativo: turma.is_active !== undefined ? turma.is_active : (turma.ativo !== undefined ? turma.ativo : true),
        }
      }) || []
    } catch (err: any) {
      console.error('Erro ao buscar turmas:', err)
      return []
    }
  }

  const buscarProfessores = async () => {
    try {
      // Tentar teachers primeiro, depois professores (fallback)
      let professores: any[] = []
      
      // Buscar teachers sem join primeiro
      const teachersResult = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })

      if (teachersResult.error) {
        // Se erro for "does not exist", tentar fallback
        if (teachersResult.error.message?.includes('does not exist') || teachersResult.error.code === '42P01') {
          const professoresResult = await supabase
            .from('professores')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (professoresResult.error) {
            throw professoresResult.error
          }
          professores = professoresResult.data || []
        } else {
          // Outro erro (RLS, etc) - tentar fallback mesmo assim
          console.warn('Erro ao buscar teachers (tentando fallback):', teachersResult.error)
          try {
            const professoresResult = await supabase
              .from('professores')
              .select('*, id!profiles(full_name, username, avatar_url)')
              .order('created_at', { ascending: false })
            
            if (!professoresResult.error) {
              professores = professoresResult.data || []
            } else {
              throw professoresResult.error
            }
          } catch (fallbackError) {
            console.error('Erro no fallback de professores:', fallbackError)
            return []
          }
        }
      } else {
        professores = teachersResult.data || []
        
        // Buscar dados dos usuários separadamente
        if (professores.length > 0) {
          const userIds = professores.map((p: any) => p.user_id).filter(Boolean)
          if (userIds.length > 0) {
            const usersResult = await supabase
              .from('users')
              .select('id, name, email, avatar_url')
              .in('id', userIds)
            
            if (!usersResult.error && usersResult.data) {
              const usersMap = new Map(usersResult.data.map((u: any) => [u.id, u]))
              professores = professores.map((p: any) => ({
                ...p,
                user_data: usersMap.get(p.user_id)
              }))
            }
          }
        }
      }

      // Buscar turmas de cada professor
      const professoresComTurmas = await Promise.all(
        professores.map(async (prof: any) => {
          const teacherId = prof.user_id || prof.id
          
          // Tentar classrooms primeiro, depois turmas (fallback)
          const { data: classrooms, error: errClassrooms } = await supabase
            .from('classrooms')
            .select('name')
            .eq('teacher_id', teacherId)
            .eq('is_active', true)

          let turmasNomes = 'Sem turmas'
          if (!errClassrooms && classrooms && classrooms.length > 0) {
            turmasNomes = classrooms.map((c: any) => c.name).join(', ')
          } else {
            // Fallback para turmas
            const { data: turmas, error: errTurmas } = await supabase
              .from('turmas')
              .select('nome')
              .eq('professor_id', teacherId)
              .eq('ativo', true)

            if (!errTurmas && turmas && turmas.length > 0) {
              turmasNomes = turmas.map((t: any) => t.nome).join(', ')
            }
          }

          // Para teachers, usar user_data, para professores usar dados diretos
          const userData = prof.user_data || prof
          const nome = userData?.name || userData?.full_name || userData?.username || 'Professor'
          const avatar = userData?.avatar_url || ''

          return {
            id: teacherId,
            nome: nome,
            turmas: turmasNomes ? `Turmas: ${turmasNomes}` : 'Sem turmas',
            status: prof.status || 'ativo', // teachers não tem status, considerar ativo
            avatar: avatar,
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
      // Tentar students primeiro, depois alunos (fallback)
      let alunos: any[] = []
      
      const studentsResult = await supabase
        .from('students')
        .select('*, user_id!users(name, email, avatar_url)')
        .order('created_at', { ascending: false })

      if (studentsResult.error) {
        // Se erro for "does not exist", tentar fallback
        if (studentsResult.error.message?.includes('does not exist') || studentsResult.error.code === '42P01') {
          const alunosResult = await supabase
            .from('alunos')
            .select('*, id!profiles(full_name, username, avatar_url)')
            .order('created_at', { ascending: false })
          
          if (alunosResult.error) {
            throw alunosResult.error
          }
          alunos = alunosResult.data || []
        } else {
          // Outro erro (RLS, etc) - tentar fallback mesmo assim
          console.warn('Erro ao buscar students (tentando fallback):', studentsResult.error)
          try {
            const alunosResult = await supabase
              .from('alunos')
              .select('*, id!profiles(full_name, username, avatar_url)')
              .order('created_at', { ascending: false })
            
            if (!alunosResult.error) {
              alunos = alunosResult.data || []
            } else {
              throw alunosResult.error
            }
          } catch (fallbackError) {
            console.error('Erro no fallback de alunos:', fallbackError)
            return []
          }
        }
      } else {
        alunos = studentsResult.data || []
      }

      // Buscar turmas e responsáveis de cada aluno
      const alunosCompletos = await Promise.all(
        alunos.map(async (aluno: any) => {
          // Buscar turma do aluno
          // Para students, usar classroom_students, para alunos usar aluno_turma
          const alunoId = aluno.user_id || aluno.id
          const { data: alunoTurma, error: errTurma } = await supabase
            .from('classroom_students')
            .select('classroom_id, classrooms(name)')
            .eq('student_id', alunoId)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle()

          let turmaNome = 'Sem turma'
          if (alunoTurma?.classrooms) {
            turmaNome = (alunoTurma.classrooms as any)?.name || 'Sem turma'
          } else if (errTurma) {
            // Tentar fallback para aluno_turma
            const alunoTurmaFallback = await supabase
              .from('aluno_turma')
              .select('turma_id, turmas(nome)')
              .eq('aluno_id', alunoId)
              .eq('ativo', true)
              .limit(1)
              .maybeSingle()
            
            if (alunoTurmaFallback.data) {
              turmaNome = (alunoTurmaFallback.data?.turmas as any)?.nome || 'Sem turma'
            }
          }

          // Buscar responsáveis
          // Para students, usar parent_student_relation, para alunos usar aluno_pais
          const studentId = aluno.user_id || aluno.id
          const { data: responsaveis, error: errResponsaveis } = await supabase
            .from('parent_student_relation')
            .select('*')
            .eq('student_id', studentId)
            .limit(1)

          let responsavelNome = 'Sem responsável'
          if (responsaveis && responsaveis.length > 0) {
            const parentData = responsaveis[0].parent_id
            responsavelNome = parentData?.users?.name || parentData?.full_name || 'Sem responsável'
          } else if (errResponsaveis) {
            // Tentar fallback para aluno_pais
            const responsaveisFallback = await supabase
              .from('aluno_pais')
              .select('*')
              .eq('aluno_id', studentId)
              .limit(1)
            
            if (responsaveisFallback.data && responsaveisFallback.data.length > 0) {
              responsavelNome = (responsaveisFallback.data[0].pais_id as any)?.full_name || 'Sem responsável'
            }
          }

          // Para students, usar user_id!users, para alunos usar id!profiles
          const userData = aluno.user_id || aluno.id
          const nome = userData?.name || userData?.full_name || userData?.username || 'Aluno'
          const avatar = userData?.avatar_url || ''

          return {
            id: studentId,
            nome: nome,
            turma: turmaNome ? `Turma: ${turmaNome}` : 'Sem turma',
            responsavel: `Responsável: ${responsavelNome}`,
            avatar: avatar,
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

