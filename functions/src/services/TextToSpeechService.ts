import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { Storage } from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";
import { v4 as uuidv4 } from "uuid";

export class TextToSpeechService {
  private ttsClient: TextToSpeechClient;
  private storage: Storage;
  private bucketName: string;

  constructor(storage: Storage) {
    this.ttsClient = new TextToSpeechClient();
    this.storage = storage;
    this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || "";
  }

  /**
   * Gera áudio a partir de texto usando Google Cloud TTS
   * @param text Texto para converter em áudio
   * @param languageCode Código do idioma (ex: 'en-US', 'pt-BR')
   * @returns URL pública do áudio
   */
  async generateAudio(text: string, languageCode = "en-US"): Promise<string> {
    try {
      logger.info(`Generating audio for text: ${text.substring(0, 50)}...`);

      // Configuração da requisição TTS
      const request = {
        input: { text },
        voice: {
          languageCode,
          ssmlGender: "NEUTRAL" as const,
          name: languageCode === "en-US" ? "en-US-Neural2-J" : undefined,
        },
        audioConfig: {
          audioEncoding: "MP3" as const,
          speakingRate: 0.9, // Fala um pouco mais devagar para facilitar compreensão
          pitch: 0,
        },
      };

      // Gera o áudio
      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error("No audio content received from TTS");
      }

      // Salva no Firebase Storage
      const audioUrl = await this.uploadToStorage(
        response.audioContent as Buffer,
        `${languageCode}-${Date.now()}`
      );

      logger.info(`Audio generated successfully: ${audioUrl}`);
      return audioUrl;
    } catch (error) {
      logger.error("Error generating audio with TTS", error);
      throw error;
    }
  }

  /**
   * Gera áudio de pronúncia para uma frase em inglês
   */
  async generatePronunciationAudio(sentence: string): Promise<string> {
    return this.generateAudio(sentence, "en-US");
  }

  /**
   * Gera áudio de explicação em português
   */
  async generateExplanationAudio(explanation: string): Promise<string> {
    return this.generateAudio(explanation, "pt-BR");
  }

  /**
   * Upload do arquivo de áudio para Firebase Storage
   */
  private async uploadToStorage(audioBuffer: Buffer, filename: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueFilename = `audio/${uuidv4()}-${filename}.mp3`;
      const file = bucket.file(uniqueFilename);

      // Upload do arquivo
      await file.save(audioBuffer, {
        metadata: {
          contentType: "audio/mpeg",
          cacheControl: "public, max-age=31536000", // Cache por 1 ano
        },
      });

      // Torna o arquivo público
      await file.makePublic();

      // Retorna URL pública
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFilename}`;
      return publicUrl;
    } catch (error) {
      logger.error("Error uploading audio to storage", error);
      throw error;
    }
  }

  /**
   * Gera áudio com SSML (Speech Synthesis Markup Language) para controle avançado
   */
  async generateAudioWithSSML(ssml: string, languageCode = "en-US"): Promise<string> {
    try {
      const request = {
        input: { ssml },
        voice: {
          languageCode,
          ssmlGender: "NEUTRAL" as const,
        },
        audioConfig: {
          audioEncoding: "MP3" as const,
        },
      };

      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error("No audio content received from TTS");
      }

      const audioUrl = await this.uploadToStorage(
        response.audioContent as Buffer,
        `ssml-${Date.now()}`
      );

      return audioUrl;
    } catch (error) {
      logger.error("Error generating SSML audio", error);
      throw error;
    }
  }
}
