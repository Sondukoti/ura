import { fetchWithRetry } from '../../utils/apiClient';
import { getApiKey } from '../../utils/apiKeys';
import { GeminiRequestOptions, GeminiResponse } from './types';
import { GEMINI_CONFIG } from './config';
import { ApiRequestError } from '../../utils/apiErrors';

export async function geminiRequest(options: GeminiRequestOptions): Promise<string> {
  const apiKey = await getApiKey('gemini');
  
  if (!apiKey?.trim()) {
    throw new ApiRequestError('Invalid API key format', 401);
  }

  const url = `${GEMINI_CONFIG.baseUrl}?key=${apiKey}`;

  try {
    const response = await fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: options.prompt
            }]
          }],
          generationConfig: {
            temperature: options.temperature ?? GEMINI_CONFIG.defaultTemperature,
            maxOutputTokens: options.maxTokens ?? GEMINI_CONFIG.maxTokens,
          }
        }),
        retries: GEMINI_CONFIG.retryAttempts,
        retryDelay: GEMINI_CONFIG.retryDelay
      }
    );

    const data = await response.json() as GeminiResponse;
    
    if (data.error) {
      throw new ApiRequestError(
        data.error.message || 'Gemini API error',
        data.error.code
      );
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new ApiRequestError('Invalid response format from Gemini API');
    }

    return text;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError('Failed to communicate with Gemini API');
  }
}