import { ApiResponse } from '../../../types/api';
import { newsApiRequest } from './client';
import { mapNewsApiResponse } from './mapper';

export async function searchNews(query: string): Promise<ApiResponse> {
  const data = await newsApiRequest('/everything', { 
    q: query,
    sortBy: 'publishedAt'
  });
  
  return mapNewsApiResponse(data);
}

export async function getLatestNews(): Promise<ApiResponse> {
  const data = await newsApiRequest('/top-headlines', { 
    country: 'us'
  });
  
  return mapNewsApiResponse(data);
}