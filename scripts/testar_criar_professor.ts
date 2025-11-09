import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testarCriarProfessor() {
  const nome = 'Professor Teste Script'
  const email = 'professor.teste.script@escola.com'
  const senha = 'teste123'
  const matricula = 'PROF-2024-003'

  console.log('🧪 Testando criação de professor...')
  console.log('📝 Dados:', { nome, email, matricula })

  try {
    // 1. Verificar se email já existe
    console.log('\n1️⃣ Verificando se email já existe...')
    const usersResult = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle()

    if (usersResult.error) {
      console.log('⚠️ Erro ao verificar users:', usersResult.error.message)
    } else if (usersResult.data) {
      console.log('❌ Email já existe em users:', usersResult.data)
      return
    } else {
      console.log('✅ Email não existe em users')
    }

    // Verificar em auth.users
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = authUsers?.users?.find(u => u.email === email.trim())
    if (existingUser) {
      console.log('❌ Email já existe em auth.users:', existingUser.id)
      return
    }
    console.log('✅ Email não existe em auth.users')

    // 2. Verificar matrícula
    console.log('\n2️⃣ Verificando se matrícula já existe...')
    try {
      const professoresResult = await supabaseAdmin
        .from('professores')
        .select('id')
        .eq('matricula', matricula.trim())
        .maybeSingle()
      
      if (professoresResult.data) {
        console.log('❌ Matrícula já existe:', professoresResult.data)
        return
      }
      console.log('✅ Matrícula não existe')
    } catch (err) {
      console.log('⚠️ Tabela professores não encontrada, pulando verificação')
    }

    // 3. Criar usuário no Supabase Auth
    console.log('\n3️⃣ Criando usuário no Supabase Auth...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      email_confirm: true,
      user_metadata: {
        full_name: nome.trim(),
        role: 'professor',
      },
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message)
      return
    }

    if (!authData.user) {
      console.error('❌ Erro: usuário não foi criado')
      return
    }

    console.log('✅ Usuário criado em auth.users:', authData.user.id)
    const userId = authData.user.id

    // 4. Criar/atualizar perfil
    console.log('\n4️⃣ Criando/atualizando perfil em users...')
    const usersProfileResult = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: userId, 
        email: email.trim(),
        name: nome.trim(),
        role: 'teacher'
      }, { onConflict: 'id' })

    if (usersProfileResult.error) {
      console.warn('⚠️ Erro ao criar perfil em users:', usersProfileResult.error.message)
    } else {
      console.log('✅ Perfil criado/atualizado em users')
    }

    // 5. Criar registro em teachers
    console.log('\n5️⃣ Criando registro em teachers...')
    const teachersInsertResult = await supabaseAdmin.from('teachers').insert({
      user_id: userId,
    })

    if (teachersInsertResult.error) {
      console.warn('⚠️ Erro ao criar registro em teachers:', teachersInsertResult.error.message)
      
      // Tentar professores como fallback
      if (teachersInsertResult.error.message?.includes('does not exist') || teachersInsertResult.error.code === '42P01') {
        console.log('🔄 Tentando criar em professores...')
        try {
          const professoresResult = await supabaseAdmin.from('professores').insert({
            id: userId,
            matricula: matricula.trim(),
            status: 'ativo',
          })
          
          if (professoresResult.error) {
            console.warn('⚠️ Erro ao criar em professores:', professoresResult.error.message)
          } else {
            console.log('✅ Registro criado em professores')
          }
        } catch (err: any) {
          console.warn('⚠️ Erro ao criar em professores:', err.message)
        }
      }
    } else {
      console.log('✅ Registro criado em teachers')
    }

    console.log('\n✅ Professor criado com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', senha)
    console.log('🆔 User ID:', userId)

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    console.error(error)
  }
}

testarCriarProfessor()

