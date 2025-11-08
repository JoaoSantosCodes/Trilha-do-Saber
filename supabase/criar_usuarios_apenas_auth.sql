-- ============================================
-- SCRIPT SQL PARA CRIAR APENAS USUÁRIOS EM auth.users
-- ============================================
-- 
-- Execute este script no SQL Editor do Supabase Dashboard
-- Copie e cole TODO o conteúdo abaixo no SQL Editor e clique em "Run"
--
-- Este script cria APENAS os usuários em auth.users
-- Os registros específicos (coordinators, teachers, parents, students) 
-- podem ser criados depois, se necessário
--
-- ============================================

-- Habilitar extensão pgcrypto para hash de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- CRIAR USUÁRIOS NO auth.users
-- ============================================

-- Criar coordenador
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'coordenador@teste.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Coordenador Teste","role":"coordinator","username":"coordenador_teste"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  false,
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'coordenador@teste.com');

-- Criar professor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'professor@teste.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Professor Teste","role":"teacher","username":"professor_teste"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  false,
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'professor@teste.com');

-- Criar pais
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'pais@teste.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Pais Teste","role":"parent","username":"pais_teste"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  false,
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pais@teste.com');

-- Criar aluno
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'aluno@teste.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Aluno Teste","role":"student","username":"aluno_teste"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  false,
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aluno@teste.com');

-- ============================================
-- VERIFICAR SE FOI CRIADO CORRETAMENTE
-- ============================================

SELECT 
  '✅ Usuários criados no auth.users' as status,
  COUNT(*) as total
FROM auth.users
WHERE email IN ('coordenador@teste.com', 'professor@teste.com', 'pais@teste.com', 'aluno@teste.com');

-- ============================================
-- LISTAR USUÁRIOS CRIADOS
-- ============================================

SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as nome,
  au.raw_user_meta_data->>'role' as role,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.created_at
FROM auth.users au
WHERE au.email IN ('coordenador@teste.com', 'professor@teste.com', 'pais@teste.com', 'aluno@teste.com')
ORDER BY au.email;

