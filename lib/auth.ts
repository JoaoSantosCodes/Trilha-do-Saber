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

    // 2. Criar perfil na tabela users (profiles pode não existir)
    // Tentar users primeiro, se não existir, tentar profiles
    let profileError = null
    const profileData = {
      id: authData.user.id,
      email: data.email,
      name: data.fullName,
      username: data.username || data.email.split('@')[0],
      role: data.role,
    }

    // Tentar inserir em users
    const usersResult = await supabase.from('users').insert(profileData)
    if (usersResult.error) {
      // Se users falhar, tentar profiles
      const profilesResult = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        username: data.username || data.email.split('@')[0],
        role: data.role,
      })
      profileError = profilesResult.error
    }

    // Não bloquear se não conseguir criar perfil (pode ser criado depois)
    if (profileError && !profileError.message.includes('duplicate')) {
      console.warn('Aviso: Não foi possível criar perfil:', profileError.message)
    }

    // 3. Criar registro específico baseado no role
    // Mapear roles em português para inglês (tabelas existem em inglês)
    const roleMap: Record<string, string> = {
      'aluno': 'student',
      'professor': 'teacher',
      'coordenador': 'coordinator',
      'pais': 'parent',
      'student': 'student',
      'teacher': 'teacher',
      'coordinator': 'coordinator',
      'parent': 'parent'
    }
    
    const englishRole = roleMap[data.role] || data.role
    
    if (englishRole === 'student') {
      // Tentar students primeiro, se não existir, tentar alunos
      let error = null
      const result = await supabase.from('students').insert({
        user_id: authData.user.id,
        grade: 1,
        total_points: 0,
        level: 1,
      })
      error = result.error
      
      if (error && error.message.includes('does not exist')) {
        const alunosResult = await supabase.from('alunos').insert({
          id: authData.user.id,
          pontos: 0,
          moedas: 0,
          sequencia_atual: 0,
        })
        error = alunosResult.error
      }
      
      if (error && !error.message.includes('duplicate')) {
        console.warn('Aviso: Não foi possível criar registro de aluno:', error.message)
      }
    } else if (englishRole === 'teacher') {
      let error = null
      const result = await supabase.from('teachers').insert({
        user_id: authData.user.id,
      })
      error = result.error
      
      if (error && error.message.includes('does not exist')) {
        const profResult = await supabase.from('professores').insert({
          id: authData.user.id,
          status: 'ativo',
        })
        error = profResult.error
      }
      
      if (error && !error.message.includes('duplicate')) {
        console.warn('Aviso: Não foi possível criar registro de professor:', error.message)
      }
    } else if (englishRole === 'parent') {
      let error = null
      const result = await supabase.from('parents').insert({
        user_id: authData.user.id,
      })
      error = result.error
      
      if (error && error.message.includes('does not exist')) {
        const paisResult = await supabase.from('pais').insert({
          id: authData.user.id,
        })
        error = paisResult.error
      }
      
      if (error && !error.message.includes('duplicate')) {
        console.warn('Aviso: Não foi possível criar registro de pais:', error.message)
      }
    } else if (englishRole === 'coordinator') {
      let error = null
      const result = await supabase.from('coordinators').insert({
        user_id: authData.user.id,
      })
      error = result.error
      
      if (error && error.message.includes('does not exist')) {
        const coordResult = await supabase.from('coordenadores').insert({
          id: authData.user.id,
        })
        error = coordResult.error
      }
      
      if (error && !error.message.includes('duplicate')) {
        console.warn('Aviso: Não foi possível criar registro de coordenador:', error.message)
      }
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
 * Tenta buscar de 'users' (a tabela profiles pode não existir)
 */
export async function getProfile(userId: string) {
  try {
    // Tentar buscar de 'users' primeiro (tabela que existe)
    let { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single()

    // Se users não tiver registro, tentar 'profiles' (caso exista)
    if (error && error.message.includes('No rows')) {
      const profilesResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (!profilesResult.error) {
        data = profilesResult.data
        error = null
      }
    }

    // Se ainda houver erro, retornar null mas não bloquear
    if (error) {
      // Não é crítico se não encontrar perfil, o app pode usar user_metadata
      return { profile: null, error: null }
    }

    return { profile: data, error: null }
  } catch (error: any) {
    // Retornar null mas não bloquear o app
    return { profile: null, error: null }
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

