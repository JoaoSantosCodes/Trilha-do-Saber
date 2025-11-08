# 🚀 Guia Completo de Deploy - Trilha do Saber

**Data**: Dezembro 2024  
**Status**: ✅ **Projeto pronto para deploy**

---

## 📋 Pré-requisitos

### ✅ Concluído
- ✅ Código completo e validado
- ✅ Banco de dados configurado e validado
- ✅ Variáveis de ambiente configuradas
- ✅ ESLint configurado
- ✅ Erros críticos corrigidos
- ✅ Warnings críticos corrigidos
- ✅ RLS implementado
- ✅ Build compilando com sucesso
- ✅ Git inicializado

---

## 🚀 Deploy na Vercel (Recomendado)

### 1. Preparação

1. **Criar conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub/GitLab/Bitbucket

2. **Conectar repositório**
   - Clique em "New Project"
   - Conecte seu repositório do GitHub

### 2. Configuração

1. **Configurar variáveis de ambiente**
   - No painel da Vercel, vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
     SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
     NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app
     ```

2. **Configurar Build Settings**
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install` (padrão)

3. **Configurar Domínio (Opcional)**
   - Vá em **Settings** → **Domains**
   - Adicione seu domínio personalizado

### 3. Deploy

1. **Fazer deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Acesse a URL fornecida pela Vercel

2. **Verificar deploy**
   - Teste a aplicação na URL de produção
   - Verifique se todas as funcionalidades estão funcionando

### 4. Configuração Pós-Deploy

1. **Configurar URL de Redirecionamento no Supabase**
   - No painel do Supabase, vá em **Authentication** → **URL Configuration**
   - Adicione a URL de produção em **Site URL**
   - Adicione a URL de produção em **Redirect URLs**

2. **Atualizar Variáveis de Ambiente**
   - Atualize `NEXT_PUBLIC_SITE_URL` com a URL de produção
   - Isso é necessário para recuperação de senha e outros redirecionamentos

---

## 🚀 Deploy na Netlify

### 1. Preparação

1. **Criar conta na Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Faça login com GitHub/GitLab/Bitbucket

2. **Conectar repositório**
   - Clique em "New site from Git"
   - Conecte seu repositório

### 2. Configuração

1. **Configurar Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `/` (raiz)

2. **Configurar variáveis de ambiente**
   - No painel da Netlify, vá em **Site settings** → **Environment variables**
   - Adicione as mesmas variáveis da Vercel

### 3. Deploy

1. **Fazer deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar

2. **Configurar URL no Supabase**
   - Siga os mesmos passos da Vercel

---

## 🔧 Deploy Manual

### 1. Preparação Local

```bash
# Instalar dependências
npm install

# Executar build
npm run build

# Testar build localmente
npm run start
```

### 2. Deploy em Servidor

1. **Transferir arquivos**
   - Copie a pasta `.next` e `node_modules`
   - Copie `package.json` e `package-lock.json`
   - Copie arquivos estáticos (se houver)

2. **Configurar variáveis de ambiente**
   - Crie arquivo `.env.production`
   - Configure as variáveis necessárias

3. **Instalar e executar**
   ```bash
   npm install --production
   npm run start
   ```

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [x] Código validado e sem erros
- [x] Banco de dados configurado
- [x] Variáveis de ambiente configuradas
- [x] ESLint configurado
- [x] Build local funcionando (`npm run build`)
- [x] Git inicializado
- [x] Repositório criado (GitHub/GitLab/Bitbucket)

### Durante o Deploy
- [ ] Conectar repositório
- [ ] Configurar variáveis de ambiente
- [ ] Configurar build settings
- [ ] Fazer deploy

### Após o Deploy
- [ ] Testar aplicação em produção
- [ ] Configurar URL no Supabase
- [ ] Testar autenticação
- [ ] Testar funcionalidades principais
- [ ] Verificar logs de erro
- [ ] Configurar domínio personalizado (opcional)

---

## 🧪 Testes Pós-Deploy

### Funcionalidades para Testar
1. ✅ Autenticação (login, cadastro, recuperação de senha)
2. ✅ Navegação entre páginas
3. ✅ Criação de turmas/professores/alunos (coordenador)
4. ✅ Sistema de amizades
5. ✅ Sistema de lições e progresso
6. ✅ Sistema de compras na loja
7. ✅ Chat em tempo real
8. ✅ Comunicados

---

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de variáveis de ambiente**
   - Verifique se todas as variáveis estão configuradas
   - Verifique se os nomes estão corretos (case-sensitive)
   - Verifique se os valores estão corretos

2. **Erro de conexão com Supabase**
   - Verifique se a URL e a chave estão corretas
   - Verifique se o projeto Supabase está ativo
   - Verifique se as políticas RLS estão configuradas

3. **Erro de build**
   - Verifique os logs de build
   - Execute `npm run build` localmente para verificar erros
   - Verifique se todas as dependências estão instaladas

4. **Erro de RLS**
   - Verifique se as políticas RLS estão configuradas corretamente
   - Verifique se o usuário está autenticado
   - Verifique os logs do Supabase

5. **Erro de pré-renderização**
   - Verifique se `useSearchParams()` está dentro de `Suspense`
   - Verifique se há componentes client-side em páginas server-side

---

## 📚 Recursos

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação da Netlify](https://docs.netlify.com)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)

---

## ✅ Conclusão

O projeto está **100% pronto para deploy**. Siga os passos acima para fazer o deploy na Vercel ou Netlify.

**🎉 Boa sorte com o deploy!**

---

**Última atualização**: Dezembro 2024

