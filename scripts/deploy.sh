#!/bin/bash

# Script de deploy - Trilha do Saber
# Execute: bash scripts/deploy.sh

echo "🚀 Iniciando processo de deploy..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se há repositório remoto
if ! git remote | grep -q origin; then
    echo "⚠️  Aviso: Repositório remoto não configurado"
    echo ""
    echo "📋 Passos para configurar:"
    echo "   1. Crie um repositório no GitHub/GitLab/Bitbucket"
    echo "   2. Execute os seguintes comandos:"
    echo "      git remote add origin <url-do-repositorio>"
    echo "      git branch -M main"
    echo "      git push -u origin main"
    echo ""
    read -p "Deseja continuar mesmo assim? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Aviso: Arquivo .env.local não encontrado"
    echo "   Certifique-se de configurar as variáveis de ambiente na plataforma de deploy"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar lint
echo "🔍 Executando ESLint..."
npm run lint

# Executar build
echo "🏗️  Executando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Faça push do código para o repositório remoto:"
    echo "      git push origin main"
    echo ""
    echo "   2. Para deploy na Vercel:"
    echo "      - Acesse https://vercel.com"
    echo "      - Conecte seu repositório"
    echo "      - Configure as variáveis de ambiente"
    echo "      - Faça o deploy"
    echo ""
    echo "   3. Para deploy na Netlify:"
    echo "      - Acesse https://netlify.com"
    echo "      - Conecte seu repositório"
    echo "      - Configure as variáveis de ambiente"
    echo "      - Faça o deploy"
    echo ""
    echo "📚 Veja o guia completo em: docs/GUIA_DEPLOY_COMPLETO.md"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

