# Comandos SQL para Copiar e Colar

## ⚠️ IMPORTANTE

**NÃO copie os blocos de código markdown (```sql e ```)**  
**Copie APENAS o SQL dentro dos blocos!**

---

## 🔧 Solução 1: Reload do Schema Cache

Copie e cole APENAS esta linha no SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

**OU use o arquivo**: `supabase/reload_schema_cache.sql`

---

## 🔧 Solução 2: Recriar Política RLS

Copie e cole APENAS estas linhas no SQL Editor:

```sql
DROP POLICY IF EXISTS "Anyone authenticated can view users" ON users;

CREATE POLICY "Anyone authenticated can view users"
ON users
FOR SELECT
TO authenticated
USING (true);
```

**OU use o arquivo**: `supabase/recriar_politica_users.sql`

---

## 🔍 Verificação: Verificar Tabelas

Copie e cole APENAS estas linhas no SQL Editor:

```sql
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'teachers', 'classrooms', 'students')
ORDER BY tablename;
```

**OU use o arquivo**: `supabase/verificar_tabelas.sql`

---

## 🔍 Verificação: Verificar Políticas RLS

Copie e cole APENAS estas linhas no SQL Editor:

```sql
SELECT 
  'users' as tabela,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'users'
ORDER BY policyname;

SELECT 
  'students' as tabela,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'students'
ORDER BY policyname;
```

**OU use o arquivo**: `supabase/verificar_politicas_rls.sql`

---

## 🧪 Teste: Desabilitar RLS Temporariamente

**ATENÇÃO**: Isso desabilita temporariamente a segurança RLS!

Copie e cole APENAS estas linhas no SQL Editor:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Teste se funciona agora (deve funcionar)
-- Se funcionar, o problema é a política RLS

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**OU use o arquivo**: `supabase/testar_desabilitar_rls.sql`

---

## 🧪 Teste: Renomear Tabela Temporariamente

**ATENÇÃO**: Isso renomeia a tabela temporariamente!

Copie e cole APENAS estas linhas no SQL Editor:

```sql
ALTER TABLE users RENAME TO app_users;

-- Teste se funciona agora
-- Se funcionar, o problema é o nome "users"
-- Se não funcionar, o problema é outro

-- Para voltar ao nome original (execute depois do teste):
-- ALTER TABLE app_users RENAME TO users;
```

**OU use o arquivo**: `supabase/testar_renomear_tabela.sql`

---

## 📝 Como Usar

1. **Abra o SQL Editor** no Supabase Dashboard
2. **Copie APENAS o SQL** (sem os ```sql e ```)
3. **Cole no SQL Editor**
4. **Execute** (Run ou F5)
5. **Verifique o resultado**

---

## 💡 Dica

Todos os arquivos SQL estão na pasta `supabase/`:
- `reload_schema_cache.sql` - Reload do schema cache
- `recriar_politica_users.sql` - Recriar política RLS
- `verificar_tabelas.sql` - Verificar se tabelas existem
- `verificar_politicas_rls.sql` - Verificar políticas RLS
- `testar_desabilitar_rls.sql` - Testar desabilitar RLS
- `testar_renomear_tabela.sql` - Testar renomear tabela

Você pode abrir esses arquivos e copiar o conteúdo diretamente!

