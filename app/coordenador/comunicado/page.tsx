'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useCoordenador } from '@/hooks/useCoordenador'
import { supabase } from '@/supabase/config'

export default function EnviarComunicadoPage() {
  const router = useRouter()
  const { enviarComunicado } = useCoordenador()
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([])

  useEffect(() => {
    fetchTurmas()
  }, [])

  const fetchTurmas = async () => {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setTurmas(data || [])
    } catch (err) {
      console.error('Erro ao buscar turmas:', err)
    }
  }
  const [tipo, setTipo] = useState<'geral' | 'turma' | 'escola'>('geral')
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!titulo.trim()) {
      setError('Digite um título para o comunicado')
      return
    }

    if (!conteudo.trim()) {
      setError('Digite o conteúdo do comunicado')
      return
    }

    if (tipo === 'turma' && !turmaSelecionada) {
      setError('Selecione uma turma')
      return
    }

    setIsLoading(true)

    try {
      const { error: err } = await enviarComunicado(
        titulo.trim(),
        conteudo.trim(),
        tipo,
        tipo === 'turma' ? turmaSelecionada : undefined
      )

      if (err) {
        setError(err)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/coordenador/painel')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar comunicado')
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
          Enviar Comunicado
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Tipo de Comunicado */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Tipo de Comunicado</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'geral', label: 'Geral', icon: 'public' },
                { value: 'turma', label: 'Turma', icon: 'groups' },
                { value: 'escola', label: 'Escola', icon: 'school' },
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

          {/* Seleção de Turma (se tipo for turma) */}
          {tipo === 'turma' && (
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Selecionar Turma</label>
              <select
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Título */}
          <div>
            <Input
              label="Título do Comunicado"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Reunião de Pais e Mestres"
              required
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Conteúdo</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite o conteúdo do comunicado..."
              rows={8}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="rounded-xl bg-green-500/20 border border-green-500/50 p-4">
              <p className="text-green-400 text-sm font-medium">
                Comunicado enviado com sucesso! Redirecionando...
              </p>
            </div>
          )}

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
              disabled={isLoading || success}
              className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Enviando...
                </span>
              ) : (
                'Enviar Comunicado'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

