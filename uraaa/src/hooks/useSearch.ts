import { useState } from 'react';
import { SearchResult } from '../types/api';
import { searchSemanticScholar } from '../services/semanticScholar';
import { searchYoutube } from '../services/youtube';
import { searchNews } from '../services/newsapi';
import { searchGemini } from '../services/gemini';
import toast from 'react-hot-toast';

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string, sources: string[]) => {
    setLoading(true);
    setResults([]);

    try {
      const searchPromises = sources.map((source) => {
        switch (source) {
          case 'semanticScholar':
            return searchSemanticScholar(query);
          case 'youtube':
            return searchYoutube(query);
          case 'newsapi':
            return searchNews(query);
          case 'gemini':
            return searchGemini(query);
          default:
            return Promise.reject(`Unknown source: ${source}`);
        }
      });

      const responses = await Promise.allSettled(searchPromises);
      
      const newResults = responses.flatMap((response) => {
        if (response.status === 'fulfilled') {
          return response.value.results;
        } else {
          toast.error(`Error fetching from ${response.reason}`);
          return [];
        }
      });

      setResults(newResults);
    } catch (error) {
      toast.error('Error performing search');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
}