import { ApiResponse } from '../types/api';

export async function searchSemanticScholar(query: string): Promise<ApiResponse> {
  const response = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,abstract,url,year`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Semantic Scholar');
  }

  const data = await response.json();
  
  return {
    results: data.data.map((paper: any) => ({
      id: paper.paperId,
      title: paper.title,
      description: paper.abstract || 'No abstract available',
      url: paper.url,
      source: 'semanticScholar',
      date: paper.year ? `${paper.year}-01-01` : undefined,
    })),
    source: 'semanticScholar'
  };
}