# 🔑 Como Encontrar a Service Role Key Correta

**Data**: Dezembro 2024  
**Status**: ✅ **GUIA VISUAL**

---

## ⚠️ IMPORTANTE: Diferença Entre as Chaves

### ❌ NÃO É ISSO:
- **Legacy JWT secret** (seção "JWT Keys")
- Formato: `ZtTBfByc3Bt++pi0rtaVopa5GY8S+EUMs1NDc76Ofbb8AGu0Lk99wM25nA+qgkrY47tCfNLjBQHmLCCZ+U9zFQ==`
- **NÃO funciona** para criar usuários via API Admin

### ✅ É ISSO:
- **Service Role Key** (seção "API Keys")
- Formato: JWT completo que começa com `eyJ...`
- **FUNCIONA** para criar usuários via API Admin

---

## 📍 Onde Encontrar a Service Role Key Correta

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto **Trilha do Saber**

---

### Passo 2: Ir em Settings > API

1. No menu lateral esquerdo, clique em **Settings** (ou **Configurações**)
2. Clique em **API** (não "JWT Keys")

---

### Passo 3: Encontrar a Service Role Key

Na seção **Project API keys**, você verá várias chaves:

1. **`anon` key** (chave pública) - ❌ Não é essa
2. **`service_role` key** (chave privada) - ✅ **É ESSA!**

A chave `service_role` deve:
- Começar com `eyJ...` (formato JWT)
- Estar marcada como **"secret"** ou **"private"**
- Ter um botão **"Copy"** ou **"Copiar"** ao lado

**Exemplo de como deve parecer:**
```
service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxenF2Z21uaW1weXp1d2J1cXgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM5OTk5OTk5LCJleHAiOjE5NTU1NzU5OTl9.xxxxx
[Copy]
```

---

## 🔍 Como Identificar a Chave Correta

### ✅ Service Role Key (CORRETA):
- ✅ Começa com `eyJ...`
- ✅ Está na seção **API Keys** (não "JWT Keys")
- ✅ Nome: `service_role`
- ✅ Tipo: "secret" ou "private"
- ✅ Funciona para criar usuários via API Admin

### ❌ Legacy JWT Secret (ERRADA):
- ❌ Formato: string aleatória (ex: `ZtTBfByc3Bt++pi0rtaVopa5GY8S+EUMs1NDc76Ofbb8AGu0Lk99wM25nA+qgkrY47tCfNLjBQHmLCCZ+U9zFQ==`)
- ❌ Está na seção **JWT Keys** (não "API Keys")
- ❌ Nome: "Legacy JWT secret"
- ❌ **NÃO funciona** para criar usuários via API Admin

---

## 📝 Passo a Passo Visual

### 1. Menu Lateral Esquerdo
```
Settings
├── General
├── Compute and Disk
├── Infrastructure
├── Integrations
├── Data API
├── API Keys          ← CLIQUE AQUI (não "JWT Keys")
├── Log Drains
├── Add Ons
└── Vault (BETA)
```

### 2. Seção API Keys
```
Project API keys

anon key (public)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  [Copy]

service_role key (secret)  ← ESTA É A CORRETA!
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  [Copy]  ← CLIQUE AQUI
```

---

## ✅ Configurar no `.env.local`

Depois de copiar a Service Role Key correta:

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione ou atualize:
   ```env
   # URL do projeto Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://iqzqvgmnimpfyzuwbuqx.supabase.co
   
   # Service Role Key (JWT, começa com eyJ...)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Salve o arquivo

---

## 🧪 Testar se a Chave Está Correta

Execute o script:

```bash
npm run criar-usuarios-api
```

**Se funcionar:**
- ✅ Você verá: "✅ Usuário criado: coordenador@teste.com"
- ✅ Os usuários serão criados com sucesso

**Se não funcionar:**
- ❌ Você verá: "❌ Erro: Invalid API key"
- ❌ Significa que a chave está errada ou no formato incorreto

---

## ⚠️ Problemas Comuns

### Erro: "Invalid API key"
**Causa:** Você está usando a chave errada (Legacy JWT secret)

**Solução:**
1. Vá em **Settings > API** (não "JWT Keys")
2. Procure pela chave **`service_role`**
3. Copie a chave que começa com `eyJ...`
4. Adicione ao `.env.local`

---

### Erro: "Cannot find service_role key"
**Causa:** A chave não está visível ou não existe

**Solução:**
1. Verifique se você está na seção **API Keys** (não "JWT Keys")
2. Procure por "service_role" na lista de chaves
3. Se não encontrar, pode ser que você precise gerar uma nova chave
4. Ou use a opção manual: crie os usuários via Dashboard (veja `CRIAR_USUARIOS_PASSO_A_PASSO.md`)

---

## 🔐 Segurança

**⚠️ IMPORTANTE:**

1. **NUNCA** compartilhe a Service Role Key
2. **NUNCA** commite a Service Role Key no Git
3. **SEMPRE** use `.env.local` (que está no `.gitignore`)
4. A Service Role Key tem **acesso total** ao banco de dados
5. Se a chave for comprometida, **revogue-a imediatamente** no Dashboard

---

## 📋 Resumo

**Para encontrar a Service Role Key correta:**

1. ✅ Acesse: **Settings > API** (não "JWT Keys")
2. ✅ Procure por: **`service_role` key**
3. ✅ Copie a chave que começa com **`eyJ...`**
4. ✅ Adicione ao `.env.local` como `SUPABASE_SERVICE_ROLE_KEY`
5. ✅ Execute: `npm run criar-usuarios-api`

**Se não encontrar ou não funcionar:**
- ✅ Use a opção manual: crie os usuários via Dashboard
- ✅ Veja o guia: `docs/CRIAR_USUARIOS_PASSO_A_PASSO.md`

---

## 🆘 Ainda Não Funciona?

Se mesmo assim não funcionar:

1. **Verifique** se a chave começa com `eyJ...`
2. **Verifique** se está na seção correta (API Keys, não JWT Keys)
3. **Verifique** se copiou a chave completa (pode ser muito longa)
4. **Tente** criar os usuários manualmente via Dashboard

---

## 📝 Nota Final

A chave que você mostrou (`ZtTBfByc3Bt++pi0rtaVopa5GY8S+EUMs1NDc76Ofbb8AGu0Lk99wM25nA+qgkrY47tCfNLjBQHmLCCZ+U9zFQ==`) é o **Legacy JWT secret**, não a Service Role Key.

Você precisa ir em **Settings > API** (não "JWT Keys") e procurar pela chave **`service_role`** que começa com `eyJ...`.

