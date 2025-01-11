import { fetchWithRetry } from '../../../utils/apiClient';
import { getApiKey } from '../../../utils/apiKeys';
import { NewsApiResponse } from './types';

const BASE_URL = 'https://newsapi.org/v2';

export async function newsApiRequest(endpoint: string, params: Record<string, string> = {}): Promise<NewsApiResponse> {
  const apiKey = await getApiKey('newsapi');
  const queryParams = new URLSearchParams({
    ...params,
    language: 'en',
    pageSize: '10'
  });

  const response = await fetchWithRetry(`${BASE_URL}${endpoint}?${queryParams}`, {
    headers: {
      'X-Api-Key': apiKey
    },
    retries: 2,
    retryDelay: 1500
  });

  const data = await response.json();
  
  if (data.status === 'error') {
    throw new Error(data.message || 'NewsAPI request failed');
  }

  return data;
}