# 📋 Passo a Passo: Criar Usuários de Teste Manualmente

**Data**: Dezembro 2024  
**Status**: ✅ **GUIA COMPLETO**

---

## 🎯 Objetivo

Criar 4 usuários de teste no Supabase Dashboard para poder fazer login no app:
- Coordenador
- Professor
- Pais
- Aluno

---

## 📝 Passo a Passo Completo

### 1️⃣ Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **Trilha do Saber** (ou o nome do seu projeto)

---

### 2️⃣ Navegar para Authentication

1. No menu lateral esquerdo, clique em **Authentication**
2. Clique na aba **Users** (ou **Usuários**)

---

### 3️⃣ Criar o Usuário Coordenador

1. Clique no botão **Add User** (ou **Adicionar Usuário**)
2. Preencha os campos:
   - **Email**: `coordenador@teste.com`
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO** (importante!)
3. Na seção **User Metadata** (ou **Metadados do Usuário**), adicione:
   ```json
   {
     "full_name": "Coordenador Teste",
     "role": "coordinator",
     "username": "coordenador_teste"
   }
   ```
4. Clique em **Create User** (ou **Criar Usuário**)

---

### 4️⃣ Criar o Usuário Professor

1. Clique novamente em **Add User**
2. Preencha os campos:
   - **Email**: `professor@teste.com`
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
3. Na seção **User Metadata**, adicione:
   ```json
   {
     "full_name": "Professor Teste",
     "role": "teacher",
     "username": "professor_teste"
   }
   ```
4. Clique em **Create User**

---

### 5️⃣ Criar o Usuário Pais

1. Clique novamente em **Add User**
2. Preencha os campos:
   - **Email**: `pais@teste.com`
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
3. Na seção **User Metadata**, adicione:
   ```json
   {
     "full_name": "Pais Teste",
     "role": "parent",
     "username": "pais_teste"
   }
   ```
4. Clique em **Create User**

---

### 6️⃣ Criar o Usuário Aluno

1. Clique novamente em **Add User**
2. Preencha os campos:
   - **Email**: `aluno@teste.com`
   - **Password**: `teste123`
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
3. Na seção **User Metadata**, adicione:
   ```json
   {
     "full_name": "Aluno Teste",
     "role": "student",
     "username": "aluno_teste"
   }
   ```
4. Clique em **Create User**

---

## ✅ Verificar se os Usuários Foram Criados

1. Na página **Authentication > Users**, você deve ver os 4 usuários listados
2. Verifique se cada usuário tem:
   - ✅ Email confirmado (ícone de check verde)
   - ✅ Status ativo
   - ✅ Metadata correta

---

## 🧪 Testar o Login

1. Execute o app: `npm run dev`
2. Acesse: `http://localhost:3000/login`
3. Teste fazer login com cada credencial:

| Email | Senha | Role |
|-------|-------|------|
| `coordenador@teste.com` | `teste123` | Coordenador |
| `professor@teste.com` | `teste123` | Professor |
| `pais@teste.com` | `teste123` | Pais |
| `aluno@teste.com` | `teste123` | Aluno |

---

## ⚠️ Problemas Comuns

### Erro: "User already exists"
- **Solução**: O usuário já existe. Você pode deletá-lo e criar novamente, ou apenas usar o existente

### Erro: "Invalid email format"
- **Solução**: Verifique se o email está no formato correto: `usuario@teste.com`

### Erro: "Password too weak"
- **Solução**: Use uma senha mais forte (mínimo 6 caracteres). Para teste, `teste123` deve funcionar

### Login não funciona (401 Unauthorized)
- **Solução**: Verifique se marcou **Auto Confirm User** ao criar o usuário. Se não marcou, o email não está confirmado e o login falha

---

## 📸 Imagens de Referência (Opcional)

Se você tiver acesso ao Dashboard, as telas devem ser similares a:

1. **Authentication > Users**: Lista de usuários
2. **Add User**: Formulário para criar novo usuário
3. **User Metadata**: Campo JSON para metadados

---

## 🔄 Próximos Passos (Opcional)

Após criar os usuários, você pode:

1. **Criar registros específicos** nas tabelas `coordinators`, `teachers`, `parents`, `students` (se necessário)
2. **Testar funcionalidades** de cada role
3. **Verificar permissões** e acessos

---

## 📝 Notas Importantes

- ✅ **Sempre marque "Auto Confirm User"** ao criar usuários de teste
- ✅ Os usuários criados via Dashboard funcionam imediatamente no login
- ✅ Não é necessário criar registros em `public.users` manualmente (o trigger faz isso automaticamente)
- ✅ Os metadados (`role`, `full_name`, `username`) são importantes para o app funcionar corretamente

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:
1. Verifique se o email está no formato correto
2. Verifique se marcou "Auto Confirm User"
3. Verifique se a senha tem pelo menos 6 caracteres
4. Tente deletar o usuário e criar novamente

