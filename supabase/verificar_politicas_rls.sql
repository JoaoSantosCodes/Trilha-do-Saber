-- Verificar políticas RLS para users e students (comparar)
-- Execute este comando no SQL Editor do Supabase

-- Políticas para users
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

-- Políticas para students (que funciona)
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

