# Script de preparação para deploy (PowerShell)
# Execute: .\scripts\preparar-deploy.ps1

Write-Host "🚀 Preparando projeto para deploy..." -ForegroundColor Cyan

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

# Verificar se .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Aviso: Arquivo .env.local não encontrado" -ForegroundColor Yellow
    Write-Host "   Crie o arquivo .env.local com as variáveis de ambiente necessárias" -ForegroundColor Yellow
    Write-Host "   Use .env.example como referência" -ForegroundColor Yellow
}

# Verificar se .env.example existe
if (-not (Test-Path ".env.example")) {
    Write-Host "⚠️  Aviso: Arquivo .env.example não encontrado" -ForegroundColor Yellow
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
npm install

# Executar lint
Write-Host "🔍 Executando ESLint..." -ForegroundColor Cyan
npm run lint

# Executar build
Write-Host "🏗️  Executando build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Configure as variáveis de ambiente na plataforma de deploy"
    Write-Host "   2. Conecte o repositório"
    Write-Host "   3. Faça o deploy"
    Write-Host ""
    Write-Host "📚 Veja o guia completo em: docs/GUIA_DEPLOY.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro no build. Verifique os erros acima." -ForegroundColor Red
    exit 1
}

