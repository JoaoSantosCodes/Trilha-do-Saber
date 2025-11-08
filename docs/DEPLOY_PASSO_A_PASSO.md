# 🚀 Deploy Passo a Passo - Trilha do Saber

**Data**: Dezembro 2024  
**Status**: ✅ **Guia de Deploy Completo**

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. ✅ Conta no GitHub/GitLab/Bitbucket
2. ✅ Conta na Vercel ou Netlify
3. ✅ Projeto Supabase configurado
4. ✅ Variáveis de ambiente do Supabase

---

## 🚀 Opção 1: Deploy na Vercel (Recomendado)

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **New repository**
3. Preencha:
   - **Repository name**: `trilha-do-saber`
   - **Description**: `App de Reforço Escolar - Trilha do Saber`
   - **Visibility**: Público ou Privado
4. Clique em **Create repository**

### Passo 2: Conectar Repositório Local

No terminal, execute:

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/SEU-USUARIO/trilha-do-saber.git

# Renomear branch para main
git branch -M main

# Fazer push do código
git push -u origin main
```

### Passo 3: Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Selecione o repositório `trilha-do-saber`
5. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
6. Clique em **Environment Variables** e adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
   NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app
   ```
7. Clique em **Deploy**

### Passo 4: Configurar Supabase

1. No painel do Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione a URL de produção em **Site URL**:
   ```
   https://seu-projeto.vercel.app
   ```
3. Adicione a URL de produção em **Redirect URLs**:
   ```
   https://seu-projeto.vercel.app/**
   ```

### Passo 5: Verificar Deploy

1. Aguarde o build completar (2-5 minutos)
2. Acesse a URL fornecida pela Vercel
3. Teste a aplicação:
   - Login
   - Cadastro
   - Navegação
   - Funcionalidades principais

---

## 🚀 Opção 2: Deploy na Netlify

### Passo 1: Criar Repositório no GitHub

Siga os mesmos passos da Opção 1.

### Passo 2: Conectar Repositório Local

Siga os mesmos passos da Opção 1.

### Passo 3: Deploy na Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Faça login com sua conta GitHub
3. Clique em **Add new site** → **Import an existing project**
4. Selecione o repositório `trilha-do-saber`
5. Configure o build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `/` (raiz)
6. Clique em **Show advanced** e adicione as variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
   NEXT_PUBLIC_SITE_URL=https://seu-projeto.netlify.app
   ```
7. Clique em **Deploy site**

### Passo 4: Configurar Supabase

1. No painel do Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione a URL de produção em **Site URL**:
   ```
   https://seu-projeto.netlify.app
   ```
3. Adicione a URL de produção em **Redirect URLs**:
   ```
   https://seu-projeto.netlify.app/**
   ```

### Passo 5: Verificar Deploy

1. Aguarde o build completar (2-5 minutos)
2. Acesse a URL fornecida pela Netlify
3. Teste a aplicação

---

## 🔧 Comandos Úteis

### Preparar para Deploy

```bash
# Bash (Linux/Mac)
bash scripts/deploy.sh

# PowerShell (Windows)
.\scripts\deploy.ps1
```

### Verificar Build Local

```bash
npm run build
```

### Testar Localmente

```bash
npm run start
```

### Fazer Push para Repositório

```bash
git add .
git commit -m "feat: preparar para deploy"
git push origin main
```

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [x] Código validado e sem erros
- [x] Build local funcionando
- [x] Git inicializado
- [x] Commit criado
- [ ] Repositório remoto criado
- [ ] Código enviado para repositório

### Durante o Deploy
- [ ] Repositório conectado na Vercel/Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] Build settings configurados
- [ ] Deploy iniciado

### Após o Deploy
- [ ] Build completado com sucesso
- [ ] URL de produção obtida
- [ ] Supabase configurado
- [ ] Aplicação testada em produção
- [ ] Funcionalidades principais testadas

---

## 🐛 Troubleshooting

### Erro: Build Failed

**Solução**:
1. Verifique os logs de build
2. Execute `npm run build` localmente
3. Verifique se todas as dependências estão instaladas
4. Verifique se as variáveis de ambiente estão configuradas

### Erro: Variáveis de Ambiente Não Encontradas

**Solução**:
1. Verifique se todas as variáveis estão configuradas na plataforma de deploy
2. Verifique se os nomes estão corretos (case-sensitive)
3. Verifique se os valores estão corretos

### Erro: Conexão com Supabase Falhou

**Solução**:
1. Verifique se a URL e a chave estão corretas
2. Verifique se o projeto Supabase está ativo
3. Verifique se as políticas RLS estão configuradas

### Erro: Página Não Encontrada (404)

**Solução**:
1. Verifique se o build foi bem-sucedido
2. Verifique se as rotas estão configuradas corretamente
3. Verifique se o middleware está funcionando

---

## 📚 Recursos

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação da Netlify](https://docs.netlify.com)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)

---

## ✅ Conclusão

Siga os passos acima para fazer o deploy do projeto. O processo é simples e direto:

1. Criar repositório no GitHub
2. Fazer push do código
3. Conectar na Vercel/Netlify
4. Configurar variáveis de ambiente
5. Fazer deploy
6. Configurar Supabase
7. Testar aplicação

**🎉 Boa sorte com o deploy!**

---

**Última atualização**: Dezembro 2024

