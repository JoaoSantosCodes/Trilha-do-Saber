# ✅ Solução Final para Criar Usuários de Teste

**Data**: Dezembro 2024  
**Status**: ✅ **SOLUÇÃO DEFINITIVA**

---

## 🔴 Problema Identificado

O erro **401 Unauthorized** no login ocorre porque:

1. **Hash de senha incompatível**: Os usuários foram criados via SQL usando `crypt()` do PostgreSQL, mas o Supabase Auth usa um formato de hash específico que não é compatível
2. **Supabase Auth não aceita senhas criadas diretamente via SQL**: O sistema de autenticação do Supabase requer que os usuários sejam criados via API Admin ou Dashboard

---

## ✅ Solução: Criar Usuários via API Admin

### Opção 1: Usar o Script TypeScript (Recomendado)

Execute o script que usa a API Admin do Supabase:

```bash
npm run criar-usuarios-api
```

**Requisitos:**
- Variáveis de ambiente configuradas em `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (chave JWT, não `sb_secret_`)

**O script:**
- ✅ Cria usuários com senhas que funcionam no login
- ✅ Auto-confirma o email
- ✅ Define metadata (nome, role, username)
- ✅ Trata erros e usuários já existentes

---

### Opção 2: Criar via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** > **Users**
3. Clique em **Add User** (ou **Invite User**)
4. Para cada usuário:
   - **Email**: `coordenador@teste.com`, `professor@teste.com`, `pais@teste.com`, `aluno@teste.com`
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ (marcar)
   - **User Metadata**:
     ```json
     {
       "full_name": "Coordenador Teste",
       "role": "coordinator",
       "username": "coordenador_teste"
     }
     ```

---

## 🔑 Como Obter a Service Role Key Correta

A Service Role Key deve ser uma **chave JWT**, não `sb_secret_`.

### Passos:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Na seção **Project API keys**, copie a chave **`service_role`** (não a `anon` ou `publishable`)
5. A chave deve começar com `eyJ...` (formato JWT)
6. Adicione ao `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

**⚠️ IMPORTANTE**: A Service Role Key tem acesso total ao banco. **NUNCA** compartilhe ou commite essa chave no Git!

---

## 📋 Credenciais de Teste

Após criar os usuários, você pode fazer login com:

| Email | Senha | Role |
|-------|-------|------|
| `coordenador@teste.com` | `teste123` | Coordenador |
| `professor@teste.com` | `teste123` | Professor |
| `pais@teste.com` | `teste123` | Pais |
| `aluno@teste.com` | `teste123` | Aluno |

---

## 🧪 Testar Login

1. Execute o app: `npm run dev`
2. Acesse: `http://localhost:3000/login`
3. Faça login com uma das credenciais acima
4. Verifique se o login funciona sem erro 401

---

## 🔍 Verificar Usuários Criados

Execute no SQL Editor do Supabase:

```sql
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  raw_user_meta_data->>'full_name' as nome,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email IN ('coordenador@teste.com', 'professor@teste.com', 'pais@teste.com', 'aluno@teste.com')
ORDER BY email;
```

---

## ❌ Por Que SQL Direto Não Funciona?

O Supabase Auth usa um sistema de hash de senha específico que:
- Não é compatível com `crypt()` do PostgreSQL
- Requer que as senhas sejam criadas via API Admin
- Valida o formato do hash durante o login

Por isso, criar usuários diretamente via SQL com `crypt()` resulta em erro 401 no login.

---

## ✅ Próximos Passos

Após criar os usuários via API Admin:

1. **Testar login** com cada credencial
2. **Verificar se cada role tem acesso** às funcionalidades corretas
3. **Criar registros específicos** nas tabelas `coordinators`, `teachers`, `parents`, `students` (se necessário)

---

## 📝 Notas

- Os usuários criados via API Admin funcionam imediatamente no login
- Não é necessário criar registros em `public.users` manualmente (o trigger `handle_new_user()` faz isso automaticamente)
- Os registros específicos (`coordinators`, `teachers`, `parents`, `students`) podem ser criados depois, se necessário

