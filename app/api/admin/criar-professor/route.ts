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
      .single()

    if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
      const profilesResult = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .single()
      emailExistente = profilesResult.data
    } else {
      emailExistente = usersResult.data
    }

    if (emailExistente) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 400 })
    }

    // 2. Verificar se matrícula já existe
    // Tentar teachers primeiro, depois professores (fallback)
    let matriculaExistente: any = null
    
    const teachersResult = await supabaseAdmin
      .from('teachers')
      .select('user_id as id')
      .eq('employee_id', matricula.trim())
      .single()

    if (teachersResult.error && teachersResult.error.message?.includes('does not exist')) {
      const professoresResult = await supabaseAdmin
        .from('professores')
        .select('id')
        .eq('matricula', matricula.trim())
        .single()
      matriculaExistente = professoresResult.data
    } else {
      matriculaExistente = teachersResult.data
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
    
    const usersResult = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: userId, 
        email: email.trim(),
        name: nome.trim(),
        role: 'teacher',
        username: email.split('@')[0]
      }, { onConflict: 'id' })

    if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
      const profilesResult = await supabaseAdmin
        .from('profiles')
        .update({ role: 'professor', full_name: nome.trim() })
        .eq('id', userId)
      profileError = profilesResult.error
    } else {
      profileError = usersResult.error
    }

    // Não bloquear se não conseguir atualizar perfil
    if (profileError && !profileError.message?.includes('duplicate')) {
      console.warn('Aviso: Não foi possível atualizar perfil:', profileError.message)
    }

    // 5. Criar registro na tabela teachers (ou professores como fallback)
    let professorError: any = null
    
    const teachersResult = await supabaseAdmin.from('teachers').insert({
      user_id: userId,
      employee_id: matricula.trim(),
    })

    if (teachersResult.error && teachersResult.error.message?.includes('does not exist')) {
      const professoresResult = await supabaseAdmin.from('professores').insert({
        id: userId,
        matricula: matricula.trim(),
        status: 'ativo',
      })
      professorError = professoresResult.error
    } else {
      professorError = teachersResult.error
    }

    // Não bloquear se não conseguir criar registro de professor
    if (professorError && !professorError.message?.includes('duplicate')) {
      console.warn('Aviso: Não foi possível criar registro de professor:', professorError.message)
    }

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar professor' }, { status: 500 })
  }
}

