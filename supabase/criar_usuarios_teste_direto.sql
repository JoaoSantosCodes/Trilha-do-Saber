-- ============================================
-- SCRIPT SQL PARA CRIAR USUÁRIOS DE TESTE
-- ============================================
-- 
-- IMPORTANTE: Este script cria os perfis e registros específicos
-- Os usuários devem ser criados primeiro via Supabase Dashboard
-- ou via API Admin do Supabase
--
-- Passos:
-- 1. Crie os usuários no Supabase Dashboard (Authentication > Users > Add User)
-- 2. Depois, execute este SQL para criar os perfis e registros específicos
--
-- ============================================

-- COORDENADOR
-- Substitua 'UUID_DO_COORDENADOR' pelo UUID real do usuário criado no auth.users
-- Para obter o UUID, execute: SELECT id, email FROM auth.users WHERE email = 'coordenador@teste.com';

-- Exemplo de uso (substitua o UUID):
/*
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_DO_COORDENADOR',  -- Substitua pelo UUID real
  'coordenador@teste.com',
  'Coordenador Teste',
  'coordenador_teste',
  'coordenador'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.coordenadores (id)
VALUES ('UUID_DO_COORDENADOR')  -- Substitua pelo UUID real
ON CONFLICT (id) DO NOTHING;
*/

-- PROFESSOR
/*
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_DO_PROFESSOR',  -- Substitua pelo UUID real
  'professor@teste.com',
  'Professor Teste',
  'professor_teste',
  'professor'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.professores (id, matricula, status)
VALUES (
  'UUID_DO_PROFESSOR',  -- Substitua pelo UUID real
  'PROF-001',
  'ativo'
)
ON CONFLICT (id) DO NOTHING;
*/

-- PAIS
/*
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_DO_PAIS',  -- Substitua pelo UUID real
  'pais@teste.com',
  'Pais Teste',
  'pais_teste',
  'pais'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.pais (id, telefone)
VALUES (
  'UUID_DO_PAIS',  -- Substitua pelo UUID real
  '(11) 99999-9999'
)
ON CONFLICT (id) DO NOTHING;
*/

-- ALUNO
/*
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_DO_ALUNO',  -- Substitua pelo UUID real
  'aluno@teste.com',
  'Aluno Teste',
  'aluno_teste',
  'aluno'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.alunos (id, pontos, moedas, sequencia_atual, serie, data_nascimento)
VALUES (
  'UUID_DO_ALUNO',  -- Substitua pelo UUID real
  100,
  50,
  0,
  '5º Ano',
  '2010-01-15'
)
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- SCRIPT AUTOMÁTICO (se os usuários já existem)
-- ============================================

-- Este script atualiza os perfis baseado nos emails dos usuários existentes
-- Execute apenas se os usuários já foram criados no auth.users

DO $$
DECLARE
  v_coordenador_id UUID;
  v_professor_id UUID;
  v_pais_id UUID;
  v_aluno_id UUID;
BEGIN
  -- Obter IDs dos usuários
  SELECT id INTO v_coordenador_id FROM auth.users WHERE email = 'coordenador@teste.com';
  SELECT id INTO v_professor_id FROM auth.users WHERE email = 'professor@teste.com';
  SELECT id INTO v_pais_id FROM auth.users WHERE email = 'pais@teste.com';
  SELECT id INTO v_aluno_id FROM auth.users WHERE email = 'aluno@teste.com';

  -- COORDENADOR
  IF v_coordenador_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, username, role)
    VALUES (v_coordenador_id, 'coordenador@teste.com', 'Coordenador Teste', 'coordenador_teste', 'coordenador')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

    INSERT INTO public.coordenadores (id)
    VALUES (v_coordenador_id)
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Coordenador criado/atualizado: %', v_coordenador_id;
  END IF;

  -- PROFESSOR
  IF v_professor_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, username, role)
    VALUES (v_professor_id, 'professor@teste.com', 'Professor Teste', 'professor_teste', 'professor')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

    INSERT INTO public.professores (id, matricula, status)
    VALUES (v_professor_id, 'PROF-001', 'ativo')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Professor criado/atualizado: %', v_professor_id;
  END IF;

  -- PAIS
  IF v_pais_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, username, role)
    VALUES (v_pais_id, 'pais@teste.com', 'Pais Teste', 'pais_teste', 'pais')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

    INSERT INTO public.pais (id, telefone)
    VALUES (v_pais_id, '(11) 99999-9999')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Pais criado/atualizado: %', v_pais_id;
  END IF;

  -- ALUNO
  IF v_aluno_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, username, role)
    VALUES (v_aluno_id, 'aluno@teste.com', 'Aluno Teste', 'aluno_teste', 'aluno')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

    INSERT INTO public.alunos (id, pontos, moedas, sequencia_atual, serie, data_nascimento)
    VALUES (v_aluno_id, 100, 50, 0, '5º Ano', '2010-01-15')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Aluno criado/atualizado: %', v_aluno_id;
  END IF;
END $$;

