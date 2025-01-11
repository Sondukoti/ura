import React from 'react';
import { Book, Youtube, Newspaper, Brain, Image } from 'lucide-react';
import { useAvailableServices } from '../../hooks/useAvailableServices';
import { ApiKey } from '../../types/database';
import { SourceButton } from './SourceButton';
import { SourcesHint } from './SourcesHint';

const sources = [
  { id: 'semanticScholar', name: 'Semantic Scholar', icon: Book, requiresKey: false },
  { id: 'youtube', name: 'YouTube', icon: Youtube, requiresKey: true },
  { id: 'newsapi', name: 'News API', icon: Newspaper, requiresKey: true },
  { id: 'images', name: 'Images', icon: Image, requiresKey: true },
  { id: 'gemini', name: 'Gemini AI', icon: Brain, requiresKey: true },
] as const;

interface SourceSelectorProps {
  selectedSources: string[];
  onToggleSource: (source: string) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({
  selectedSources,
  onToggleSource,
}) => {
  const { availableServices, loading } = useAvailableServices();

  if (loading) {
    return (
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-32 bg-gray-100 animate-pulse rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <SourceButton
            key={source.id}
            source={source}
            selected={selectedSources.includes(source.id)}
            available={!source.requiresKey || availableServices.has(source.id as ApiKey['service'])}
            onToggle={() => onToggleSource(source.id)}
          />
        ))}
      </div>
      <SourcesHint sources={sources} availableServices={availableServices} />
    </div>
  );
};