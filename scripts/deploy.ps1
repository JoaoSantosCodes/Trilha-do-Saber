# Script de deploy - Trilha do Saber (PowerShell)
# Execute: .\scripts\deploy.ps1

Write-Host "🚀 Iniciando processo de deploy..." -ForegroundColor Cyan

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

# Verificar se há repositório remoto
$hasRemote = git remote | Select-String -Pattern "origin"
if (-not $hasRemote) {
    Write-Host "⚠️  Aviso: Repositório remoto não configurado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Passos para configurar:" -ForegroundColor Cyan
    Write-Host "   1. Crie um repositório no GitHub/GitLab/Bitbucket"
    Write-Host "   2. Execute os seguintes comandos:"
    Write-Host "      git remote add origin <url-do-repositorio>"
    Write-Host "      git branch -M main"
    Write-Host "      git push -u origin main"
    Write-Host ""
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Verificar se .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Aviso: Arquivo .env.local não encontrado" -ForegroundColor Yellow
    Write-Host "   Certifique-se de configurar as variáveis de ambiente na plataforma de deploy" -ForegroundColor Yellow
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
    Write-Host "   1. Faça push do código para o repositório remoto:"
    Write-Host "      git push origin main"
    Write-Host ""
    Write-Host "   2. Para deploy na Vercel:"
    Write-Host "      - Acesse https://vercel.com"
    Write-Host "      - Conecte seu repositório"
    Write-Host "      - Configure as variáveis de ambiente"
    Write-Host "      - Faça o deploy"
    Write-Host ""
    Write-Host "   3. Para deploy na Netlify:"
    Write-Host "      - Acesse https://netlify.com"
    Write-Host "      - Conecte seu repositório"
    Write-Host "      - Configure as variáveis de ambiente"
    Write-Host "      - Faça o deploy"
    Write-Host ""
    Write-Host "📚 Veja o guia completo em: docs/GUIA_DEPLOY_COMPLETO.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro no build. Verifique os erros acima." -ForegroundColor Red
    exit 1
}

