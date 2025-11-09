-- Testar desabilitar e reabilitar RLS na tabela users
-- Execute este comando no SQL Editor do Supabase
-- ATENÇÃO: Isso desabilita temporariamente a segurança RLS

-- Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Teste se funciona agora (deve funcionar)
-- Se funcionar, o problema é a política RLS

-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

