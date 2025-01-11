import React, { useState } from 'react';
import { SearchResult } from '../../types/api';
import { ScholarResults } from './ScholarResults';
import { VideoResults } from './VideoResults';
import { NewsResults } from './NewsResults';
import { ImageResults } from './ImageResults';
import { GeminiResults } from './GeminiResults';
import { Book, Youtube, Newspaper, Brain, Image } from 'lucide-react';

interface ResultsTabsProps {
  results: SearchResult[];
  loading: boolean;
}

const tabs = [
  { id: 'semanticScholar', label: 'Scholar', icon: Book },
  { id: 'youtube', label: 'Videos', icon: Youtube },
  { id: 'newsapi', label: 'News', icon: Newspaper },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'gemini', label: 'AI Analysis', icon: Brain },
] as const;

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ results, loading }) => {
  const [activeTab, setActiveTab] = useState<string>('semanticScholar');

  const filteredResults = results.filter(result => result.source === activeTab);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const hasResults = results.some(r => r.source === id);
            
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                disabled={!hasResults && !loading}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium text-center
                  border-b-2 transition-colors flex items-center justify-center gap-2
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600'
                    : hasResults
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
                {hasResults && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {results.filter(r => r.source === id).length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="grid gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-32" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'semanticScholar' && <ScholarResults results={filteredResults} />}
            {activeTab === 'youtube' && <VideoResults results={filteredResults} />}
            {activeTab === 'newsapi' && <NewsResults results={filteredResults} />}
            {activeTab === 'images' && <ImageResults results={filteredResults} />}
            {activeTab === 'gemini' && <GeminiResults results={filteredResults} />}
          </>
        )}
      </div>
    </div>
  );
};