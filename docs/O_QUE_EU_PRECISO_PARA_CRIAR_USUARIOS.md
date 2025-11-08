# 🔑 O Que Eu Preciso Para Criar Usuários Automaticamente

**Data**: Dezembro 2024  
**Status**: 📋 **REQUISITOS**

---

## 🎯 Resumo

Para eu criar os usuários automaticamente via código, preciso de **acesso à API Admin do Supabase**, que requer a **Service Role Key** no formato correto.

---

## ✅ O Que Eu Preciso

### 1. Service Role Key (Chave JWT)

**O que é:**
- Chave de administrador do Supabase
- Permite criar usuários via API Admin
- Formato: JWT (começa com `eyJ...`)

**Onde encontrar:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Na seção **Project API keys**, procure a chave **`service_role`**
5. Copie a chave (ela deve começar com `eyJ...`)

**⚠️ IMPORTANTE:**
- Esta chave tem **acesso total** ao banco de dados
- **NUNCA** compartilhe ou commite no Git
- Use apenas no `.env.local` (que está no `.gitignore`)

---

### 2. URL do Projeto Supabase

**O que é:**
- URL base do seu projeto Supabase
- Formato: `https://xxxxx.supabase.co`

**Onde encontrar:**
1. No mesmo lugar: **Settings** > **API**
2. Procure por **Project URL** ou **API URL**
3. Copie a URL completa

**Exemplo:**
```
https://iqzqvgmnimpfyzuwbuqx.supabase.co
```

---

### 3. Configurar no `.env.local`

Adicione as seguintes variáveis ao arquivo `.env.local`:

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Service Role Key (chave JWT, começa com eyJ...)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:**
- O arquivo `.env.local` já está no `.gitignore`
- Não commite essas chaves no Git
- Mantenha-as seguras

---

## 🚀 Como Eu Crio os Usuários

### Opção 1: Via Script TypeScript (Recomendado)

Após configurar as variáveis de ambiente:

```bash
npm run criar-usuarios-api
```

**O que o script faz:**
1. ✅ Lê as variáveis de ambiente do `.env.local`
2. ✅ Conecta à API Admin do Supabase
3. ✅ Cria os 4 usuários de teste:
   - `coordenador@teste.com` / `teste123`
   - `professor@teste.com` / `teste123`
   - `pais@teste.com` / `teste123`
   - `aluno@teste.com` / `teste123`
4. ✅ Auto-confirma o email de cada usuário
5. ✅ Define metadata (nome, role, username)
6. ✅ Trata erros e usuários já existentes

---

### Opção 2: Via SQL Direto (Não Funciona)

**❌ Por que não funciona:**
- O Supabase Auth não aceita senhas criadas com `crypt()` do PostgreSQL
- O sistema de autenticação requer que as senhas sejam criadas via API Admin
- Criar usuários diretamente via SQL resulta em erro 401 no login

**✅ Solução:**
- Use a API Admin (via script ou Dashboard)
- Não tente criar via SQL direto

---

## 🔍 Verificar se Tenho Acesso

Para verificar se tenho acesso ao banco, posso:

1. **Listar tabelas** via `mcp_supabase_list_tables`
2. **Executar SQL** via `mcp_supabase_execute_sql`
3. **Criar usuários** via API Admin (se tiver a Service Role Key)

**Mas para criar usuários via API Admin, preciso:**
- ✅ Service Role Key (JWT)
- ✅ URL do projeto
- ✅ Configurado no `.env.local`

---

## 📋 Checklist

Para eu criar os usuários automaticamente, você precisa:

- [ ] Acessar o Supabase Dashboard
- [ ] Ir em **Settings** > **API**
- [ ] Copiar a chave **`service_role`** (formato JWT, começa com `eyJ...`)
- [ ] Copiar a **Project URL** (formato `https://xxxxx.supabase.co`)
- [ ] Adicionar ao `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL=...`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] Executar: `npm run criar-usuarios-api`

---

## 🆘 Se Não Tiver a Service Role Key

Se você não conseguir a Service Role Key ou não quiser usá-la:

**✅ Solução: Criar Manualmente via Dashboard**

Siga o guia em: `docs/CRIAR_USUARIOS_PASSO_A_PASSO.md`

É mais trabalhoso, mas funciona perfeitamente e não requer a Service Role Key.

---

## 🔐 Segurança

**⚠️ IMPORTANTE:**

1. **NUNCA** compartilhe a Service Role Key
2. **NUNCA** commite a Service Role Key no Git
3. **SEMPRE** use `.env.local` (que está no `.gitignore`)
4. A Service Role Key tem **acesso total** ao banco de dados
5. Se a chave for comprometida, **revogue-a imediatamente** no Dashboard

---

## 📝 Resumo

**Para eu criar os usuários automaticamente:**
- ✅ Preciso da **Service Role Key** (JWT)
- ✅ Preciso da **URL do projeto**
- ✅ Preciso que estejam no `.env.local`
- ✅ Depois executo: `npm run criar-usuarios-api`

**Se não tiver a Service Role Key:**
- ✅ Crie manualmente via Dashboard (veja `CRIAR_USUARIOS_PASSO_A_PASSO.md`)
- ✅ Funciona perfeitamente, só é mais trabalhoso

---

## 🎯 Próximos Passos

1. **Se você tem a Service Role Key:**
   - Configure no `.env.local`
   - Execute: `npm run criar-usuarios-api`
   - Teste o login

2. **Se você não tem a Service Role Key:**
   - Siga o guia: `docs/CRIAR_USUARIOS_PASSO_A_PASSO.md`
   - Crie os usuários manualmente via Dashboard
   - Teste o login

