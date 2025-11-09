# Pós-Recriação do Banco - Próximos Passos

## ✅ Banco Recriado com Sucesso!

O script SQL foi executado com sucesso. Agora você precisa:

---

## 🔧 Passo 1: Verificar se o Schema Cache Foi Recarregado

O script já executou `NOTIFY pgrst, 'reload schema';`, mas você pode executar novamente para garantir:

```sql
NOTIFY pgrst, 'reload schema';
```

**Aguarde 30 segundos** antes de testar.

---

## 👥 Passo 2: Recriar Usuários de Teste

O banco foi recriado do zero, então você precisa recriar os usuários de teste.

### Opção A: Usar o Script de Criação de Usuários

Execute no SQL Editor do Supabase:

```sql
-- Criar usuário coordenador
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75',
  'coordenador@teste.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"role": "coordinator"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Inserir na tabela users
INSERT INTO public.users (id, email, password_hash, name, role)
VALUES (
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75',
  'coordenador@teste.com',
  crypt('teste123', gen_salt('bf')),
  'Coordenador Teste',
  'coordinator'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Inserir na tabela coordinators
INSERT INTO public.coordinators (id, user_id)
VALUES (
  uuid_generate_v4(),
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75'
)
ON CONFLICT DO NOTHING;
```

### Opção B: Usar o Script via API

Execute no terminal:

```bash
npm run criar-usuarios-api
```

---

## 🧪 Passo 3: Testar a Aplicação

1. **Faça login** com:
   - Email: `coordenador@teste.com`
   - Senha: `teste123`

2. **Acesse** `/coordenador/turmas/nova`

3. **Verifique**:
   - ✅ O select de professores está preenchido?
   - ✅ Não há erros 404 no console?
   - ✅ Os contadores no painel mostram valores corretos?

---

## 🔍 Passo 4: Verificar se o Problema Foi Resolvido

### Verificações:

1. **Console do Navegador** (F12):
   - ❌ Não deve haver erros 404 para `/rest/v1/users` ou `/rest/v1/teachers`
   - ✅ Queries devem retornar 200 OK

2. **Select de Professores**:
   - ✅ Deve estar preenchido (mesmo que vazio, não deve mostrar erro)

3. **Contadores no Painel**:
   - ✅ Devem mostrar valores corretos (ou 0 se não houver dados)

---

## 📝 Se Ainda Houver Problemas

Se o problema persistir após recriar o banco:

1. **Verifique os logs do PostgREST** no Supabase Dashboard
2. **Verifique as configurações do PostgREST** (Settings → API)
3. **Contate o suporte do Supabase** se necessário

---

## ✅ Resultado Esperado

Após recriar o banco e os usuários:
- ✅ Tabelas criadas corretamente
- ✅ Políticas RLS configuradas
- ✅ Schema cache recarregado
- ✅ Queries funcionando (200 OK)
- ✅ Select de professores preenchido
- ✅ Contadores mostrando valores corretos

---

## 🚀 Próximos Passos

1. Recriar usuários de teste
2. Testar login
3. Testar criação de professores
4. Testar criação de turmas
5. Testar criação de alunos

