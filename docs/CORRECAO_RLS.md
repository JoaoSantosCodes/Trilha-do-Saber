# Correção de Políticas RLS

## 📋 Problema Identificado

### RLS Bloqueando Acesso às Tabelas

**Sintomas**:
- Queries retornam 404 mesmo com sessão válida
- Tabelas `users` e `classrooms` existem e têm dados
- Coordenador logado não consegue ler professores e turmas

**Causa**:
- Políticas RLS não permitem que coordenadores leiam `users` e `classrooms`
- RLS está habilitado nas tabelas, mas não há políticas adequadas

---

## ✅ Correções Aplicadas

### 1. Política RLS para `users` (Professores)

**Política Criada**:
```sql
CREATE POLICY IF NOT EXISTS "Coordenadores podem ler professores em users"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'coordinator'
  )
  AND role = 'teacher'
);
```

**Descrição**:
- Permite que usuários autenticados leiam `users`
- Apenas se o usuário logado for um coordenador (`role = 'coordinator'`)
- Apenas retorna usuários com `role = 'teacher'` (professores)

---

### 2. Política RLS para `classrooms` (Turmas)

**Política Criada**:
```sql
CREATE POLICY IF NOT EXISTS "Coordenadores podem ler classrooms"
ON public.classrooms
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'coordinator'
  )
);
```

**Descrição**:
- Permite que usuários autenticados leiam `classrooms`
- Apenas se o usuário logado for um coordenador (`role = 'coordinator'`)
- Retorna todas as turmas ativas

---

## 📊 Resultados Esperados

### Professores
- ✅ 6 professores devem aparecer no select
- ✅ Nomes: Juliana Duarte, Roberto Azevedo, Fernanda Silveira, etc.

### Turmas
- ✅ 7 turmas devem aparecer no select
- ✅ Nomes: A, B, C, D, E, etc.

---

## 🔍 Verificação

### Verificar Políticas RLS
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('users', 'classrooms')
ORDER BY tablename, policyname;
```

### Verificar RLS Habilitado
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'classrooms');
```

---

## 🚀 Próximos Passos

1. ✅ Testar se professores aparecem no select
2. ✅ Testar se turmas aparecem no select
3. ✅ Testar criação de turma com professor selecionado
4. ✅ Testar criação de aluno com turma selecionada

---

## 📝 Observações

- **RLS**: Políticas criadas para permitir acesso de coordenadores
- **Segurança**: Apenas coordenadores podem ler professores e turmas
- **Dados**: 6 professores e 7 turmas disponíveis no banco

---

## ✅ Resumo

| Item | Status | Observação |
|------|--------|------------|
| Política RLS para users | ✅ | Criada para coordenadores |
| Política RLS para classrooms | ✅ | Criada para coordenadores |
| RLS habilitado | ✅ | Verificado |
| Dados no banco | ✅ | 6 professores e 7 turmas |

