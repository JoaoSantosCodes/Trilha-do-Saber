'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import PageLoading from '@/components/PageLoading'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'

interface ProgressoDetalhado {
  materia: string
  licoes_completadas: number
  total_licoes: number
  media_acertos: number
  ultima_atividade: string | null
}

export default function AlunoDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const alunoId = params.id as string
  const { user } = useAuth()
  const [aluno, setAluno] = useState<any>(null)
  const [progressoDetalhado, setProgressoDetalhado] = useState<ProgressoDetalhado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (alunoId && user) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alunoId, user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Buscar perfil do aluno
      // Tentar users primeiro, depois profiles (fallback)
      let perfil: any = null
      let errPerfil: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url, role')
        .eq('id', alunoId)
        .eq('role', 'student')
        .single()

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('id', alunoId)
          .eq('role', 'aluno')
          .single()
        perfil = profilesResult.data
        errPerfil = profilesResult.error
      } else {
        perfil = usersResult.data ? {
          id: usersResult.data.id,
          full_name: usersResult.data.name || null,
          username: usersResult.data.name?.split(' ')[0] || null,
          avatar_url: usersResult.data.avatar_url || null
        } : null
        errPerfil = usersResult.error
      }

      if (errPerfil && !errPerfil.message?.includes('No rows')) throw errPerfil
      if (!perfil) throw new Error('Aluno não encontrado')

      // 2. Buscar dados do aluno
      // Tentar students primeiro, depois alunos (fallback)
      let dadosAluno: any = null
      let errAluno: any = null
      
      const studentsResult = await supabase
        .from('students')
        .select('total_points as pontos')
        .eq('user_id', alunoId)
        .single()

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .select('pontos, moedas')
          .eq('id', alunoId)
          .single()
        dadosAluno = alunosResult.data
        errAluno = alunosResult.error
      } else {
        dadosAluno = studentsResult.data ? {
          pontos: studentsResult.data.pontos || 0,
          moedas: 0 // students não tem moedas
        } : null
        errAluno = studentsResult.error
      }

      if (errAluno && !errAluno.message?.includes('No rows')) throw errAluno

      setAluno({
        ...perfil,
        ...dadosAluno,
      })

      // 3. Buscar progresso por matéria
      const { data: materias, error: errMaterias } = await supabase
        .from('materias')
        .select('id, nome')

      if (errMaterias) throw errMaterias

      const progressoPorMateria: ProgressoDetalhado[] = await Promise.all(
        (materias || []).map(async (materia) => {
          // Buscar trilhas da matéria
          const { data: trilhas, error: errTrilhas } = await supabase
            .from('trilhas')
            .select('id')
            .eq('materia_id', materia.id)

          if (errTrilhas) throw errTrilhas

          const trilhasIds = (trilhas || []).map((t) => t.id)

          if (trilhasIds.length === 0) {
            return {
              materia: materia.nome,
              licoes_completadas: 0,
              total_licoes: 0,
              media_acertos: 0,
              ultima_atividade: null,
            }
          }

          // Buscar lições das trilhas
          const { data: licoes, error: errLicoes } = await supabase
            .from('licoes')
            .select('id')
            .in('trilha_id', trilhasIds)

          if (errLicoes) throw errLicoes

          const totalLicoes = licoes?.length || 0

          // Buscar progresso das lições
          const { data: progresso, error: errProgresso } = await supabase
            .from('progresso_licoes')
            .select('status, acertos, erros, data_conclusao')
            .eq('aluno_id', alunoId)
            .in(
              'licao_id',
              (licoes || []).map((l) => l.id)
            )

          if (errProgresso) throw errProgresso

          const licoesCompletadas = progresso?.filter((p) => p.status === 'concluida').length || 0
          const totalAcertos = progresso?.reduce((acc, p) => acc + p.acertos, 0) || 0
          const totalRespostas = progresso?.reduce((acc, p) => acc + p.acertos + p.erros, 0) || 0
          const mediaAcertos = totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0

          // Buscar última atividade
          const ultimaAtividade = progresso
            ?.filter((p) => p.data_conclusao)
            .sort((a, b) => (b.data_conclusao || '').localeCompare(a.data_conclusao || ''))[0]
            ?.data_conclusao || null

          return {
            materia: materia.nome,
            licoes_completadas: licoesCompletadas,
            total_licoes: totalLicoes,
            media_acertos: Math.round(mediaAcertos),
            ultima_atividade: ultimaAtividade,
          }
        })
      )

      setProgressoDetalhado(progressoPorMateria)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao carregar dados do aluno:', err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return '??'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <Header title="Detalhes do Aluno" />
        <PageLoading message="Carregando dados do aluno..." />
      </div>
    )
  }

  if (error || !aluno) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <Header title="Erro" />
        <EmptyState
          icon="error"
          title={error || 'Aluno não encontrado'}
          description="Não foi possível carregar os dados do aluno. Tente novamente mais tarde."
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/95 p-3 sm:p-4 pb-2 backdrop-blur-sm justify-between safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
          Detalhes do Aluno
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        {/* Aluno Info */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            {aluno.avatar_url ? (
              <Image
                src={aluno.avatar_url}
                alt={aluno.full_name || aluno.username || 'Aluno'}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                width={64}
                height={64}
                unoptimized
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center text-background-dark text-lg sm:text-xl font-bold shrink-0">
                {getInitials(aluno.full_name || aluno.username)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-base sm:text-xl font-bold truncate">{aluno.full_name || aluno.username || 'Aluno'}</h2>
              <p className="text-gray-400 text-xs sm:text-sm truncate">@{aluno.username || 'aluno'}</p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-1 rounded-lg bg-white/5 p-2.5 sm:p-3">
              <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Pontos</p>
              <p className="text-white text-base sm:text-lg font-bold">{aluno.pontos || 0}</p>
            </div>
            <div className="flex-1 rounded-lg bg-white/5 p-2.5 sm:p-3">
              <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Moedas</p>
              <p className="text-white text-base sm:text-lg font-bold">{aluno.moedas || 0}</p>
            </div>
          </div>
        </div>

        {/* Progresso por Matéria */}
        <div>
          <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Progresso por Matéria</h3>
          <div className="flex flex-col gap-3 sm:gap-4">
            {progressoDetalhado.map((progresso, index) => (
              <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                  <h4 className="text-white text-sm sm:text-base font-semibold truncate flex-1 min-w-0">{progresso.materia}</h4>
                  <span className="text-primary text-xs sm:text-sm font-bold shrink-0">
                    {progresso.media_acertos}% acertos
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="text-gray-400 text-[10px] sm:text-xs">
                      {progresso.licoes_completadas} de {progresso.total_licoes} lições
                    </span>
                    <span className="text-white text-[10px] sm:text-xs font-semibold">
                      {progresso.total_licoes > 0
                        ? Math.round((progresso.licoes_completadas / progresso.total_licoes) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-primary h-1.5 sm:h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          progresso.total_licoes > 0
                            ? (progresso.licoes_completadas / progresso.total_licoes) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                {progresso.ultima_atividade && (
                  <p className="text-gray-500 text-[10px] sm:text-xs">
                    Última atividade: {new Date(progresso.ultima_atividade).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

