# Firebase Functions - English WhatsApp Trainer

Este diretório contém as Firebase Functions do projeto.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Copiar configuração
cp .env.example .env
# Editar .env com suas credenciais

# Rodar localmente
npm run serve

# Deploy
npm run deploy
```

## 📁 Estrutura

```
functions/
├── src/
│   ├── index.ts              # Entry point - todas as functions
│   ├── services/
│   │   ├── AiTrainingService.ts    # Lógica principal de treinamento
│   │   ├── OpenAIService.ts        # Integração ChatGPT
│   │   ├── TextToSpeechService.ts  # Google Cloud TTS
│   │   └── WhatsappService.ts      # WhatsApp API
│   ├── models/
│   │   ├── User.ts           # Modelo e operações Firestore para usuários
│   │   └── Progress.ts       # Modelo e operações Firestore para progresso
│   └── types/
│       └── index.ts          # TypeScript types e interfaces
├── lib/                      # Código compilado (gerado)
├── node_modules/             # Dependências (gerado)
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
├── .eslintrc.js              # Configuração ESLint
├── .env.example              # Template de variáveis de ambiente
└── .env                      # Suas variáveis (não commitar!)
```

## 📜 Scripts Disponíveis

```bash
# Build
npm run build              # Compila TypeScript para JavaScript

# Desenvolvimento
npm run build:watch        # Compila com watch mode
npm run serve             # Build + inicia emuladores Firebase

# Deploy
npm run deploy            # Deploy para produção
npm run logs              # Ver logs das functions

# Qualidade de Código
npm run lint              # Verifica código
npm run lint:fix          # Corrige problemas automaticamente
```

## 🔧 Configuração

### 1. Variáveis de Ambiente (.env)

```env
# WhatsApp
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_VERIFY_TOKEN=seu_verify_token

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Firebase
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com

# Features
TRAINING_AI_ENABLED=true
TRAINING_AUDIO_ENABLED=true

# Admin
ADMIN_TOKEN=seu-token-secreto
```

### 2. Firebase Config (Produção)

```bash
firebase functions:config:set \
  whatsapp.api_url="..." \
  whatsapp.phone_number_id="..." \
  whatsapp.access_token="..." \
  whatsapp.verify_token="..." \
  openai.api_key="..." \
  openai.model="gpt-4" \
  firebase.storage_bucket="..." \
  training.ai_enabled="true" \
  training.audio_enabled="true" \
  admin.token="..."
```

## 📦 Functions Disponíveis

### HTTP Functions

#### `webhookVerify` (GET)
Verificação do webhook WhatsApp.
```
GET /webhookVerify?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY
```

#### `webhook` (POST)
Recebe mensagens do WhatsApp.
```
POST /webhook
Body: WhatsApp webhook payload
```

#### `health` (GET)
Health check da aplicação.
```
GET /health
Response: { status: "ok", timestamp: "...", service: "..." }
```

#### `stats` (GET)
Estatísticas administrativas (requer autenticação).
```
GET /stats
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: { totalUsers: 10, totalQuestions: 50, timestamp: "..." }
```

### Scheduled Functions

#### `cleanupOldAudios`
Executa diariamente às 2h AM (America/Sao_Paulo).
Deleta áudios do Storage com mais de 7 dias.

### Firestore Triggers

#### `onUserCreated`
Dispara quando um novo usuário é criado na coleção `users`.
Faz log das informações do usuário.

## 🧪 Desenvolvimento Local

### Usar Emuladores

```bash
# Da pasta raiz do projeto
firebase emulators:start
```

Isso inicia:
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Storage**: http://localhost:9199
- **UI**: http://localhost:4000

### Testar Functions

```bash
# Verificação webhook
curl "http://localhost:5001/seu-projeto/us-central1/webhookVerify?hub.mode=subscribe&hub.verify_token=test&hub.challenge=test123"

# Health check
curl http://localhost:5001/seu-projeto/us-central1/health

# Stats (substitua TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5001/seu-projeto/us-central1/stats
```

## 🚢 Deploy

### Deploy Completo

```bash
# Da pasta raiz
firebase deploy
```

### Deploy Seletivo

```bash
# Apenas functions
firebase deploy --only functions

# Function específica
firebase deploy --only functions:webhook
```

### Verificar Deploy

```bash
# Listar functions deployadas
firebase functions:list

# Ver configuração
firebase functions:config:get
```

## 📊 Monitoramento

### Ver Logs

```bash
# Todos os logs
firebase functions:log

# Logs específicos
firebase functions:log --only webhook

# Tail (tempo real)
firebase functions:log --only webhook -n 50
```

### Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Menu lateral > Functions
4. Visualize:
   - Invocações
   - Erros
   - Tempo de execução
   - Logs

## 🔒 Segurança

### Proteger Functions

As functions HTTP são públicas por padrão. Para proteger:

**1. Verificar origem (webhook):**
```typescript
const signature = req.headers['x-hub-signature-256'];
// Verificar assinatura
```

**2. Bearer token (stats):**
```typescript
const authHeader = req.headers.authorization;
if (authHeader !== `Bearer ${expectedToken}`) {
  res.status(401).send("Unauthorized");
}
```

**3. Firebase Auth:**
```typescript
import * as admin from "firebase-admin";

const token = req.headers.authorization?.split('Bearer ')[1];
const decodedToken = await admin.auth().verifyIdToken(token);
```

## 💡 Dicas de Performance

### 1. Cold Start
```typescript
// Inicializar serviços fora do handler
const service = new MyService();

export const myFunction = functions.https.onRequest((req, res) => {
  // Usar serviço já inicializado
  service.doSomething();
});
```

### 2. Timeout e Memória
```typescript
export const myFunction = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB"
  })
  .https.onRequest(handler);
```

### 3. Região
```typescript
export const myFunction = functions
  .region('southamerica-east1')
  .https.onRequest(handler);
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Firebase config not set"
```bash
firebase functions:config:get
firebase functions:config:set key=value
```

### Erro: Build falhou
```bash
npm run lint:fix
npm run build
```

### Erro: Deploy falhou
```bash
# Ver logs detalhados
firebase deploy --only functions --debug

# Verificar quota
# Firebase Console > Usage and billing
```

## 📚 Recursos

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Node.js 18 Docs](https://nodejs.org/docs/latest-v18.x/api/)
- [Firestore SDK](https://firebase.google.com/docs/firestore)
- [Firebase Storage SDK](https://firebase.google.com/docs/storage)

## 🆘 Suporte

Consulte a documentação na raiz:
- `../FIREBASE_SETUP.md` - Setup completo
- `../README_FIREBASE.md` - Guia da versão Firebase
- `../MIGRATION_GUIDE.md` - Migração Java → Firebase

---

**Node.js:** 18+
**TypeScript:** 5.3+
**Firebase Functions:** v4.5+
