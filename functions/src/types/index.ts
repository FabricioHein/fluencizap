export interface User {
  phoneNumber: string;
  name?: string;
  level: string;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  createdAt: Date;
  lastInteraction?: Date;
}

export interface Progress {
  id?: string;
  phoneNumber: string;
  question: string;
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  timestamp: Date;
  topic?: string;
  level?: string;
}

export interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text?: {
    body: string;
  };
  audio?: {
    link: string;
  };
}

export interface WhatsAppWebhookEntry {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: Array<{
          from: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
      };
    }>;
  }>;
}
