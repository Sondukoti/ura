import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private ai: GoogleGenerativeAI | null = null;
  
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async analyze(content: string, type: 'summarize' | 'explain' = 'summarize') {
    try {
      if (!this.ai) throw new Error('Gemini AI not initialized');
      
      const model = this.ai.getGenerativeModel({ model: 'gemini-pro' });
      
      // Add conversation context and style instructions
      const prompt = `
        You are a helpful and friendly AI assistant. Keep your responses natural, concise, and conversational.
        Avoid overly formal or academic language unless specifically requested.
        
        User message: ${content}
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 200, // Limit response length for faster replies
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini analysis error:', error)
      throw error;
    }
  }

  async chat(message: string) {
    try {
      if (!this.ai) throw new Error('Gemini AI not initialized');
      
      const model = this.ai.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 150, // Keep chat responses shorter
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw error;
    }
  }
} 