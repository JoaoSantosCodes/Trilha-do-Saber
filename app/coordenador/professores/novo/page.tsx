'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'

export default function NovoProfessorPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [matricula, setMatricula] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nome.trim()) {
      setError('Digite o nome do professor')
      return
    }

    if (!email.trim()) {
      setError('Digite o email do professor')
      return
    }

    if (!senha.trim() || senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!matricula.trim()) {
      setError('Digite a matrícula do professor')
      return
    }

    setIsLoading(true)

    try {
      // Chamar API route para criar professor
      const response = await fetch('/api/admin/criar-professor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha: senha,
          matricula: matricula.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar professor')
      }

      // Redirecionar de volta à lista
      router.push('/coordenador/professores')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar professor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/95 p-3 sm:p-4 pb-2 backdrop-blur-sm justify-between safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
          Novo Professor
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {/* Nome */}
          <div>
            <Input
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ana Silva"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: ana.silva@escola.com"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <p className="text-gray-400 text-xs mt-1">O professor poderá alterar a senha após o primeiro login</p>
          </div>

          {/* Matrícula */}
          <div>
            <Input
              label="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ex: PROF-2024-001"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Matrícula única do professor</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4">
              <p className="text-red-400 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/20 text-white h-12 sm:h-14 text-sm sm:text-base touch-manipulation"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !nome?.trim() || !email?.trim() || !senha?.trim() || !matricula?.trim()}
              className="flex-1 bg-primary text-background-dark h-12 sm:h-14 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
                  <span className="text-xs sm:text-sm">Criando...</span>
                </span>
              ) : (
                'Criar Professor'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

