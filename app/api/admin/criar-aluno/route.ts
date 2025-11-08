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
    const { nome, email, senha, dataNascimento, serie, turmaId } = body

    if (!nome || !email || !senha) {
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

    // 2. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      email_confirm: true,
      user_metadata: {
        full_name: nome.trim(),
        role: 'aluno',
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Erro ao criar usuário')

    const userId = authData.user.id

    // 3. Atualizar perfil com role de aluno
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'aluno', full_name: nome.trim() })
      .eq('id', userId)

    if (profileError) throw profileError

    // 4. Criar registro na tabela alunos
    const { error: alunoError } = await supabaseAdmin.from('alunos').insert({
      id: userId,
      data_nascimento: dataNascimento || null,
      serie: serie?.trim() || null,
    })

    if (alunoError) throw alunoError

    // 5. Associar aluno à turma se selecionada
    if (turmaId) {
      const { error: turmaError } = await supabaseAdmin.from('aluno_turma').insert({
        aluno_id: userId,
        turma_id: turmaId,
        ativo: true,
      })

      if (turmaError) throw turmaError
    }

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar aluno' }, { status: 500 })
  }
}

