import React from 'react';
import { Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyzeButtonProps {
  title: string;
  content: string;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ title, content }) => {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    const prompt = `Please analyze the following content:
Title: ${title}

Content:
${content}

Please provide:
1. A detailed analysis
2. Key points and insights
3. Related concepts and implications`;

    navigate('/ai-analysis', { state: { prompt } });
  };

  return (
    <button
      onClick={handleAnalyze}
      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
      title="Analyze with AI"
    >
      <Brain size={16} />
      <span className="text-sm">Analyze</span>
    </button>
  );
};