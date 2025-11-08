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

      <main className="flex-grow p-4">
        <div className="flex flex-col items-center gap-6 py-8">
          <div className={`w-32 h-32 rounded-full bg-card-dark flex items-center justify-center ${colorClass}`}>
            <span className="material-symbols-outlined text-7xl">
              {subject.icon}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-center">
            {subject.name}
          </h1>

          <p className="text-gray-400 text-center max-w-md">
            Escolha uma lição para começar a estudar {subject.name.toLowerCase()}.
          </p>

          <div className="w-full max-w-md space-y-4 mt-8">
            <button
              onClick={() => router.push(`/aluno/materias/${materiaId}/licao/1`)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-card-dark hover:bg-card-dark/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">play_circle</span>
                <div className="text-left">
                  <h3 className="font-semibold">Lição 1: Introdução</h3>
                  <p className="text-sm text-gray-400">Comece aqui</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            <button
              onClick={() => router.push(`/aluno/materias/${materiaId}/licao/2`)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-card-dark hover:bg-card-dark/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">play_circle</span>
                <div className="text-left">
                  <h3 className="font-semibold">Lição 2: Conceitos Básicos</h3>
                  <p className="text-sm text-gray-400">Próxima lição</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            <button
              onClick={() => router.push(`/aluno/materias/${materiaId}/licao/3`)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-card-dark hover:bg-card-dark/80 transition-colors opacity-50"
              disabled
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">lock</span>
                <div className="text-left">
                  <h3 className="font-semibold">Lição 3: Avançado</h3>
                  <p className="text-sm text-gray-400">Complete a lição anterior</p>
                </div>
              </div>
              <span className="material-symbols-outlined">lock</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

