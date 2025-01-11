import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { SearchBar } from '../components/Search/SearchBar';
import { SourceSelector } from '../components/Sources/SourceSelector';
import { ResultsTabs } from '../components/Results/ResultsTabs';
import { FileUpload } from '../components/Upload/FileUpload';
import { useSearch } from '../hooks/useSearch';
import toast from 'react-hot-toast';

export const ResearchDashboard: React.FC = () => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const { results, loading, search } = useSearch();

  const handleSearch = async (query: string) => {
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return;
    }
    await search(query, selectedSources);
  };

  const handleToggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <SearchBar onSearch={handleSearch} />
              <SourceSelector
                selectedSources={selectedSources}
                onToggleSource={handleToggleSource}
              />
            </div>
            <ResultsTabs results={results} loading={loading} />
          </div>
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload Research Files
              </h2>
              <FileUpload />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};