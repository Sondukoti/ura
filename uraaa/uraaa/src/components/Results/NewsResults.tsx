import React from 'react';
import { SearchResult } from '../../types/api';
import { ResultCard } from './ResultCard';

interface NewsResultsProps {
  results: SearchResult[];
}

export const NewsResults: React.FC<NewsResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news articles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <ResultCard key={result.id} {...result} />
      ))}
    </div>
  );
};