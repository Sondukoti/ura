import { ApiRequestError } from './apiErrors';

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiRequestError(
          errorData.message || `HTTP error ${response.status}`,
          response.status
        );
      }

      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error instanceof ApiRequestError 
          ? error 
          : new ApiRequestError('Network request failed');
      }
      await delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
    }
  }

  throw new ApiRequestError('All retry attempts failed');
}