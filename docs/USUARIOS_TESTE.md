# 👥 Usuários de Teste - Trilha do Saber

**Data**: Dezembro 2024  
**Status**: ✅ **Scripts Criados**

---

## 📋 Usuários de Teste

### Credenciais Padrão

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| `coordenador@teste.com` | `teste123` | coordenador | Coordenador Teste |
| `professor@teste.com` | `teste123` | professor | Professor Teste |
| `pais@teste.com` | `teste123` | pais | Pais Teste |
| `aluno@teste.com` | `teste123` | aluno | Aluno Teste |

---

## 🚀 Como Criar os Usuários

### Opção 1: Script Node.js (Recomendado)

Execute o script que cria todos os usuários automaticamente:

```bash
npm run criar-usuarios-teste
```

**Requisitos**:
- Variáveis de ambiente configuradas (`.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**O que o script faz**:
1. Cria usuários no Supabase Auth
2. Cria perfis na tabela `profiles`
3. Cria registros específicos (aluno, professor, pais, coordenador)
4. Atualiza usuários existentes se necessário

### Opção 2: Via Supabase Dashboard

1. Acesse o Supabase Dashboard
2. Vá em **Authentication > Users**
3. Clique em **Add User**
4. Preencha os dados de cada usuário:
   - **Email**: `coordenador@teste.com` (ou outro)
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ (marcar)
   - **User Metadata**: 
     ```json
     {
       "full_name": "Coordenador Teste",
       "role": "coordenador",
       "username": "coordenador_teste"
     }
     ```

5. Depois de criar o usuário, execute o SQL em `supabase/criar_usuarios_teste.sql` para criar os perfis e registros específicos.

### Opção 3: Via API Admin (Programaticamente)

Use a API Admin do Supabase para criar os usuários:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Criar coordenador
await supabaseAdmin.auth.admin.createUser({
  email: 'coordenador@teste.com',
  password: 'teste123',
  email_confirm: true,
  user_metadata: {
    full_name: 'Coordenador Teste',
    role: 'coordenador',
    username: 'coordenador_teste',
  },
})
```

---

## 📝 Estrutura dos Usuários

### Coordenador
- **Email**: `coordenador@teste.com`
- **Senha**: `teste123`
- **Role**: `coordenador`
- **Tabela**: `coordenadores`

### Professor
- **Email**: `professor@teste.com`
- **Senha**: `teste123`
- **Role**: `professor`
- **Tabela**: `professores`
- **Matrícula**: `PROF-001`
- **Status**: `ativo`

### Pais
- **Email**: `pais@teste.com`
- **Senha**: `teste123`
- **Role**: `pais`
- **Tabela**: `pais`
- **Telefone**: `(11) 99999-9999`

### Aluno
- **Email**: `aluno@teste.com`
- **Senha**: `teste123`
- **Role**: `aluno`
- **Tabela**: `alunos`
- **Série**: `5º Ano`
- **Data de Nascimento**: `2010-01-15`
- **Pontos**: `100`
- **Moedas**: `50`

---

## ✅ Verificação

Após criar os usuários, verifique se foram criados corretamente:

```sql
-- Verificar usuários criados
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

---

## 🔧 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env.local` existe
- Certifique-se de que contém `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`

### Erro: "Usuário já existe"
- O script atualiza usuários existentes automaticamente
- Se quiser recriar, delete o usuário no Supabase Dashboard primeiro

### Erro: "Permission denied"
- Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está correta
- Certifique-se de que tem permissões de admin no Supabase

### Erro: "Relation does not exist"
- Execute o schema SQL primeiro (`supabase/schema.sql`)
- Verifique se todas as tabelas foram criadas

---

## 📚 Arquivos Relacionados

- `scripts/criar_usuarios_teste.js` - Script Node.js para criar usuários
- `supabase/criar_usuarios_teste.sql` - SQL para criar perfis manualmente
- `supabase/schema.sql` - Schema completo do banco de dados

---

**Última atualização**: Dezembro 2024  
**Status**: ✅ **Scripts Prontos para Uso**

