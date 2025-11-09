# Como Resolver o Problema PostgREST 404

## 📋 Problema

O PostgREST está retornando **404** para as tabelas `users`, `teachers` e `classrooms`, mesmo com:
- ✅ Dados existindo no banco
- ✅ Políticas RLS corretas
- ✅ Token JWT válido
- ✅ Queries SQL diretas funcionando

---

## 🔧 Soluções (Tente nesta ordem)

### Solução 1: Forçar Reload do Schema Cache do PostgREST

**Passo 1**: Acesse o **SQL Editor** no Supabase Dashboard

**Passo 2**: Execute este comando:

```sql
NOTIFY pgrst, 'reload schema';
```

**Passo 3**: Aguarde alguns segundos e teste novamente

**Passo 4**: Se não funcionar, tente também:

```sql
SELECT pg_notify('pgrst', 'reload schema');
```

---

### Solução 2: Verificar Configuração do PostgREST no Supabase

**Passo 1**: Acesse o **Supabase Dashboard** → **Settings** → **API**

**Passo 2**: Verifique se:
- ✅ O schema `public` está sendo exposto
- ✅ Não há configurações que bloqueiem `users`, `teachers` ou `classrooms`
- ✅ O PostgREST está habilitado

**Passo 3**: Se houver alguma configuração bloqueando, desabilite ou ajuste

---

### Solução 3: Verificar se a Tabela `users` Está Sendo Exposta

**Passo 1**: No **SQL Editor**, execute:

```sql
-- Verificar se a tabela users existe e está no schema public
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'users';
```

**Passo 2**: Se a tabela existir, verifique se há alguma view ou materialized view interferindo:

```sql
-- Verificar views que possam estar interferindo
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
AND viewname LIKE '%user%';
```

---

### Solução 4: Verificar Políticas RLS Específicas

**Passo 1**: No **SQL Editor**, execute:

```sql
-- Verificar políticas RLS para users
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'users';
```

**Passo 2**: Compare com a tabela `students` (que funciona):

```sql
-- Verificar políticas RLS para students (que funciona)
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'students';
```

**Passo 3**: Se houver diferenças, ajuste as políticas de `users` para serem idênticas às de `students`

---

### Solução 5: Recriar Políticas RLS para `users`

**Passo 1**: No **SQL Editor**, execute para **desabilitar temporariamente RLS**:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Passo 2**: Teste se a query funciona agora (deve funcionar)

**Passo 3**: Se funcionar, **reabilite RLS**:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**Passo 4**: **Recrie a política**:

```sql
-- Deletar política existente (se houver)
DROP POLICY IF EXISTS "Anyone authenticated can view users" ON users;

-- Recriar política
CREATE POLICY "Anyone authenticated can view users"
ON users
FOR SELECT
TO authenticated
USING (true);
```

**Passo 5**: Teste novamente

---

### Solução 6: Verificar se `users` é uma Palavra Reservada

**Passo 1**: Se nada funcionar, pode ser que `users` seja uma palavra reservada ou conflite com algo

**Passo 2**: Tente renomear temporariamente a tabela para testar:

```sql
-- Renomear temporariamente
ALTER TABLE users RENAME TO app_users;

-- Testar se funciona agora
-- Se funcionar, o problema é o nome "users"
-- Se não funcionar, o problema é outro
```

**Passo 3**: Se funcionar, você tem duas opções:
- **Opção A**: Manter o nome `app_users` e atualizar o código
- **Opção B**: Voltar para `users` e contatar suporte do Supabase

---

### Solução 7: Contatar Suporte do Supabase

**Passo 1**: Se nenhuma das soluções acima funcionar, o problema pode ser específico da configuração do seu projeto

**Passo 2**: Contate o **Suporte do Supabase** com:
- Descrição do problema
- Evidências (logs da API mostrando 404 para `users` mas 200 para `students`)
- Queries SQL que funcionam diretamente
- Políticas RLS que estão configuradas

**Passo 3**: Peça para verificar:
- Configuração do PostgREST
- Schema cache
- Se há alguma configuração específica bloqueando `users`

---

## 🔍 Verificação Rápida

Para verificar se o problema foi resolvido:

1. **Abra o console do navegador** (F12)
2. **Acesse a página** `/coordenador/turmas/nova`
3. **Verifique se há erros 404** para `/rest/v1/users` ou `/rest/v1/teachers`
4. **Verifique se o select de professores** está preenchido

---

## 📝 Checklist de Verificação

- [ ] Executei `NOTIFY pgrst, 'reload schema';`
- [ ] Verifiquei configurações do PostgREST no Dashboard
- [ ] Verifiquei se a tabela `users` existe e está no schema `public`
- [ ] Comparei políticas RLS entre `users` e `students`
- [ ] Tentei desabilitar e reabilitar RLS
- [ ] Tentei recriar as políticas RLS
- [ ] Testei renomear a tabela temporariamente
- [ ] Contatei suporte do Supabase (se necessário)

---

## 🚨 Importante

- **NÃO delete dados** sem fazer backup
- **Teste cada solução** antes de passar para a próxima
- **Anote o que funcionou** para referência futura
- **Se algo der errado**, você pode sempre reverter usando os comandos SQL

---

## 💡 Dica Final

Se você conseguir acesso ao **Supabase Dashboard** → **Settings** → **API**, verifique se há alguma configuração de **"Exposed Schemas"** ou **"Blocked Tables"** que possa estar bloqueando `users`, `teachers` ou `classrooms`.

