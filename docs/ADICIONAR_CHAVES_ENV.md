# 🔑 Como Adicionar as Chaves do Supabase ao .env.local

**Data**: Dezembro 2024

---

## 📋 Chaves Fornecidas

Você forneceu as seguintes chaves do Supabase:

1. **Publishable Key** (chave pública):
   ```
   sb_publishable_8f3gsy0sf-d0OLrHrgjIEw_w55pm_tZ
   ```

2. **Secret Key** (chave secreta - Service Role):
   ```
   sb_secret_9NdnNoGq7OyX3rb0OZCz_w_jcv4Qml1
   ```

---

## 📝 Como Adicionar ao .env.local

### Passo 1: Abrir o arquivo .env.local

Abra o arquivo `.env.local` na raiz do projeto.

### Passo 2: Adicionar/Atualizar as Variáveis

Adicione ou atualize as seguintes linhas no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://iqzqvgmnimpfyzuwbuqx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8f3gsy0sf-d0OLrHrgjIEw_w55pm_tZ
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9NdnNoGq7OyX3rb0OZCz_w_jcv4Qml1
```

**Importante**:
- Substitua a URL do Supabase pela URL correta do seu projeto (se diferente)
- Não adicione espaços antes ou depois do `=`
- Não adicione aspas nas chaves
- Certifique-se de que não há quebras de linha no meio das chaves

### Passo 3: Salvar o Arquivo

Salve o arquivo `.env.local`.

---

## ✅ Verificar se Está Configurado

Execute o script de criação de usuários de teste:

```bash
npm run criar-usuarios-teste
```

Se estiver tudo configurado corretamente, você verá:

```
🚀 Iniciando criação de usuários de teste...
✅ Usuário coordenador@teste.com criado com sucesso!
✅ Usuário professor@teste.com criado com sucesso!
✅ Usuário pais@teste.com criado com sucesso!
✅ Usuário aluno@teste.com criado com sucesso!
```

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- O arquivo `.env.local` já está no `.gitignore` e **NÃO** será commitado no Git
- **NUNCA** compartilhe essas chaves publicamente
- **NUNCA** use a `SUPABASE_SERVICE_ROLE_KEY` no frontend
- A `SUPABASE_SERVICE_ROLE_KEY` tem permissões administrativas completas

---

## 🆘 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não configurado"

**Solução**: 
1. Verifique se adicionou a chave no `.env.local`
2. Certifique-se de que não há espaços antes ou depois do `=`
3. Verifique se copiou a chave completa
4. Reinicie o terminal após salvar o arquivo

### Erro: "Invalid API key"

**Solução**:
1. Verifique se copiou a chave correta (secret key, não publishable key)
2. Certifique-se de que não há espaços ou quebras de linha na chave
3. Tente copiar a chave novamente do Supabase Dashboard

---

**Última atualização**: Dezembro 2024

