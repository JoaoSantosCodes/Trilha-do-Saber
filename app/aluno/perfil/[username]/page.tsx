'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { useAmizades } from '@/hooks/useAmizades'
import { supabase } from '@/supabase/config'

interface Achievement {
  id: string
  name: string
  description: string
  image: string
}

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Perfeccionista',
    description: '10 aulas sem errar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_dA07Y7BddlIY2Yg5bVlQ_wu_Z7T3QLP0DAKr4i6b5uweDSSD-BrfnrrlDF-m1izoAufwrjwE4AuUtX9JGMnO-2g8vXTnGGN6BAKmdFzcs5N2vysmUAfO_2P-dNY22o0dQhPUk6tGf2LG16kOpTL3YCctYiQyq7MTSnXM0Z0p3nP2lqnUCRqA59CpFedsk705Hmb6i1W_uMX_vUDC-SYxpBRn-1XkLjEmSKeaWmfIoaUzaqg9-oO_D2RiahwiXs7wMxbbJMQt9xZ',
  },
  {
    id: '2',
    name: 'Sábio',
    description: 'Alcançou 5000 XP',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Z7bdMqYr5UJWdto53-6W-ICl3ZpiGtrvrP4oepgMIMeJ0a30TvlhCToZcMrjz1pfG6RezdSkGnw9Ya0tCbNy6uWZEPhzv0F0tDHn0qtYXnJ0iPKvYTWIfv7bl3FbznzBY4aIhSFCzmYzQJOMfboYOb4f2gwMQvWaSmCrJmJ8jbI-VHzhH_BrOUOVk3F6HbvvBLoA5y27rEzdwQ2ePcLa1IClt3N7fQlrVU6mZlRVx1mm8-SB9eNa5YysgUf6EIazzhuUFHGGf-kW',
  },
  {
    id: '3',
    name: 'Vitorioso',
    description: 'Ficou em 1º lugar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxI0jvAVp5sVsRScZsMzZTwwzEZRlKrUyyFN_h4Wwkdv2Sfm4Fj1qp8OnuoBDUpcFtvTNQVQPhbAlCftRWECpD1LNBcWf4x4_gYoaZlgtcLFqkVfuUepKwjvyQHBcW4q5IZU2ozscOTx5iETuXAHpuJcMeHr56n5KWw1RY42WF9bAqtmRhFWpOfRbzbztsx0gZAJjOTSwsF71NaFyOijaFYfq-T7ymWdCYW_q-t3Pk0OXllhwjt7XZCbQyMtdgmLoExuOVEvETDGYm',
  },
  {
    id: '4',
    name: 'Conquistador',
    description: 'Completou 100 lições',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1akb22msXpHcOQYPHU8mPFSgvcGxxakWgBPiZ3O0rMKHDMOLp3lSIsp-Ul8-oNOoxb9XtEymtDQXo68ZNt9cAywjO0XrOnr2888y9ZkKOxJytZy8WXLo3h4KlkG3rgr-2gqLt_zMotjzMHj7nE3zRapNSeoODxxlfYRyrExwnHp_fZAEq_lJxD-UMaIvGYp-RnX8GM1qkjKPM6yIVHzZGME3ZF2zOYMAGSfL83WF_Jxlwj90EAsD3jOtbzclRFPqxJkQI2GdYTxK',
  },
  {
    id: '5',
    name: 'Foguete',
    description: 'Completou 5 lições em 1 dia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYITQOeQ00YGrQIYupA0XA_b-C1bSp0CLi8asS3M08Bq_6qwfw7cJKGwaeb2HGS7_RVLrgvEPGIgRlY9JdKKWSVLaSRJ9j0UxWWNlMvF7rwrzDpy6RhX3ZrlmynFYh6JiayxvDpzt3150j7wuXqxFbZ7cRHVmbMucDev25alHlAzzFlLRe8FIC3lhztYXdLDOtLVDZimBr2DAsOwOYiItQq8nX23GFghaVkGbgSwneC_dUIjsNJsL7mHMsT3wMybb9AeN4N3TWitUO',
  },
]

interface PerfilPublico {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  pontos: number
  moedas: number
  sequencia_atual: number
  cor_fundo_perfil: string
  icone_conquista_favorito: string | null
}

export default function PerfilPublicoPage() {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  const { user } = useAuth()
  const { amigos, adicionarAmigo } = useAmizades()
  const [perfil, setPerfil] = useState<PerfilPublico | null>(null)
  const [conquistas, setConquistas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingFriend, setIsAddingFriend] = useState(false)

  const isFriend = user && perfil
    ? amigos.some((amigo) => amigo.id === perfil.id)
    : false

  useEffect(() => {
    if (username) {
      fetchPerfil()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  const fetchPerfil = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar perfil por username ou id
      // Tentar users primeiro, depois profiles (fallback)
      let profile: any = null
      let profileError: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url, role')
        .or(`name.ilike.%${username}%,id.eq.${username}`)
        .eq('role', 'student')
        .single()

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .or(`username.eq.${username},id.eq.${username}`)
          .eq('role', 'aluno')
          .single()
        profile = profilesResult.data
        profileError = profilesResult.error
      } else {
        profile = usersResult.data ? {
          id: usersResult.data.id,
          username: usersResult.data.name?.split(' ')[0] || null,
          full_name: usersResult.data.name || null,
          avatar_url: usersResult.data.avatar_url || null
        } : null
        profileError = usersResult.error
      }

      if (profileError && !profileError.message?.includes('No rows')) throw profileError
      if (!profile) throw new Error('Perfil não encontrado')

      // Buscar dados do aluno
      // Tentar students primeiro, depois alunos (fallback)
      let aluno: any = null
      let alunoError: any = null
      
      const studentsResult = await supabase
        .from('students')
        .select('*')
        .eq('user_id', profile.id)
        .single()

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .select('*')
          .eq('id', profile.id)
          .single()
        aluno = alunosResult.data
        alunoError = alunosResult.error
      } else {
        // Mapear students para formato de alunos
        aluno = studentsResult.data ? {
          id: studentsResult.data.user_id,
          pontos: studentsResult.data.total_points || 0,
          moedas: 0, // students não tem moedas
          sequencia_atual: 0,
          cor_fundo_perfil: '#E57373',
          icone_conquista_favorito: null
        } : null
        alunoError = studentsResult.error
      }

      if (alunoError && !alunoError.message?.includes('No rows')) throw alunoError

      setPerfil({
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        pontos: aluno.pontos,
        moedas: aluno.moedas,
        sequencia_atual: aluno.sequencia_atual,
        cor_fundo_perfil: aluno.cor_fundo_perfil,
        icone_conquista_favorito: aluno.icone_conquista_favorito,
      })

      // Buscar conquistas desbloqueadas
      const { data: conquistasData, error: conquistasError } = await supabase
        .from('aluno_conquistas')
        .select('conquista_id, conquistas(*)')
        .eq('aluno_id', profile.id)
        .limit(5)

      if (conquistasError) throw conquistasError

      setConquistas(conquistasData?.map((ac: any) => ac.conquistas) || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar perfil:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async () => {
    if (!perfil || !user || isFriend) return

    setIsAddingFriend(true)
    try {
      const { error } = await adicionarAmigo(perfil.id)
      if (error) throw new Error(error)
      // Recarregar lista de amigos
      window.location.reload()
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar amigo')
    } finally {
      setIsAddingFriend(false)
    }
  }

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <Header title="Carregando..." />
        <PageLoading message="Carregando perfil..." />
      </div>
    )
  }

  if (error || !perfil) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <Header title="Erro" />
        <EmptyState
          icon="error"
          title={error || 'Perfil não encontrado'}
          description="Não foi possível carregar o perfil. O usuário pode não existir ou você não tem permissão para visualizá-lo."
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Dynamic Banner */}
      <div
        className="absolute top-0 left-0 w-full h-48 bg-purple-500/30"
        style={{
          background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.4) 0%, rgba(16, 34, 22, 0) 100%)',
        }}
      />

      {/* Top App Bar */}
      <div className="relative flex items-center p-3 sm:p-4 pb-2 justify-between z-10 safe-area-top">
        <button
          onClick={() => router.back()}
          className="text-white flex size-10 shrink-0 items-center justify-center bg-black/20 rounded-full touch-manipulation active:opacity-70"
          aria-label="Voltar"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="text-white flex size-10 shrink-0 items-center justify-center bg-black/20 rounded-full touch-manipulation active:opacity-70" aria-label="Compartilhar">
            <span className="material-symbols-outlined text-xl sm:text-2xl">share</span>
          </button>
          <button className="text-white flex size-10 shrink-0 items-center justify-center bg-black/20 rounded-full touch-manipulation active:opacity-70" aria-label="Mais opções">
            <span className="material-symbols-outlined text-xl sm:text-2xl">more_vert</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative flex p-3 sm:p-4 pt-0 z-10">
        <div className="flex w-full flex-col gap-3 sm:gap-4 items-center">
          <div className="flex gap-3 sm:gap-4 flex-col items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 border-3 sm:border-4 border-primary/80"
              style={{
                backgroundImage: perfil.avatar_url ? `url('${perfil.avatar_url}')` : undefined,
                backgroundColor: perfil.cor_fundo_perfil || '#E57373',
              }}
            />
            <p className="text-white text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] text-center px-2">
              {perfil.username || perfil.full_name || 'Aluno'}
            </p>
          </div>
          {user && user.id !== perfil.id && (
            <Button
              onClick={handleAddFriend}
              disabled={isFriend || isAddingFriend}
              className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-4 sm:px-6 bg-primary text-background-dark text-sm sm:text-base font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] shadow-lg shadow-primary/30 disabled:opacity-50 touch-manipulation"
            >
              {isAddingFriend ? (
                <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-1 sm:mr-2 text-lg sm:text-xl">person_add</span>
                  <span className="truncate">
                    {isFriend ? 'Já é Amigo' : 'Adicionar Amigo'}
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-3 sm:p-4 bg-gray-500/10 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg sm:text-xl">star</span>
            <p className="text-gray-300 text-xs sm:text-sm font-medium leading-normal truncate">Total de Pontos (XP)</p>
          </div>
          <p className="text-white tracking-light text-2xl sm:text-3xl font-bold leading-tight">
            {perfil.pontos.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-3 sm:p-4 bg-gray-500/10 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg sm:text-xl">emoji_events</span>
            <p className="text-gray-300 text-xs sm:text-sm font-medium leading-normal truncate">Divisão no Ranking</p>
          </div>
          <p className="text-white tracking-light text-lg font-bold leading-tight">
            {perfil.pontos >= 5000 ? 'Divisão Ouro' : perfil.pontos >= 2000 ? 'Divisão Prata' : 'Divisão Bronze'}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 bg-gray-500/10 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
            <p className="text-gray-300 text-sm font-medium leading-normal">Sequência</p>
          </div>
          <p className="text-white tracking-light text-3xl font-bold leading-tight">
            {perfil.sequencia_atual} dias
          </p>
        </div>
      </div>

      {/* Section Header for Achievements */}
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Conquistas em Destaque
      </h2>

      {/* Achievements Carousel */}
      {conquistas.length > 0 ? (
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-4">
          <div className="flex items-stretch gap-4">
            {conquistas.map((conquista: any) => (
              <div key={conquista.id} className="flex h-full flex-col gap-3 text-center rounded-lg min-w-32 pt-4">
                <div className="flex flex-col self-center w-24 h-24 items-center justify-center">
                  {conquista.imagem_url ? (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-contain w-full h-full"
                      style={{ backgroundImage: `url('${conquista.imagem_url}')` }}
                    />
                  ) : (
                    <div className={`p-4 rounded-full bg-gradient-to-br ${conquista.cor_gradiente || 'from-yellow-300 to-amber-500'}`}>
                      <span
                        className="material-symbols-outlined text-4xl text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {conquista.icone}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-base font-bold leading-normal">{conquista.nome}</p>
                  {conquista.descricao && (
                    <p className="text-gray-300 text-sm font-normal leading-normal">
                      {conquista.descricao}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-gray-400">
          Nenhuma conquista em destaque
        </div>
      )}
      <div className="h-10"></div>
    </div>
  )
}

