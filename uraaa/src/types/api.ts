export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'semanticScholar' | 'youtube' | 'newsapi' | 'gemini' | 'images';
  date?: string;
  thumbnail?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
  statistics?: {
    views: number;
    likes: number;
  };
}