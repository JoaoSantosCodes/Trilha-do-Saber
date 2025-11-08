'use client'

import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import EmptyState from '@/components/EmptyState'

const subjects: Record<string, { name: string; icon: string; color: string }> = {
  matematica: { name: 'Matemática', icon: 'calculate', color: 'matematica' },
  ciencias: { name: 'Ciências', icon: 'rocket_launch', color: 'ciencias' },
  portugues: { name: 'Português', icon: 'auto_stories', color: 'portugues' },
  historia: { name: 'História', icon: 'hourglass_empty', color: 'historia' },
  geografia: { name: 'Geografia', icon: 'public', color: 'geografia' },
  artes: { name: 'Artes', icon: 'palette', color: 'artes' },
}

export default function MateriaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const materiaId = params.materia as string
  const subject = subjects[materiaId]

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark">
        <Header showBack title="Erro" />
        <EmptyState
          icon="error"
          title="Matéria não encontrada"
          description="A matéria solicitada não foi encontrada."
          actionLabel="Voltar para Matérias"
          onAction={() => router.push('/aluno/materias')}
        />
      </div>
    )
  }

  const colorClasses: Record<string, string> = {
    matematica: 'text-matematica',
    ciencias: 'text-ciencias',
    portugues: 'text-portugues',
    historia: 'text-historia',
    geografia: 'text-geografia',
    artes: 'text-artes',
  }

  const colorClass = colorClasses[subject.color] || 'text-primary'

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-white">
      <Header showBack title={subject.name} />

      <main className="flex-grow p-3 sm:p-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8">
          <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-card-dark flex items-center justify-center ${colorClass}`}>
            <span className="material-symbols-outlined text-5xl sm:text-7xl">
              {subject.icon}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center px-2">
            {subject.name}
          </h1>

          <p className="text-gray-400 text-center max-w-md text-sm sm:text-base px-3 sm:px-4">
            Escolha uma lição para começar a estudar {subject.name.toLowerCase()}.
          </p>

          <div className="w-full max-w-md space-y-3 sm:space-y-4 mt-6 sm:mt-8 px-3 sm:px-4">
            <button
              onClick={() => router.push(`/aluno/materias/${materiaId}/licao/1`)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-700 bg-card-dark hover:bg-card-dark/80 active:bg-card-dark/70 transition-colors touch-manipulation"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl shrink-0">play_circle</span>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate">Lição 1: Introdução</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">Comece aqui</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-lg sm:text-xl shrink-0">chevron_right</span>
            </button>

            <button
              onClick={() => router.push(`/aluno/materias/${materiaId}/licao/2`)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-700 bg-card-dark hover:bg-card-dark/80 active:bg-card-dark/70 transition-colors touch-manipulation"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl shrink-0">play_circle</span>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate">Lição 2: Conceitos Básicos</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">Próxima lição</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-lg sm:text-xl shrink-0">chevron_right</span>
            </button>

            <button
              onClick={() => router.push(`/aluno/trilha/${materiaId}`)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-700 bg-card-dark opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl shrink-0">lock</span>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate">Lição 3: Avançado</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">Complete a lição anterior</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-lg sm:text-xl shrink-0">lock</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

