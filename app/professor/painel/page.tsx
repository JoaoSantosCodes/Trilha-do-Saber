'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import StatCard from '@/components/StatCard'
import StudentCard from '@/components/StudentCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useProfessor, TurmaProfessor, AlunoTurma, EstatisticasTurma } from '@/hooks/useProfessor'

export default function ProfessorPainelPage() {
  const router = useRouter()
  const { turmas, loading: loadingTurmas, buscarAlunosTurma, buscarEstatisticasTurma } = useProfessor()
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null)
  const [alunos, setAlunos] = useState<AlunoTurma[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasTurma | null>(null)
  const [loadingAlunos, setLoadingAlunos] = useState(false)

  // Selecionar primeira turma quando turmas carregarem
  useEffect(() => {
    if (turmas.length > 0 && !selectedTurma) {
      setSelectedTurma(turmas[0].id)
    }
  }, [turmas, selectedTurma])

  // Buscar alunos e estatísticas quando turma selecionada mudar
  useEffect(() => {
    if (selectedTurma) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTurma])

  const loadData = async () => {
    if (!selectedTurma) return

    setLoadingAlunos(true)
    const [alunosData, estatisticasData] = await Promise.all([
      buscarAlunosTurma(selectedTurma),
      buscarEstatisticasTurma(selectedTurma),
    ])
    setAlunos(alunosData)
    setEstatisticas(estatisticasData)
    setLoadingAlunos(false)
  }

  const getInitials = (name: string | null) => {
    if (!name) return '??'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (loadingTurmas) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <Header title="Painel do Professor" />
        <PageLoading message="Carregando turmas..." />
      </div>
    )
  }

  if (turmas.length === 0) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <Header title="Painel do Professor" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <span className="material-symbols-outlined text-6xl text-gray-400">school</span>
            <p className="text-white text-lg font-bold">Nenhuma turma cadastrada</p>
            <p className="text-gray-400">Entre em contato com o coordenador para ser atribuído a uma turma.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentTurma = turmas.find((t) => t.id === selectedTurma)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header title="Painel do Professor" />

      {/* Turma Selection */}
      {turmas.length > 1 && (
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {turmas.map((turma) => (
              <button
                key={turma.id}
                onClick={() => setSelectedTurma(turma.id)}
                className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                  selectedTurma === turma.id
                    ? 'bg-primary text-background-dark'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <p className="text-sm font-bold leading-normal">{turma.nome}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Código da Turma */}
      {currentTurma && (
        <div className="px-4 py-3 bg-primary/20 border-b border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Código da Turma</p>
              <p className="text-white text-lg font-bold font-mono">{currentTurma.codigo}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentTurma.codigo)
                alert('Código copiado!')
              }}
              className="p-2 rounded-lg bg-primary/30 hover:bg-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-white">content_copy</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex flex-col gap-6 p-4">
        {/* Visão Geral da Turma */}
        <section>
          <h2 className="text-lg font-semibold leading-tight tracking-tight pb-4 text-text-dark">
            Visão Geral da Turma
          </h2>
          {loadingAlunos ? (
            <LoadingSkeleton type="card" count={3} className="flex flex-col sm:flex-row gap-4" />
          ) : estatisticas ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <StatCard
                icon="trending_up"
                label="Média de Lições/Semana"
                value={estatisticas.media_licoes_semana.toString()}
              />
              <StatCard
                icon="star"
                label="Melhor Desempenho"
                value={estatisticas.melhor_desempenho || 'N/A'}
              />
              <StatCard
                icon="priority_high"
                label="Precisam de Atenção"
                value={`${estatisticas.precisam_atencao} Aluno${estatisticas.precisam_atencao !== 1 ? 's' : ''}`}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Nenhuma estatística disponível ainda.
            </div>
          )}
        </section>

        {/* Mascote */}
        <div className="flex w-full grow py-3 justify-center items-center">
          <div className="w-48 h-48 bg-center bg-no-repeat bg-contain flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-primary">school</span>
          </div>
        </div>

        {/* Lista de Alunos */}
        <section>
          <h2 className="text-lg font-semibold leading-tight tracking-tight pb-4 text-text-dark">
            Lista de Alunos {currentTurma && `- ${currentTurma.nome}`}
          </h2>
          {loadingAlunos ? (
            <LoadingSkeleton type="list" count={5} />
          ) : alunos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {alunos.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => router.push(`/professor/aluno/${aluno.id}`)}
                  className="w-full"
                >
                  <StudentCard
                    student={{
                      id: aluno.id,
                      name: aluno.full_name || aluno.username || 'Aluno',
                      initials: getInitials(aluno.full_name || aluno.username),
                      progress: aluno.progresso_geral,
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="group"
              title="Nenhum aluno cadastrado"
              description="Esta turma ainda não possui alunos cadastrados."
            />
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="sticky bottom-0 w-full p-4 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent">
        <button
          onClick={() => router.push('/professor/tarefas/nova')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 px-6 text-center text-base font-bold text-[#1A1A2E] shadow-lg shadow-primary/30 hover:bg-yellow-500 transition-colors"
        >
          <span className="material-symbols-outlined">add_task</span>
          Atribuir Tarefas para a Turma
        </button>
      </div>
    </div>
  )
}

