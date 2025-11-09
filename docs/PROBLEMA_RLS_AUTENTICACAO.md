# Problema: RLS e Autenticação

## 📋 Análise do Problema

### Erro Principal: PGRST205 - Tabela não encontrada no schema cache

**Status**: ⚠️ **PROBLEMA CRÍTICO**

**Sintomas**:
- Erro 404 ao tentar acessar `teachers` e `classrooms`
- PostgREST retorna `PGRST205` mesmo com políticas RLS existentes
- Fallback para `professores` e `turmas` também retorna 404 (tabelas não existem)

**Causa Provável**:
- **RLS está bloqueando acesso** mesmo com políticas corretas
- Token JWT pode não estar sendo enviado corretamente
- Role do usuário pode não estar correto na tabela `users`

---

## 🔍 Descobertas

### 1. Políticas RLS Existem
- ✅ `"Coordinators can view all teachers"` na tabela `teachers`
- ✅ `"Coordinators can view all classrooms"` na tabela `classrooms`
- ✅ RLS está habilitado nas tabelas

### 2. Tabelas Existem e Têm Dados
- ✅ Tabela `teachers` existe e tem 5 professores
- ✅ Tabela `classrooms` existe e tem 3 turmas
- ✅ Dados acessíveis via SQL direto

### 3. Usuário Coordenador Existe
- ✅ Usuário `coordenador@teste.com` existe
- ⚠️ **Precisa verificar se tem role `coordinator` na tabela `users`**

### 4. Fallback Não Funciona
- ❌ Tabela `professores` não existe (fallback não funciona)
- ❌ Tabela `turmas` não existe (fallback não funciona)

---

## 🔧 Soluções Possíveis

### Solução 1: Verificar Role do Usuário
```sql
-- Verificar se o usuário tem role correto
SELECT id, email, name, role
FROM users
WHERE email = 'coordenador@teste.com';
```

**Se o role não estiver correto**:
```sql
-- Atualizar role do usuário
UPDATE users
SET role = 'coordinator'
WHERE email = 'coordenador@teste.com';
```

### Solução 2: Verificar Token JWT
- Verificar se o token JWT está sendo enviado corretamente nas requisições
- Verificar se o token não expirou
- Verificar se o token contém o role correto

### Solução 3: Testar Política RLS Diretamente
```sql
-- Testar se a política funciona com o usuário logado
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "id-do-coordenador", "role": "coordinator"}';
SELECT * FROM teachers LIMIT 1;
```

### Solução 4: Criar Tabelas de Fallback
Se as tabelas `professores` e `turmas` não existem, podemos criá-las como fallback:
```sql
-- Criar tabela professores (se não existir)
CREATE TABLE IF NOT EXISTS professores (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  matricula TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela turmas (se não existir)
CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  professor_id UUID REFERENCES auth.users(id),
  serie TEXT,
  periodo TEXT,
  ano_letivo TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 Resumo

| Problema | Status | Causa Provável | Solução |
|----------|--------|----------------|---------|
| PGRST205 | ⚠️ | RLS bloqueando | Verificar autenticação/role |
| Professores não carregam | ⚠️ | RLS bloqueando | Verificar autenticação/role |
| Turmas não carregam | ⚠️ | RLS bloqueando | Verificar autenticação/role |
| Botão desabilitado | ⚠️ | Estado não atualiza | Verificar estado do formulário |

---

## 🔧 Próximos Passos

1. ⏳ Verificar se o usuário coordenador tem role `coordinator` na tabela `users`
2. ⏳ Verificar se o token JWT está sendo enviado corretamente
3. ⏳ Testar a política RLS diretamente no SQL
4. ⏳ Criar tabelas de fallback se necessário
5. ⏳ Verificar estado do formulário de criar professor

