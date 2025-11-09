'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'

export default function NotificacoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notificacoes, setNotificacoes] = useState<any[]>([])

  useEffect(() => {
    // Simular carregamento de notificações
    setTimeout(() => {
      setNotificacoes([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Header title="Notificações" showBack />
      
      <main className="p-4 pb-20 safe-area-bottom">
        {notificacoes.length === 0 ? (
          <EmptyState
            icon="notifications"
            title="Nenhuma notificação"
            message="Você não tem notificações no momento."
          />
        ) : (
          <div className="space-y-4">
            {notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className="bg-card-dark rounded-lg p-4 border border-border-dark"
              >
                <h3 className="font-semibold text-white mb-2">
                  {notificacao.titulo}
                </h3>
                <p className="text-text-secondary text-sm">
                  {notificacao.mensagem}
                </p>
                <p className="text-text-tertiary text-xs mt-2">
                  {new Date(notificacao.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

