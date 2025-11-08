'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { useCoordenador, EstatisticasCoordenador, DadosEngajamento } from '@/hooks/useCoordenador'

export default function PainelCoordenadorPage() {
  const router = useRouter()
  const { estatisticas, loading, buscarEngajamento } = useCoordenador()
  const [engajamento, setEngajamento] = useState<DadosEngajamento[]>([])
  const [loadingEngajamento, setLoadingEngajamento] = useState(false)

  useEffect(() => {
    loadEngajamento()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadEngajamento = async () => {
    setLoadingEngajamento(true)
    const dados = await buscarEngajamento(6)
    setEngajamento(dados)
    setLoadingEngajamento(false)
  }

  const stats = [
    {
      id: 'professores',
      title: 'Gerenciar Professores',
      value: estatisticas?.professores_ativos.toString() || '0',
      subtitle: 'professores ativos',
      icon: 'school',
      route: '/coordenador/professores',
    },
    {
      id: 'turmas',
      title: 'Gerenciar Turmas',
      value: estatisticas?.turmas_ativas.toString() || '0',
      subtitle: 'turmas ativas',
      icon: 'groups',
      route: '/coordenador/turmas',
    },
    {
      id: 'alunos',
      title: 'Gerenciar Alunos',
      value: estatisticas?.alunos_ativos.toString() || '0',
      subtitle: 'alunos matriculados',
      icon: 'person',
      route: '/coordenador/alunos',
    },
  ]

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
        <Header title="Painel do Coordenador" />
        <PageLoading message="Carregando estatísticas..." />
      </div>
    )
  }

  if (!estatisticas) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-white">refresh</span>
            <p className="text-white">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark">
      {/* Header */}
      <header className="flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-white/10">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white/90 text-2xl">menu</span>
          </button>
        </div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Painel do Coordenador
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={() => router.push('/coordenador/notificacoes')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white/90 gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Stats Cards */}
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-stretch justify-start rounded-xl bg-white/5 p-5"
            >
              <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <p className="text-[#9dabb9] text-sm font-medium leading-normal">
                    {stat.title}
                  </p>
                </div>
                <p className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] pt-2">
                  {stat.value}
                </p>
                <div className="flex items-end gap-3 justify-between pt-1">
                  <p className="text-[#9dabb9] text-base font-normal leading-normal">
                    {stat.subtitle}
                  </p>
                  <Button
                    onClick={() => router.push(stat.route)}
                    className="h-9 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90"
                  >
                    {stat.id === 'alunos' ? 'Buscar Aluno' : stat.id === 'turmas' ? 'Ver Todas' : 'Ver Lista'}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Communication Panel */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-transparent p-5 lg:col-span-3">
            <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-white text-base font-bold leading-tight">
                  Comunicação Escola-Pais
                </p>
                <p className="text-[#9dabb9] text-base font-normal leading-normal">
                  Envie uma mensagem para todos os responsáveis.
                </p>
              </div>
              <Button
                onClick={() => router.push('/coordenador/comunicado')}
                className="w-full md:w-auto h-10 px-5 bg-primary text-white text-sm font-medium hover:bg-primary/90"
              >
                Enviar Comunicado Geral
              </Button>
            </div>
          </div>

          {/* Graph Card */}
          <div className="rounded-xl bg-white/5 p-5 lg:col-span-3">
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-white text-base font-bold leading-tight">
                Engajamento Geral da Escola
              </p>
              <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                Lições completadas por semana
              </p>
            </div>
            {loadingEngajamento ? (
              <div className="flex items-center justify-center h-60">
                <LoadingSkeleton type="text" count={3} className="w-full" />
              </div>
            ) : engajamento.length > 0 ? (
              <div className="relative flex h-60 w-full items-end justify-between gap-2 border-b border-l border-white/10 px-2 pb-1">
                {/* Y-Axis Labels */}
                <div className="absolute -left-1 top-0 bottom-1 flex flex-col justify-between text-right text-xs text-[#9dabb9]">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                {/* X-Axis Labels & Bars */}
                <div className="flex h-full w-full items-end justify-between pl-6">
                  {engajamento.map((week, index) => (
                    <div key={index} className="flex h-full w-full flex-col items-center justify-end gap-2">
                      <div
                        className={`w-full rounded-t-sm ${
                          week.atual ? 'bg-primary/50' : 'bg-primary'
                        }`}
                        style={{ height: `${week.altura_percentual}%` }}
                      />
                      <p className="text-xs text-[#9dabb9]">{week.semana}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-60 text-gray-400">
                Nenhum dado de engajamento disponível ainda.
              </div>
            )}
          </div>

          {/* Mascot Card */}
          <div className="relative overflow-hidden rounded-xl bg-primary/20 p-6 lg:col-span-3 flex items-center">
            <div className="relative z-10 flex flex-col gap-2 max-w-md">
              <h3 className="text-white text-lg font-bold">
                Bem-vindo(a) à Trilha do Saber!
              </h3>
              <p className="text-white/80 text-sm">
                Sua plataforma completa para uma gestão escolar eficiente e conectada. Estamos aqui
                para simplificar seu dia a dia.
              </p>
            </div>
            <Image
              alt="Ilustração da mascote coruja da Trilha do Saber, segurando um livro."
              className="absolute -right-8 -bottom-10 h-48 w-48 opacity-40 lg:opacity-100 lg:h-56 lg:w-56 lg:-right-4 lg:-bottom-6 select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM_emoIlVP1ma4ecQCJDu19NEFVGGIAQ5jN3WtbIp8F-s9b0rvLmoI4CmkOmaM4sxRLo9z4a8qf7kw6HvXIIR11WN7SJ6A2goySdZVE1vgA0jtlrmIGlUlTfjT-nHYDsNf6Gnkv6cJT4O7yYWUs7myev2jQ6MNUqO7BqmdYfYPI261jOLNcgxDvbPeQE_GTOOeDE85YirE71Ztxg_6YeJxQSM49fHok048qqVDqEhEDM8d3jM9LwYHX4P2Ip-V8XRDOpG8lrAzgvsB"
              width={224}
              height={224}
              unoptimized
            />
          </div>
        </div>
      </main>
    </div>
  )
}

