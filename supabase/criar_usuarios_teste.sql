-- ============================================
-- SCRIPT PARA CRIAR USUÁRIOS DE TESTE
-- ============================================
-- 
-- IMPORTANTE: Este script cria os perfis e registros específicos
-- Os usuários devem ser criados primeiro via API Admin do Supabase Auth
-- ou via interface do Supabase Dashboard
--
-- Senhas sugeridas para todos: "teste123"
-- 
-- Emails de teste:
-- - coordenador@teste.com
-- - professor@teste.com
-- - pais@teste.com
-- - aluno@teste.com
--
-- ============================================

-- Função auxiliar para criar usuário de teste completo
-- Esta função assume que o usuário já foi criado no auth.users
CREATE OR REPLACE FUNCTION criar_usuario_teste(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_username TEXT,
  p_role TEXT,
  p_senha TEXT DEFAULT 'teste123'
)
RETURNS TEXT AS $$
DECLARE
  v_result TEXT;
BEGIN
  -- 1. Criar/atualizar perfil
  INSERT INTO public.profiles (id, email, full_name, username, role)
  VALUES (p_user_id, p_email, p_full_name, p_username, p_role)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    role = EXCLUDED.role;

  -- 2. Criar registro específico baseado no role
  IF p_role = 'aluno' THEN
    INSERT INTO public.alunos (id, pontos, moedas, sequencia_atual, serie)
    VALUES (p_user_id, 100, 50, 0, '5º Ano')
    ON CONFLICT (id) DO NOTHING;
    v_result := 'Aluno criado com sucesso';
    
  ELSIF p_role = 'professor' THEN
    INSERT INTO public.professores (id, matricula, status)
    VALUES (p_user_id, 'PROF-' || SUBSTRING(p_user_id::TEXT, 1, 8), 'ativo')
    ON CONFLICT (id) DO NOTHING;
    v_result := 'Professor criado com sucesso';
    
  ELSIF p_role = 'pais' THEN
    INSERT INTO public.pais (id, telefone)
    VALUES (p_user_id, '(11) 99999-9999')
    ON CONFLICT (id) DO NOTHING;
    v_result := 'Pais criado com sucesso';
    
  ELSIF p_role = 'coordenador' THEN
    INSERT INTO public.coordenadores (id)
    VALUES (p_user_id)
    ON CONFLICT (id) DO NOTHING;
    v_result := 'Coordenador criado com sucesso';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSTRUÇÕES PARA CRIAR OS USUÁRIOS
-- ============================================
--
-- 1. Crie os usuários no Supabase Auth via Dashboard ou API:
--    - Vá em Authentication > Users > Add User
--    - Ou use a API Admin do Supabase
--
-- 2. Depois de criar os usuários, execute as queries abaixo
--    substituindo os UUIDs pelos IDs reais dos usuários criados
--
-- ============================================

-- Exemplo de uso (substitua os UUIDs pelos IDs reais):
-- SELECT criar_usuario_teste(
--   'UUID_DO_COORDENADOR',
--   'coordenador@teste.com',
--   'Coordenador Teste',
--   'coordenador_teste',
--   'coordenador'
-- );

-- ============================================
-- SCRIPT ALTERNATIVO: Criar perfis diretamente
-- (Se você já tem os UUIDs dos usuários)
-- ============================================

/*
-- COORDENADOR
-- Substitua 'UUID_AQUI' pelo UUID real do usuário criado no auth.users
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  'coordenador@teste.com',
  'Coordenador Teste',
  'coordenador_teste',
  'coordenador'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.coordenadores (id)
VALUES ('UUID_AQUI')  -- Substitua pelo UUID real
ON CONFLICT (id) DO NOTHING;

-- PROFESSOR
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  'professor@teste.com',
  'Professor Teste',
  'professor_teste',
  'professor'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.professores (id, matricula, status)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  'PROF-001',
  'ativo'
)
ON CONFLICT (id) DO NOTHING;

-- PAIS
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  'pais@teste.com',
  'Pais Teste',
  'pais_teste',
  'pais'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.pais (id, telefone)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  '(11) 99999-9999'
)
ON CONFLICT (id) DO NOTHING;

-- ALUNO
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  'aluno@teste.com',
  'Aluno Teste',
  'aluno_teste',
  'aluno'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.alunos (id, pontos, moedas, sequencia_atual, serie, data_nascimento)
VALUES (
  'UUID_AQUI',  -- Substitua pelo UUID real
  100,
  50,
  0,
  '5º Ano',
  '2010-01-15'
)
ON CONFLICT (id) DO NOTHING;
*/

