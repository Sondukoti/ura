import { ApiResponse } from '../types/api';
import { getApiKey } from '../utils/apiKeys';
import { fetchWithRetry } from '../utils/apiClient';

export async function searchImages(query: string): Promise<ApiResponse> {
  const apiKey = await getApiKey('serp');
  const response = await fetchWithRetry(
    `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${apiKey}`
  );

  const data = await response.json();
  
  return {
    results: data.images_results.slice(0, 12).map((image: any) => ({
      id: image.position.toString(),
      title: image.title || 'Image',
      description: image.snippet || '',
      url: image.original || image.thumbnail,
      thumbnail: image.thumbnail,
      source: 'images',
      sourceUrl: image.source_website,
      width: image.original_width,
      height: image.original_height,
    })),
    source: 'images'
  };
}