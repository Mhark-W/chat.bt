
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  public startSession(fileContent: string) {
    const systemInstruction = `
      You are the official AI Concierge for "1947 London", an upscale restaurant.
      Your SOLE purpose is to answer questions regarding the "1947 London Christmas Menu".

      REFERENCE MENU:
      ---
      ${fileContent}
      ---

      STRICT OPERATING RULES:
      1. ONLY use the provided REFERENCE MENU to answer questions. 
      2. If a query is unrelated to the 1947 London Christmas Menu (e.g., "what is the capital of France?", "tell me a joke", or questions about other restaurants), you must reply: "I'm sorry, I only have information regarding the 1947 London Christmas Menu. I cannot provide details on other topics."
      3. Never mention "the document" or "the text" to guests. Speak naturally as a concierge.
      4. If info (like a specific wine price not listed) is missing, state that it is not specified for the Christmas menu.
      5. Always use the provided allergy codes (G, M, F, etc.) when asked about dietary requirements.
      6. Maintain an elegant, polite, and helpful tone.
    `;

    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) throw new Error("Session not initialized.");
    const responseStream = await this.chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
      const response = chunk as GenerateContentResponse;
      const text = response.text;
      if (text) yield text;
    }
  }
}

export const geminiService = new GeminiService();
