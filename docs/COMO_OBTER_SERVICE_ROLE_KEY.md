# 🔑 Como Obter a Service Role Key do Supabase

**Data**: Dezembro 2024

---

## 📋 O que é a Service Role Key?

A **Service Role Key** é uma chave de API do Supabase que tem **permissões administrativas completas**. Ela é necessária para:

- Criar usuários via API Admin
- Executar operações administrativas
- Bypassar Row Level Security (RLS)

⚠️ **IMPORTANTE**: Esta chave é **SECRETA** e **NUNCA** deve ser exposta no frontend ou commitada no Git!

---

## 🚀 Como Obter a Service Role Key

### Passo 1: Acessar o Supabase Dashboard

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **Trilha do Saber**

### Passo 2: Navegar até as Configurações da API

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **API** (ou vá diretamente para Settings > API)

### Passo 3: Copiar a Service Role Key

1. Na seção **Project API keys**, você verá várias chaves:
   - **anon** `public` - Chave pública (já configurada)
   - **service_role** `secret` - Chave secreta (esta é a que precisamos!)

2. Clique no ícone de **olho** 👁️ ao lado de `service_role` para revelar a chave

3. Clique em **Copy** para copiar a chave

4. A chave será algo como:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxenF2Z21uaW1wZnl6dXdidXF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwNTg2MSwiZXhwIjoyMDc3NzgxODYxfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Passo 4: Adicionar ao .env.local

1. Abra o arquivo `.env.local` na raiz do projeto

2. Adicione a linha:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
   ```

3. **Exemplo completo** do `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://iqzqvgmnimpfyzuwbuqx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxenF2Z21uaW1wZnl6dXdidXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDU4NjEsImV4cCI6MjA3Nzc4MTg2MX0.xMkH5hwwKbko3WAZpjkcBWOTfY-jNGROvbsAJZrvdRI
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxenF2Z21uaW1wZnl6dXdidXF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwNTg2MSwiZXhwIjoyMDc3NzgxODYxfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. Salve o arquivo

---

## ✅ Verificar se Está Configurado

Execute o script de criação de usuários de teste:

```bash
npm run criar-usuarios-teste
```

Se estiver tudo configurado corretamente, você verá:

```
🚀 Iniciando criação de usuários de teste...
✅ Usuário coordenador@teste.com criado com sucesso!
✅ Usuário professor@teste.com criado com sucesso!
✅ Usuário pais@teste.com criado com sucesso!
✅ Usuário aluno@teste.com criado com sucesso!
```

---

## 🔒 Segurança

### ⚠️ NUNCA faça:

- ❌ Commit a Service Role Key no Git
- ❌ Expor a chave no frontend
- ❌ Compartilhar a chave publicamente
- ❌ Usar a chave em código cliente

### ✅ SEMPRE faça:

- ✅ Mantenha a chave no `.env.local` (já está no `.gitignore`)
- ✅ Use apenas em scripts server-side
- ✅ Revogue e recrie a chave se ela for exposta
- ✅ Use a chave apenas quando necessário

---

## 🆘 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não configurado"

**Solução**: 
1. Verifique se adicionou a chave no `.env.local`
2. Certifique-se de que não há espaços antes ou depois do `=`
3. Verifique se copiou a chave completa (é muito longa!)

### Erro: "Invalid API key"

**Solução**:
1. Verifique se copiou a chave correta (service_role, não anon)
2. Certifique-se de que não há espaços ou quebras de linha na chave
3. Tente copiar a chave novamente do Supabase Dashboard

### Erro: "Permission denied"

**Solução**:
1. Verifique se está usando a Service Role Key (não a anon key)
2. Certifique-se de que a chave está correta
3. Verifique se o projeto do Supabase está ativo

---

## 📚 Referências

- [Documentação do Supabase - API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Documentação do Supabase - Service Role Key](https://supabase.com/docs/guides/api/api-keys#service-role-key)

---

**Última atualização**: Dezembro 2024

