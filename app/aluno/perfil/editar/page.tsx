'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useAluno } from '@/hooks/useAluno'
import { supabase } from '@/supabase/config'

const backgroundColors = [
  { id: '1', color: '#E57373', name: 'Vermelho' },
  { id: '2', color: '#81C784', name: 'Verde' },
  { id: '3', color: '#64B5F6', name: 'Azul' },
  { id: '4', color: '#FFD54F', name: 'Amarelo' },
  { id: '5', color: '#BA68C8', name: 'Roxo' },
]

const achievementIcons = [
  { id: '1', icon: 'star', color: '#FFD700' },
  { id: '2', icon: 'workspace_premium', color: '#C0C0C0' },
  { id: '3', icon: 'school', color: '#CD7F32' },
  { id: '4', icon: 'rocket_launch', color: '#81C784' },
  { id: '5', icon: 'science', color: '#64B5F6' },
]

export default function EditarPerfilPage() {
  const router = useRouter()
  const { profile, refreshProfile } = useAuth()
  const { aluno, updateAluno, loading: loadingAluno } = useAluno()
  const [username, setUsername] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [selectedBgColor, setSelectedBgColor] = useState(backgroundColors[0].id)
  const [selectedIcon, setSelectedIcon] = useState(achievementIcons[0].id)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
    }
    if (aluno) {
      const bgColorIndex = backgroundColors.findIndex((c) => c.color === aluno.cor_fundo_perfil)
      if (bgColorIndex >= 0) {
        setSelectedBgColor(backgroundColors[bgColorIndex].id)
      }
      if (aluno.icone_conquista_favorito) {
        const iconIndex = achievementIcons.findIndex((i) => i.icon === aluno.icone_conquista_favorito)
        if (iconIndex >= 0) {
          setSelectedIcon(achievementIcons[iconIndex].id)
        }
      }
    }
  }, [profile, aluno])

  // Buscar email dos pais
  useEffect(() => {
    async function fetchParentEmail() {
      if (!profile?.id) return

      try {
        const { data: alunoPais, error: err } = await supabase
          .from('aluno_pais')
          .select('pais_id')
          .eq('aluno_id', profile.id)
          .limit(1)
          .single()

        if (err && err.code !== 'PGRST116') throw err

        if (alunoPais) {
          const { data: paisProfile, error: errPais } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', alunoPais.pais_id)
            .single()

          if (errPais) throw errPais
          if (paisProfile) {
            setParentEmail(paisProfile.email)
          }
        }
      } catch (err) {
        console.error('Erro ao buscar email dos pais:', err)
      }
    }

    fetchParentEmail()
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const selectedColor = backgroundColors.find((c) => c.id === selectedBgColor)
      const selectedIconData = achievementIcons.find((i) => i.id === selectedIcon)

      // Atualizar perfil (username)
      if (profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', profile.id)

        if (profileError) throw profileError
      }

      // Atualizar dados do aluno
      if (aluno && selectedColor && selectedIconData) {
        const { error: alunoError } = await updateAluno({
          cor_fundo_perfil: selectedColor.color,
          icone_conquista_favorito: selectedIconData.icon,
        })

        if (alunoError) throw new Error(alunoError)
      }

      // Atualizar email dos pais (se necessário)
      if (parentEmail && profile) {
        // Buscar ou criar relação aluno-pais
        const { data: existingPais } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', parentEmail)
          .eq('role', 'pais')
          .single()

        if (existingPais) {
          // Verificar se já existe relação
          const { data: existingRelation } = await supabase
            .from('aluno_pais')
            .select('id')
            .eq('aluno_id', profile.id)
            .eq('pais_id', existingPais.id)
            .single()

          if (!existingRelation) {
            // Criar relação
            await supabase.from('aluno_pais').insert({
              aluno_id: profile.id,
              pais_id: existingPais.id,
            })
          }
        }
      }

      await refreshProfile()
      router.back()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações')
      console.error('Erro ao salvar:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-28 bg-background-dark text-white">
      {/* Header */}
      <header className="flex items-center p-4">
        <button onClick={() => router.back()} className="flex h-12 w-12 shrink-0 items-center justify-center text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">
          Editar Perfil
        </h1>
        <div className="h-12 w-12 shrink-0"></div>
      </header>

      {/* Main Content */}
      <main className="flex w-full flex-col items-center px-4">
        <div className="w-full max-w-md">
          {/* Profile Header */}
          <section className="flex w-full flex-col items-center gap-4 py-4">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary/30"
                style={{
                  backgroundImage: profile?.avatar_url
                    ? `url('${profile.avatar_url}')`
                    : undefined,
                  backgroundColor: aluno?.cor_fundo_perfil || '#E57373',
                }}
              />
              <button className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-background-dark bg-primary text-background-dark hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
            <span className="text-sm font-bold leading-normal tracking-[0.015em] text-primary">
              Editar Avatar
            </span>
          </section>

          {/* User Info Fields */}
          <section className="flex w-full flex-col gap-3 py-3">
            <Input
              label="Nome de Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              className="bg-white/5"
            />
            <Input
              label="Email dos Pais"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="Email dos pais"
              className="bg-white/5"
            />
          </section>

          {/* Personalization Section */}
          <section className="py-4">
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4">
              Personalize seu Perfil
            </h2>
            {/* Background Color Picker */}
            <div className="mb-6">
              <h3 className="text-base font-medium leading-normal text-white/80 pb-3">
                Cor de Fundo do Perfil
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {backgroundColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedBgColor(color.id)}
                    className={`aspect-square w-full rounded-full transition-transform hover:scale-110 ${
                      selectedBgColor === color.id
                        ? 'ring-2 ring-offset-2 ring-offset-background-dark ring-primary'
                        : ''
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>
            {/* Favorite Achievement Icon */}
            <div>
              <h3 className="text-base font-medium leading-normal text-white/80 pb-3">
                Ícone de Conquista Favorito
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {achievementIcons.map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon.id)}
                    className={`flex aspect-square w-full items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10 ${
                      selectedIcon === icon.id
                        ? 'ring-2 ring-offset-2 ring-offset-background-dark ring-primary'
                        : ''
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ color: icon.color }}
                    >
                      {icon.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mascot */}
      <div className="pointer-events-none absolute bottom-24 right-0 z-10 w-28">
        <Image
          alt="Duolingo-style owl mascot holding a paintbrush and a palette"
          className="w-full h-auto"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC72Tv_1Ny7BM66BpKuPVhf-mGSQZY3VHA_lm2ppz7gqXBanxap8izTVz3FZ9Q030Mo8V5jL-ljiq2FWIr5nqBc9fWefNS49CTHi9b-zGzkSAOdXGbXROohGIdvm695QRkA0YDXjN7FiOY2yJBl4Uib6JIaq5E_J59qblBKNLM8qx9aCML1Ansf7GaYhUC8DX0yHwZZ81JWxFXSaJN31vW_5eaVqkdECHfIOu_mZT4BaKF1gf6ceXfBnyqs0aQeu2PrKtKCRRPGZPgT"
          width={112}
          height={112}
          unoptimized
        />
      </div>

      {/* Sticky Footer Button */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 w-full bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent p-4">
        <div className="mx-auto max-w-md">
          {error && (
            <div className="text-red-400 text-sm mb-2 text-center">{error}</div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || loadingAluno}
            className="h-14 w-full bg-primary text-background-dark shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Salvando...
              </span>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </footer>
    </div>
  )
}

