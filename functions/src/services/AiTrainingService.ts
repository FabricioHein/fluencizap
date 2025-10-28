import { Firestore } from "firebase-admin/firestore";
import { Storage } from "firebase-admin/storage";
import { OpenAIService } from "./OpenAIService";
import { TextToSpeechService } from "./TextToSpeechService";
import { WhatsappService } from "./WhatsappService";
import { UserModel } from "../models/User";
import { ProgressModel } from "../models/Progress";
import { User } from "../types";
import * as logger from "firebase-functions/logger";

interface TrainingStep {
  step: string;
  question: string;
  answer: string;
  correct: boolean;
  timestamp: Date;
}

export class AiTrainingService {
  private userModel: UserModel;
  private progressModel: ProgressModel;
  private openAIService: OpenAIService;
  private ttsService: TextToSpeechService;
  private whatsappService: WhatsappService;
  private aiEnabled: boolean;
  private audioEnabled: boolean;

  constructor(db: Firestore, storage: Storage) {
    this.userModel = new UserModel(db);
    this.progressModel = new ProgressModel(db);
    this.openAIService = new OpenAIService();
    this.ttsService = new TextToSpeechService(storage);
    this.whatsappService = new WhatsappService();
    this.aiEnabled = process.env.TRAINING_AI_ENABLED !== "false";
    this.audioEnabled = process.env.TRAINING_AUDIO_ENABLED !== "false";
  }

  /**
   * Processa a mensagem do usuário com IA
   */
  async processMessageWithAI(phoneNumber: string, message: string): Promise<void> {
    let user = await this.userModel.findByPhoneNumber(phoneNumber);

    if (!user) {
      user = await this.userModel.create({
        phoneNumber,
        level: "beginner",
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        createdAt: new Date(),
      });
    }

    const history = await this.progressModel.getByPhoneNumber(phoneNumber, 1);

    // Determinar o estágio do usuário
    if (
      history.length === 0 ||
      message.toLowerCase() === "começar" ||
      message.toLowerCase() === "start"
    ) {
      await this.startTraining(phoneNumber, user);
      return;
    }

    // Processar comandos especiais
    if (message.toLowerCase() === "ajuda" || message.toLowerCase() === "help") {
      await this.sendHelp(phoneNumber);
      return;
    }

    if (message.toLowerCase() === "progresso" || message.toLowerCase() === "progress") {
      await this.sendProgress(phoneNumber, user);
      return;
    }

    if (message.toLowerCase() === "lição" || message.toLowerCase() === "lesson") {
      await this.sendLesson(phoneNumber, user);
      return;
    }

    if (message.toLowerCase() === "reiniciar" || message.toLowerCase() === "reset") {
      await this.userModel.resetProgress(phoneNumber);
      await this.whatsappService.sendTextMessage(
        phoneNumber,
        "✅ Progresso reiniciado! Digite 'começar' para iniciar novamente."
      );
      return;
    }

    // Processar resposta do usuário
    await this.processUserAnswer(phoneNumber, user, message);
  }

  /**
   * Inicia o treinamento
   */
  private async startTraining(phoneNumber: string, user: User): Promise<void> {
    const welcomeMessage = `🎯 Bem-vindo ao English Trainer com IA!

Vou te ajudar a melhorar seu inglês de forma dinâmica e personalizada.

Comandos disponíveis:
• Digite qualquer mensagem para praticar
• 'ajuda' - ver comandos
• 'lição' - receber uma mini-lição
• 'progresso' - ver seu progresso
• 'reiniciar' - reiniciar progresso

Vamos começar! 🚀`;

    await this.whatsappService.sendTextMessage(phoneNumber, welcomeMessage);

    // Gerar primeira pergunta com IA
    await this.askNextQuestion(phoneNumber, user, "beginner", "programming basics");
  }

  /**
   * Gera e envia próxima pergunta usando IA
   */
  private async askNextQuestion(
    phoneNumber: string,
    user: User,
    level: string,
    topic: string
  ): Promise<void> {
    if (!this.aiEnabled) {
      await this.askStaticQuestion(phoneNumber, user);
      return;
    }

    try {
      // Gera pergunta com ChatGPT
      const question = await this.openAIService.generateQuestion(level, topic);

      // Envia a pergunta
      await this.whatsappService.sendTextMessage(phoneNumber, question);

      // Salva a pergunta no histórico
      await this.progressModel.create({
        phoneNumber,
        question,
        timestamp: new Date(),
        topic,
        level,
      });

      // Gera áudio da pronúncia (opcional)
      if (this.audioEnabled) {
        try {
          const expectedAnswer = this.extractExpectedAnswer(question);
          if (expectedAnswer) {
            await this.delay(1000);
            const audioUrl = await this.ttsService.generatePronunciationAudio(expectedAnswer);
            await this.whatsappService.sendTextMessage(phoneNumber, "🔊 Ouça a pronúncia:");
            await this.delay(500);
            await this.whatsappService.sendAudioMessage(phoneNumber, audioUrl);
          }
        } catch (error) {
          logger.warn("Failed to generate audio", error);
        }
      }
    } catch (error) {
      logger.error("Error generating AI question", error);
      await this.askStaticQuestion(phoneNumber, user);
    }
  }

  /**
   * Processa resposta do usuário
   */
  private async processUserAnswer(
    phoneNumber: string,
    user: User,
    answer: string
  ): Promise<void> {
    const lastProgress = await this.progressModel.getLastQuestion(phoneNumber);

    if (!lastProgress) {
      await this.startTraining(phoneNumber, user);
      return;
    }

    // Se já respondeu, gera nova pergunta
    if (lastProgress.userAnswer) {
      const level = this.calculateLevel(user);
      await this.askNextQuestion(phoneNumber, user, level, "programming");
      return;
    }

    // Avaliar resposta com IA
    if (this.aiEnabled) {
      await this.evaluateWithAI(phoneNumber, user, lastProgress, answer);
    } else {
      await this.evaluateStatically(phoneNumber, user, lastProgress, answer);
    }
  }

  /**
   * Avalia resposta usando ChatGPT
   */
  private async evaluateWithAI(
    phoneNumber: string,
    user: User,
    progress: any,
    answer: string
  ): Promise<void> {
    try {
      // Corrige gramática
      const correction = await this.openAIService.correctGrammar(answer);

      const isCorrect =
        correction.toLowerCase().includes("perfeito") ||
        correction.toLowerCase().includes("correto");

      // Atualiza estatísticas do usuário
      await this.userModel.incrementStats(phoneNumber, isCorrect);

      // Envia feedback
      const updatedUser = await this.userModel.findByPhoneNumber(phoneNumber);
      const feedback = `✅ ${correction}

Pontuação: ${updatedUser?.correctAnswers || 0}/${updatedUser?.questionsAnswered || 0}`;

      await this.whatsappService.sendTextMessage(phoneNumber, feedback);

      // Gera áudio da correção se necessário
      if (this.audioEnabled && !isCorrect) {
        try {
          const correctedSentence = this.extractCorrectedSentence(correction);
          if (correctedSentence) {
            await this.delay(800);
            const audioUrl = await this.ttsService.generatePronunciationAudio(correctedSentence);
            await this.whatsappService.sendTextMessage(phoneNumber, "🔊 Pronúncia correta:");
            await this.delay(500);
            await this.whatsappService.sendAudioMessage(phoneNumber, audioUrl);
          }
        } catch (error) {
          logger.warn("Failed to generate correction audio", error);
        }
      }

      // Pergunta seguinte
      await this.delay(1500);
      const level = this.calculateLevel(updatedUser || user);
      await this.askNextQuestion(phoneNumber, updatedUser || user, level, "programming");
    } catch (error) {
      logger.error("Error evaluating with AI", error);
      await this.whatsappService.sendTextMessage(
        phoneNumber,
        "Resposta registrada! Próxima pergunta..."
      );
      const level = this.calculateLevel(user);
      await this.askNextQuestion(phoneNumber, user, level, "programming");
    }
  }

  /**
   * Envia mini-lição educacional
   */
  private async sendLesson(phoneNumber: string, user: User): Promise<void> {
    if (!this.aiEnabled) {
      await this.whatsappService.sendTextMessage(
        phoneNumber,
        "IA não disponível no momento. Use 'começar' para praticar."
      );
      return;
    }

    const level = this.calculateLevel(user);
    const lesson = await this.openAIService.generateLesson("technical English", level);

    await this.whatsappService.sendTextMessage(phoneNumber, `📚 Mini-Lição:\n\n${lesson}`);

    // Gera exemplo com áudio
    if (this.audioEnabled) {
      try {
        const example = "I am debugging the application";
        const audioUrl = await this.ttsService.generatePronunciationAudio(example);

        await this.delay(1000);
        await this.whatsappService.sendTextMessage(phoneNumber, `📢 Exemplo: ${example}`);
        await this.delay(500);
        await this.whatsappService.sendAudioMessage(phoneNumber, audioUrl);
      } catch (error) {
        logger.warn("Failed to generate lesson audio", error);
      }
    }
  }

  /**
   * Envia progresso do usuário
   */
  private async sendProgress(phoneNumber: string, user: User): Promise<void> {
    const total = user.questionsAnswered || 0;
    const correct = user.correctAnswers || 0;
    const percentage = total > 0 ? Math.round((correct * 100) / total) : 0;

    const progressMsg = `📊 Seu Progresso:

Total de questões: ${total}
Acertos: ${correct}
Taxa de acerto: ${percentage}%
Nível atual: ${this.calculateLevel(user)}
Sequência atual: ${user.currentStreak || 0} 🔥

Continue praticando! 💪`;

    await this.whatsappService.sendTextMessage(phoneNumber, progressMsg);

    // Sugerir próximo tópico com IA
    if (this.aiEnabled && total > 0) {
      try {
        const suggestion = await this.openAIService.suggestNextTopic(
          this.calculateLevel(user),
          total,
          correct
        );
        await this.whatsappService.sendTextMessage(phoneNumber, `💡 ${suggestion}`);
      } catch (error) {
        logger.warn("Failed to generate suggestion", error);
      }
    }
  }

  /**
   * Envia ajuda
   */
  private async sendHelp(phoneNumber: string): Promise<void> {
    const help = `📖 Comandos Disponíveis:

• 'começar' - Iniciar treinamento
• 'lição' - Receber mini-lição
• 'progresso' - Ver estatísticas
• 'reiniciar' - Reiniciar progresso
• 'ajuda' - Ver esta mensagem

Ou simplesmente responda as perguntas! 😊`;

    await this.whatsappService.sendTextMessage(phoneNumber, help);
  }

  // ===== Métodos Auxiliares =====

  private async askStaticQuestion(phoneNumber: string, user: User): Promise<void> {
    const question = "Traduza para inglês: 'Eu sou um desenvolvedor'";
    await this.whatsappService.sendTextMessage(phoneNumber, question);

    await this.progressModel.create({
      phoneNumber,
      question,
      timestamp: new Date(),
      topic: "static",
      level: user.level,
    });
  }

  private async evaluateStatically(
    phoneNumber: string,
    user: User,
    progress: any,
    answer: string
  ): Promise<void> {
    const isCorrect = answer.toLowerCase().includes("i am a developer");

    await this.userModel.incrementStats(phoneNumber, isCorrect);

    const response = isCorrect
      ? "✅ Correto! Próxima pergunta..."
      : "❌ Tente: 'I am a developer'";

    await this.whatsappService.sendTextMessage(phoneNumber, response);
    await this.askStaticQuestion(phoneNumber, user);
  }

  private calculateLevel(user: User): string {
    const total = user.questionsAnswered || 0;
    const correct = user.correctAnswers || 0;

    if (total < 5) return "beginner";
    if (total < 15) return "intermediate";

    const percentage = total > 0 ? (correct * 100) / total : 0;
    if (percentage >= 80) return "advanced";
    if (percentage >= 60) return "intermediate";
    return "beginner";
  }

  private extractExpectedAnswer(question: string): string | null {
    // Simplified extraction - can be enhanced with regex or AI
    return null;
  }

  private extractCorrectedSentence(correction: string): string | null {
    if (correction.includes(":")) {
      const parts = correction.split(":");
      if (parts.length > 1) {
        return parts[1].trim().replace(/['"]/g, "");
      }
    }
    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
