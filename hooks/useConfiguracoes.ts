// Hook para gerenciar configurações do usuário
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Configuracoes {
  efeitos_sonoros: boolean
  musica_fundo: boolean
  lembretes_estudo: boolean
  notificacoes_push: boolean
  tema: 'light' | 'dark' | 'auto'
  idioma: string
}

const defaultConfig: Configuracoes = {
  efeitos_sonoros: true,
  musica_fundo: false,
  lembretes_estudo: true,
  notificacoes_push: true,
  tema: 'dark',
  idioma: 'pt-BR',
}

export function useConfiguracoes() {
  const { user } = useAuth()
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchConfiguracoes()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchConfiguracoes = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar configurações do usuário
      const { data, error: err } = await supabase
        .from('configuracoes_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single()

      if (err && err.code !== 'PGRST116') {
        // PGRST116 = No rows found
        throw err
      }

      if (data) {
        setConfiguracoes({
          efeitos_sonoros: data.efeitos_sonoros ?? defaultConfig.efeitos_sonoros,
          musica_fundo: data.musica_fundo ?? defaultConfig.musica_fundo,
          lembretes_estudo: data.lembretes_estudo ?? defaultConfig.lembretes_estudo,
          notificacoes_push: data.notificacoes_push ?? defaultConfig.notificacoes_push,
          tema: (data.tema as 'light' | 'dark' | 'auto') || defaultConfig.tema,
          idioma: data.idioma || defaultConfig.idioma,
        })
      } else {
        // Criar configurações padrão se não existirem
        await criarConfiguracoesPadrao()
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar configurações:', err)
    } finally {
      setLoading(false)
    }
  }

  const criarConfiguracoesPadrao = async () => {
    if (!user) return

    try {
      const { error: err } = await supabase.from('configuracoes_usuario').insert({
        usuario_id: user.id,
        ...defaultConfig,
      })

      if (err) throw err
      setConfiguracoes(defaultConfig)
    } catch (err: any) {
      console.error('Erro ao criar configurações padrão:', err)
    }
  }

  const atualizarConfiguracao = async (campo: keyof Configuracoes, valor: any) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // Atualizar estado local primeiro
      const novasConfiguracoes = { ...configuracoes, [campo]: valor }
      setConfiguracoes(novasConfiguracoes)

      // Verificar se já existe registro
      const { data: existing } = await supabase
        .from('configuracoes_usuario')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

      if (existing) {
        // Atualizar registro existente
        const { error: err } = await supabase
          .from('configuracoes_usuario')
          .update({
            [campo]: valor,
            updated_at: new Date().toISOString(),
          })
          .eq('usuario_id', user.id)

        if (err) throw err
      } else {
        // Criar novo registro
        const { error: err } = await supabase.from('configuracoes_usuario').insert({
          usuario_id: user.id,
          ...novasConfiguracoes,
        })

        if (err) throw err
      }

      return { error: null }
    } catch (err: any) {
      // Reverter estado local em caso de erro
      setConfiguracoes(configuracoes)
      return { error: err.message }
    }
  }

  const salvarConfiguracoes = async (novasConfiguracoes: Partial<Configuracoes>) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // Atualizar estado local
      const configCompleta = { ...configuracoes, ...novasConfiguracoes }
      setConfiguracoes(configCompleta)

      // Verificar se já existe registro
      const { data: existing } = await supabase
        .from('configuracoes_usuario')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

      if (existing) {
        // Atualizar registro existente
        const { error: err } = await supabase
          .from('configuracoes_usuario')
          .update({
            ...novasConfiguracoes,
            updated_at: new Date().toISOString(),
          })
          .eq('usuario_id', user.id)

        if (err) throw err
      } else {
        // Criar novo registro
        const { error: err } = await supabase.from('configuracoes_usuario').insert({
          usuario_id: user.id,
          ...configCompleta,
        })

        if (err) throw err
      }

      return { error: null }
    } catch (err: any) {
      // Reverter estado local em caso de erro
      setConfiguracoes(configuracoes)
      return { error: err.message }
    }
  }

  return {
    configuracoes,
    loading,
    error,
    refetch: fetchConfiguracoes,
    atualizarConfiguracao,
    salvarConfiguracoes,
  }
}

