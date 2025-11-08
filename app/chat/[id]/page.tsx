'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/hooks/useChat'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const { user, profile } = useAuth()
  const conversaId = params.id as string
  const { conversa, mensagens, loading, enviarMensagem, marcarComoLida } = useChat(conversaId)
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Marcar mensagens como lidas quando visualizadas
  useEffect(() => {
    if (mensagens.length > 0 && user) {
      const mensagensNaoLidas = mensagens.filter(
        (m) => !m.lida && m.remetente_id !== user.id
      )
      if (mensagensNaoLidas.length > 0) {
        marcarComoLida()
      }
    }
  }, [mensagens, user, marcarComoLida])

  const handleSend = async () => {
    if (!inputMessage.trim() || isSending) return

    setIsSending(true)
    const { error } = await enviarMensagem(inputMessage)
    if (!error) {
      setInputMessage('')
    }
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Formatar timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden">
        <Header title="Carregando..." />
        <PageLoading message="Carregando conversa..." />
      </div>
    )
  }

  if (!conversa) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden">
        <Header title="Erro" />
        <EmptyState
          icon="chat_bubble"
          title="Conversa não encontrada"
          description="A conversa solicitada não foi encontrada ou você não tem permissão para acessá-la."
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      </div>
    )
  }

  const chatInfo = {
    name: conversa.outro_participante?.full_name || conversa.outro_participante?.username || 'Usuário',
    subtitle: '',
    avatar: conversa.outro_participante?.avatar_url || undefined,
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden">
      {/* Background Watermark */}
      <div
        className="absolute inset-0 opacity-[0.03] z-0 bg-center bg-no-repeat bg-contain"
        style={{
          backgroundImage: "url('https://storage.googleapis.com/pai-images/919920b7201c9a17.png')",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-background-dark/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="text-white flex size-10 shrink-0 items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="ml-2 flex-1">
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
              {chatInfo.name}
            </h2>
            {chatInfo.subtitle && (
              <p className="text-white/60 text-sm font-normal leading-normal">
                {chatInfo.subtitle}
              </p>
            )}
          </div>
          <button className="text-white flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Chat Body */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 z-0">
        <div className="flex flex-col gap-4 py-4">
          {mensagens.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p>Nenhuma mensagem ainda.</p>
                <p className="text-sm mt-2">Comece a conversa enviando uma mensagem!</p>
              </div>
            </div>
          ) : (
            mensagens.map((message) => {
              const isMe = message.remetente_id === user?.id
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 max-w-[85%] sm:max-w-[70%] ${
                    isMe ? 'justify-end self-end ml-auto' : ''
                  }`}
                >
                  {!isMe && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 bg-gray-600"
                      style={
                        message.avatar
                          ? { backgroundImage: `url('${message.avatar}')` }
                          : undefined
                      }
                    />
                  )}
                  <div
                    className={`flex flex-1 flex-col gap-1 ${
                      isMe ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <p
                        className={`text-white text-base font-normal leading-normal flex rounded-xl px-4 py-3 ${
                          isMe
                            ? 'bg-primary rounded-br-none'
                            : 'bg-message-sender rounded-bl-none'
                        }`}
                      >
                        {message.texto}
                      </p>
                    </div>
                    <span className="text-white/40 text-xs font-normal">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  {isMe && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 bg-gray-600"
                      style={
                        profile?.avatar_url
                          ? { backgroundImage: `url('${profile.avatar_url}')` }
                          : undefined
                      }
                    />
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 z-10 w-full bg-background-dark p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isSending}
            className="flex-1 bg-message-sender border-0 text-white placeholder-white/40 rounded-full h-12 px-5 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-200 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isSending}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shrink-0 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

