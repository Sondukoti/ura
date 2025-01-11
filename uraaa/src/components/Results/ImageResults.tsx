import React from 'react';
import { SearchResult } from '../../types/api';
import { ExternalLink } from 'lucide-react';

interface ImageResultsProps {
  results: SearchResult[];
}

export const ImageResults: React.FC<ImageResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {results.map((image) => (
        <div key={image.id} className="group relative">
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={image.thumbnail || image.url}
              alt={image.title}
              className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};