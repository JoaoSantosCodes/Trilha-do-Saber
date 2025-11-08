'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { useCoordenador } from '@/hooks/useCoordenador'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { supabase } from '@/supabase/config'

interface Turma {
  id: string
  nome: string
  codigo: string
  professor: string
  alunos: number
  serie?: string | null
  periodo?: string | null
  ativo: boolean
}

const filters = ['Todos', '1º Ano', '2º Ano', '3º Ano', 'Médio']

export default function GerenciarTurmasPage() {
  const router = useRouter()
  const { buscarTurmas } = useCoordenador()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState<'nome' | 'professor' | 'alunos'>('nome')

  useEffect(() => {
    loadTurmas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTurmas = async () => {
    try {
      setLoading(true)
      const turmasData = await buscarTurmas()

      // Buscar número de alunos para cada turma
      const turmasComAlunos = await Promise.all(
        turmasData.map(async (turma) => {
          const { count, error } = await supabase
            .from('aluno_turma')
            .select('id', { count: 'exact', head: true })
            .eq('turma_id', turma.id)
            .eq('ativo', true)

          return {
            ...turma,
            alunos: count || 0,
          }
        })
      )

      setTurmas(turmasComAlunos)
    } catch (err) {
      console.error('Erro ao carregar turmas:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedTurmas = turmas
    .filter((turma) => {
      const matchesSearch =
        turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.codigo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = activeFilter === 'Todos' || turma.serie?.includes(activeFilter) || false

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'professor':
          return a.professor.localeCompare(b.professor)
        case 'alunos':
          return b.alunos - a.alunos
        default:
          return 0
      }
    })

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-text-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-4 bg-background-dark/95 px-3 sm:px-4 py-2 backdrop-blur-sm safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-base sm:text-xl font-bold text-white flex-1 text-center px-2 truncate">Gerenciar Turmas</h1>
        <button
          onClick={() => router.push('/coordenador/turmas/nova')}
          className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white touch-manipulation active:opacity-80"
          aria-label="Criar nova turma"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">add</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col p-3 sm:p-4 pt-2 overflow-y-auto smooth-scroll">
        {/* Search Bar */}
        <div className="pb-2 sm:pb-3">
          <label className="flex h-11 sm:h-12 w-full flex-col">
            <div className="flex h-full w-full flex-1 items-stretch rounded-lg bg-white/5">
              <div className="text-[#A0A0A0] flex items-center justify-center pl-3 sm:pl-4">
                <span className="material-symbols-outlined text-lg sm:text-2xl">search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar turmas ou professores"
                className="form-input w-full flex-1 resize-none overflow-hidden rounded-r-lg border-none bg-transparent px-2 sm:px-3 text-sm sm:text-base font-normal text-white placeholder:text-[#A0A0A0] focus:outline-0 focus:ring-0 touch-manipulation"
              />
            </div>
          </label>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 sm:pb-4 smooth-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-8 sm:h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 sm:px-4 transition-colors touch-manipulation active:opacity-80 ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-gray-200/10 text-gray-300 hover:bg-gray-200/20 active:bg-gray-200/30'
              }`}
            >
              <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">{filter}</p>
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 pb-2 sm:pb-3 flex-wrap">
          <span className="text-gray-400 text-xs sm:text-sm">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'nome' | 'professor' | 'alunos')}
            className="rounded-lg bg-white/5 border border-white/10 px-2 sm:px-3 py-1 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
          >
            <option value="nome">Nome</option>
            <option value="professor">Professor</option>
            <option value="alunos">Número de Alunos</option>
          </select>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : filteredAndSortedTurmas.length > 0 ? (
            filteredAndSortedTurmas.map((turma) => (
              <div
                key={turma.id}
                className="flex items-center gap-3 sm:gap-4 rounded-lg bg-white/5 p-3 sm:p-4 cursor-pointer hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
                onClick={() => router.push(`/coordenador/turmas/${turma.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-white truncate">{turma.nome}</p>
                  <p className="text-xs sm:text-sm font-normal text-gray-400 truncate">{turma.professor}</p>
                  <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm sm:text-base text-gray-500">
                      group
                    </span>
                    <p className="text-xs sm:text-sm font-normal text-gray-400">{turma.alunos} alunos</p>
                  </div>
                </div>
                <button className="shrink-0 touch-manipulation active:opacity-70" aria-label="Mais opções">
                  <span className="material-symbols-outlined text-gray-400 text-lg sm:text-xl">more_vert</span>
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              icon="search_off"
              title="Nenhuma turma encontrada"
              description="Tente um filtro diferente ou crie uma nova turma."
              actionLabel="Criar Nova Turma"
              onAction={() => router.push('/coordenador/turmas/nova')}
            />
          )}
        </div>
      </main>
    </div>
  )
}

