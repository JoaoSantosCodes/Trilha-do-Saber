'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { useAmizades } from '@/hooks/useAmizades'

interface FriendRequest {
  id: string
  amizadeId: string
  userId: string
  username: string
  avatar: string
}

export default function PedidosAmizadePage() {
  const router = useRouter()
  const { aceitarAmizade, recusarAmizade, buscarPedidosPendentes } = useAmizades()
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPedidos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPedidos = async () => {
    setLoading(true)
    const pedidos = await buscarPedidosPendentes()
    setRequests(
      pedidos.map((p) => ({
        id: p.userId,
        amizadeId: p.amizadeId,
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
      }))
    )
    setLoading(false)
  }

  const handleAccept = async (amizadeId: string) => {
    const { error } = await aceitarAmizade(amizadeId)
    if (error) {
      alert(`Erro ao aceitar pedido: ${error}`)
    } else {
      setRequests((prev) => prev.filter((req) => req.amizadeId !== amizadeId))
      await loadPedidos()
    }
  }

  const handleDecline = async (amizadeId: string) => {
    const { error } = await recusarAmizade(amizadeId)
    if (error) {
      alert(`Erro ao recusar pedido: ${error}`)
    } else {
      setRequests((prev) => prev.filter((req) => req.amizadeId !== amizadeId))
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#1F2A44] text-text-dark">
      {/* Header */}
      <header className="flex shrink-0 items-center p-3 sm:p-4 safe-area-top">
        <button onClick={() => router.back()} className="mr-3 sm:mr-4 touch-manipulation active:opacity-70" aria-label="Voltar">
          <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-base sm:text-xl font-bold tracking-tight text-white px-2 truncate">
          Pedidos de Amizade
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col p-3 sm:p-4 overflow-y-auto smooth-scroll">
        <div className="flex flex-col gap-3 sm:gap-4">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="flex flex-col gap-2 sm:gap-3 rounded-xl bg-[#2D2D2D]/50 p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: request.avatar ? `url('${request.avatar}')` : undefined,
                      backgroundColor: request.avatar ? undefined : '#E57373',
                    }}
                  />
                  <p className="flex-1 truncate text-base sm:text-lg font-bold text-white">
                    {request.username || 'Aluno'}
                  </p>
                </div>
                <div className="flex flex-1 justify-end gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleDecline(request.amizadeId)}
                    className="h-11 sm:h-12 flex-1 bg-decline text-white text-xs sm:text-sm font-bold gap-2 touch-manipulation"
                  >
                    <span className="material-symbols-outlined text-base sm:text-lg">close</span>
                    <span className="truncate">Recusar</span>
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.amizadeId)}
                    className="h-11 sm:h-12 flex-1 bg-accept text-white text-xs sm:text-sm font-bold gap-2 touch-manipulation"
                  >
                    <span className="material-symbols-outlined text-base sm:text-lg">done</span>
                    <span className="truncate">Aceitar</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon="mail"
              title="Nenhum pedido novo por aqui!"
              description="Sua caixa de correio de amigos está vazia por enquanto!"
            />
          )}
        </div>
      </main>
    </div>
  )
}

