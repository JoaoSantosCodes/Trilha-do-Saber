# Resolução Final do Problema RLS

## 📋 Problema Identificado

### PostgREST Retornando 404 para Queries RLS

**Sintomas**:
- Queries retornam 404 mesmo com sessão válida
- Políticas RLS existem e parecem corretas
- Dados existem no banco (6 professores, 7 turmas)
- SQL direto funciona, mas API REST retorna 404

**Causa Raiz**:
- Usuário logado não está sincronizado entre `auth.users` e `public.users`
- Políticas RLS verificam `public.users` para determinar role
- Sem registro em `public.users`, RLS bloqueia acesso

---

## ✅ Solução Aplicada

### 1. Sincronizar Usuário Coordenador

**SQL Executado**:
```sql
INSERT INTO public.users (id, email, name, role)
VALUES (
  '45b485dc-a070-4e5f-99c5-7ea1492a9d75',
  'coordenador@teste.com',
  'Coordenador Teste',
  'coordinator'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;
```

**Descrição**:
- Insere usuário coordenador em `public.users`
- Usa `ON CONFLICT` para atualizar se já existir
- Garante que o usuário tenha `role = 'coordinator'`

### 2. Verificar Políticas RLS

**Políticas Confirmadas**:
- ✅ `users`: "Anyone authenticated can view users" - `qual: "true"`
- ✅ `classrooms`: "Coordinators can view all classrooms" - verifica `role = 'coordinator'`

### 3. Testar com Usuário Correto

**Ação**:
- Fazer login com `coordenador1@teste.com` (que está em `public.users`)
- Verificar se professores e turmas aparecem nos selects

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
2. ⏳ **Fazer login com usuário correto** (testando)
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
| Usuário sincronizado | ✅ | Inserido em public.users |
| Políticas RLS | ✅ | Existem e estão corretas |
| Dados no banco | ✅ | 6 professores e 7 turmas |
| Acesso via API | ⏳ | Testando após sincronização |

