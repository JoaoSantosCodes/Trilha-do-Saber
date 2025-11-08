// Hook para gerenciar conversas e mensagens
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Mensagem {
  id: string
  texto: string
  remetente_id: string
  lida: boolean
  created_at: string
  senderName?: string
  avatar?: string
}

export interface Conversa {
  id: string
  participante_1_id: string
  participante_2_id: string
  tipo: 'professor_pais' | 'coordenador_pais' | 'professor_professor'
  ultima_mensagem_at: string | null
  outro_participante?: {
    id: string
    full_name: string | null
    username: string | null
    avatar_url: string | null
  }
}

export function useChat(conversaId?: string) {
  const { user } = useAuth()
  const [conversa, setConversa] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar conversa
  const fetchConversa = useCallback(async () => {
    if (!user || !conversaId) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar a conversa
      const { data: conversaData, error: errConversa } = await supabase
        .from('conversas')
        .select('*')
        .eq('id', conversaId)
        .single()

      if (errConversa) throw errConversa

      if (!conversaData) {
        throw new Error('Conversa não encontrada')
      }

      // 2. Identificar o outro participante
      const outroParticipanteId =
        conversaData.participante_1_id === user.id
          ? conversaData.participante_2_id
          : conversaData.participante_1_id

      // 3. Buscar perfil do outro participante
      // Tentar users primeiro, depois profiles (fallback)
      let perfilOutro: any = null
      let errPerfil: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', outroParticipanteId)
        .single()

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('id', outroParticipanteId)
          .single()
        perfilOutro = profilesResult.data
        errPerfil = profilesResult.error
      } else {
        perfilOutro = usersResult.data ? {
          id: usersResult.data.id,
          full_name: usersResult.data.name || null,
          username: usersResult.data.name?.split(' ')[0] || null,
          avatar_url: usersResult.data.avatar_url || null
        } : null
        errPerfil = usersResult.error
      }

      if (errPerfil && !errPerfil.message?.includes('No rows')) throw errPerfil

      setConversa({
        ...conversaData,
        outro_participante: perfilOutro,
      })
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar conversa:', err)
    } finally {
      setLoading(false)
    }
  }, [user, conversaId])

  // Buscar mensagens
  const fetchMensagens = useCallback(async () => {
    if (!user || !conversaId) return

    try {
      // 1. Buscar mensagens
      const { data: mensagensData, error: errMensagens } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('created_at', { ascending: true })

      if (errMensagens) throw errMensagens

      // 2. Buscar perfis dos remetentes
      const remetentesIds = [...new Set(mensagensData?.map((m) => m.remetente_id) || [])]
      
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', remetentesIds)

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', remetentesIds)
        perfis = profilesResult.data
        errPerfis = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          full_name: u.name || null,
          username: u.name?.split(' ')[0] || null,
          avatar_url: u.avatar_url || null
        })) || null
        errPerfis = usersResult.error
      }

      if (errPerfis && !errPerfis.message?.includes('does not exist')) throw errPerfis

      // 3. Combinar mensagens com perfis
      const mensagensCompletas: Mensagem[] = (mensagensData || []).map((msg) => {
        const perfil = perfis?.find((p) => p.id === msg.remetente_id)
        return {
          ...msg,
          senderName: perfil?.full_name || perfil?.username || 'Usuário',
          avatar: perfil?.avatar_url || undefined,
        }
      })

      setMensagens(mensagensCompletas)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar mensagens:', err)
    }
  }, [user, conversaId])

  // Enviar mensagem
  const enviarMensagem = async (texto: string) => {
    if (!user || !conversaId || !texto.trim()) {
      return { error: 'Dados inválidos' }
    }

    try {
      // 1. Inserir mensagem
      const { data: novaMensagem, error: errMensagem } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          remetente_id: user.id,
          texto: texto.trim(),
          lida: false,
        })
        .select()
        .single()

      if (errMensagem) throw errMensagem

      // 2. Atualizar última mensagem da conversa
      await supabase
        .from('conversas')
        .update({ ultima_mensagem_at: new Date().toISOString() })
        .eq('id', conversaId)

      // 3. Buscar perfil do remetente para adicionar à mensagem
      // Tentar users primeiro, depois profiles (fallback)
      let perfil: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', user.id)
        .single()

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('id', user.id)
          .single()
        perfil = profilesResult.data
      } else {
        perfil = usersResult.data ? {
          id: usersResult.data.id,
          full_name: usersResult.data.name || null,
          username: usersResult.data.name?.split(' ')[0] || null,
          avatar_url: usersResult.data.avatar_url || null
        } : null
      }

      const mensagemCompleta: Mensagem = {
        ...novaMensagem,
        senderName: perfil?.full_name || perfil?.username || 'Você',
        avatar: perfil?.avatar_url || undefined,
      }

      // 4. Adicionar mensagem ao estado local
      setMensagens((prev) => [...prev, mensagemCompleta])

      return { error: null, mensagem: mensagemCompleta }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  // Marcar mensagens como lidas
  const marcarComoLida = async (mensagemId?: string) => {
    if (!user || !conversaId) return

    try {
      if (mensagemId) {
        // Marcar mensagem específica como lida
        await supabase
          .from('mensagens')
          .update({ lida: true })
          .eq('id', mensagemId)
          .eq('conversa_id', conversaId)
          .neq('remetente_id', user.id) // Apenas mensagens que não são do usuário atual
      } else {
        // Marcar todas as mensagens não lidas da conversa como lidas
        await supabase
          .from('mensagens')
          .update({ lida: true })
          .eq('conversa_id', conversaId)
          .neq('remetente_id', user.id)
      }

      // Atualizar estado local
      setMensagens((prev) =>
        prev.map((msg) => {
          if (msg.remetente_id === user.id) return msg
          if (mensagemId && msg.id !== mensagemId) return msg
          return { ...msg, lida: true }
        })
      )
    } catch (err: any) {
      console.error('Erro ao marcar mensagem como lida:', err)
    }
  }

  // Setup real-time subscription
  useEffect(() => {
    if (!conversaId) return

    // Buscar dados iniciais
    fetchConversa()
    fetchMensagens()

    // Configurar subscription para novas mensagens
    const channel = supabase
      .channel(`conversa:${conversaId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversaId}`,
        },
        async (payload) => {
          const novaMensagem = payload.new as any

          // Buscar perfil do remetente
          // Tentar users primeiro, depois profiles (fallback)
          let perfil: any = null
          
          const usersResult = await supabase
            .from('users')
            .select('id, name, avatar_url')
            .eq('id', novaMensagem.remetente_id)
            .single()

          if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
            const profilesResult = await supabase
              .from('profiles')
              .select('id, full_name, username, avatar_url')
              .eq('id', novaMensagem.remetente_id)
              .single()
            perfil = profilesResult.data
          } else {
            perfil = usersResult.data ? {
              id: usersResult.data.id,
              full_name: usersResult.data.name || null,
              username: usersResult.data.name?.split(' ')[0] || null,
              avatar_url: usersResult.data.avatar_url || null
            } : null
          }

          const mensagemCompleta: Mensagem = {
            ...novaMensagem,
            senderName: perfil?.full_name || perfil?.username || 'Usuário',
            avatar: perfil?.avatar_url || undefined,
          }

          setMensagens((prev) => {
            // Evitar duplicatas
            if (prev.some((m) => m.id === mensagemCompleta.id)) {
              return prev
            }
            return [...prev, mensagemCompleta]
          })

          // Se a mensagem não é do usuário atual, marcar como lida automaticamente
          if (user && novaMensagem.remetente_id !== user.id) {
            marcarComoLida(novaMensagem.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversaId, user, fetchConversa, fetchMensagens])

  return {
    conversa,
    mensagens,
    loading,
    error,
    enviarMensagem,
    marcarComoLida,
    refetch: fetchMensagens,
  }
}

