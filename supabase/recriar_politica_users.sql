-- Recriar política RLS para tabela users
-- Execute este comando no SQL Editor do Supabase

-- Deletar política existente (se houver)
DROP POLICY IF EXISTS "Anyone authenticated can view users" ON users;

-- Recriar política
CREATE POLICY "Anyone authenticated can view users"
ON users
FOR SELECT
TO authenticated
USING (true);

