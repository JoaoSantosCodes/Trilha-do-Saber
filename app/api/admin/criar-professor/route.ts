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
    const { data: emailExistente } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.trim())
      .single()

    if (emailExistente) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 400 })
    }

    // 2. Verificar se matrícula já existe
    const { data: matriculaExistente } = await supabaseAdmin
      .from('professores')
      .select('id')
      .eq('matricula', matricula.trim())
      .single()

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

    // 4. Atualizar perfil com role de professor
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'professor', full_name: nome.trim() })
      .eq('id', userId)

    if (profileError) throw profileError

    // 5. Criar registro na tabela professores
    const { error: professorError } = await supabaseAdmin.from('professores').insert({
      id: userId,
      matricula: matricula.trim(),
      status: 'ativo',
    })

    if (professorError) throw professorError

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar professor' }, { status: 500 })
  }
}

