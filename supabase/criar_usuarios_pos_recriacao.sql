-- Criar usuários de teste após recriar o banco
-- Execute este comando no SQL Editor do Supabase

-- NOTA: Este script cria usuários diretamente na tabela users
-- Para criar em auth.users, use o script via API: npm run criar-usuarios-api

-- Criar usuário coordenador
INSERT INTO public.users (id, email, password_hash, name, role, is_active, email_verified)
VALUES (
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75',
  'coordenador@teste.com',
  '$2a$10$placeholder', -- Será atualizado pelo Supabase Auth
  'Coordenador Teste',
  'coordinator',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  email_verified = EXCLUDED.email_verified;

-- Inserir na tabela coordinators
INSERT INTO public.coordinators (id, user_id)
VALUES (
  uuid_generate_v4(),
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75'
)
ON CONFLICT DO NOTHING;

-- Criar professores de teste (apenas na tabela users)
-- NOTA: Para criar professores completos, use o script via API

INSERT INTO public.users (id, email, password_hash, name, role, is_active, email_verified)
VALUES
  ('c6fe5ff7-b470-413c-bb49-57a706452509', 'professor1@teste.com', '$2a$10$placeholder', 'Ana Barbosa', 'teacher', true, true),
  ('ba18629b-a5c1-41f3-9df4-506ecebef912', 'professor2@teste.com', '$2a$10$placeholder', 'Carlos Menezes', 'teacher', true, true),
  ('c3cde9c2-f312-430d-ad4e-102d8815fb72', 'professor3@teste.com', '$2a$10$placeholder', 'Fernanda Silveira', 'teacher', true, true),
  ('4967ee88-979c-419d-8451-64a8bd80dbb5', 'professor4@teste.com', '$2a$10$placeholder', 'Juliana Duarte', 'teacher', true, true),
  ('e919a868-7365-4909-8eac-1c69ad803088', 'professor5@teste.com', '$2a$10$placeholder', 'Marcos Albuquerque', 'teacher', true, true),
  ('caef1e31-ff9b-4d58-8150-75f2bb5ea2a9', 'professor6@teste.com', '$2a$10$placeholder', 'Roberto Azevedo', 'teacher', true, true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  email_verified = EXCLUDED.email_verified;

-- Inserir na tabela teachers
INSERT INTO public.teachers (id, user_id)
SELECT uuid_generate_v4(), id
FROM public.users
WHERE role = 'teacher'
ON CONFLICT DO NOTHING;

