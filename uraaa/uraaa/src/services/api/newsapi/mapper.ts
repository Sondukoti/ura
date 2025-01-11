import { ApiResponse } from '../../../types/api';
import { NewsApiResponse } from './types';

export function mapNewsApiResponse(data: NewsApiResponse): ApiResponse {
  return {
    results: data.articles.map(article => ({
      id: btoa(article.url),
      title: article.title,
      description: article.description || article.content,
      url: article.url,
      source: 'newsapi' as const,
      date: article.publishedAt,
      thumbnail: article.urlToImage
    })),
    source: 'newsapi'
  };
}