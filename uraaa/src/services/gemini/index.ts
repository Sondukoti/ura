import { ApiResponse } from '../../types/api';
import { geminiRequest } from './client';

export async function searchGemini(query: string): Promise<ApiResponse> {
  const response = await analyzeWithGemini(`Research query: ${query}\nProvide a comprehensive analysis.`);
  
  return {
    results: [{
      id: Date.now().toString(),
      title: 'AI Analysis',
      description: response,
      url: '#',
      source: 'gemini',
      date: new Date().toISOString(),
    }],
    source: 'gemini'
  };
}

export async function analyzeWithGemini(prompt: string): Promise<string> {
  return geminiRequest({ prompt });
}