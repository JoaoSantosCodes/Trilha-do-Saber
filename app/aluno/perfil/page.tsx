'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Button from '@/components/Button'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { useAluno } from '@/hooks/useAluno'
import { useProgresso } from '@/hooks/useProgresso'
import { useConquistas } from '@/hooks/useConquistas'
import { useAmizades } from '@/hooks/useAmizades'

export default function PerfilAlunoPage() {
  const router = useRouter()
  const { profile, user } = useAuth()
  const { aluno, loading: loadingAluno } = useAluno()
  const { progressoSemanal, loading: loadingProgresso } = useProgresso()
  const { conquistas, loading: loadingConquistas } = useConquistas()
  const { amigos, loading: loadingAmigos } = useAmizades()
  const [view, setView] = useState<'conquistas' | 'trilha' | 'amigos'>('conquistas')

  const loading = loadingAluno || loadingProgresso || loadingConquistas || loadingAmigos

  // Dados do perfil
  const nomeUsuario = profile?.full_name || aluno?.id || 'Aluno'
  const avatarUrl = profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpKkagCxN4u32KivO1yOZJqTQQOgBbmklmUHlj8yXskMCQ-ThFvWuXFl-yvov0bh_0_6z7Dpx0dlxE2FbtRA_gqZPPDRhdoz5dAX_Xff_bhL6qHt9G-5QGQt6GEue4Z2puScuaVgb8ZTwCrjqjVSD7zHHq-j2-yKWRdTtkxEt7JIDvHtHHf-d6xC5MGTH9VLAvCz8Bl2-dg_nERqtbESoyp4pNLKLY4j0iJkTen6tA6fS7sMR_L2VXbjGclgYy7m9O9735P7R7ZtnK"
  const pontos = aluno?.pontos || 0
  const moedas = aluno?.moedas || 0

  // Progresso semanal
  const tempoEstudoMinutos = progressoSemanal?.tempo_estudo_minutos || 0
  const licoesCompletadas = progressoSemanal?.licoes_completadas || 0

  // Gerar dados da semana (mock por enquanto, pode ser melhorado)
  const weekData = useMemo(() => {
    const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    return dias.map((day, index) => {
      // Simular dados baseados no progresso (pode ser melhorado)
      const height = index < licoesCompletadas ? Math.min(20 + index * 10, 90) : 20
      const color = height > 40 ? 'bg-brand-lime' : 'bg-brand-cyan/40'
      return { day, height, color }
    })
  }, [licoesCompletadas])

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-text-dark">
        <Header showBack title="Perfil" />
        <PageLoading message="Carregando perfil..." />
      </div>
    )
  }

  // Cores para bordas dos amigos
  const borderColors = [
    'border-brand-cyan',
    'border-brand-lime',
    'border-brand-pink',
    'border-profile-primary',
    'border-profile-secondary',
  ]

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-text-dark">
      <Header showBack title="Perfil" />

      <div className="flex p-3 sm:p-4">
        <div className="flex w-full flex-col gap-3 sm:gap-4 items-center">
          {/* Avatar e Informações */}
          <div className="flex gap-3 sm:gap-4 flex-col items-center">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 border-3 sm:border-4 border-card-dark shadow-md"
                style={{
                  backgroundImage: `url('${avatarUrl}')`,
                  backgroundColor: aluno?.cor_fundo_perfil || '#E57373',
                }}
                role="img"
                aria-label={`Avatar de ${nomeUsuario}`}
              />
              <button
                onClick={() => router.push('/aluno/perfil/editar')}
                className="absolute bottom-0 right-0 flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 bg-brand-pink rounded-full text-card-dark border-2 border-background-dark hover:bg-brand-pink/90 active:bg-brand-pink/80 transition-colors touch-manipulation"
                aria-label="Editar perfil"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">edit</span>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-center px-2">
                {loading ? 'Carregando...' : nomeUsuario}
              </p>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-profile-secondary text-lg sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <p className="text-profile-secondary text-sm sm:text-base font-bold leading-normal text-center">
                  {pontos.toLocaleString('pt-BR')} Pontos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 sm:px-4 pb-2">
        <div className="flex gap-1 sm:gap-2 border-b border-card-dark overflow-x-auto smooth-scroll">
          <button
            onClick={() => setView('conquistas')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors touch-manipulation whitespace-nowrap ${
              view === 'conquistas'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-text-dark/60 hover:text-text-dark active:text-text-dark'
            }`}
          >
            Conquistas
          </button>
          <button
            onClick={() => setView('trilha')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors touch-manipulation whitespace-nowrap ${
              view === 'trilha'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-text-dark/60 hover:text-text-dark active:text-text-dark'
            }`}
          >
            Trilha
          </button>
          <button
            onClick={() => setView('amigos')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors touch-manipulation whitespace-nowrap ${
              view === 'amigos'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-text-dark/60 hover:text-text-dark active:text-text-dark'
            }`}
          >
            Amigos
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-2 space-y-4 sm:space-y-6 flex-1 overflow-y-auto smooth-scroll">
        {/* View: Conquistas */}
        {view === 'conquistas' && (
          <>
            <div className="bg-card-dark rounded-lg shadow-sm p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] pb-3 sm:pb-4 text-text-dark">
                Minhas Conquistas
              </h3>
              {loadingConquistas ? (
                <LoadingSkeleton type="grid" count={6} className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 sm:gap-4" />
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 sm:gap-4">
                  {conquistas.length > 0 ? (
                    conquistas.map((conquista) => {
                      const gradient = conquista.cor_gradiente || 'from-yellow-300 to-amber-500'
                      return (
                        <div
                          key={conquista.id}
                          className={`flex flex-col gap-2 text-center items-center ${
                            !conquista.desbloqueada ? 'opacity-40' : ''
                          }`}
                        >
                          <div className={`p-2 sm:p-3 rounded-full ${
                            conquista.desbloqueada
                              ? `bg-gradient-to-br ${gradient}`
                              : 'bg-gray-700'
                          }`}>
                            {conquista.desbloqueada ? (
                              <span
                                className="material-symbols-outlined text-3xl sm:text-4xl text-white"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                              >
                                {conquista.icone}
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-2xl sm:text-3xl text-slate-400">
                                lock
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-medium leading-normal text-text-dark text-center">
                            {conquista.nome}
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <EmptyState
                      icon="emoji_events"
                      title="Nenhuma conquista disponível"
                      description="Complete lições para desbloquear conquistas!"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="bg-card-dark rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-dark">
                Meu Progresso na Semana
              </h3>
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-text-dark/80 text-sm font-medium leading-normal">
                  Tempo total de estudo
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="tracking-light text-[32px] font-bold leading-tight truncate text-text-dark">
                    {tempoEstudoMinutos} min
                  </p>
                  {licoesCompletadas > 0 && (
                    <p className="text-brand-lime text-base font-medium leading-normal">
                      {licoesCompletadas} lições
                    </p>
                  )}
                </div>
                <div className="grid min-h-[160px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
                  {weekData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className={`${day.color} w-full rounded-t-lg transition-all`}
                        style={{ height: `${day.height}%` }}
                      />
                      <p className="text-text-dark/70 text-[13px] font-bold leading-normal tracking-[0.015em]">
                        {day.day}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* View: Trilha */}
        {view === 'trilha' && (
          <div className="bg-card-dark rounded-lg shadow-sm p-4 overflow-hidden">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-dark">
              Sua Trilha do Saber
            </h3>
            <div className="mt-4 relative h-48 flex items-center justify-center">
              <svg
                className="absolute w-full h-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 320 192"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="stroke-slate-600"
                  d="M20 160 C 80 160, 60 40, 160 40 S 240 160, 300 160"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <path
                  className="stroke-brand-lime"
                  d="M20 160 C 80 160, 60 40, 130 50"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>
              <div className="relative w-full h-full">
                <div className="absolute bottom-4 left-2 flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500 border-2 border-slate-400">
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      calculate
                    </span>
                  </div>
                  <p className="text-xs font-bold mt-1 text-slate-400 text-center">
                    Reino da<br />Matemática
                  </p>
                </div>
                <div className="absolute top-4 left-[42%] transform -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-lime border-2 border-background-dark shadow-lg">
                    <span
                      className="material-symbols-outlined text-2xl text-green-900"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      science
                    </span>
                  </div>
                  <p className="text-xs font-bold mt-1 text-brand-lime text-center">
                    Reino da<br />Ciência
                  </p>
                </div>
                <div className="absolute bottom-4 right-2 flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600">
                    <span className="material-symbols-outlined text-xl text-slate-400">
                      auto_stories
                    </span>
                  </div>
                  <p className="text-xs font-bold mt-1 text-slate-400 text-center">
                    Reino da<br />Leitura
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <p className="font-medium text-text-dark/80">Progresso total:</p>
              <p className="font-bold text-brand-lime">45%</p>
            </div>
          </div>
        )}

        {/* View: Amigos */}
        {view === 'amigos' && (
          <div className="bg-card-dark rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-dark mb-4">
              {amigos.length > 0 ? 'Companheiros de Jornada' : 'Amigos'}
            </h3>
            {loadingAmigos ? (
              <LoadingSkeleton type="list" count={3} />
            ) : amigos.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pt-2 pb-2 no-scrollbar">
                {amigos.map((friend, index) => (
                  <Link
                    key={friend.id}
                    href={`/aluno/perfil/${friend.username || friend.id}`}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <div
                      className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 ${borderColors[index % borderColors.length]}`}
                      style={{
                        backgroundImage: friend.avatar_url ? `url('${friend.avatar_url}')` : undefined,
                        backgroundColor: friend.avatar_url ? undefined : '#E57373',
                      }}
                    />
                    <p className="text-sm font-medium text-text-dark">
                      {friend.username || friend.full_name || 'Amigo'}
                    </p>
                  </Link>
                ))}
                <Link
                  href="/aluno/buscar-amigos"
                  className="flex items-center justify-center flex-col gap-2 flex-shrink-0 w-16"
                >
                  <div className="flex items-center justify-center bg-slate-700/50 rounded-full h-16 w-16">
                    <span className="material-symbols-outlined text-3xl">add</span>
                  </div>
                  <p className="text-sm font-medium text-text-dark">Adicionar</p>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                <span className="material-symbols-outlined text-5xl text-brand-lime">
                  group_add
                </span>
                <p className="text-text-dark/80 max-w-xs">
                  Adicione amigos para estudar junto e comparar o progresso!
                </p>
                <Button
                  onClick={() => router.push('/aluno/buscar-amigos')}
                  className="bg-brand-lime text-background-dark shadow-md mt-2"
                >
                  Buscar Amigos
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      <div className="sticky bottom-0 mt-auto p-4 bg-background-dark">
        <Button
          onClick={() => router.push('/aluno/materias')}
          className="w-full bg-brand-cyan text-background-dark shadow-lg h-14 text-lg"
        >
          Continuar Aprendendo
        </Button>
      </div>
    </div>
  )
}

