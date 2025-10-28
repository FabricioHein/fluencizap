import axios from "axios";
import { WhatsAppMessage } from "../types";
import * as logger from "firebase-functions/logger";

export class WhatsappService {
  private apiUrl: string;
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0/";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
  }

  /**
   * Envia mensagem de texto simples
   */
  async sendTextMessage(to: string, message: string): Promise<void> {
    try {
      const url = `${this.apiUrl}${this.phoneNumberId}/messages`;

      const payload: WhatsAppMessage = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body: message,
        },
      };

      await this.sendRequest(url, payload);
      logger.info(`Mensagem de texto enviada para ${to}`);
    } catch (error) {
      logger.error("Erro ao enviar mensagem WhatsApp", error);
      throw error;
    }
  }

  /**
   * Envia mensagem de áudio
   * @param to Número do destinatário
   * @param audioUrl URL pública do arquivo de áudio (MP3, OGG)
   */
  async sendAudioMessage(to: string, audioUrl: string): Promise<void> {
    try {
      const url = `${this.apiUrl}${this.phoneNumberId}/messages`;

      const payload: WhatsAppMessage = {
        messaging_product: "whatsapp",
        to,
        type: "audio",
        audio: {
          link: audioUrl,
        },
      };

      await this.sendRequest(url, payload);
      logger.info(`Mensagem de áudio enviada para ${to} (URL: ${audioUrl})`);
    } catch (error) {
      logger.error("Erro ao enviar áudio WhatsApp", error);
      throw error;
    }
  }

  /**
   * Envia mensagem de texto com áudio de pronúncia
   * @param to Número do destinatário
   * @param textMessage Mensagem de texto
   * @param audioUrl URL do áudio (opcional)
   */
  async sendTextWithAudio(to: string, textMessage: string, audioUrl?: string): Promise<void> {
    // Envia o texto primeiro
    await this.sendTextMessage(to, textMessage);

    // Se houver áudio, envia em seguida
    if (audioUrl) {
      // Pequeno delay para garantir ordem das mensagens
      await this.delay(500);
      await this.sendAudioMessage(to, audioUrl);
    }
  }

  /**
   * Envia múltiplas mensagens (texto + áudio de pronúncia)
   * Útil para lições com exemplos
   */
  async sendLesson(
    to: string,
    lessonText: string,
    exampleSentence: string,
    audioUrl?: string
  ): Promise<void> {
    await this.sendTextMessage(to, lessonText);

    await this.delay(800);
    await this.sendTextMessage(to, `📢 Exemplo: ${exampleSentence}`);

    if (audioUrl) {
      await this.delay(500);
      await this.sendAudioMessage(to, audioUrl);
    }
  }

  /**
   * Método auxiliar para fazer requisições HTTP
   */
  private async sendRequest(url: string, payload: WhatsAppMessage): Promise<void> {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.accessToken}`,
        },
      });

      if (response.status >= 400) {
        logger.error(`WhatsApp API error: ${response.status} - ${JSON.stringify(response.data)}`);
        throw new Error(`WhatsApp API error: ${response.status}`);
      }
    } catch (error) {
      logger.error("Error sending WhatsApp request", error);
      throw error;
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
