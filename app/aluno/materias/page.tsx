'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import SubjectCard from '@/components/SubjectCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { useMaterias } from '@/hooks/useMaterias'

export default function MateriasPage() {
  const router = useRouter()
  const { materias, loading, error } = useMaterias()

  const handleSubjectClick = (subjectSlug: string) => {
    router.push(`/aluno/materias/${subjectSlug}`)
  }

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-white">
        <Header />
        <main className="flex-grow p-3 sm:p-4">
          <h1 className="text-gray-100 tracking-tight text-xl sm:text-2xl md:text-[32px] font-bold leading-tight text-left pb-2 sm:pb-3 pt-4 sm:pt-6">
            Qual matéria vamos estudar hoje?
          </h1>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <LoadingSkeleton type="grid" count={6} />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center p-3 sm:p-4">
          <div className="flex flex-col items-center gap-3 sm:gap-4 text-center px-3 sm:px-4">
            <span className="material-symbols-outlined text-red-400 text-3xl sm:text-4xl">error</span>
            <p className="text-red-400 text-sm sm:text-base break-words">Erro ao carregar matérias: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline text-sm sm:text-base touch-manipulation active:opacity-70"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-white">
      <Header />

      <main className="flex-grow">
        <h1 className="text-gray-100 tracking-tight text-xl sm:text-2xl md:text-[32px] font-bold leading-tight px-4 text-left pb-2 sm:pb-3 pt-4 sm:pt-6">
          Qual matéria vamos estudar hoje?
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
          {materias.length > 0 ? (
            materias.map((materia) => (
              <SubjectCard
                key={materia.id}
                subject={{
                  id: materia.slug,
                  name: materia.nome,
                  icon: materia.icone || 'school',
                  color: materia.slug,
                }}
                onClick={() => handleSubjectClick(materia.slug)}
              />
            ))
          ) : (
            <EmptyState
              icon="school"
              title="Nenhuma matéria disponível"
              description="Não há matérias cadastradas no momento. Entre em contato com o administrador."
            />
          )}
        </div>
      </main>

      <div className="h-5 bg-background-dark"></div>
    </div>
  )
}

