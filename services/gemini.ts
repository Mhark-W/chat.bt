
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
      You are a specialized AI assistant. The user has provided a document for you to reference.
      
      DOCUMENT CONTENT:
      ---
      ${fileContent}
      ---
      
      Rules:
      1. Use the provided document content as your primary knowledge base.
      2. If the user asks a question that can be answered using the document, provide a detailed answer based on the text.
      3. If the answer is NOT in the document, you should mention that the information isn't in the provided file, but then offer a general helpful response based on your broader knowledge if appropriate.
      4. Always be polite, professional, and concise.
    `;

    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
  }

  /**
   * Sends a message to the current chat session and returns a streaming response.
   */
  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      throw new Error("Chat session not initialized. Please upload a file first.");
    }

    const responseStream = await this.chat.sendMessageStream({ message });
    
    for await (const chunk of responseStream) {
      const response = chunk as GenerateContentResponse;
      yield response.text;
    }
  }
}

export const geminiService = new GeminiService();
