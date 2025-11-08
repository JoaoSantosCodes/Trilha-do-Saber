# 🗄️ Guia de Configuração do Supabase

## 📋 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name**: Trilha do Saber
   - **Database Password**: (anote esta senha!)
   - **Region**: Escolha a mais próxima
4. Aguarde a criação do projeto (pode levar alguns minutos)

### 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** → **API**
2. Anote:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (chave longa)

### 3. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Aguarde a execução (pode levar alguns segundos)

### 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:
   ```bash
   # Windows
   type nul > .env.local
   
   # Linux/Mac
   touch .env.local
   ```

2. Adicione as seguintes variáveis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
   ```

   **Exemplo:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ```

   **Importante**: 
   - A `SUPABASE_SERVICE_ROLE_KEY` é necessária para criar professores e alunos através do painel do coordenador
   - Esta chave tem permissões administrativas e **NUNCA** deve ser exposta no frontend
   - Você pode encontrá-la em: **Supabase Dashboard → Settings → API → `service_role` key (secret)**

### 5. Instalar Dependências

```bash
npm install
```

Isso instalará o `@supabase/supabase-js` automaticamente.

### 6. Verificar Configuração

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Verifique se não há erros no console

## ✅ Verificação

Para testar se está tudo funcionando, você pode criar um arquivo de teste:

```typescript
// app/test-supabase/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase/config'

export default function TestSupabase() {
  const [materias, setMaterias] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMaterias() {
      const { data, error: err } = await supabase
        .from('materias')
        .select('*')
      
      if (err) {
        setError(err.message)
      } else {
        setMaterias(data || [])
      }
    }
    
    fetchMaterias()
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste Supabase</h1>
      <p className="mb-4">Matérias encontradas: {materias.length}</p>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>{materia.nome}</li>
        ))}
      </ul>
    </div>
  )
}
```

Acesse `/test-supabase` no navegador. Se aparecer a lista de matérias, está tudo funcionando! 🎉

## 🔐 Segurança

### Row Level Security (RLS)

O schema inclui políticas RLS básicas. Para produção, você deve:

1. Revisar todas as políticas em `supabase/schema.sql`
2. Ajustar conforme suas necessidades
3. Testar as permissões

### Service Role Key

⚠️ **NUNCA** exponha a Service Role Key no frontend!

Use apenas para operações server-side (API routes, Server Components).

## 📚 Próximos Passos

1. ✅ Schema criado
2. ✅ Configuração básica feita
3. 🔄 Integrar com as páginas do app
4. 🔄 Criar hooks personalizados para Supabase
5. 🔄 Implementar autenticação

## 🐛 Problemas Comuns

### "relation does not exist"
- Verifique se executou o `schema.sql` completamente
- Confirme que está no banco correto

### "permission denied"
- Verifique as políticas RLS
- Confirme que o usuário está autenticado

### Erro de conexão
- Verifique `.env.local` existe e tem as variáveis corretas
- Reinicie o servidor após criar `.env.local`
- Verifique se a URL e a chave estão corretas

## 📖 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

