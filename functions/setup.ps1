# 🔥 Firebase Setup Script para English WhatsApp Trainer (PowerShell)
# Este script automatiza o setup inicial do projeto

Write-Host "🔥 English WhatsApp Trainer - Firebase Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Firebase CLI
try {
    $null = firebase --version
    Write-Host "✅ Firebase CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI não encontrado" -ForegroundColor Red
    Write-Host "Instale com: npm install -g firebase-tools"
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')

    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js versão 18+ necessária (atual: $nodeVersion)" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado" -ForegroundColor Red
    Write-Host "Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
}

# Login no Firebase
Write-Host ""
Write-Host "🔑 Verificando login no Firebase..." -ForegroundColor Yellow
try {
    $null = firebase projects:list 2>&1
    Write-Host "✅ Já logado no Firebase" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não está logado no Firebase" -ForegroundColor Yellow
    Write-Host "Por favor, faça login:"
    firebase login
}

# Listar projetos
Write-Host ""
Write-Host "📋 Projetos Firebase disponíveis:" -ForegroundColor Cyan
firebase projects:list

# Selecionar projeto
Write-Host ""
$projectId = Read-Host "Digite o ID do seu projeto Firebase"

if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "❌ Project ID não pode ser vazio" -ForegroundColor Red
    exit 1
}

# Atualizar .firebaserc
Write-Host ""
Write-Host "📝 Configurando projeto..." -ForegroundColor Yellow

$firebaserc = @{
    projects = @{
        default = $projectId
    }
} | ConvertTo-Json

$firebaserc | Out-File -FilePath "../.firebaserc" -Encoding UTF8
Write-Host "✅ .firebaserc atualizado" -ForegroundColor Green

# Instalar dependências
Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Criar .env
if (!(Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚙️  Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env criado" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️  .env já existe, não foi sobrescrito" -ForegroundColor Yellow
}

# Configurar variáveis no Firebase
Write-Host ""
$configureEnv = Read-Host "Deseja configurar variáveis de ambiente no Firebase agora? (y/n)"

if ($configureEnv -eq "y" -or $configureEnv -eq "Y") {
    Write-Host ""
    Write-Host "🔐 Configure suas variáveis de ambiente:" -ForegroundColor Cyan
    Write-Host ""

    $whatsappPhoneId = Read-Host "WhatsApp Phone Number ID"
    $whatsappToken = Read-Host "WhatsApp Access Token"
    $whatsappVerify = Read-Host "WhatsApp Verify Token (crie um)"
    $openaiKey = Read-Host "OpenAI API Key"
    $adminToken = Read-Host "Admin Token (crie um)"

    Write-Host ""
    Write-Host "📤 Configurando no Firebase..." -ForegroundColor Yellow

    firebase functions:config:set `
        whatsapp.api_url="https://graph.facebook.com/v18.0/" `
        whatsapp.phone_number_id="$whatsappPhoneId" `
        whatsapp.access_token="$whatsappToken" `
        whatsapp.verify_token="$whatsappVerify" `
        openai.api_key="$openaiKey" `
        openai.model="gpt-4" `
        firebase.storage_bucket="$projectId.appspot.com" `
        training.ai_enabled="true" `
        training.audio_enabled="true" `
        admin.token="$adminToken"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Variáveis configuradas" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Lembre-se de configurar as variáveis depois!" -ForegroundColor Yellow
}

# Verificar APIs
Write-Host ""
Write-Host "🔍 Verificando APIs do Google Cloud..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Você precisa habilitar:"
Write-Host "  1. Cloud Text-to-Speech API"
Write-Host "  2. Cloud Firestore API"
Write-Host "  3. Cloud Storage API"
Write-Host ""
Write-Host "Acesse: https://console.cloud.google.com/apis/library?project=$projectId"
Read-Host "Pressione ENTER quando tiver habilitado as APIs"

# Build
Write-Host ""
Write-Host "🏗️  Compilando TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build" -ForegroundColor Red
    exit 1
}

# Resumo
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edite o arquivo .env com suas credenciais (se ainda não fez)"
Write-Host "2. Teste localmente:"
Write-Host "   $ firebase emulators:start"
Write-Host ""
Write-Host "3. Faça deploy:"
Write-Host "   $ firebase deploy"
Write-Host ""
Write-Host "4. Configure o webhook no Meta for Developers"
Write-Host "   URL: https://us-central1-$projectId.cloudfunctions.net/webhook"
Write-Host ""
Write-Host "📚 Documentação completa: FIREBASE_SETUP.md"
Write-Host ""
