import { useState, useEffect } from 'react';
import { SearchResult } from '../types/api';
import { getLatestNews } from '../services/newsapi';
import { handleApiError } from '../utils/errorHandling';

export function useLatestNews() {
  const [news, setNews] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const response = await getLatestNews();
        setNews(response.results);
      } catch (error) {
        handleApiError(error, { context: 'News' });
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestNews();
  }, []);

  return { news, loading };
}