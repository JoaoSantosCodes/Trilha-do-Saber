# 👥 Como Criar Usuários de Teste Manualmente

**Data**: Dezembro 2024

---

## ⚠️ Problema com a API Key

O Supabase mudou o formato das chaves para `sb_secret_`, mas o cliente JavaScript ainda espera o formato JWT antigo. Por isso, vamos criar os usuários manualmente via Dashboard do Supabase.

---

## 🚀 Método 1: Via Supabase Dashboard (Recomendado)

### Passo 1: Criar Usuários no Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto **Trilha do Saber**
3. Vá em **Authentication** > **Users**
4. Clique em **Add User** (ou **Invite User**)

5. Crie cada usuário com os seguintes dados:

#### Coordenador
- **Email**: `coordenador@teste.com`
- **Password**: `teste123`
- **Auto Confirm User**: ✅ (marcar)
- **User Metadata** (opcional):
  ```json
  {
    "full_name": "Coordenador Teste",
    "role": "coordenador",
    "username": "coordenador_teste"
  }
  ```

#### Professor
- **Email**: `professor@teste.com`
- **Password**: `teste123`
- **Auto Confirm User**: ✅ (marcar)
- **User Metadata** (opcional):
  ```json
  {
    "full_name": "Professor Teste",
    "role": "professor",
    "username": "professor_teste"
  }
  ```

#### Pais
- **Email**: `pais@teste.com`
- **Password**: `teste123`
- **Auto Confirm User**: ✅ (marcar)
- **User Metadata** (opcional):
  ```json
  {
    "full_name": "Pais Teste",
    "role": "pais",
    "username": "pais_teste"
  }
  ```

#### Aluno
- **Email**: `aluno@teste.com`
- **Password**: `teste123`
- **Auto Confirm User**: ✅ (marcar)
- **User Metadata** (opcional):
  ```json
  {
    "full_name": "Aluno Teste",
    "role": "aluno",
    "username": "aluno_teste"
  }
  ```

### Passo 2: Criar Perfis e Registros Específicos

Depois de criar os usuários, execute o SQL em `supabase/criar_usuarios_teste_direto.sql`:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/criar_usuarios_teste_direto.sql`
4. Copie o conteúdo do script automático (a parte com `DO $$`)
5. Cole no SQL Editor
6. Clique em **Run** (ou pressione Ctrl+Enter)

O script criará automaticamente:
- Perfis na tabela `profiles`
- Registros específicos (coordenador, professor, pais, aluno)

---

## 🚀 Método 2: Via SQL Editor (Alternativo)

Se preferir criar tudo via SQL:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Execute o seguinte SQL para cada usuário:

### Coordenador

```sql
-- 1. Criar usuário no auth.users (via Dashboard primeiro)
-- 2. Depois, obter o UUID:
SELECT id, email FROM auth.users WHERE email = 'coordenador@teste.com';

-- 3. Substituir UUID_AQUI pelo UUID obtido e executar:
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',
  'coordenador@teste.com',
  'Coordenador Teste',
  'coordenador_teste',
  'coordenador'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.coordenadores (id)
VALUES ('UUID_AQUI')
ON CONFLICT (id) DO NOTHING;
```

### Professor

```sql
-- Obter UUID
SELECT id, email FROM auth.users WHERE email = 'professor@teste.com';

-- Substituir UUID_AQUI e executar:
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',
  'professor@teste.com',
  'Professor Teste',
  'professor_teste',
  'professor'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.professores (id, matricula, status)
VALUES (
  'UUID_AQUI',
  'PROF-001',
  'ativo'
)
ON CONFLICT (id) DO NOTHING;
```

### Pais

```sql
-- Obter UUID
SELECT id, email FROM auth.users WHERE email = 'pais@teste.com';

-- Substituir UUID_AQUI e executar:
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',
  'pais@teste.com',
  'Pais Teste',
  'pais_teste',
  'pais'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.pais (id, telefone)
VALUES (
  'UUID_AQUI',
  '(11) 99999-9999'
)
ON CONFLICT (id) DO NOTHING;
```

### Aluno

```sql
-- Obter UUID
SELECT id, email FROM auth.users WHERE email = 'aluno@teste.com';

-- Substituir UUID_AQUI e executar:
INSERT INTO public.profiles (id, email, full_name, username, role)
VALUES (
  'UUID_AQUI',
  'aluno@teste.com',
  'Aluno Teste',
  'aluno_teste',
  'aluno'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, username = EXCLUDED.username, role = EXCLUDED.role;

INSERT INTO public.alunos (id, pontos, moedas, sequencia_atual, serie, data_nascimento)
VALUES (
  'UUID_AQUI',
  100,
  50,
  0,
  '5º Ano',
  '2010-01-15'
)
ON CONFLICT (id) DO NOTHING;
```

---

## ✅ Verificar se Funcionou

Execute o seguinte SQL para verificar se os usuários foram criados:

```sql
SELECT 
  u.id,
  u.email,
  p.role,
  p.full_name,
  p.username
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email LIKE '%teste.com'
ORDER BY p.role;
```

Você deve ver os 4 usuários listados.

---

## 📋 Credenciais de Teste

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| `coordenador@teste.com` | `teste123` | coordenador | Coordenador Teste |
| `professor@teste.com` | `teste123` | professor | Professor Teste |
| `pais@teste.com` | `teste123` | pais | Pais Teste |
| `aluno@teste.com` | `teste123` | aluno | Aluno Teste |

---

## 🆘 Troubleshooting

### Erro: "User already exists"
- O usuário já foi criado no auth.users
- Execute apenas o SQL para criar os perfis e registros específicos

### Erro: "Foreign key violation"
- Certifique-se de que o usuário foi criado no auth.users primeiro
- Verifique se o UUID está correto

### Erro: "Unique constraint violation"
- O perfil ou registro específico já existe
- O script usa `ON CONFLICT DO NOTHING` para evitar esse erro

---

**Última atualização**: Dezembro 2024

