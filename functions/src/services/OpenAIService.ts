import OpenAI from "openai";
import * as logger from "firebase-functions/logger";

export class OpenAIService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    this.openai = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || "gpt-4";
    logger.info(`OpenAI Service initialized with model: ${this.model}`);
  }

  /**
   * Gera uma pergunta de inglês personalizada baseada no nível do usuário
   */
  async generateQuestion(level: string, topic: string): Promise<string> {
    const systemPrompt = `Você é um professor de inglês especializado em ensinar desenvolvedores de software.
Gere uma pergunta de tradução adequada ao nível do aluno.
Formate a resposta assim: "Traduza para inglês: [frase em português]"
A frase deve ser relacionada a programação e tecnologia.`;

    const userPrompt = `Nível: ${level}. Tópico: ${topic}. Gere UMA pergunta de tradução.`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Avalia a resposta do usuário e fornece feedback
   */
  async evaluateAnswer(
    question: string,
    userAnswer: string,
    correctAnswer: string
  ): Promise<string> {
    const systemPrompt = `Você é um professor de inglês que avalia respostas de alunos.
Forneça feedback construtivo e educado.
Se a resposta estiver correta ou muito próxima, parabenize.
Se estiver errada, explique o erro gentilmente e dê a resposta correta.
Seja breve (máximo 3 linhas).`;

    const userPrompt = `Pergunta: ${question}
Resposta do aluno: ${userAnswer}
Resposta esperada: ${correctAnswer}
Avalie:`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Gera conteúdo educacional personalizado
   */
  async generateLesson(topic: string, level: string): Promise<string> {
    const systemPrompt = `Você é um professor de inglês criativo e didático.
Crie uma mini-lição de inglês para desenvolvedores.
Inclua:
1. Uma explicação breve do conceito
2. 2-3 exemplos práticos
3. Uma dica útil
Seja conciso (máximo 5 linhas).`;

    const userPrompt = `Tópico: ${topic}. Nível: ${level}. Crie a lição:`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Gera sugestões de próximos tópicos baseado no progresso
   */
  async suggestNextTopic(
    currentLevel: string,
    questionsAnswered: number,
    correctAnswers: number
  ): Promise<string> {
    const systemPrompt = `Você é um conselheiro educacional especializado em ensino de inglês.
Baseado no desempenho do aluno, sugira o próximo tópico de estudo.
Seja específico e motivador.
Responda em 2 linhas.`;

    const userPrompt = `Nível atual: ${currentLevel}. Questões respondidas: ${questionsAnswered}. Acertos: ${correctAnswers}. Sugira o próximo tópico:`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Corrige gramática e sugere melhorias
   */
  async correctGrammar(sentence: string): Promise<string> {
    const systemPrompt = `Você é um corretor de inglês especializado.
Se a frase estiver correta, diga "Perfeito!".
Se tiver erros, mostre a versão corrigida e explique o erro brevemente.
Máximo 2 linhas.`;

    const userPrompt = `Corrija esta frase: "${sentence}"`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Gera uma conversa contextual para praticar
   */
  async generateConversation(context: string, userMessage: string): Promise<string> {
    const systemPrompt = `Você é um colega desenvolvedor americano praticando inglês.
Mantenha uma conversa natural e amigável sobre programação.
Responda de forma breve e natural (máximo 3 linhas).
Corrija erros sutilmente sem ser pedante.`;

    const userPrompt = `Contexto: ${context}
Mensagem do usuário: ${userMessage}
Responda:`;

    return this.getChatCompletion(systemPrompt, userPrompt);
  }

  /**
   * Método genérico para fazer chamadas ao ChatGPT
   */
  private async getChatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        logger.warn("OpenAI returned empty response");
        return "Desculpe, não consegui gerar uma resposta. Tente novamente.";
      }

      logger.debug(`OpenAI response: ${content}`);
      return content.trim();
    } catch (error) {
      logger.error("Error calling OpenAI API", error);
      return "Erro ao processar com IA. Continuando com modo padrão.";
    }
  }

  /**
   * Verifica se o serviço está disponível
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.getChatCompletion("Test", "Say 'OK'");
      return true;
    } catch (error) {
      logger.warn("OpenAI service is not available", error);
      return false;
    }
  }
}
