import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  try {
    const body = await request.json()
    const { nome, email, senha, matricula } = body

    if (!nome || !email || !senha || !matricula) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // 1. Verificar se email já existe
    // Tentar users primeiro, depois profiles (fallback)
    let emailExistente: any = null
    
    const usersResult = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle()

    if (usersResult.error) {
      // Se erro for "does not exist" (tabela não existe), tentar profiles
      if (usersResult.error.message?.includes('does not exist') || usersResult.error.code === '42P01') {
        try {
          const profilesResult = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email.trim())
            .maybeSingle()
          if (!profilesResult.error && profilesResult.data) {
            emailExistente = profilesResult.data
          }
        } catch (err) {
          // Ignorar erro de profiles
        }
      }
    } else {
      // Se não houver erro, verificar se há dados
      if (usersResult.data) {
        emailExistente = usersResult.data
      }
    }

    // Também verificar em auth.users
    if (!emailExistente) {
      try {
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
        if (!authError && authUsers?.users) {
          const existingUser = authUsers.users.find(u => u.email === email.trim())
          if (existingUser) {
            emailExistente = { id: existingUser.id }
          }
        }
      } catch (err) {
        // Ignorar erro
      }
    }

    if (emailExistente) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 400 })
    }

    // 2. Verificar se matrícula já existe (se a tabela professores existir)
    // Como teachers não tem matrícula, verificar apenas em professores
    let matriculaExistente: any = null
    
    try {
      const professoresResult = await supabaseAdmin
        .from('professores')
        .select('id')
        .eq('matricula', matricula.trim())
        .maybeSingle()
      
      if (!professoresResult.error && professoresResult.data) {
        matriculaExistente = professoresResult.data
      }
    } catch (err) {
      // Se a tabela professores não existir, ignorar verificação de matrícula
      console.warn('Tabela professores não encontrada, pulando verificação de matrícula')
    }

    if (matriculaExistente) {
      return NextResponse.json({ error: 'Esta matrícula já está em uso' }, { status: 400 })
    }

    // 3. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      email_confirm: true,
      user_metadata: {
        full_name: nome.trim(),
        role: 'professor',
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Erro ao criar usuário')

    const userId = authData.user.id

    // 4. Criar/atualizar perfil com role de professor
    // Tentar users primeiro, depois profiles (fallback)
    let profileError: any = null
    
    const usersProfileResult = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: userId, 
        email: email.trim(),
        name: nome.trim(),
        role: 'teacher'
      }, { onConflict: 'id' })

    if (usersProfileResult.error && usersProfileResult.error.message?.includes('does not exist')) {
      const profilesResult = await supabaseAdmin
        .from('profiles')
        .update({ role: 'professor', full_name: nome.trim() })
        .eq('id', userId)
      profileError = profilesResult.error
    } else {
      profileError = usersProfileResult.error
    }

    // Não bloquear se não conseguir atualizar perfil
    if (profileError && !profileError.message?.includes('duplicate')) {
      console.warn('Aviso: Não foi possível atualizar perfil:', profileError.message)
    }

    // 5. Criar registro na tabela teachers (ou professores como fallback)
    // teachers não tem employee_id, então vamos criar apenas com user_id
    let professorError: any = null
    
    const teachersInsertResult = await supabaseAdmin.from('teachers').insert({
      user_id: userId,
    })

    if (teachersInsertResult.error) {
      // Se teachers não existir ou der erro, tentar professores
      if (teachersInsertResult.error.message?.includes('does not exist') || teachersInsertResult.error.code === '42P01') {
        try {
          const professoresResult = await supabaseAdmin.from('professores').insert({
            id: userId,
            matricula: matricula.trim(),
            status: 'ativo',
          })
          professorError = professoresResult.error
        } catch (err: any) {
          professorError = err
        }
      } else {
        professorError = teachersInsertResult.error
      }
    }

    // Não bloquear se não conseguir criar registro de professor
    // Mas logar o erro para debug
    if (professorError) {
      console.warn('Aviso: Não foi possível criar registro de professor:', professorError.message || professorError)
      // Se for erro de duplicata, não é crítico
      if (!professorError.message?.includes('duplicate') && !professorError.message?.includes('unique')) {
        // Para outros erros, ainda retornar sucesso pois o usuário foi criado em auth.users
        console.warn('Usuário criado em auth.users, mas registro em teachers/professores falhou')
      }
    }

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar professor' }, { status: 500 })
  }
}

