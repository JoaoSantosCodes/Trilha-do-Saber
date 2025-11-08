/**
 * Script para deletar e recriar usuários de teste via API Admin do Supabase
 * 
 * Execute: npx tsx scripts/deletar_e_recriar_usuarios.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const users = [
  'coordenador@teste.com',
  'professor@teste.com',
  'pais@teste.com',
  'aluno@teste.com'
]

async function deleteUser(email: string) {
  try {
    // Primeiro, buscar o ID do usuário
    const listResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    })

    if (!listResponse.ok) {
      console.log(`⚠️  Não foi possível buscar usuário ${email}`)
      return false
    }

    const listData = await listResponse.json()
    
    if (!listData.users || listData.users.length === 0) {
      console.log(`ℹ️  Usuário ${email} não existe`)
      return true
    }

    const userId = listData.users[0].id

    // Deletar o usuário
    const deleteResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    })

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text()
      console.error(`❌ Erro ao deletar ${email}: ${errorText}`)
      return false
    }

    console.log(`✅ Usuário ${email} deletado`)
    return true
  } catch (error: any) {
    console.error(`❌ Erro ao deletar ${email}: ${error.message}`)
    return false
  }
}

async function createUser(email: string, password: string, metadata: any) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    throw new Error(`Erro ao criar usuário ${email}: ${error.message}`)
  }
}

async function main() {
  console.log('🗑️  Deletando usuários existentes...\n')

  // Deletar todos os usuários
  for (const email of users) {
    await deleteUser(email)
  }

  console.log('\n🚀 Criando usuários de teste...\n')

  // Criar os usuários
  const usersData = [
    {
      email: 'coordenador@teste.com',
      password: 'teste123',
      metadata: {
        full_name: 'Coordenador Teste',
        role: 'coordinator',
        username: 'coordenador_teste'
      }
    },
    {
      email: 'professor@teste.com',
      password: 'teste123',
      metadata: {
        full_name: 'Professor Teste',
        role: 'teacher',
        username: 'professor_teste'
      }
    },
    {
      email: 'pais@teste.com',
      password: 'teste123',
      metadata: {
        full_name: 'Pais Teste',
        role: 'parent',
        username: 'pais_teste'
      }
    },
    {
      email: 'aluno@teste.com',
      password: 'teste123',
      metadata: {
        full_name: 'Aluno Teste',
        role: 'student',
        username: 'aluno_teste'
      }
    }
  ]

  for (const userData of usersData) {
    try {
      console.log(`📝 Criando usuário: ${userData.email}...`)
      const result = await createUser(userData.email, userData.password, userData.metadata)
      console.log(`✅ Usuário criado: ${userData.email} (ID: ${result.user?.id || result.id})`)
    } catch (error: any) {
      console.error(`❌ ${error.message}`)
    }
    console.log('')
  }

  console.log('✅ Processo concluído!')
  console.log('\n📋 Credenciais de teste:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  usersData.forEach(user => {
    console.log(`Email: ${user.email} | Senha: ${user.password}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error)

