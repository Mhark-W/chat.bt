
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Initializes a new chat session with file context as a system instruction.
   */
  public startSession(fileContent: string) {
    const systemInstruction = `
      You are a strictly grounded AI assistant for the "1947 London" restaurant. 
      You have access to ONE specific document: the 1947 London Christmas Menu.
      
      DOCUMENT CONTENT:
      ---
      ${fileContent}
      ---
      
      STRICT OPERATING RULES:
      1. ONLY answer questions using the information provided in the DOCUMENT CONTENT above.
      2. If a user asks about something NOT in the document (e.g., general knowledge, other restaurants, current events, or unrelated menu items), you must politely state: "I'm sorry, I only have information regarding the 1947 London Christmas Menu. I cannot provide details on that topic."
      3. DO NOT use your internal training data to supplement answers. For example, if the document doesn't list the price of a specific wine, do not guess or provide a general price.
      4. If the user asks for dietary advice or allergy information, strictly refer to the allergy codes listed in the document (e.g., M for Milk, G for Gluten).
      5. Maintain a professional, high-end restaurant concierge persona.
      6. Be concise and accurate.
    `;

    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        temperature: 0.1, // Lower temperature for more deterministic/strict adherence
      },
    });
  }

  /**
   * Sends a message to the current chat session and returns a streaming response.
   */
  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      throw new Error("Chat session not initialized.");
    }

    const responseStream = await this.chat.sendMessageStream({ message });
    
    for await (const chunk of responseStream) {
      const response = chunk as GenerateContentResponse;
      yield response.text;
    }
  }
}

export const geminiService = new GeminiService();
