'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { usePais, Filho, ProgressoFilho, TarefaPais } from '@/hooks/usePais'
import { useConquistas } from '@/hooks/useConquistas'

export default function PainelPaisPage() {
  const router = useRouter()
  const { filhos, loading: loadingFilhos, buscarProgressoFilho, buscarTarefas } = usePais()
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [view, setView] = useState<'overview' | 'tasks'>('overview')
  const [progresso, setProgresso] = useState<ProgressoFilho | null>(null)
  const [tarefas, setTarefas] = useState<TarefaPais[]>([])
  const [loadingProgresso, setLoadingProgresso] = useState(false)
  const { conquistas, loading: loadingConquistas } = useConquistas(selectedChild || '')

  // Selecionar primeiro filho quando filhos carregarem
  useEffect(() => {
    if (filhos.length > 0 && !selectedChild) {
      setSelectedChild(filhos[0].id)
    }
  }, [filhos, selectedChild])

  // Buscar progresso e tarefas quando filho selecionado mudar
  useEffect(() => {
    if (selectedChild) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChild])

  const loadData = async () => {
    if (!selectedChild) return

    setLoadingProgresso(true)
    const [progressoData, tarefasData] = await Promise.all([
      buscarProgressoFilho(selectedChild),
      buscarTarefas(selectedChild),
    ])
    setProgresso(progressoData)
    setTarefas(tarefasData)
    setLoadingProgresso(false)
  }

  const currentChild = filhos.find((c) => c.id === selectedChild)
  const currentTasks = view === 'tasks' ? tarefas : tarefas.filter((t) => !t.concluida)

  // Converter tempo de minutos para horas e minutos
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    if (horas > 0) {
      return `${horas}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loadingFilhos) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <Header title="Painel dos Pais" />
        <PageLoading message="Carregando dados dos filhos..." />
      </div>
    )
  }

  if (filhos.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <Header title="Painel dos Pais" />
        <EmptyState
          icon="child_care"
          title="Nenhum filho cadastrado"
          description="Adicione um filho ao seu perfil para começar a acompanhar o progresso."
        />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">menu</span>
          </button>
        </div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Painel dos Pais
        </h1>
        <div className="flex w-12 items-center justify-end gap-2">
          <button
            onClick={() => router.push('/pais/comunicados')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 relative"
          >
            <span className="material-symbols-outlined text-white text-2xl">mail</span>
          </button>
          <button
            onClick={() => router.push('/pais/perfil')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span className="material-symbols-outlined text-white text-2xl">
              account_circle
            </span>
          </button>
        </div>
      </div>

      {/* Child Selection Chips */}
      <div className="flex gap-3 px-4 py-2 overflow-x-auto">
        {filhos.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full pl-4 pr-4 transition-colors ${
              selectedChild === child.id
                ? 'bg-primary'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <p
              className={`text-sm font-bold leading-normal ${
                selectedChild === child.id
                  ? 'text-background-dark'
                  : 'text-white font-medium'
              }`}
            >
              {child.full_name || child.username || 'Filho'}
            </p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-4 pb-2 border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setView('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              view === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setView('tasks')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              view === 'tasks'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tarefas
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {/* Weekly Summary */}
          <section>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
              Resumo Semanal
            </h2>
            {loadingProgresso ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-4xl text-white">
                  refresh
                </span>
              </div>
            ) : progresso ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      schedule
                    </span>
                    <p className="text-gray-300 text-base font-medium leading-normal">
                      Tempo de Estudo
                    </p>
                  </div>
                  <p className="text-white tracking-light text-3xl font-bold leading-tight">
                    {formatarTempo(progresso.tempo_estudo_minutos)}
                  </p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      task_alt
                    </span>
                    <p className="text-gray-300 text-base font-medium leading-normal">
                      Lições Completadas
                    </p>
                  </div>
                  <p className="text-white tracking-light text-3xl font-bold leading-tight">
                    {progresso.licoes_completadas} Lições
                  </p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white/5 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      percent
                    </span>
                    <p className="text-gray-300 text-base font-medium leading-normal">
                      Média de Acertos
                    </p>
                  </div>
                  <p className="text-white tracking-light text-3xl font-bold leading-tight">
                    {progresso.media_acertos}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nenhum dado de progresso disponível ainda.
              </div>
            )}
          </section>

          {/* Tasks Section (only in tasks view or overview) */}
          {view === 'tasks' && (
            <section>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                Tarefas da Semana
              </h2>
              <div className="rounded-xl bg-white/5 p-4 space-y-4">
                {currentTasks.length > 0 ? (
                  currentTasks.map((task) => (
                    <div key={task.id}>
                      {task.concluida ? (
                        <div className="flex flex-col gap-3 rounded-lg bg-green-500/20 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                              <span className="material-symbols-outlined text-background-dark text-xl font-bold">
                                check
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-bold text-white">Concluída!</p>
                              <p className="text-sm font-medium text-gray-300">{task.descricao}</p>
                            </div>
                          </div>
                          {task.recompensa && (
                            <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                              <span className="material-symbols-outlined text-amber-400 text-xl">
                                emoji_events
                              </span>
                              <p className="text-sm text-white">
                                Recompensa: <span className="font-bold">{task.recompensa}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-white">{task.descricao}</p>
                            <p className="text-sm font-medium text-gray-300">
                              {task.progresso_atual}/{task.meta_valor}
                              {task.unidade && ` ${task.unidade}`}
                            </p>
                          </div>
                          <div className="h-3 w-full rounded-full bg-gray-700">
                            <div
                              className={`h-3 rounded-full ${
                                task.progresso_atual / task.meta_valor < 0.5
                                  ? 'bg-amber-400'
                                  : 'bg-primary'
                              }`}
                              style={{
                                width: `${Math.min((task.progresso_atual / task.meta_valor) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma tarefa definida para esta semana.
                  </div>
                )}
                <button
                  onClick={() => router.push('/pais/tarefas/nova')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-600 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                >
                  <span className="material-symbols-outlined">add</span>
                  Definir Nova Tarefa
                </button>
              </div>
            </section>
          )}

          {/* Progress by Subject */}
          <section>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
              Progresso por Matéria
            </h2>
            {progresso && progresso.progresso_por_materia.length > 0 ? (
              <div className="rounded-xl p-4 bg-white/5 space-y-4">
                {progresso.progresso_por_materia.map((materia) => {
                  const menorProgresso = Math.min(
                    ...progresso.progresso_por_materia.map((m) => m.progresso)
                  )
                  const precisaFocar = materia.progresso === menorProgresso && materia.progresso < 70

                  return (
                    <div key={materia.materia_id} className="flex flex-col gap-1.5">
                      <p className="text-sm font-medium text-white">{materia.materia_nome}</p>
                      <div className="h-3 w-full rounded-full bg-gray-700">
                        <div
                          className={`h-3 rounded-full ${
                            precisaFocar ? 'bg-amber-400' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(materia.progresso, 100)}%` }}
                        />
                      </div>
                      {precisaFocar && (
                        <p className="text-xs text-amber-400">Área para focar</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl p-4 bg-white/5 text-center text-gray-400">
                Nenhum progresso por matéria disponível ainda.
              </div>
            )}
          </section>

          {/* Recent Achievements */}
          <section>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
              Conquistas Recentes
            </h2>
            {loadingConquistas ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-4xl text-white">
                  refresh
                </span>
              </div>
            ) : conquistas && conquistas.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {conquistas.slice(0, 4).map((conquista) => (
                  <div
                    key={conquista.id}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 bg-white/5 aspect-square"
                  >
                    <span
                      className={`material-symbols-outlined text-5xl ${
                        conquista.desbloqueada ? 'text-amber-400' : 'text-gray-500'
                      }`}
                    >
                      {conquista.icone || 'emoji_events'}
                    </span>
                    {conquista.desbloqueada && (
                      <p className="text-white text-center text-sm font-medium">
                        {conquista.nome}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 bg-white/5 text-center text-gray-400">
                Nenhuma conquista desbloqueada ainda.
              </div>
            )}
          </section>

          {/* Friends Activity - Removido por enquanto, pode ser implementado depois */}
        </div>
      </main>
    </div>
  )
}

