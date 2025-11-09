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

    // 3. Criar/atualizar perfil com role de aluno
    // Tentar users primeiro, depois profiles (fallback)
    let profileError: any = null
    
    const usersResult = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: userId, 
        email: email.trim(),
        name: nome.trim(),
        role: 'student'
      }, { onConflict: 'id' })

    if (usersResult.error && usersResult.error.message?.includes('does not exist')) {
      const profilesResult = await supabaseAdmin
        .from('profiles')
        .update({ role: 'aluno', full_name: nome.trim() })
        .eq('id', userId)
      profileError = profilesResult.error
    } else {
      profileError = usersResult.error
    }

    // Não bloquear se não conseguir atualizar perfil
    if (profileError && !profileError.message?.includes('duplicate')) {
      console.warn('Aviso: Não foi possível atualizar perfil:', profileError.message)
    }

    // 4. Criar registro na tabela students (ou alunos como fallback)
    let alunoError: any = null
    
    const studentsResult = await supabaseAdmin.from('students').insert({
      user_id: userId,
      grade: serie ? parseInt(serie) || 1 : 1,
      total_points: 0,
      level: 1,
    })

    if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
      const alunosResult = await supabaseAdmin.from('alunos').insert({
        id: userId,
        data_nascimento: dataNascimento || null,
        serie: serie?.trim() || null,
      })
      alunoError = alunosResult.error
    } else {
      alunoError = studentsResult.error
    }

    // Não bloquear se não conseguir criar registro de aluno
    if (alunoError && !alunoError.message?.includes('duplicate')) {
      console.warn('Aviso: Não foi possível criar registro de aluno:', alunoError.message)
    }

    // 5. Associar aluno à turma se selecionada
    if (turmaId) {
      // Tentar classroom_students primeiro, depois aluno_turma (fallback)
      let turmaError: any = null
      
      // Verificar se turmaId é de classrooms ou turmas
      // Primeiro, tentar buscar em classrooms
      const classroomResult = await supabaseAdmin
        .from('classrooms')
        .select('id')
        .eq('id', turmaId)
        .maybeSingle()

      if (!classroomResult.error && classroomResult.data) {
        // É uma classroom, usar classroom_students
        const classroomStudentResult = await supabaseAdmin.from('classroom_students').insert({
          classroom_id: turmaId,
          student_id: userId,
          is_active: true,
        })
        turmaError = classroomStudentResult.error
      } else {
        // É uma turma, usar aluno_turma
        const alunoTurmaResult = await supabaseAdmin.from('aluno_turma').insert({
          aluno_id: userId,
          turma_id: turmaId,
          ativo: true,
        })
        turmaError = alunoTurmaResult.error
      }

      if (turmaError) {
        console.warn('Aviso: Não foi possível associar aluno à turma:', turmaError.message)
        // Não bloquear, apenas logar
      }
    }

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar aluno' }, { status: 500 })
  }
}

