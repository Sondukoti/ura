import { useState, useCallback, useEffect } from 'react';
import { analyzeWithGemini } from '../services/gemini';
import { GeminiMessage } from '../services/gemini/types';
import toast from 'react-hot-toast';
import { ApiKeyError, ApiRequestError } from '../utils/apiErrors';

export function useGeminiChat(initialPrompt?: string) {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      const response = await analyzeWithGemini(content);
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content },
        { role: 'model', content: response }
      ]);
    } catch (error) {
      if (error instanceof ApiKeyError) {
        toast.error('Please configure your Gemini API key in settings');
      } else if (error instanceof ApiRequestError && error.status === 401) {
        toast.error('Invalid API key. Please check your Gemini API key in settings');
      } else {
        toast.error('Failed to get response from AI');
        console.error('Gemini chat error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage]);

  return {
    messages,
    loading,
    sendMessage
  };
}