import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { GeminiChat } from '../components/AI/GeminiChat';
import { Brain } from 'lucide-react';
import { useGeminiChat } from '../hooks/useGeminiChat';

export const AIAnalysisPage: React.FC = () => {
  const location = useLocation();
  const prompt = location.state?.prompt;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>
          </div>
          <p className="text-gray-600">
            Ask questions or get AI analysis on any topic
          </p>
        </div>
        <GeminiChat context={prompt} />
      </main>
    </div>
  );
};