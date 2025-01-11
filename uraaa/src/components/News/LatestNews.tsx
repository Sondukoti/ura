import React from 'react';
import { useLatestNews } from '../../hooks/useLatestNews';
import { ResultCard } from '../Results/ResultCard';
import { Newspaper } from 'lucide-react';

export const LatestNews: React.FC = () => {
  const { news, loading } = useLatestNews();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-32 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No news available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-medium text-gray-900">Latest News</h2>
      </div>
      {news.map((article) => (
        <ResultCard key={article.id} {...article} />
      ))}
    </div>
  );
}