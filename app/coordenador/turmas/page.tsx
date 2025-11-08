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
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background-dark/80 px-4 py-2 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-xl font-bold text-white">Gerenciar Turmas</h1>
        <button
          onClick={() => router.push('/coordenador/turmas/nova')}
          className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col p-4 pt-2">
        {/* Search Bar */}
        <div className="pb-3">
          <label className="flex h-12 w-full flex-col">
            <div className="flex h-full w-full flex-1 items-stretch rounded-lg bg-white/5">
              <div className="text-[#A0A0A0] flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar turmas ou professores"
                className="form-input w-full flex-1 resize-none overflow-hidden rounded-r-lg border-none bg-transparent px-2 text-base font-normal text-white placeholder:text-[#A0A0A0] focus:outline-0 focus:ring-0"
              />
            </div>
          </label>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-gray-200/10 text-gray-300 hover:bg-gray-200/20'
              }`}
            >
              <p className="text-sm font-semibold">{filter}</p>
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 pb-3">
          <span className="text-gray-400 text-sm">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'nome' | 'professor' | 'alunos')}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="nome">Nome</option>
            <option value="professor">Professor</option>
            <option value="alunos">Número de Alunos</option>
          </select>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : filteredAndSortedTurmas.length > 0 ? (
            filteredAndSortedTurmas.map((turma) => (
              <div
                key={turma.id}
                className="flex items-center gap-4 rounded-lg bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => router.push(`/coordenador/turmas/${turma.id}`)}
              >
                <div className="flex-1">
                  <p className="text-base font-semibold text-white">{turma.nome}</p>
                  <p className="text-sm font-normal text-gray-400">{turma.professor}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-gray-500">
                      group
                    </span>
                    <p className="text-sm font-normal text-gray-400">{turma.alunos} alunos</p>
                  </div>
                </div>
                <button className="shrink-0">
                  <span className="material-symbols-outlined text-gray-400">more_vert</span>
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

