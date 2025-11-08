'use client'

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useTrilha } from '@/hooks/useTrilha'
import { useMaterias } from '@/hooks/useMaterias'

// Interfaces removidas - usando tipos do hook useTrilha

export default function TrilhaPage() {
  const router = useRouter()
  const params = useParams()
  const materia = params.materia as string
  const { trilha, loading, error } = useTrilha(materia)
  const { materias } = useMaterias()

  const materiaData = materias.find((m) => m.slug === materia)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark text-text-dark">
        <Header showBack title="Carregando..." />
        <PageLoading message="Carregando trilha..." />
      </div>
    )
  }

  if (error || !trilha) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark text-text-dark">
        <Header showBack title="Erro" />
        <EmptyState
          icon="error"
          title={error || 'Trilha não encontrada'}
          description="Não foi possível carregar a trilha. Tente novamente mais tarde."
          actionLabel="Voltar para Matérias"
          onAction={() => router.push('/aluno/materias')}
        />
      </div>
    )
  }

  // Configurar cores e imagens baseado na matéria
  const primaryColor = materiaData?.cor_primaria || '#5b13ec'
  const backgroundImage = trilha.imagem_fundo || materiaData?.imagem_url || ''

  // Encontrar lição atual (disponível ou em andamento)
  const currentLesson = trilha.licoes.find(
    (l) => l.status === 'disponivel' || l.status === 'em_andamento'
  )

  // Encontrar desafio final (tipo 'desafio')
  const finalChallenge = trilha.licoes.find((l) => l.tipo === 'desafio')

  const handleLessonClick = (licaoId: string) => {
    router.push(`/aluno/trilha/${materia}/licao/${licaoId}`)
  }

  const handleChallengeClick = () => {
    if (finalChallenge) {
      router.push(`/aluno/trilha/${materia}/licao/${finalChallenge.id}`)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <Header
        showBack
        title={trilha.titulo}
        showSettings
      />

      <main className="relative flex-1 overflow-hidden">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-background-dark/20 to-transparent z-0" />

        <div className="relative z-10 p-3 sm:p-4 flex flex-col items-center min-h-full">
          {/* Final Challenge */}
          {finalChallenge && (
            <div
              className="mt-3 sm:mt-4"
              style={{
                position: 'absolute',
                top: finalChallenge.posicao_top || '5%',
                left: finalChallenge.posicao_left || '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={handleChallengeClick}
                className="flex items-center justify-center p-3 sm:p-4 rounded-xl shadow-lg shadow-primary/50 border-2 touch-manipulation active:opacity-80"
                style={{
                  backgroundColor: `${primaryColor}30`,
                  borderColor: primaryColor,
                }}
              >
                <span
                  className="material-symbols-outlined text-3xl sm:text-4xl"
                  style={{ color: '#FFCA28' }}
                >
                  {finalChallenge.icone || 'castle'}
                </span>
                <div className="ml-2 sm:ml-4 text-left">
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    {finalChallenge.titulo}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm">Desafio Final</p>
                </div>
              </button>
            </div>
          )}

          {/* Lessons (apenas lições, não desafios) */}
          {trilha.licoes
            .filter((l) => l.tipo === 'licao')
            .map((licao, index) => (
            <div key={licao.id}>
              {/* Path SVG */}
              {index < trilha.licoes.filter((l) => l.tipo === 'licao').length - 1 && (
                <div className="my-4 sm:my-6 w-full flex justify-center">
                  <svg
                    fill="none"
                    height="100"
                    viewBox="0 0 20 100"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0V100"
                      stroke={`url(#glowing-path-${materia})`}
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />
                    <defs>
                      <linearGradient
                        id={`glowing-path-${materia}`}
                        gradientUnits="userSpaceOnUse"
                        x1="10"
                        x2="10"
                        y1="0"
                        y2="100"
                      >
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              {/* Lesson Button */}
              <div
                style={{
                  position: 'absolute',
                  top: licao.posicao_top || `${60 - index * 20}%`,
                  left: licao.posicao_left || '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button
                  onClick={() => handleLessonClick(licao.id)}
                  disabled={licao.status === 'bloqueada'}
                  className={`flex items-center justify-center p-2 sm:p-3 rounded-full shadow-md border touch-manipulation active:opacity-80 ${
                    licao.status === 'bloqueada'
                      ? 'bg-slate-800/50 border-slate-600 opacity-50 cursor-not-allowed'
                      : licao.status === 'concluida'
                      ? 'bg-green-500 border-green-400'
                      : 'bg-slate-800/50 border-slate-600'
                  }`}
                >
                  {licao.status === 'concluida' ? (
                    <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">
                      done
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined text-2xl sm:text-3xl"
                      style={{
                        color: licao.status === 'bloqueada' ? '#94a3b8' : '#22d3ee',
                      }}
                    >
                      {licao.icone || 'school'}
                    </span>
                  )}
                  <span className="ml-2 sm:ml-3 text-white font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{licao.titulo}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Current Lesson Info (Bottom Sheet) */}
          {currentLesson && (
            <div className="absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-sm rounded-t-xl pointer-events-auto safe-area-bottom">
              <button className="flex h-5 w-full items-center justify-center pt-2 touch-manipulation" aria-label="Arrastar">
                <div className="h-1 w-9 rounded-full bg-slate-600" />
              </button>
              <h2 className="text-white tracking-light text-xl sm:text-[28px] font-bold leading-tight px-3 sm:px-4 text-left pb-2 sm:pb-3 pt-3 sm:pt-5">
                {currentLesson.titulo}
              </h2>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <p className="text-slate-300 font-display text-sm sm:text-base mb-4 sm:mb-6">
                  {currentLesson.descricao || trilha.descricao || 'Complete esta lição para avançar na trilha!'}
                </p>
                <Button
                  onClick={() => handleLessonClick(currentLesson.id)}
                  className="w-full bg-primary text-white h-12 sm:h-14 text-base sm:text-lg gap-3 sm:gap-4 touch-manipulation"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="material-symbols-outlined text-white text-xl sm:text-[24px]">
                    play_arrow
                  </span>
                  Iniciar Lição
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mascot */}
        {trilha.mascote_imagem && (
          <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-5 z-20 safe-area-right">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 sm:h-16 sm:w-16 shadow-lg shadow-primary/40 touch-manipulation active:opacity-80"
              style={{ backgroundColor: primaryColor }}
              aria-label="Mascote"
            >
              <Image
                alt="Mascote"
                className="h-9 w-9 sm:h-10 sm:w-10"
                src={trilha.mascote_imagem}
                width={40}
                height={40}
                unoptimized
              />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

