import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { GeminiMessage } from '../../services/gemini/types';

interface GeminiChatProps {
  context?: string;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ context }) => {
  const { messages, loading, sendMessage } = useGeminiChat(context);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const renderMessage = (message: GeminiMessage) => {
    const isUser = message.role === 'user';
    return (
      <div
        className={`flex ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            isUser
              ? 'bg-indigo-100 text-gray-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="animate-fade-in">
            {renderMessage(message)}
          </div>
        ))}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};