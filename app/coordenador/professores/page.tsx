'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { useCoordenador } from '@/hooks/useCoordenador'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'

interface Professor {
  id: string
  nome: string
  turmas: string
  status: 'ativo' | 'inativo'
  avatar: string
}

export default function GerenciarProfessoresPage() {
  const router = useRouter()
  const { buscarProfessores } = useCoordenador()
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [sortBy, setSortBy] = useState<'nome' | 'status'>('nome')

  useEffect(() => {
    loadProfessores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfessores = async () => {
    try {
      setLoading(true)
      const professoresData = await buscarProfessores()
      setProfessores(professoresData)
    } catch (err) {
      console.error('Erro ao carregar professores:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProfessores = professores
    .filter((professor) => {
      const matchesSearch = professor.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'todos' || professor.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-text-dark overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-col bg-background-dark safe-area-top">
        <div className="flex items-center p-3 sm:p-4 justify-between min-h-[64px] sm:min-h-[72px]">
          <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start text-white">
            <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_back</span>
            </button>
          </div>
          <h1 className="text-white text-base sm:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
            Gerenciar Professores
          </h1>
          <div className="flex w-10 sm:w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 sm:h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 touch-manipulation active:opacity-70" aria-label="Buscar">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher List */}
      <main className="flex-1 px-3 sm:px-4 pb-24 sm:pb-28 pt-3 sm:pt-4 overflow-y-auto smooth-scroll">
        {/* Filters */}
        <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-xs sm:text-sm">Filtrar por status:</span>
            <div className="flex gap-2">
              {(['todos', 'ativo', 'inativo'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors touch-manipulation active:opacity-80 ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : status === 'ativo' ? 'Ativos' : 'Inativos'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-xs sm:text-sm">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'nome' | 'status')}
              className="rounded-lg bg-white/5 border border-white/10 px-2 sm:px-3 py-1 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
            >
              <option value="nome">Nome</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : filteredAndSortedProfessores.length > 0 ? (
            filteredAndSortedProfessores.map((professor) => (
            <div
              key={professor.id}
              className="flex cursor-pointer items-center gap-3 sm:gap-4 rounded-lg bg-white/5 p-3 sm:p-4 transition-colors hover:bg-white/10 active:bg-white/15 touch-manipulation"
              onClick={() => router.push(`/coordenador/professores/${professor.id}`)}
            >
              <div className="flex-shrink-0">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 sm:h-14 sm:w-14"
                  style={{ backgroundImage: `url('${professor.avatar}')` }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <p className="text-white text-sm sm:text-base font-medium leading-normal line-clamp-1 truncate">
                  {professor.nome}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                  {professor.turmas}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center justify-center rounded-full px-2 sm:px-3 py-1 ${
                    professor.status === 'ativo'
                      ? 'bg-green-500/20'
                      : 'bg-zinc-500/20'
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      professor.status === 'ativo' ? 'text-green-400' : 'text-zinc-400'
                    }`}
                  >
                    {professor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="text-gray-400">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </div>
          ))
          ) : (
            <EmptyState
              icon="person_search"
              title="Nenhum professor encontrado"
              description="Tente uma busca diferente ou adicione um novo professor."
              actionLabel="Adicionar Novo Professor"
              onAction={() => router.push('/coordenador/professores/novo')}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-20 safe-area-right safe-area-bottom">
        <Button
          onClick={() => router.push('/coordenador/professores/novo')}
          className="flex h-14 sm:h-16 w-auto items-center justify-center gap-2 sm:gap-3 rounded-full bg-primary pl-4 pr-4 sm:pl-6 sm:pr-6 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 touch-manipulation"
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">add</span>
          <span className="text-sm sm:text-base font-bold whitespace-nowrap hidden sm:inline">Adicionar Novo Professor</span>
        </Button>
      </div>
    </div>
  )
}

