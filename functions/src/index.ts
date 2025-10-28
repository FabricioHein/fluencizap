import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AiTrainingService } from "./services/AiTrainingService";
import { WhatsAppWebhookEntry } from "./types";
import * as logger from "firebase-functions/logger";

// Inicializa Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// Configurações
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "your-verify-token";

/**
 * Webhook de verificação do WhatsApp
 * GET /webhook
 */
export const webhookVerify = functions.https.onRequest((req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  logger.info("Webhook verification request", { mode, token });

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    logger.info("Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logger.warn("Webhook verification failed");
    res.status(403).send("Forbidden");
  }
});

/**
 * Webhook de recebimento de mensagens do WhatsApp
 * POST /webhook
 */
export const webhook = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB",
  })
  .https.onRequest(async (req, res) => {
    // Responde imediatamente ao WhatsApp
    res.status(200).send("OK");

    // Processa a mensagem de forma assíncrona
    try {
      const body = req.body as WhatsAppWebhookEntry;

      logger.info("Webhook received", { body: JSON.stringify(body) });

      if (!body.entry || body.entry.length === 0) {
        logger.warn("No entry in webhook body");
        return;
      }

      const entry = body.entry[0];
      if (!entry.changes || entry.changes.length === 0) {
        logger.warn("No changes in entry");
        return;
      }

      const change = entry.changes[0];
      const value = change.value;

      if (!value.messages || value.messages.length === 0) {
        logger.info("No messages in webhook (probably a status update)");
        return;
      }

      const message = value.messages[0];
      const from = message.from;
      const messageText = message.text?.body || "";

      logger.info("Processing message", { from, messageText });

      // Processa a mensagem com o serviço de IA
      const aiTrainingService = new AiTrainingService(db, storage);
      await aiTrainingService.processMessageWithAI(from, messageText);

      logger.info("Message processed successfully", { from });
    } catch (error) {
      logger.error("Error processing webhook", error);
    }
  });

/**
 * Health check endpoint
 */
export const health = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "englishwhatsapptrainer",
  });
});

/**
 * Função agendada para limpeza de áudios antigos (executa diariamente às 2h)
 */
export const cleanupOldAudios = functions.pubsub
  .schedule("0 2 * * *")
  .timeZone("America/Sao_Paulo")
  .onRun(async (context) => {
    try {
      logger.info("Starting audio cleanup");

      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({ prefix: "audio/" });

      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      let deletedCount = 0;

      for (const file of files) {
        const [metadata] = await file.getMetadata();
        const createdTime = new Date(metadata.timeCreated).getTime();

        // Deleta arquivos com mais de 7 dias
        if (createdTime < sevenDaysAgo) {
          await file.delete();
          deletedCount++;
        }
      }

      logger.info(`Audio cleanup completed. Deleted ${deletedCount} files`);
    } catch (error) {
      logger.error("Error during audio cleanup", error);
    }
  });

/**
 * Função Firestore trigger para logging de novos usuários
 */
export const onUserCreated = functions.firestore
  .document("users/{phoneNumber}")
  .onCreate(async (snap, context) => {
    const user = snap.data();
    logger.info("New user created", {
      phoneNumber: context.params.phoneNumber,
      level: user.level,
    });
  });

/**
 * Função HTTP para estatísticas gerais (para dashboard administrativo)
 */
export const stats = functions.https.onRequest(async (req, res) => {
  try {
    // Básica autenticação - em produção usar Firebase Auth
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.ADMIN_TOKEN || "change-me";

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const usersSnapshot = await db.collection("users").get();
    const progressSnapshot = await db.collection("progress").get();

    const stats = {
      totalUsers: usersSnapshot.size,
      totalQuestions: progressSnapshot.size,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(stats);
  } catch (error) {
    logger.error("Error getting stats", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
