-- Testar renomear temporariamente a tabela users
-- Execute este comando no SQL Editor do Supabase
-- ATENÇÃO: Isso renomeia a tabela temporariamente

-- Renomear temporariamente
ALTER TABLE users RENAME TO app_users;

-- Teste se funciona agora
-- Se funcionar, o problema é o nome "users"
-- Se não funcionar, o problema é outro

-- Para voltar ao nome original (execute depois do teste):
-- ALTER TABLE app_users RENAME TO users;

