'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { useAmizades } from '@/hooks/useAmizades'

interface User {
  id: string
  username: string
  name: string
  avatar: string
  status: 'available' | 'pending' | 'friend'
  amizadeId?: string
}

export default function BuscarAmigosPage() {
  const router = useRouter()
  const { adicionarAmigo, aceitarAmizade, recusarAmizade, buscarUsuarios, buscarPedidosPendentes } = useAmizades()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'buscar' | 'pedidos'>('buscar')
  const [users, setUsers] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)

  // Buscar usuários quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const timeoutId = setTimeout(async () => {
        setLoading(true)
        const resultados = await buscarUsuarios(searchTerm)
        setUsers(resultados)
        setLoading(false)
      }, 500) // Debounce de 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setUsers([])
    }
  }, [searchTerm, buscarUsuarios])

  // Buscar pedidos pendentes quando mudar para a aba de pedidos
  useEffect(() => {
    if (activeTab === 'pedidos') {
      loadPedidosPendentes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const loadPedidosPendentes = async () => {
    setLoading(true)
    const pedidos = await buscarPedidosPendentes()
    setFriendRequests(
      pedidos.map((p) => ({
        id: p.userId,
        username: p.username,
        name: p.username,
        avatar: p.avatar,
        status: 'pending' as const,
        amizadeId: p.amizadeId,
      }))
    )
    setLoading(false)
  }

  const handleAddFriend = async (userId: string) => {
    setIsAdding(userId)
    const { error } = await adicionarAmigo(userId)
    if (error) {
      alert(`Erro ao adicionar amigo: ${error}`)
    } else {
      // Atualizar status do usuário
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'pending' as const } : u))
      )
    }
    setIsAdding(null)
  }

  const handleAcceptRequest = async (userId: string, amizadeId?: string) => {
    if (!amizadeId) return

    const { error } = await aceitarAmizade(amizadeId)
    if (error) {
      alert(`Erro ao aceitar pedido: ${error}`)
    } else {
      setFriendRequests((prev) => prev.filter((req) => req.id !== userId))
      await loadPedidosPendentes()
    }
  }

  const handleDeclineRequest = async (userId: string, amizadeId?: string) => {
    if (!amizadeId) return

    const { error } = await recusarAmizade(amizadeId)
    if (error) {
      alert(`Erro ao recusar pedido: ${error}`)
    } else {
      setFriendRequests((prev) => prev.filter((req) => req.id !== userId))
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark p-3 sm:p-4 pb-2 justify-between safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start text-white">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
          Adicionar Amigos
        </h1>
        <div className="flex size-10 sm:size-12 shrink-0 items-center"></div>
      </div>

      {/* Search Bar */}
      <div className="px-3 sm:px-4 py-2 sm:py-3">
        <label className="flex flex-col min-w-40 h-11 sm:h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-gray-400 flex border-none bg-zinc-800 items-center justify-center pl-3 sm:pl-4 rounded-l-xl border-r-0">
              <span className="material-symbols-outlined text-lg sm:text-2xl">search</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome de usuário..."
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-zinc-800 focus:border-none h-full placeholder:text-gray-400 px-3 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal touch-manipulation"
            />
          </div>
        </label>
      </div>

      {/* Segmented Buttons */}
      <div className="flex px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex h-9 sm:h-10 flex-1 items-center justify-center rounded-xl bg-zinc-800 p-1">
          <button
            onClick={() => setActiveTab('buscar')}
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-xs sm:text-sm font-medium leading-normal transition-colors touch-manipulation ${
              activeTab === 'buscar'
                ? 'bg-background-dark shadow-sm text-white'
                : 'text-gray-400 active:text-gray-300'
            }`}
          >
            <span className="truncate">Buscar</span>
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-xs sm:text-sm font-medium leading-normal transition-colors touch-manipulation ${
              activeTab === 'pedidos'
                ? 'bg-background-dark shadow-sm text-white'
                : 'text-gray-400 active:text-gray-300'
            }`}
          >
            <span className="truncate">Pedidos de Amizade</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto smooth-scroll">
        {activeTab === 'buscar' ? (
          <div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 sm:gap-4 rounded-xl bg-zinc-800/50 p-3 sm:p-4"
                >
                  <Image
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shrink-0"
                    src={user.avatar}
                    alt={`Avatar de ${user.name}`}
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm sm:text-base truncate">{user.username}</p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{user.name}</p>
                  </div>
                  {user.status === 'available' ? (
                    <Button
                      onClick={() => handleAddFriend(user.id)}
                      disabled={isAdding === user.id}
                      className="min-w-[84px] h-9 sm:h-10 px-3 sm:px-4 bg-primary text-black text-xs sm:text-sm font-bold gap-1.5 sm:gap-2 disabled:opacity-50 touch-manipulation shrink-0"
                    >
                      {isAdding === user.id ? (
                        <span className="material-symbols-outlined animate-spin text-base sm:text-lg">refresh</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base sm:text-lg">person_add</span>
                          <span className="truncate">Adicionar</span>
                        </>
                      )}
                    </Button>
                  ) : user.status === 'friend' ? (
                    <button
                      disabled
                      className="flex min-w-[84px] cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-full h-9 sm:h-10 px-3 sm:px-4 bg-green-600 text-white text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] touch-manipulation shrink-0"
                    >
                      <span className="material-symbols-outlined text-base sm:text-lg">check</span>
                      <span className="truncate">Amigo</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex min-w-[84px] cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-full h-9 sm:h-10 px-3 sm:px-4 bg-zinc-700 text-gray-400 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] touch-manipulation shrink-0"
                    >
                      <span className="material-symbols-outlined text-base sm:text-lg">schedule</span>
                      <span className="truncate">Enviado</span>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                icon="person_search"
                title="Nenhum estudante encontrado"
                description="Verifique a digitação e tente novamente!"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
            {loading ? (
              <LoadingSkeleton type="list" count={5} />
            ) : friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-2 sm:gap-3 rounded-xl bg-[#2D2D2D]/50 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${request.avatar}')` }}
                    />
                    <p className="flex-1 truncate text-base sm:text-lg font-bold text-white">
                      {request.username}
                    </p>
                  </div>
                  <div className="flex flex-1 justify-end gap-2 sm:gap-3">
                    <Button
                      onClick={() => handleDeclineRequest(request.id, request.amizadeId)}
                      className="h-11 sm:h-12 flex-1 bg-decline text-white text-xs sm:text-sm font-bold gap-1.5 sm:gap-2 touch-manipulation"
                    >
                      <span className="material-symbols-outlined text-base sm:text-lg">close</span>
                      <span className="truncate">Recusar</span>
                    </Button>
                    <Button
                      onClick={() => handleAcceptRequest(request.id, request.amizadeId)}
                      className="h-11 sm:h-12 flex-1 bg-accept text-white text-xs sm:text-sm font-bold gap-1.5 sm:gap-2 touch-manipulation"
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
        )}
      </main>
    </div>
  )
}

