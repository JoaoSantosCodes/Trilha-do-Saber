# Solução: Usuário Faltando na Tabela users

## 📋 Problema Identificado

### Usuário Logado Não Está na Tabela `users`

**Descoberta**:
- ❌ Usuário logado (`45b485dc-a070-4e5f-99c5-7ea1492a9d75`) não está na tabela `users`
- ✅ Usuário está em `auth.users` (autenticação funciona)
- ❌ Políticas RLS não conseguem verificar se é coordenador
- ❌ API REST retorna 404 porque RLS bloqueia

**Causa**:
- Usuário foi criado em `auth.users` mas não foi sincronizado para `public.users`
- Políticas RLS verificam `public.users` para determinar role
- Sem registro em `public.users`, RLS bloqueia acesso

---

## ✅ Solução Aplicada

### 1. Sincronizar Usuário de `auth.users` para `public.users`

**SQL Executado**:
```sql
INSERT INTO public.users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  COALESCE(au.raw_user_meta_data->>'role', 'coordinator')
FROM auth.users au
WHERE au.id = '45b485dc-a070-4e5f-99c5-7ea1492a9d75'
AND NOT EXISTS (
  SELECT 1 FROM public.users u WHERE u.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, users.name),
  role = COALESCE(EXCLUDED.role, users.role);
```

**Descrição**:
- Busca usuário em `auth.users`
- Insere em `public.users` se não existir
- Atualiza se já existir (usando `ON CONFLICT`)
- Usa `raw_user_meta_data` para obter `name` e `role`

---

## 📊 Resultados Esperados

### Após Sincronização

1. ✅ **Usuário na tabela `users`**:
   - ID: `45b485dc-a070-4e5f-99c5-7ea1492a9d75`
   - Email: `coordenador@teste.com`
   - Role: `coordinator`

2. ✅ **Políticas RLS funcionando**:
   - RLS consegue verificar `role = 'coordinator'`
   - Acesso permitido para `users` e `classrooms`

3. ✅ **Selects preenchidos**:
   - 6 professores aparecem no select
   - 7 turmas aparecem no select

---

## 🔍 Verificação

### Verificar se Usuário Foi Inserido
```sql
SELECT id, email, name, role 
FROM users 
WHERE id = '45b485dc-a070-4e5f-99c5-7ea1492a9d75';
```

### Verificar se Políticas RLS Funcionam
- Testar se professores aparecem no select
- Testar se turmas aparecem no select

---

## 🚀 Próximos Passos

1. ✅ **Sincronizar usuário** (feito)
2. ⏳ **Testar selects** (aguardando)
3. ⏳ **Verificar se professores aparecem**
4. ⏳ **Verificar se turmas aparecem**

---

## 📝 Observações

- **Sincronização**: Usuário precisa estar em `public.users` para RLS funcionar
- **Trigger**: Idealmente, um trigger deveria sincronizar automaticamente
- **Solução Temporária**: Inserção manual resolve o problema imediato
- **Solução Permanente**: Criar trigger para sincronizar automaticamente

---

## ✅ Resumo

| Item | Status | Observação |
|------|--------|------------|
| Usuário em auth.users | ✅ | Existe |
| Usuário em public.users | ⏳ | Sincronizando |
| Políticas RLS | ✅ | Devem funcionar após sincronização |
| Selects | ⏳ | Aguardando teste |

