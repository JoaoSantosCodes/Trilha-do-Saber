# ⚠️ Problema de Autenticação - Usuários de Teste

**Data**: Dezembro 2024  
**Status**: ⚠️ **PROBLEMA IDENTIFICADO**

---

## 🔴 Problema

O erro **401 Unauthorized** ocorre porque:

1. **Usuários criados na tabela errada**: Os usuários foram criados na tabela `public.users`, mas o Supabase Auth usa a tabela `auth.users`
2. **Sistema de autenticação**: O código usa `supabase.auth.signInWithPassword()`, que procura usuários em `auth.users`, não em `public.users`

---

## 🔍 Diagnóstico

### Erro no Console
```
POST https://iqzqvgmnimpfyzuwbuqx.supabase.co/auth/v1/token?grant_type=password 401 (Unauthorized)
```

### Causa Raiz
- Os usuários foram criados diretamente na tabela `public.users` via SQL
- O Supabase Auth não reconhece esses usuários porque eles não existem em `auth.users`
- O sistema de autenticação do Supabase requer que os usuários sejam criados via API Admin ou Dashboard

---

## ✅ Solução

### Opção 1: Criar Usuários via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** > **Users**
3. Clique em **Add User** (ou **Invite User**)
4. Crie cada usuário com:
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

5. Depois de criar os usuários no `auth.users`, execute o SQL em `supabase/criar_usuarios_teste_direto.sql` para criar os perfis e registros específicos nas tabelas `public.users`, `coordinators`, `teachers`, `parents`, `students`.

### Opção 2: Usar API Admin do Supabase

Use o script TypeScript que já existe, mas precisa da Service Role Key no formato correto:

```bash
npm run criar-usuarios-teste
```

**Nota**: O script pode falhar se a Service Role Key estiver no formato `sb_secret_` em vez do formato JWT antigo.

### Opção 3: Criar Usuários via SQL (Limitado)

Tentei criar uma migration para inserir diretamente em `auth.users`, mas isso geralmente não funciona porque:
- O Supabase Auth tem proteções contra inserção direta
- Requer permissões especiais
- Pode não funcionar mesmo com permissões

---

## 📋 Status Atual

### Usuários Criados em `public.users`
- ✅ `coordenador@teste.com` - ID: `299345a2-d287-413a-bd8a-4e898cefd111`
- ✅ `professor@teste.com` - ID: `1f137b1b-cf1e-450c-8cf7-071122d04399`
- ✅ `pais@teste.com` - ID: `a70d505b-704f-4b6d-8c48-6ffb69cd5d9f`
- ✅ `aluno@teste.com` - ID: `ebf986be-2d44-47df-939f-3be76463284d`

### Usuários Criados em `auth.users`
- ❌ Nenhum usuário encontrado

### Registros Específicos
- ✅ Coordenador → `coordinators`
- ✅ Professor → `teachers`
- ✅ Pais → `parents`
- ✅ Aluno → `students`

---

## 🎯 Próximos Passos

1. **Criar usuários no Supabase Dashboard** (Authentication > Users > Add User)
2. **Depois de criar**, os triggers do Supabase podem criar automaticamente os registros em `public.users`
3. **Ou executar o SQL** em `supabase/criar_usuarios_teste_direto.sql` para criar os registros específicos

---

## 🔧 Alternativa: Modificar Sistema de Autenticação

Se não for possível criar usuários no `auth.users`, seria necessário modificar o sistema de autenticação para usar a tabela `public.users` diretamente, mas isso não é recomendado porque:
- Perde todas as funcionalidades do Supabase Auth (sessões, tokens, etc.)
- Requer reimplementar toda a lógica de autenticação
- Não é a abordagem recomendada

---

**Última atualização**: Dezembro 2024  
**Status**: ⚠️ **AGUARDANDO CRIAÇÃO DE USUÁRIOS NO AUTH.USERS**

