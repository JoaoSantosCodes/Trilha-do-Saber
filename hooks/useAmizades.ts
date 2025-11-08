// Hook para buscar e gerenciar amizades
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface Amigo {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  pontos: number
  moedas: number
  aluno_id: string
}

export function useAmizades() {
  const { user } = useAuth()
  const [amigos, setAmigos] = useState<Amigo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAmigos()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAmigos = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar amizades aceitas onde o aluno é o solicitante ou o amigo
      const { data: amizades, error: err } = await supabase
        .from('amizades')
        .select('*')
        .or(`aluno_id.eq.${user.id},amigo_id.eq.${user.id}`)
        .eq('status', 'aceita')

      if (err) throw err

      // Extrair IDs dos amigos
      const amigosIds = (amizades || []).map((amizade) =>
        amizade.aluno_id === user.id ? amizade.amigo_id : amizade.aluno_id
      )

      if (amigosIds.length === 0) {
        setAmigos([])
        return
      }

      // Buscar dados dos amigos (perfil + dados do aluno)
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', amigosIds)

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', amigosIds)
        perfis = profilesResult.data
        errPerfis = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          username: u.name?.split(' ')[0] || null,
          full_name: u.name || null,
          avatar_url: u.avatar_url || null
        })) || null
        errPerfis = usersResult.error
      }

      if (errPerfis) throw errPerfis

      // Tentar students primeiro, depois alunos (fallback)
      let dadosAlunos: any[] | null = null
      let errAlunos: any = null
      
      const studentsResult = await supabase
        .from('students')
        .select('user_id as id, total_points as pontos')
        .in('user_id', amigosIds)

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .select('id, pontos, moedas')
          .in('id', amigosIds)
        dadosAlunos = alunosResult.data
        errAlunos = alunosResult.error
      } else {
        dadosAlunos = studentsResult.data?.map((s: any) => ({
          id: s.id,
          pontos: s.pontos || 0,
          moedas: 0 // students não tem moedas, usar 0
        })) || null
        errAlunos = studentsResult.error
      }

      if (errAlunos) throw errAlunos

      // Combinar dados
      const amigosCompletos: Amigo[] = (perfis || []).map((perfil) => {
        const dadosAluno = dadosAlunos?.find((da) => da.id === perfil.id)

        return {
          id: perfil.id,
          username: perfil.username,
          full_name: perfil.full_name,
          avatar_url: perfil.avatar_url,
          pontos: dadosAluno?.pontos || 0,
          moedas: dadosAluno?.moedas || 0,
          aluno_id: perfil.id,
        }
      })

      setAmigos(amigosCompletos)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar amigos:', err)
    } finally {
      setLoading(false)
    }
  }

  const adicionarAmigo = async (amigoId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error: err } = await supabase.from('amizades').insert({
        aluno_id: user.id,
        amigo_id: amigoId,
        status: 'pendente',
        solicitado_por: user.id,
      })

      if (err) throw err
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const aceitarAmizade = async (amizadeId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error: err } = await supabase
        .from('amizades')
        .update({
          status: 'aceita',
          data_resposta: new Date().toISOString(),
        })
        .eq('id', amizadeId)

      if (err) throw err
      await fetchAmigos()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const recusarAmizade = async (amizadeId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error: err } = await supabase
        .from('amizades')
        .update({
          status: 'recusada',
          data_resposta: new Date().toISOString(),
        })
        .eq('id', amizadeId)

      if (err) throw err
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const buscarUsuarios = async (termo: string) => {
    if (!user || !termo.trim()) return []

    try {
      // Buscar perfis que correspondem ao termo (username ou full_name)
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let err: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url, role')
        .eq('role', 'student')
        .neq('id', user.id)
        .ilike('name', `%${termo}%`)
        .limit(20)

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('role', 'aluno')
          .neq('id', user.id)
          .or(`username.ilike.%${termo}%,full_name.ilike.%${termo}%`)
          .limit(20)
        perfis = profilesResult.data
        err = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          username: u.name?.split(' ')[0] || null,
          full_name: u.name || null,
          avatar_url: u.avatar_url || null
        })) || null
        err = usersResult.error
      }

      if (err) throw err

      // Buscar status de amizade para cada perfil
      const perfisComStatus = await Promise.all(
        (perfis || []).map(async (perfil) => {
          const { data: amizade } = await supabase
            .from('amizades')
            .select('id, status, solicitado_por')
            .or(`aluno_id.eq.${user.id}.and.amigo_id.eq.${perfil.id},aluno_id.eq.${perfil.id}.and.amigo_id.eq.${user.id}`)
            .limit(1)
            .single()

          let status: 'available' | 'pending' | 'friend' = 'available'
          if (amizade) {
            if (amizade.status === 'aceita') {
              status = 'friend'
            } else if (amizade.status === 'pendente') {
              status = 'pending'
            }
          }

          return {
            id: perfil.id,
            username: perfil.username || '',
            name: perfil.full_name || perfil.username || 'Aluno',
            avatar: perfil.avatar_url || '',
            status,
            amizadeId: amizade?.id,
          }
        })
      )

      return perfisComStatus
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err)
      return []
    }
  }

  const buscarPedidosPendentes = async () => {
    if (!user) return []

    try {
      // Buscar pedidos pendentes onde o usuário é o destinatário
      const { data: pedidos, error: err } = await supabase
        .from('amizades')
        .select('id, aluno_id, amigo_id, solicitado_por')
        .or(`aluno_id.eq.${user.id},amigo_id.eq.${user.id}`)
        .eq('status', 'pendente')
        .neq('solicitado_por', user.id) // Apenas pedidos recebidos, não enviados

      if (err) throw err

      // Extrair IDs dos solicitantes (quem enviou o pedido)
      const solicitantesIds = (pedidos || []).map((pedido) => {
        // O solicitante é quem está em solicitado_por
        return pedido.solicitado_por
      })

      if (solicitantesIds.length === 0) return []

      // Buscar perfis dos solicitantes
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      const usersResult = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', solicitantesIds)

      if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
        const profilesResult = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', solicitantesIds)
        perfis = profilesResult.data
        errPerfis = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          username: u.name?.split(' ')[0] || null,
          full_name: u.name || null,
          avatar_url: u.avatar_url || null
        })) || null
        errPerfis = usersResult.error
      }

      if (errPerfis) throw errPerfis

      // Combinar dados
      const pedidosCompletos = (pedidos || []).map((pedido) => {
        const solicitanteId = pedido.solicitado_por
        const perfil = perfis?.find((p) => p.id === solicitanteId)

        return {
          id: pedido.id,
          amizadeId: pedido.id,
          userId: solicitanteId,
          username: perfil?.username || '',
          avatar: perfil?.avatar_url || '',
        }
      })

      return pedidosCompletos
    } catch (err: any) {
      console.error('Erro ao buscar pedidos pendentes:', err)
      return []
    }
  }

  const removerAmigo = async (amigoId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // Buscar a amizade (pode estar em qualquer ordem: aluno_id ou amigo_id)
      const { data: amizade, error: errBuscar } = await supabase
        .from('amizades')
        .select('id')
        .or(`aluno_id.eq.${user.id}.and.amigo_id.eq.${amigoId},aluno_id.eq.${amigoId}.and.amigo_id.eq.${user.id}`)
        .eq('status', 'aceita')
        .single()

      if (errBuscar && errBuscar.code !== 'PGRST116') {
        throw errBuscar
      }

      if (!amizade) {
        return { error: 'Amizade não encontrada' }
      }

      // Remover a amizade (ou atualizar status para 'removida')
      const { error: errRemover } = await supabase
        .from('amizades')
        .delete()
        .eq('id', amizade.id)

      if (errRemover) throw errRemover

      await fetchAmigos()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    amigos,
    loading,
    error,
    refetch: fetchAmigos,
    adicionarAmigo,
    aceitarAmizade,
    recusarAmizade,
    removerAmigo,
    buscarUsuarios,
    buscarPedidosPendentes,
  }
}

