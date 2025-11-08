#!/bin/bash

# Script de preparação para deploy
# Execute: bash scripts/preparar-deploy.sh

echo "🚀 Preparando projeto para deploy..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Aviso: Arquivo .env.local não encontrado"
    echo "   Crie o arquivo .env.local com as variáveis de ambiente necessárias"
    echo "   Use .env.example como referência"
fi

# Verificar se .env.example existe
if [ ! -f ".env.example" ]; then
    echo "⚠️  Aviso: Arquivo .env.example não encontrado"
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
    echo "   1. Configure as variáveis de ambiente na plataforma de deploy"
    echo "   2. Conecte o repositório"
    echo "   3. Faça o deploy"
    echo ""
    echo "📚 Veja o guia completo em: docs/GUIA_DEPLOY.md"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

