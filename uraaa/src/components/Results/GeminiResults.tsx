import React from 'react';
import { SearchResult } from '../../types/api';
import { Brain } from 'lucide-react';

interface GeminiResultsProps {
  results: SearchResult[];
}

export const GeminiResults: React.FC<GeminiResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No AI analysis available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">{result.title}</h3>
          </div>
          <div className="prose max-w-none">
            {result.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};