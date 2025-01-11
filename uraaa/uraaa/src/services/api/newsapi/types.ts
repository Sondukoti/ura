export interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsApiResponse {
  status: string;
  articles: NewsApiArticle[];
  message?: string;
  code?: string;
}