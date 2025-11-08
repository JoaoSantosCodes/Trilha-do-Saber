// Script de validação do banco de dados Supabase
// Execute com: npx tsx supabase/validar-banco.ts

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Verifique se o arquivo .env.local existe e contém:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ValidationResult {
  tabela: string
  status: 'success' | 'error' | 'warning'
  mensagem: string
  detalhes?: any
}

const resultados: ValidationResult[] = []

async function validarTabela(nome: string, descricao: string) {
  try {
    const { data, error } = await supabase.from(nome).select('*').limit(1)
    
    if (error) {
      resultados.push({
        tabela: nome,
        status: 'error',
        mensagem: `❌ Erro ao acessar: ${error.message}`,
        detalhes: error
      })
      return false
    }
    
    resultados.push({
      tabela: nome,
      status: 'success',
      mensagem: `✅ ${descricao} - OK`,
      detalhes: { registros: data?.length || 0 }
    })
    return true
  } catch (err: any) {
    resultados.push({
      tabela: nome,
      status: 'error',
      mensagem: `❌ Erro: ${err.message}`,
      detalhes: err
    })
    return false
  }
}

async function validarDadosIniciais() {
  console.log('\n📊 Validando dados iniciais...\n')
  
  // Validar matérias
  const { data: materias, error: errMaterias } = await supabase
    .from('materias')
    .select('*')
  
  if (errMaterias) {
    resultados.push({
      tabela: 'materias (dados)',
      status: 'error',
      mensagem: `❌ Erro ao buscar matérias: ${errMaterias.message}`
    })
  } else {
    const count = materias?.length || 0
    resultados.push({
      tabela: 'materias (dados)',
      status: count >= 6 ? 'success' : 'warning',
      mensagem: count >= 6 
        ? `✅ Matérias inseridas: ${count} (esperado: 6+)`
        : `⚠️ Matérias inseridas: ${count} (esperado: 6+)`,
      detalhes: materias?.map(m => m.nome)
    })
  }
  
  // Validar conquistas
  const { data: conquistas, error: errConquistas } = await supabase
    .from('conquistas')
    .select('*')
  
  if (errConquistas) {
    resultados.push({
      tabela: 'conquistas (dados)',
      status: 'error',
      mensagem: `❌ Erro ao buscar conquistas: ${errConquistas.message}`
    })
  } else {
    const count = conquistas?.length || 0
    resultados.push({
      tabela: 'conquistas (dados)',
      status: count >= 9 ? 'success' : 'warning',
      mensagem: count >= 9
        ? `✅ Conquistas inseridas: ${count} (esperado: 9+)`
        : `⚠️ Conquistas inseridas: ${count} (esperado: 9+)`,
      detalhes: conquistas?.map(c => c.nome)
    })
  }
}

async function validarConexao() {
  console.log('🔌 Testando conexão com Supabase...\n')
  
  try {
    const { data, error } = await supabase.from('materias').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erro de conexão:', error.message)
      return false
    }
    
    console.log('✅ Conexão estabelecida com sucesso!\n')
    return true
  } catch (err: any) {
    console.error('❌ Erro de conexão:', err.message)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🔍 VALIDAÇÃO DO BANCO DE DADOS - TRILHA DO SABER')
  console.log('='.repeat(60))
  console.log(`\n📡 URL: ${supabaseUrl}`)
  console.log(`🔑 Key: ${supabaseKey?.substring(0, 20) || 'N/A'}...\n`)
  
  // Testar conexão
  const conectado = await validarConexao()
  if (!conectado) {
    console.error('\n❌ Não foi possível conectar ao banco. Verifique:')
    console.error('   1. Se o projeto Supabase está ativo')
    console.error('   2. Se as credenciais estão corretas')
    console.error('   3. Se o schema foi executado')
    process.exit(1)
  }
  
  // Validar tabelas principais
  console.log('📋 Validando tabelas...\n')
  
  const tabelas = [
    { nome: 'profiles', descricao: 'Tabela de perfis' },
    { nome: 'alunos', descricao: 'Tabela de alunos' },
    { nome: 'professores', descricao: 'Tabela de professores' },
    { nome: 'pais', descricao: 'Tabela de pais' },
    { nome: 'coordenadores', descricao: 'Tabela de coordenadores' },
    { nome: 'materias', descricao: 'Tabela de matérias' },
    { nome: 'trilhas', descricao: 'Tabela de trilhas' },
    { nome: 'licoes', descricao: 'Tabela de lições' },
    { nome: 'questoes', descricao: 'Tabela de questões' },
    { nome: 'opcoes_resposta', descricao: 'Tabela de opções de resposta' },
    { nome: 'turmas', descricao: 'Tabela de turmas' },
    { nome: 'aluno_turma', descricao: 'Relação aluno-turma' },
    { nome: 'progresso_licoes', descricao: 'Tabela de progresso' },
    { nome: 'progresso_semanal', descricao: 'Tabela de progresso semanal' },
    { nome: 'conquistas', descricao: 'Tabela de conquistas' },
    { nome: 'aluno_conquistas', descricao: 'Relação aluno-conquistas' },
    { nome: 'ranking_semanal', descricao: 'Tabela de ranking' },
    { nome: 'amizades', descricao: 'Tabela de amizades' },
    { nome: 'itens_loja', descricao: 'Tabela de itens da loja' },
    { nome: 'inventario_aluno', descricao: 'Tabela de inventário' },
    { nome: 'conversas', descricao: 'Tabela de conversas' },
    { nome: 'mensagens', descricao: 'Tabela de mensagens' },
    { nome: 'tarefas_pais', descricao: 'Tabela de tarefas dos pais' },
    { nome: 'configuracoes_usuario', descricao: 'Tabela de configurações' },
  ]
  
  for (const tabela of tabelas) {
    await validarTabela(tabela.nome, tabela.descricao)
  }
  
  // Validar dados iniciais
  await validarDadosIniciais()
  
  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO DA VALIDAÇÃO')
  console.log('='.repeat(60) + '\n')
  
  const sucessos = resultados.filter(r => r.status === 'success').length
  const erros = resultados.filter(r => r.status === 'error').length
  const avisos = resultados.filter(r => r.status === 'warning').length
  
  resultados.forEach(resultado => {
    console.log(resultado.mensagem)
    if (resultado.detalhes && Array.isArray(resultado.detalhes) && resultado.detalhes.length > 0) {
      console.log(`   Detalhes: ${resultado.detalhes.join(', ')}`)
    }
  })
  
  console.log('\n' + '='.repeat(60))
  console.log(`✅ Sucessos: ${sucessos}`)
  console.log(`⚠️  Avisos: ${avisos}`)
  console.log(`❌ Erros: ${erros}`)
  console.log('='.repeat(60) + '\n')
  
  if (erros > 0) {
    console.log('❌ O banco de dados não está completamente configurado.')
    console.log('   Execute o arquivo supabase/schema.sql no SQL Editor do Supabase.\n')
    process.exit(1)
  } else if (avisos > 0) {
    console.log('⚠️  O banco está configurado, mas alguns dados iniciais podem estar faltando.')
    console.log('   Verifique se os seeds foram executados corretamente.\n')
  } else {
    console.log('✅ Banco de dados validado com sucesso! Tudo está funcionando.\n')
  }
}

main().catch(console.error)

