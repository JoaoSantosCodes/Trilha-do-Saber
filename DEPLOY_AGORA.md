# 🚀 Deploy Agora - Trilha do Saber

**Status**: ✅ **PROJETO PRONTO PARA DEPLOY**

---

## ⚡ Deploy Rápido

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name**: `trilha-do-saber`
   - **Description**: `App de Reforço Escolar - Trilha do Saber`
   - **Visibility**: Público ou Privado
3. Clique em **Create repository**

### Passo 2: Conectar e Fazer Push

Execute os seguintes comandos no terminal:

```bash
# Adicionar repositório remoto (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/trilha-do-saber.git

# Renomear branch para main
git branch -M main

# Fazer push do código
git push -u origin main
```

### Passo 3: Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Faça login com GitHub
3. Clique em **Import Project**
4. Selecione o repositório `trilha-do-saber`
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anon do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = sua service role key do Supabase
   - `NEXT_PUBLIC_SITE_URL` = será preenchido automaticamente após o deploy
6. Clique em **Deploy**

### Passo 4: Configurar Supabase

Após o deploy, você receberá uma URL (ex: `https://trilha-do-saber.vercel.app`)

1. No painel do Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione a URL de produção em **Site URL**
3. Adicione a URL de produção em **Redirect URLs** (com `/**` no final)

---

## 📋 Checklist Rápido

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o repositório
- [ ] Projeto conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Supabase configurado
- [ ] Aplicação testada

---

## 🔧 Comandos Úteis

### Verificar se está tudo pronto

```bash
# Verificar build
npm run build

# Verificar lint
npm run lint

# Verificar status do Git
git status
```

### Fazer push para o repositório

```bash
git add .
git commit -m "feat: preparar para deploy"
git push origin main
```

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- **[Deploy Passo a Passo](./docs/DEPLOY_PASSO_A_PASSO.md)** - Guia completo
- **[Guia de Deploy Completo](./docs/GUIA_DEPLOY_COMPLETO.md)** - Guia detalhado
- **[Preparação para Deploy](./docs/PREPARACAO_DEPLOY_COMPLETA.md)** - Preparação

---

## ✅ Status Atual

- ✅ **Build**: Compilando com sucesso
- ✅ **TypeScript**: Sem erros
- ✅ **ESLint**: Sem erros críticos
- ✅ **Git**: Inicializado e commit criado
- ✅ **Arquivos**: Preparados para deploy
- ⏳ **Repositório remoto**: Precisa ser criado
- ⏳ **Deploy**: Aguardando repositório remoto

---

## 🎯 Próximo Passo

**Crie o repositório no GitHub e execute os comandos acima!**

Depois disso, o deploy será automático na Vercel.

---

**Última atualização**: Dezembro 2024

