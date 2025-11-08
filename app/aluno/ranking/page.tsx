'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useRanking } from '@/hooks/useRanking'

interface RankingEntry {
  id: string
  position: number
  name: string
  xp: number
  avatar: string
  isMe?: boolean
}


export default function RankingPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'amigos' | 'global'>('amigos')
  const { ranking, loading } = useRanking(filter)

  const podium = ranking.slice(0, 3)
  const restOfRanking = ranking.slice(3)

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1A202C] overflow-x-hidden">
        <Header />
        <PageLoading message="Carregando ranking..." />
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1A202C] overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center bg-[#1A202C] p-3 sm:p-4 pb-2 justify-between sticky top-0 z-10 safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#FFD700]">trophy</span>
          </button>
        </div>
        <h2 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10 sm:pr-12">
          Ranking Semanal
        </h2>
      </div>

      {/* Segmented Buttons */}
      <div className="flex px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex h-9 sm:h-10 flex-1 items-center justify-center rounded-full bg-[#2D3748] p-1">
          <button
            onClick={() => setFilter('amigos')}
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300 touch-manipulation ${
              filter === 'amigos'
                ? 'bg-[#8A2BE2] shadow-[0_0_4px_rgba(138,43,226,0.5)] text-white'
                : 'text-gray-300'
            }`}
          >
            <span className="truncate">Amigos</span>
          </button>
          <button
            onClick={() => setFilter('global')}
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300 touch-manipulation ${
              filter === 'global'
                ? 'bg-[#8A2BE2] shadow-[0_0_4px_rgba(138,43,226,0.5)] text-white'
                : 'text-gray-300'
            }`}
          >
            <span className="truncate">Global</span>
          </button>
        </div>
      </div>

      {/* Podium Section */}
      {ranking.length > 0 ? (
        <div className="relative flex items-end justify-center gap-1 sm:gap-2 px-3 sm:px-4 pt-6 sm:pt-8 pb-4 sm:pb-6 h-56 sm:h-64">
          {/* 2nd Place */}
          <div className="flex flex-col items-center w-1/3">
            {podium[1] ? (
              <>
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 sm:h-20 sm:w-20 border-3 sm:border-4 border-[#C0C0C0]"
                    style={{
                      backgroundImage: podium[1].avatar_url
                        ? `url('${podium[1].avatar_url}')`
                        : undefined,
                      backgroundColor: podium[1].avatar_url ? undefined : '#E57373',
                    }}
                  />
                  <div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 flex size-6 sm:size-8 items-center justify-center rounded-full bg-[#C0C0C0] text-[#1A202C] font-bold text-sm sm:text-lg">
                    2
                  </div>
                </div>
                <p className="text-white text-sm sm:text-base font-bold leading-tight mt-1.5 sm:mt-2 truncate px-1">
                  {podium[1].username || podium[1].full_name || 'Aluno'}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm font-normal leading-normal">
                  {podium[1].pontos_xp.toLocaleString('pt-BR')} XP
                </p>
              </>
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20" />
            )}
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center w-1/3">
            {podium[0] ? (
              <>
                <div className="relative">
                  <span className="material-symbols-outlined text-2xl sm:text-3xl absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 text-[#FFD700]">
                    workspace_premium
                  </span>
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 sm:h-24 sm:w-24 border-3 sm:border-4 border-[#FFD700]"
                    style={{
                      backgroundImage: podium[0].avatar_url
                        ? `url('${podium[0].avatar_url}')`
                        : undefined,
                      backgroundColor: podium[0].avatar_url ? undefined : '#E57373',
                    }}
                  />
                  <div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 flex size-8 sm:size-10 items-center justify-center rounded-full bg-[#FFD700] text-[#1A202C] font-bold text-lg sm:text-xl">
                    1
                  </div>
                </div>
                <p className="text-white text-base sm:text-lg font-bold leading-tight mt-1.5 sm:mt-2 truncate px-1">
                  {podium[0].username || podium[0].full_name || 'Aluno'}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm font-normal leading-normal">
                  {podium[0].pontos_xp.toLocaleString('pt-BR')} XP
                </p>
              </>
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24" />
            )}
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center w-1/3">
            {podium[2] ? (
              <>
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 sm:h-20 sm:w-20 border-3 sm:border-4 border-[#CD7F32]"
                    style={{
                      backgroundImage: podium[2].avatar_url
                        ? `url('${podium[2].avatar_url}')`
                        : undefined,
                      backgroundColor: podium[2].avatar_url ? undefined : '#E57373',
                    }}
                  />
                  <div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 flex size-6 sm:size-8 items-center justify-center rounded-full bg-[#CD7F32] text-white font-bold text-sm sm:text-lg">
                    3
                  </div>
                </div>
                <p className="text-white text-sm sm:text-base font-bold leading-tight mt-1.5 sm:mt-2 truncate px-1">
                  {podium[2].username || podium[2].full_name || 'Aluno'}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm font-normal leading-normal">
                  {podium[2].pontos_xp.toLocaleString('pt-BR')} XP
                </p>
              </>
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20" />
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon="emoji_events"
          title="Nenhum dado de ranking disponível"
          description="Ainda não há dados de ranking para exibir. Complete lições para aparecer no ranking!"
        />
      )}

      {/* Ranking List */}
      {restOfRanking.length > 0 ? (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {restOfRanking.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 px-4 min-h-14 justify-between rounded-lg ${
                entry.isCurrentUser
                  ? 'bg-[#2CF2B1]/10 border-2 border-[#2CF2B1]'
                  : 'bg-[#2D3748]'
              }`}
            >
              <div className="flex items-center gap-4">
                <p
                  className={`font-semibold w-6 text-center ${
                    entry.isCurrentUser ? 'text-[#2CF2B1]' : 'text-gray-400'
                  }`}
                >
                  {entry.posicao}
                </p>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10"
                  style={{
                    backgroundImage: entry.avatar_url ? `url('${entry.avatar_url}')` : undefined,
                    backgroundColor: entry.avatar_url ? undefined : '#E57373',
                  }}
                />
                <p
                  className={`text-base font-medium leading-normal flex-1 truncate ${
                    entry.isCurrentUser ? 'text-white font-bold' : 'text-white'
                  }`}
                >
                  {entry.username || entry.full_name || 'Aluno'}
                </p>
              </div>
              <p
                className={`text-sm font-medium leading-normal ${
                  entry.isCurrentUser ? 'text-[#2CF2B1] font-bold' : 'text-gray-300'
                }`}
              >
                {entry.pontos_xp.toLocaleString('pt-BR')} XP
              </p>
            </div>
          ))}
        </div>
      ) : ranking.length <= 3 ? null : null}
    </div>
  )
}

