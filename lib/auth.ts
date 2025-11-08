// Funções de autenticação com Supabase
import { supabase } from '@/supabase/config'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  role: 'aluno' | 'professor' | 'coordenador' | 'pais'
  username?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Cadastra um novo usuário
 */
export async function signUp(data: SignUpData) {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
          username: data.username || data.email.split('@')[0],
        },
      },
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error('Erro ao criar usuário')
    }

    // 2. Criar perfil na tabela profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: data.email,
      full_name: data.fullName,
      username: data.username || data.email.split('@')[0],
      role: data.role,
    })

    if (profileError) throw profileError

    // 3. Criar registro específico baseado no role
    if (data.role === 'aluno') {
      const { error: alunoError } = await supabase.from('alunos').insert({
        id: authData.user.id,
        pontos: 0,
        moedas: 0,
        sequencia_atual: 0,
      })

      if (alunoError) throw alunoError
    } else if (data.role === 'professor') {
      const { error: profError } = await supabase.from('professores').insert({
        id: authData.user.id,
        status: 'ativo',
      })

      if (profError) throw profError
    } else if (data.role === 'pais') {
      const { error: paisError } = await supabase.from('pais').insert({
        id: authData.user.id,
      })

      if (paisError) throw paisError
    } else if (data.role === 'coordenador') {
      const { error: coordError } = await supabase.from('coordenadores').insert({
        id: authData.user.id,
      })

      if (coordError) throw coordError
    }

    return { user: authData.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Faz login do usuário
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    return { user: authData.user, session: authData.session, error: null }
  } catch (error: any) {
    return { user: null, session: null, error: error.message }
  }
}

/**
 * Faz logout do usuário
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

/**
 * Envia email de recuperação de senha
 */
export async function resetPassword(email: string) {
  try {
    // Usar origin do cliente ou fallback
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/reset-password`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

/**
 * Obtém o usuário atual
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Obtém o perfil completo do usuário
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { profile: data, error: null }
  } catch (error: any) {
    return { profile: null, error: error.message }
  }
}

/**
 * Obtém a sessão atual
 */
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

  if (error) throw error
    return { session, error: null }
  } catch (error: any) {
    return { session: null, error: error.message }
  }
}

/**
 * Atualiza a senha do usuário
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

