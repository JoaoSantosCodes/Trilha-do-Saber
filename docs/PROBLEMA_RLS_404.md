# Problema RLS Retornando 404

## 📋 Problema Identificado

### RLS Bloqueando Acesso Mesmo com Políticas Existentes

**Sintomas**:
- Queries retornam 404 mesmo com sessão válida
- Políticas RLS existem e parecem corretas
- Tabelas `users` e `classrooms` existem e têm dados

**Políticas Existentes**:
- `users`: "Anyone authenticated can view users" com `qual: "true"` - deveria permitir acesso
- `classrooms`: "Coordinators can view all classrooms" com verificação de role = 'coordinator'

**Causa Possível**:
1. **Cache do PostgREST**: O schema cache pode estar desatualizado
2. **Conflito de Políticas**: Múltiplas políticas podem estar conflitando
3. **Verificação de Role**: A verificação de `role = 'coordinator'` pode estar falhando
4. **Tabela `users` não acessível**: O usuário coordenador pode não estar na tabela `users` com role correto

---

## 🔍 Verificações Realizadas

### 1. Políticas RLS Existentes

**Tabela `users`**:
- ✅ "Anyone authenticated can view users" - `qual: "true"` - deveria permitir acesso
- ⚠️ Mas ainda retorna 404

**Tabela `classrooms`**:
- ✅ "Coordinators can view all classrooms" - verifica `role = 'coordinator'`
- ⚠️ Mas ainda retorna 404

### 2. Verificação de Dados

- ✅ 6 professores em `users` com `role = 'teacher'`
- ✅ 7 turmas em `classrooms` com `is_active = true`
- ⚠️ Usuário coordenador pode não estar na tabela `users` com role correto

---

## 🔧 Soluções Tentadas

### 1. Criar Novas Políticas RLS
- ❌ Falhou: `CREATE POLICY IF NOT EXISTS` não é suportado (syntax error)

### 2. Verificar Políticas Existentes
- ✅ Políticas existem e parecem corretas
- ⚠️ Mas ainda retornam 404

### 3. Forçar Refresh do Schema Cache
- ✅ Enviado `NOTIFY pgrst, 'reload schema'`
- ⏳ Aguardando efeito

---

## 🚀 Próximos Passos

1. ⏳ **Verificar usuário coordenador**:
   - Verificar se está na tabela `users`
   - Verificar se `role = 'coordinator'` está correto

2. ⏳ **Testar políticas diretamente**:
   - Testar se podemos ler `users` com role = 'teacher'
   - Testar se podemos ler `classrooms`

3. ⏳ **Verificar cache do PostgREST**:
   - Aguardar refresh do schema cache
   - Testar novamente após refresh

4. ⏳ **Verificar conflitos de políticas**:
   - Verificar se há políticas conflitantes
   - Verificar ordem de aplicação das políticas

---

## 📝 Observações

- **RLS**: Políticas existem, mas não estão funcionando
- **Cache**: PostgREST pode precisar de refresh
- **Dados**: Existem no banco, mas não são acessíveis via API REST
- **Sessão**: Válida, mas RLS ainda bloqueia

---

## ✅ Resumo

| Item | Status | Observação |
|------|--------|------------|
| Políticas RLS | ✅ | Existem e parecem corretas |
| Dados no banco | ✅ | 6 professores e 7 turmas |
| Acesso via API | ❌ | Retorna 404 |
| Cache PostgREST | ⏳ | Refresh enviado |
| Usuário coordenador | ⏳ | Verificando |

