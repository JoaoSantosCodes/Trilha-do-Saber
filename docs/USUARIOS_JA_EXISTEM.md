# ✅ Usuários Já Existem - Próximos Passos

**Data**: Dezembro 2024  
**Status**: ✅ **USUÁRIOS JÁ CRIADOS**

---

## 🎉 Boa Notícia

Os usuários de teste **já existem** no banco de dados!

O erro "A user with this email address has already been registered" significa que os usuários foram criados anteriormente (provavelmente via SQL).

---

## 🧪 Testar Login

Agora você pode testar fazer login com as credenciais:

| Email | Senha | Role |
|-------|-------|------|
| `coordenador@teste.com` | `teste123` | Coordenador |
| `professor@teste.com` | `teste123` | Professor |
| `pais@teste.com` | `teste123` | Pais |
| `aluno@teste.com` | `teste123` | Aluno |

---

## ⚠️ Se o Login Não Funcionar (401 Unauthorized)

Se você receber erro **401 Unauthorized** ao tentar fazer login, significa que:

1. **Os usuários foram criados via SQL** com hash de senha incompatível
2. **As senhas não funcionam** no sistema de autenticação do Supabase

### Solução: Deletar e Recriar os Usuários

#### Opção 1: Deletar via Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard
2. Vá em **Authentication** > **Users**
3. Para cada usuário (`coordenador@teste.com`, `professor@teste.com`, `pais@teste.com`, `aluno@teste.com`):
   - Clique nos três pontos (⋯) ao lado do usuário
   - Clique em **Delete User**
   - Confirme a exclusão
4. Depois, execute novamente:
   ```bash
   npm run criar-usuarios-api
   ```

#### Opção 2: Deletar via SQL

Execute no SQL Editor do Supabase:

```sql
-- Deletar os usuários existentes
DELETE FROM auth.users 
WHERE email IN ('coordenador@teste.com', 'professor@teste.com', 'pais@teste.com', 'aluno@teste.com');
```

Depois, execute:
```bash
npm run criar-usuarios-api
```

---

## ✅ Verificar se os Usuários Estão Corretos

Execute no SQL Editor do Supabase:

```sql
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as nome,
  created_at
FROM auth.users
WHERE email IN ('coordenador@teste.com', 'professor@teste.com', 'pais@teste.com', 'aluno@teste.com')
ORDER BY email;
```

**Verifique:**
- ✅ `email_confirmado` deve ser `true`
- ✅ `role` deve estar correto (coordinator, teacher, parent, student)
- ✅ `nome` deve estar preenchido

---

## 🚀 Próximos Passos

1. **Teste o login** com as credenciais acima
2. **Se funcionar**: ✅ Pronto! Os usuários estão corretos
3. **Se não funcionar**: Siga os passos acima para deletar e recriar

---

## 📝 Notas

- Os usuários criados via SQL podem ter senhas que não funcionam
- Os usuários criados via API Admin têm senhas que funcionam corretamente
- Se precisar recriar, use o script `npm run criar-usuarios-api` após deletar

