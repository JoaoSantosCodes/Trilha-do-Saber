// Hook para buscar itens da loja e gerenciar compras
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'
import { useAluno } from '@/hooks/useAluno'

export interface ItemLoja {
  id: string
  nome: string
  descricao: string | null
  imagem_url: string
  categoria: 'avatar' | 'coruja' | 'powerup'
  subcategoria: string | null
  preco_moedas: number
  preco_pontos: number
  raridade: 'comum' | 'raro' | 'epico' | 'lendario' | null
  ativo: boolean
  ordem: number
  possui: boolean
  equipado: boolean
}

export function useLoja() {
  const { user } = useAuth()
  const { aluno, updateAluno } = useAluno()
  const [itens, setItens] = useState<ItemLoja[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchItens()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchItens = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // 1. Buscar todos os itens ativos da loja
      const { data: itensLoja, error: errItens } = await supabase
        .from('itens_loja')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })

      if (errItens) throw errItens

      // 2. Buscar inventário do aluno
      const { data: inventario, error: errInventario } = await supabase
        .from('inventario_aluno')
        .select('item_id, equipado')
        .eq('aluno_id', user.id)

      if (errInventario) throw errInventario

      // 3. Combinar dados
      const itensComStatus: ItemLoja[] = (itensLoja || []).map((item) => {
        const itemInventario = inventario?.find((inv) => inv.item_id === item.id)
        return {
          ...item,
          possui: !!itemInventario,
          equipado: itemInventario?.equipado || false,
        }
      })

      setItens(itensComStatus)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar itens da loja:', err)
    } finally {
      setLoading(false)
    }
  }

  const comprarItem = async (itemId: string) => {
    if (!user || !aluno) return { error: 'Usuário não autenticado' }

    try {
      // 1. Buscar item
      const { data: item, error: errItem } = await supabase
        .from('itens_loja')
        .select('*')
        .eq('id', itemId)
        .single()

      if (errItem) throw errItem
      if (!item) throw new Error('Item não encontrado')

      // 2. Verificar se já possui
      const { data: jaPossui } = await supabase
        .from('inventario_aluno')
        .select('id')
        .eq('aluno_id', user.id)
        .eq('item_id', itemId)
        .single()

      if (jaPossui) {
        return { error: 'Você já possui este item' }
      }

      // 3. Verificar saldo
      const precoTotal = item.preco_moedas + item.preco_pontos
      if (item.preco_moedas > (aluno.moedas || 0)) {
        return { error: 'Moedas insuficientes' }
      }
      if (item.preco_pontos > (aluno.pontos || 0)) {
        return { error: 'Pontos insuficientes' }
      }

      // 4. Realizar compra
      const { error: errCompra } = await supabase.from('inventario_aluno').insert({
        aluno_id: user.id,
        item_id: itemId,
        equipado: false,
        data_compra: new Date().toISOString(),
      })

      if (errCompra) throw errCompra

      // 5. Atualizar moedas e pontos do aluno
      await updateAluno({
        moedas: (aluno.moedas || 0) - item.preco_moedas,
        pontos: (aluno.pontos || 0) - item.preco_pontos,
      })

      // 6. Recarregar itens
      await fetchItens()

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const equiparItem = async (itemId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // 1. Verificar se possui o item
      const { data: inventario, error: errInventario } = await supabase
        .from('inventario_aluno')
        .select('*')
        .eq('aluno_id', user.id)
        .eq('item_id', itemId)
        .single()

      if (errInventario || !inventario) {
        return { error: 'Você não possui este item' }
      }

      // 2. Buscar categoria do item
      const { data: item, error: errItem } = await supabase
        .from('itens_loja')
        .select('categoria')
        .eq('id', itemId)
        .single()

      if (errItem) throw errItem

      // 3. Desequipar outros itens da mesma categoria
      if (item?.categoria) {
        // Buscar todos os itens equipados do aluno
        const { data: outrosItens, error: errOutros } = await supabase
          .from('inventario_aluno')
          .select('item_id')
          .eq('aluno_id', user.id)
          .eq('equipado', true)

        if (!errOutros && outrosItens && outrosItens.length > 0) {
          // Buscar categorias dos outros itens equipados
          const outrosIds = outrosItens.map((oi) => oi.item_id)
          const { data: outrosItensLoja } = await supabase
            .from('itens_loja')
            .select('id')
            .in('id', outrosIds)
            .eq('categoria', item.categoria)

          // Desequipar itens da mesma categoria
          if (outrosItensLoja && outrosItensLoja.length > 0) {
            const idsParaDesequipar = outrosItensLoja.map((o) => o.id)
            await supabase
              .from('inventario_aluno')
              .update({ equipado: false })
              .eq('aluno_id', user.id)
              .in('item_id', idsParaDesequipar)
          }
        }
      }

      // 4. Equipar o item
      const { error: errEquipar } = await supabase
        .from('inventario_aluno')
        .update({ equipado: true })
        .eq('id', inventario.id)

      if (errEquipar) throw errEquipar

      // 5. Recarregar itens
      await fetchItens()

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const desequiparItem = async (itemId: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error: err } = await supabase
        .from('inventario_aluno')
        .update({ equipado: false })
        .eq('aluno_id', user.id)
        .eq('item_id', itemId)

      if (err) throw err

      await fetchItens()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    itens,
    loading,
    error,
    refetch: fetchItens,
    comprarItem,
    equiparItem,
    desequiparItem,
  }
}

