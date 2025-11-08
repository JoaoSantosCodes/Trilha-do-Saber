/**
 * Script para criar usuários de teste no Supabase
 * 
 * Execute: node scripts/criar_usuarios_teste.js
 * 
 * Requisitos:
 * - Variáveis de ambiente configuradas (.env.local)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que .env.local contém:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const usuariosTeste = [
  {
    email: 'coordenador@teste.com',
    senha: 'teste123',
    fullName: 'Coordenador Teste',
    username: 'coordenador_teste',
    role: 'coordenador',
  },
  {
    email: 'professor@teste.com',
    senha: 'teste123',
    fullName: 'Professor Teste',
    username: 'professor_teste',
    role: 'professor',
    matricula: 'PROF-001',
  },
  {
    email: 'pais@teste.com',
    senha: 'teste123',
    fullName: 'Pais Teste',
    username: 'pais_teste',
    role: 'pais',
    telefone: '(11) 99999-9999',
  },
  {
    email: 'aluno@teste.com',
    senha: 'teste123',
    fullName: 'Aluno Teste',
    username: 'aluno_teste',
    role: 'aluno',
    serie: '5º Ano',
    dataNascimento: '2010-01-15',
    pontos: 100,
    moedas: 50,
  },
]

async function criarUsuario(usuario) {
  try {
    console.log(`\n📝 Criando usuário: ${usuario.email} (${usuario.role})...`)

    // 1. Verificar se usuário já existe
    const { data: usuarioExistente } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', usuario.email)
      .single()

    if (usuarioExistente) {
      console.log(`⚠️  Usuário ${usuario.email} já existe. Atualizando...`)
      
      // Atualizar perfil
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: usuario.fullName,
          username: usuario.username,
          role: usuario.role,
        })
        .eq('id', usuarioExistente.id)

      if (profileError) throw profileError

      // Atualizar registro específico
      await atualizarRegistroEspecifico(usuarioExistente.id, usuario)
      
      console.log(`✅ Usuário ${usuario.email} atualizado com sucesso!`)
      return { success: true, userId: usuarioExistente.id, updated: true }
    }

    // 2. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: usuario.email,
      password: usuario.senha,
      email_confirm: true,
      user_metadata: {
        full_name: usuario.fullName,
        role: usuario.role,
        username: usuario.username,
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Erro ao criar usuário no Auth')

    const userId = authData.user.id
    console.log(`   ✅ Usuário criado no Auth: ${userId}`)

    // 3. Criar perfil
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      email: usuario.email,
      full_name: usuario.fullName,
      username: usuario.username,
      role: usuario.role,
    })

    if (profileError) throw profileError
    console.log(`   ✅ Perfil criado`)

    // 4. Criar registro específico
    await criarRegistroEspecifico(userId, usuario)
    console.log(`   ✅ Registro específico criado`)

    console.log(`✅ Usuário ${usuario.email} criado com sucesso!`)
    return { success: true, userId, updated: false }
  } catch (error) {
    console.error(`❌ Erro ao criar usuário ${usuario.email}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function criarRegistroEspecifico(userId, usuario) {
  if (usuario.role === 'aluno') {
    const { error } = await supabaseAdmin.from('alunos').insert({
      id: userId,
      pontos: usuario.pontos || 0,
      moedas: usuario.moedas || 0,
      sequencia_atual: 0,
      serie: usuario.serie || null,
      data_nascimento: usuario.dataNascimento || null,
    })
    if (error) throw error
  } else if (usuario.role === 'professor') {
    const { error } = await supabaseAdmin.from('professores').insert({
      id: userId,
      matricula: usuario.matricula || `PROF-${userId.substring(0, 8)}`,
      status: 'ativo',
    })
    if (error) throw error
  } else if (usuario.role === 'pais') {
    const { error } = await supabaseAdmin.from('pais').insert({
      id: userId,
      telefone: usuario.telefone || null,
    })
    if (error) throw error
  } else if (usuario.role === 'coordenador') {
    const { error } = await supabaseAdmin.from('coordenadores').insert({
      id: userId,
    })
    if (error) throw error
  }
}

async function atualizarRegistroEspecifico(userId, usuario) {
  if (usuario.role === 'aluno') {
    const { error } = await supabaseAdmin
      .from('alunos')
      .upsert({
        id: userId,
        serie: usuario.serie || null,
        data_nascimento: usuario.dataNascimento || null,
      })
    if (error) throw error
  } else if (usuario.role === 'professor') {
    const { error } = await supabaseAdmin
      .from('professores')
      .upsert({
        id: userId,
        matricula: usuario.matricula || `PROF-${userId.substring(0, 8)}`,
        status: 'ativo',
      })
    if (error) throw error
  } else if (usuario.role === 'pais') {
    const { error } = await supabaseAdmin
      .from('pais')
      .upsert({
        id: userId,
        telefone: usuario.telefone || null,
      })
    if (error) throw error
  }
}

async function main() {
  console.log('🚀 Iniciando criação de usuários de teste...\n')
  console.log('=' .repeat(60))

  const resultados = []

  for (const usuario of usuariosTeste) {
    const resultado = await criarUsuario(usuario)
    resultados.push({ ...usuario, ...resultado })
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Resumo:\n')

  const sucessos = resultados.filter((r) => r.success)
  const falhas = resultados.filter((r) => !r.success)
  const atualizados = resultados.filter((r) => r.updated)

  console.log(`✅ Sucessos: ${sucessos.length}/${resultados.length}`)
  if (atualizados.length > 0) {
    console.log(`🔄 Atualizados: ${atualizados.length}`)
  }
  if (falhas.length > 0) {
    console.log(`❌ Falhas: ${falhas.length}`)
  }

  console.log('\n📋 Credenciais de teste:\n')
  console.log('┌─────────────────────────┬──────────────┬─────────────┐')
  console.log('│ Email                    │ Senha        │ Role        │')
  console.log('├─────────────────────────┼──────────────┼─────────────┤')
  usuariosTeste.forEach((u) => {
    console.log(
      `│ ${u.email.padEnd(23)} │ ${u.senha.padEnd(12)} │ ${u.role.padEnd(11)} │`
    )
  })
  console.log('└─────────────────────────┴──────────────┴─────────────┘')

  console.log('\n✅ Processo concluído!')
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

