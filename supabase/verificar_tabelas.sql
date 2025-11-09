-- Verificar se as tabelas existem e estão no schema public
-- Execute este comando no SQL Editor do Supabase

SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'teachers', 'classrooms', 'students')
ORDER BY tablename;

