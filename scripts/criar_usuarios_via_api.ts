/**
 * Script para criar usuários de teste via API Admin do Supabase
 * 
 * Este script usa a API Admin do Supabase para criar usuários corretamente
 * com senhas que funcionam no sistema de autenticação
 * 
 * Execute: npx tsx scripts/criar_usuarios_via_api.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')
  process.exit(1)
}

interface UserData {
  email: string
  password: string
  user_metadata: {
    full_name: string
    role: string
    username: string
  }
}

const users: UserData[] = [
  {
    email: 'coordenador@teste.com',
    password: 'teste123',
    user_metadata: {
      full_name: 'Coordenador Teste',
      role: 'coordinator',
      username: 'coordenador_teste'
    }
  },
  {
    email: 'professor@teste.com',
    password: 'teste123',
    user_metadata: {
      full_name: 'Professor Teste',
      role: 'teacher',
      username: 'professor_teste'
    }
  },
  {
    email: 'pais@teste.com',
    password: 'teste123',
    user_metadata: {
      full_name: 'Pais Teste',
      role: 'parent',
      username: 'pais_teste'
    }
  },
  {
    email: 'aluno@teste.com',
    password: 'teste123',
    user_metadata: {
      full_name: 'Aluno Teste',
      role: 'student',
      username: 'aluno_teste'
    }
  }
]

async function createUser(userData: UserData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: userData.user_metadata
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    throw new Error(`Erro ao criar usuário ${userData.email}: ${error.message}`)
  }
}

async function main() {
  console.log('🚀 Criando usuários de teste via API Admin do Supabase...\n')

  for (const user of users) {
    try {
      console.log(`📝 Criando usuário: ${user.email}...`)
      const result = await createUser(user)
      console.log(`✅ Usuário criado: ${user.email} (ID: ${result.user?.id || result.id})`)
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        console.log(`⚠️  Usuário já existe: ${user.email}`)
      } else {
        console.error(`❌ ${error.message}`)
      }
    }
    console.log('')
  }

  console.log('✅ Processo concluído!')
  console.log('\n📋 Credenciais de teste:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  users.forEach(user => {
    console.log(`Email: ${user.email} | Senha: ${user.password}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error)

