#!/bin/bash

# 🔥 Firebase Setup Script para English WhatsApp Trainer
# Este script automatiza o setup inicial do projeto

set -e

echo "🔥 English WhatsApp Trainer - Firebase Setup"
echo "============================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI não encontrado${NC}"
    echo "Instale com: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✅ Firebase CLI encontrado${NC}"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versão 18+ necessária (atual: v$NODE_VERSION)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js v$NODE_VERSION${NC}"

# Login no Firebase
echo ""
echo "🔑 Verificando login no Firebase..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Não está logado no Firebase${NC}"
    echo "Por favor, faça login:"
    firebase login
else
    echo -e "${GREEN}✅ Já logado no Firebase${NC}"
fi

# Selecionar projeto
echo ""
echo "📋 Projetos Firebase disponíveis:"
firebase projects:list

echo ""
read -p "Digite o ID do seu projeto Firebase: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID não pode ser vazio${NC}"
    exit 1
fi

# Atualizar .firebaserc
echo ""
echo "📝 Configurando projeto..."
cat > ../.firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF

echo -e "${GREEN}✅ .firebaserc atualizado${NC}"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Criar .env se não existir
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env criado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  .env já existe, não foi sobrescrito${NC}"
fi

# Configurar variáveis no Firebase
echo ""
read -p "Deseja configurar variáveis de ambiente no Firebase agora? (y/n): " CONFIGURE_ENV

if [ "$CONFIGURE_ENV" = "y" ] || [ "$CONFIGURE_ENV" = "Y" ]; then
    echo ""
    echo "🔐 Configure suas variáveis de ambiente:"
    echo ""

    read -p "WhatsApp Phone Number ID: " WHATSAPP_PHONE_ID
    read -p "WhatsApp Access Token: " WHATSAPP_TOKEN
    read -p "WhatsApp Verify Token (crie um): " WHATSAPP_VERIFY
    read -p "OpenAI API Key: " OPENAI_KEY
    read -p "Admin Token (crie um): " ADMIN_TOKEN

    echo ""
    echo "📤 Configurando no Firebase..."

    firebase functions:config:set \
        whatsapp.api_url="https://graph.facebook.com/v18.0/" \
        whatsapp.phone_number_id="$WHATSAPP_PHONE_ID" \
        whatsapp.access_token="$WHATSAPP_TOKEN" \
        whatsapp.verify_token="$WHATSAPP_VERIFY" \
        openai.api_key="$OPENAI_KEY" \
        openai.model="gpt-4" \
        firebase.storage_bucket="$PROJECT_ID.appspot.com" \
        training.ai_enabled="true" \
        training.audio_enabled="true" \
        admin.token="$ADMIN_TOKEN"

    echo -e "${GREEN}✅ Variáveis configuradas${NC}"
else
    echo -e "${YELLOW}⚠️  Lembre-se de configurar as variáveis depois!${NC}"
fi

# Verificar APIs necessárias
echo ""
echo "🔍 Verificando APIs do Google Cloud..."
echo ""
echo "Você precisa habilitar:"
echo "  1. Cloud Text-to-Speech API"
echo "  2. Cloud Firestore API"
echo "  3. Cloud Storage API"
echo ""
echo "Acesse: https://console.cloud.google.com/apis/library?project=$PROJECT_ID"
read -p "Pressione ENTER quando tiver habilitado as APIs..."

# Build
echo ""
echo "🏗️  Compilando TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído${NC}"
else
    echo -e "${RED}❌ Erro no build${NC}"
    exit 1
fi

# Resumo
echo ""
echo "============================================="
echo -e "${GREEN}🎉 Setup concluído com sucesso!${NC}"
echo "============================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1. Edite o arquivo .env com suas credenciais (se ainda não fez)"
echo "2. Teste localmente:"
echo "   $ firebase emulators:start"
echo ""
echo "3. Faça deploy:"
echo "   $ firebase deploy"
echo ""
echo "4. Configure o webhook no Meta for Developers"
echo "   URL: https://us-central1-$PROJECT_ID.cloudfunctions.net/webhook"
echo ""
echo "📚 Documentação completa: FIREBASE_SETUP.md"
echo ""
