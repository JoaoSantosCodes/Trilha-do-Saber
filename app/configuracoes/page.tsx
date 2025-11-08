'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { useConfiguracoes } from '@/hooks/useConfiguracoes'
import { useAuth } from '@/contexts/AuthContext'

interface SettingItem {
  id: string
  title: string
  icon: string
  route?: string
  type?: 'toggle' | 'link'
  value?: boolean
}

const accountSettings: SettingItem[] = [
  {
    id: '1',
    title: 'Editar Perfil',
    icon: 'person',
    route: '/aluno/perfil/editar',
    type: 'link',
  },
  {
    id: '2',
    title: 'Alterar Senha',
    icon: 'lock',
    route: '/alterar-senha',
    type: 'link',
  },
  {
    id: '3',
    title: 'Gerenciar Assinatura',
    icon: 'workspace_premium',
    route: '/assinatura',
    type: 'link',
  },
]

const generalSettings: SettingItem[] = [
  {
    id: '1',
    title: 'Ajuda e Suporte',
    icon: 'help',
    route: '/ajuda',
    type: 'link',
  },
  {
    id: '2',
    title: 'Sobre o App',
    icon: 'info',
    route: '/sobre',
    type: 'link',
  },
  {
    id: '3',
    title: 'Política de Privacidade',
    icon: 'privacy_tip',
    route: '/politica-privacidade',
    type: 'link',
  },
  {
    id: '4',
    title: 'Termos de Serviço',
    icon: 'gavel',
    route: '/termos',
    type: 'link',
  },
]

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { configuracoes, loading, atualizarConfiguracao } = useConfiguracoes()
  const [isSaving, setIsSaving] = useState(false)

  // Determinar rota de editar perfil baseado no role
  const getEditProfileRoute = () => {
    if (!user) return '/aluno/perfil/editar'
    switch (user.role) {
      case 'aluno':
        return '/aluno/perfil/editar'
      case 'professor':
        return '/professor/perfil/editar'
      case 'pais':
        return '/pais/perfil/editar'
      case 'coordenador':
        return '/coordenador/perfil/editar'
      default:
        return '/aluno/perfil/editar'
    }
  }

  // Atualizar accountSettings com rota dinâmica
  const accountSettingsWithRoute = accountSettings.map((setting) => {
    if (setting.id === '1') {
      return { ...setting, route: getEditProfileRoute() }
    }
    return setting
  })

  const handleToggle = async (campo: 'efeitos_sonoros' | 'musica_fundo' | 'lembretes_estudo' | 'notificacoes_push', valor: boolean) => {
    setIsSaving(true)
    await atualizarConfiguracao(campo, valor)
    setIsSaving(false)
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-dark/80 p-4 pb-2 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center justify-start text-white">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-white">
          Configurações
        </h1>
        <div className="size-12 shrink-0"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 pb-40">
        <div className="space-y-6">
          {/* Account Section */}
          <div>
            <h2 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-primary">
              Conta
            </h2>
            <div className="flex flex-col gap-2">
              {accountSettingsWithRoute.map((setting) => (
                <Link
                  key={setting.id}
                  href={setting.route || '#'}
                  className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">{setting.icon}</span>
                    </div>
                    <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                      {setting.title}
                    </p>
                  </div>
                  <div className="shrink-0 text-white/50">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sound and Notifications Section */}
          <div>
            <h2 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-primary">
              Sons e Notificações
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">volume_up</span>
                  </div>
                  <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                    Efeitos Sonoros
                  </p>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracoes.efeitos_sonoros}
                    onChange={(e) => handleToggle('efeitos_sonoros', e.target.checked)}
                    disabled={loading || isSaving}
                    className="peer absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    id="sound-effects"
                  />
                  <div className="relative h-8 w-14 rounded-full bg-gray-600 transition-colors duration-200 ease-in-out peer-checked:bg-primary peer-disabled:opacity-50">
                    <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                  </div>
                </div>
              </div>
              <div className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">music_note</span>
                  </div>
                  <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                    Música de Fundo
                  </p>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracoes.musica_fundo}
                    onChange={(e) => handleToggle('musica_fundo', e.target.checked)}
                    disabled={loading || isSaving}
                    className="peer absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    id="background-music"
                  />
                  <div className="relative h-8 w-14 rounded-full bg-gray-600 transition-colors duration-200 ease-in-out peer-checked:bg-primary peer-disabled:opacity-50">
                    <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                  </div>
                </div>
              </div>
              <div className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">notifications</span>
                  </div>
                  <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                    Lembretes de Estudo
                  </p>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracoes.lembretes_estudo}
                    onChange={(e) => handleToggle('lembretes_estudo', e.target.checked)}
                    disabled={loading || isSaving}
                    className="peer absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    id="study-reminders"
                  />
                  <div className="relative h-8 w-14 rounded-full bg-gray-600 transition-colors duration-200 ease-in-out peer-checked:bg-primary peer-disabled:opacity-50">
                    <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                  </div>
                </div>
              </div>
              <div className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">notifications_active</span>
                  </div>
                  <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                    Notificações Push
                  </p>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_push}
                    onChange={(e) => handleToggle('notificacoes_push', e.target.checked)}
                    disabled={loading || isSaving}
                    className="peer absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    id="push-notifications"
                  />
                  <div className="relative h-8 w-14 rounded-full bg-gray-600 transition-colors duration-200 ease-in-out peer-checked:bg-primary peer-disabled:opacity-50">
                    <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Section */}
          <div>
            <h2 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-primary">
              Geral
            </h2>
            <div className="flex flex-col gap-2">
              {generalSettings.map((setting) => (
                <Link
                  key={setting.id}
                  href={setting.route || '#'}
                  className="flex min-h-14 items-center justify-between gap-4 rounded bg-white/5 px-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">{setting.icon}</span>
                    </div>
                    <p className="flex-1 truncate text-base font-normal leading-normal text-white">
                      {setting.title}
                    </p>
                  </div>
                  <div className="shrink-0 text-white/50">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

