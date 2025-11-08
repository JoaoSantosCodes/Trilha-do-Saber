'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { usePais } from '@/hooks/usePais'

function NovaTarefaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filhos, criarTarefa } = usePais()
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [tipo, setTipo] = useState<'licoes' | 'tempo' | 'pontos' | 'personalizada'>('licoes')
  const [descricao, setDescricao] = useState('')
  const [metaValor, setMetaValor] = useState('')
  const [unidade, setUnidade] = useState('')
  const [recompensa, setRecompensa] = useState('')
  const [dataLimite, setDataLimite] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pegar filho da query string se disponível
  useEffect(() => {
    const childId = searchParams.get('filho')
    if (childId && filhos.some((f) => f.id === childId)) {
      setSelectedChild(childId)
    } else if (filhos.length > 0 && !selectedChild) {
      setSelectedChild(filhos[0].id)
    }
  }, [searchParams, filhos, selectedChild])

  // Atualizar unidade baseado no tipo
  useEffect(() => {
    switch (tipo) {
      case 'licoes':
        setUnidade('lições')
        break
      case 'tempo':
        setUnidade('minutos')
        break
      case 'pontos':
        setUnidade('pontos')
        break
      case 'personalizada':
        setUnidade('')
        break
    }
  }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedChild) {
      setError('Selecione um filho')
      return
    }

    if (!descricao.trim()) {
      setError('Digite uma descrição para a tarefa')
      return
    }

    const meta = parseInt(metaValor)
    if (!meta || meta <= 0) {
      setError('Digite um valor válido para a meta')
      return
    }

    setIsLoading(true)

    try {
      const { error: err } = await criarTarefa(
        selectedChild,
        descricao.trim(),
        tipo,
        meta,
        unidade || null,
        recompensa.trim() || null,
        dataLimite || null
      )

      if (err) {
        setError(err)
        return
      }

      // Redirecionar de volta ao painel
      router.push('/pais/painel')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar tarefa')
    } finally {
      setIsLoading(false)
    }
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
          Nova Tarefa
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Seleção de Filho */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Para qual filho?</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filhos.map((filho) => (
                <button
                  key={filho.id}
                  type="button"
                  onClick={() => setSelectedChild(filho.id)}
                  className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                    selectedChild === filho.id
                      ? 'bg-primary text-background-dark'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal">
                    {filho.full_name || filho.username || 'Filho'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Tarefa */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Tipo de Tarefa</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'licoes', label: 'Lições', icon: 'menu_book' },
                { value: 'tempo', label: 'Tempo', icon: 'schedule' },
                { value: 'pontos', label: 'Pontos', icon: 'star' },
                { value: 'personalizada', label: 'Personalizada', icon: 'edit' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTipo(option.value as any)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-colors ${
                    tipo === option.value
                      ? 'bg-primary text-background-dark'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{option.icon}</span>
                  <p className="text-sm font-bold">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Input
              label="Descrição da Tarefa"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Completar 5 lições de Matemática"
              required
            />
          </div>

          {/* Meta */}
          <div>
            <Input
              label={`Meta (${unidade || 'valor'})`}
              type="number"
              value={metaValor}
              onChange={(e) => setMetaValor(e.target.value)}
              placeholder="Ex: 5"
              min="1"
              required
            />
          </div>

          {/* Unidade (apenas para personalizada) */}
          {tipo === 'personalizada' && (
            <div>
              <Input
                label="Unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="Ex: exercícios, páginas, etc."
              />
            </div>
          )}

          {/* Recompensa */}
          <div>
            <Input
              label="Recompensa (opcional)"
              value={recompensa}
              onChange={(e) => setRecompensa(e.target.value)}
              placeholder="Ex: Passeio no parque, sorvete, etc."
            />
          </div>

          {/* Data Limite */}
          <div>
            <Input
              label="Data Limite (opcional)"
              type="date"
              value={dataLimite}
              onChange={(e) => setDataLimite(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/20 text-white h-14"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedChild || !descricao.trim() || !metaValor}
              className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Criando...
                </span>
              ) : (
                'Criar Tarefa'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function NovaTarefaPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    }>
      <NovaTarefaContent />
    </Suspense>
  )
}

