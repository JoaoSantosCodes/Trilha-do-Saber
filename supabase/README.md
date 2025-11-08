# 🗄️ Configuração do Banco de Dados - Supabase

Este diretório contém os arquivos necessários para configurar o banco de dados no Supabase.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Acesso ao SQL Editor do Supabase

## 🚀 Passos para Configuração

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL do projeto e a chave anônima (anon key)

### 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `schema.sql`
4. Execute o script (botão **Run**)

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

### 4. Instalar Dependências do Supabase

```bash
npm install @supabase/supabase-js
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Perfis de usuários (alunos, professores, pais, coordenadores)
- **alunos**: Dados específicos dos alunos
- **professores**: Dados específicos dos professores
- **pais**: Dados dos responsáveis
- **materias**: Matérias escolares disponíveis
- **trilhas**: Trilhas do saber por matéria
- **licoes**: Lições dentro das trilhas
- **questoes**: Questões das lições
- **turmas**: Turmas escolares
- **progresso_licoes**: Progresso dos alunos nas lições
- **amizades**: Sistema de amizades entre alunos
- **itens_loja**: Itens disponíveis na loja
- **inventario_aluno**: Inventário dos alunos
- **ranking_semanal**: Rankings semanais
- **conquistas**: Conquistas disponíveis
- **conversas**: Conversas de chat
- **mensagens**: Mensagens do chat
- **tarefas_pais**: Tarefas criadas pelos pais
- **configuracoes_usuario**: Configurações dos usuários

## 🔐 Segurança (RLS)

O schema inclui Row Level Security (RLS) habilitado nas tabelas principais. As políticas básicas permitem:

- Usuários veem apenas seus próprios dados
- Professores veem alunos de suas turmas
- Coordenadores têm acesso amplo

**⚠️ Importante**: Revise e ajuste as políticas RLS conforme suas necessidades de segurança.

## 🔄 Funções e Triggers

### Triggers Automáticos

- **update_updated_at_column**: Atualiza o campo `updated_at` automaticamente
- **handle_new_user**: Cria perfil automaticamente quando um usuário é criado no auth

### Funções

- **atualizar_ranking_semanal**: Atualiza o ranking semanal automaticamente

## 📝 Dados Iniciais (Seeds)

O schema inclui dados iniciais para:

- **Matérias**: Matemática, Ciências, História, Português, Geografia, Artes
- **Conquistas**: Conquistas padrão do sistema

## 🧪 Testando a Conexão

Crie um arquivo de teste para verificar a conexão:

```typescript
// test-supabase.ts
import { supabase } from './supabase/config'

async function testConnection() {
  const { data, error } = await supabase.from('materias').select('*')
  
  if (error) {
    console.error('Erro:', error)
  } else {
    console.log('Conexão OK! Matérias:', data)
  }
}

testConnection()
```

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Client JS](https://supabase.com/docs/reference/javascript/introduction)

## ⚠️ Notas Importantes

1. **Backup**: Sempre faça backup do banco antes de executar scripts SQL
2. **Ambiente**: Use variáveis de ambiente diferentes para dev/staging/prod
3. **RLS**: Revise todas as políticas RLS antes de colocar em produção
4. **Índices**: Os índices foram criados para otimizar consultas comuns

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Verifique se executou o schema.sql completamente
- Confirme que está conectado ao banco correto

### Erro: "permission denied"
- Verifique as políticas RLS
- Confirme que o usuário tem as permissões necessárias

### Erro de conexão
- Verifique as variáveis de ambiente
- Confirme que a URL e a chave estão corretas
- Verifique se o projeto está ativo no Supabase

