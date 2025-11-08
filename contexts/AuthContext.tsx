'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/supabase/config'
import { signIn, signUp, signOut, getCurrentUser, getProfile } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (data: {
    email: string
    password: string
    fullName: string
    role: 'aluno' | 'professor' | 'coordenador' | 'pais'
    username?: string
  }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão inicial
    checkSession()

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Carregar perfil de forma não-bloqueante
        loadProfile(session.user.id).catch(() => {
          // Ignorar erros de perfil, não bloquear o app
        })
      }
    } catch (error) {
      // Apenas logar em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao verificar sessão:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { profile, error } = await getProfile(userId)
      if (error) {
        // Se a tabela profiles não existir ou não houver registro, não é crítico
        // O usuário ainda pode usar o app com os dados de user_metadata
        if (error.includes('does not exist') || error.includes('No rows')) {
          setProfile(null)
          return
        }
        throw error
      }
      setProfile(profile)
    } catch (error: any) {
      // Não bloquear o app se não conseguir carregar o perfil
      // O usuário ainda pode usar o app com user_metadata
      setProfile(null)
      // Apenas logar em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.warn('Aviso: Não foi possível carregar perfil:', error?.message || error)
      }
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn({ email, password })
    if (result.error) {
      return { error: result.error }
    }
    return { error: null }
  }

  const handleSignUp = async (data: {
    email: string
    password: string
    fullName: string
    role: 'aluno' | 'professor' | 'coordenador' | 'pais'
    username?: string
  }) => {
    const result = await signUp(data)
    if (result.error) {
      return { error: result.error }
    }
    return { error: null }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    router.push('/login')
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

