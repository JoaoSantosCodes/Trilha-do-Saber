'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  tipo: 'geral' | 'turma' | 'escola'
  enviado_em: string
  coordenador_nome?: string
  turma_nome?: string
}

export default function ComunicadosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null)

  useEffect(() => {
    if (user) {
      loadComunicados()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadComunicados = async () => {
    if (!user) return

    try {
      setLoading(true)

      // 1. Buscar IDs dos filhos do pai
      const { data: relacoes, error: errRelacoes } = await supabase
        .from('aluno_pais')
        .select('aluno_id')
        .eq('pais_id', user.id)

      if (errRelacoes) throw errRelacoes

      const filhosIds = (relacoes || []).map((r) => r.aluno_id)

      if (filhosIds.length === 0) {
        setComunicados([])
        setLoading(false)
        return
      }

      // 2. Buscar turmas dos filhos
      const { data: alunoTurmas, error: errTurmas } = await supabase
        .from('aluno_turma')
        .select('turma_id')
        .in('aluno_id', filhosIds)
        .eq('ativo', true)

      if (errTurmas) throw errTurmas

      const turmasIds = [...new Set((alunoTurmas || []).map((at) => at.turma_id))]

      // 3. Buscar comunicados gerais e da turma dos filhos
      const { data: comunicadosData, error: errComunicados } = await supabase
        .from('comunicados')
        .select('*, coordenador_id!profiles(full_name), turma_id!turmas(nome)')
        .or(`tipo.eq.geral,tipo.eq.escola${turmasIds.length > 0 ? `,tipo.eq.turma.and.turma_id.in.(${turmasIds.join(',')})` : ''}`)
        .order('enviado_em', { ascending: false })

      if (errComunicados) throw errComunicados

      const comunicadosFormatados: Comunicado[] = (comunicadosData || []).map((c: any) => ({
        id: c.id,
        titulo: c.titulo,
        conteudo: c.conteudo,
        tipo: c.tipo,
        enviado_em: c.enviado_em,
        coordenador_nome: c.coordenador_id?.full_name || 'Coordenação',
        turma_nome: c.turma_id?.nome || null,
      }))

      setComunicados(comunicadosFormatados)
    } catch (err: any) {
      console.error('Erro ao carregar comunicados:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'geral':
        return 'campaign'
      case 'turma':
        return 'group'
      case 'escola':
        return 'school'
      default:
        return 'mark_email_unread'
    }
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <Header title="Comunicados" />
        <PageLoading message="Carregando comunicados..." />
      </div>
    )
  }

  if (selectedComunicado) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <button onClick={() => setSelectedComunicado(null)}>
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
            </button>
          </div>
          <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Comunicado
          </h1>
          <div className="flex w-12 items-center justify-end"></div>
        </div>

        {/* Content */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/20 size-12 text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    {getTipoIcon(selectedComunicado.tipo)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold mb-2">{selectedComunicado.titulo}</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedComunicado.coordenador_nome}
                    {selectedComunicado.turma_nome && ` • ${selectedComunicado.turma_nome}`}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(selectedComunicado.enviado_em).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComunicado.conteudo}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Comunicados
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        {comunicados.length === 0 ? (
          <EmptyState
            icon="mark_email_read"
            title="Tudo em dia!"
            description="Nenhum comunicado da escola por agora. Você será notificado quando houver novidades."
          />
        ) : (
          <div className="flex flex-col gap-2 max-w-2xl mx-auto">
            {comunicados.map((comunicado) => (
              <button
                key={comunicado.id}
                onClick={() => setSelectedComunicado(comunicado)}
                className="flex items-center gap-4 px-4 py-3 min-h-[72px] rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/20 size-12 text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    {getTipoIcon(comunicado.tipo)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center overflow-hidden min-w-0">
                  <p className="truncate text-base font-medium text-white">{comunicado.titulo}</p>
                  <p className="truncate text-sm font-normal text-gray-400">
                    {comunicado.coordenador_nome}
                    {comunicado.turma_nome && ` • ${comunicado.turma_nome}`}
                  </p>
                </div>
                <div className="shrink-0">
                  <p className="text-sm font-normal text-gray-500">{formatDate(comunicado.enviado_em)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

