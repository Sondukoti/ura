import React from 'react';
import { ExternalLink, BookOpen, Youtube, Newspaper, Brain } from 'lucide-react';
import { AnalyzeButton } from '../AI/AnalyzeButton';

const sourceIcons = {
  semanticScholar: BookOpen,
  youtube: Youtube,
  newsapi: Newspaper,
  gemini: Brain,
} as const;

interface ResultCardProps {
  title: string;
  description: string;
  url: string;
  source: keyof typeof sourceIcons;
  date?: string;
  thumbnail?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  description,
  url,
  source,
  date,
  thumbnail,
}) => {
  const Icon = sourceIcons[source];
  const showAnalyzeButton = source === 'semanticScholar' || source === 'youtube';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Icon size={16} />
            <span>{source}</span>
            {date && <span>• {new Date(date).toLocaleDateString()}</span>}
          </div>
          <div className="flex items-center gap-3">
            {showAnalyzeButton && (
              <AnalyzeButton title={title} content={description} />
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
        {thumbnail && (
          <div className="mb-3">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
};