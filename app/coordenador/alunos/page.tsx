'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { useCoordenador } from '@/hooks/useCoordenador'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'

interface Aluno {
  id: string
  nome: string
  turma: string
  responsavel: string
  avatar: string
}

export default function GerenciarAlunosPage() {
  const router = useRouter()
  const { buscarAlunos } = useCoordenador()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'nome' | 'turma'>('nome')

  useEffect(() => {
    loadAlunos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAlunos = async () => {
    try {
      setLoading(true)
      const alunosData = await buscarAlunos()
      setAlunos(alunosData)
    } catch (err) {
      console.error('Erro ao carregar alunos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedAlunos = alunos
    .filter((aluno) => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'turma':
          return a.turma.localeCompare(b.turma)
        default:
          return 0
      }
    })

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full bg-background-dark">
        <div className="flex items-center p-4">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
          <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight flex-1 text-center">
            Gerenciar Alunos
          </h1>
        </div>
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <label className="flex flex-col min-w-40 h-14 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-400 dark:text-[#8E8E93] flex border-none bg-slate-200/10 dark:bg-[#2C2C2E] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome..."
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-slate-200/10 dark:bg-[#2C2C2E] h-full placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 pb-28">
        {/* Sort Options */}
        <div className="flex items-center gap-2 pb-3">
          <span className="text-gray-400 text-sm">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'nome' | 'turma')}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="nome">Nome</option>
            <option value="turma">Turma</option>
          </select>
        </div>

        {/* List of Students */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : filteredAndSortedAlunos.length > 0 ? (
            filteredAndSortedAlunos.map((aluno) => (
              <div
                key={aluno.id}
                className="flex cursor-pointer items-center gap-4 bg-slate-100/10 dark:bg-[#2C2C2E] p-4 min-h-[72px] rounded hover:bg-slate-100/20 transition-colors"
                onClick={() => router.push(`/coordenador/alunos/${aluno.id}`)}
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0"
                  style={{ backgroundImage: `url('${aluno.avatar}')` }}
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal truncate">
                    {aluno.nome}
                  </p>
                  <p className="text-slate-500 dark:text-[#8E8E93] text-sm font-normal leading-normal truncate">
                    {aluno.turma} | {aluno.responsavel}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon="person_search"
              title="Nenhum aluno encontrado"
              description="Tente buscar por outro nome ou matricule um novo aluno."
              actionLabel="Matricular Novo Aluno"
              onAction={() => router.push('/coordenador/alunos/novo')}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 right-0 w-full p-6 pointer-events-none">
        <div className="flex justify-end">
          <Button
            onClick={() => router.push('/coordenador/alunos/novo')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 shadow-lg bg-primary text-white text-base font-bold leading-normal tracking-wide min-w-0 gap-3 px-5 pointer-events-auto"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="truncate">Matricular Novo Aluno</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

