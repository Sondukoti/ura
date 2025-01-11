import { ApiResponse } from '../types/api';
import { fetchWithRetry } from '../utils/apiClient';
import { getApiKey } from '../utils/apiKeys';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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
  const apiKey = await getApiKey('gemini');
  
  const response = await fetchWithRetry(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}