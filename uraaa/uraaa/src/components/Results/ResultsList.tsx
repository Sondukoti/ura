import React from 'react';
import { ResultCard } from './ResultCard';

interface Result {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'semanticScholar' | 'youtube' | 'newsapi' | 'gemini';
  date?: string;
}

export const ResultsList: React.FC<{
  results: Result[];
  loading?: boolean;
}> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {results.map((result) => (
        <ResultCard key={result.id} {...result} />
      ))}
    </div>
  );
};