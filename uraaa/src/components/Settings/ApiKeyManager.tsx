import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { apiKeyService } from '../../lib/apiKeys';
import { ApiKey } from '../../types/database';
import { ApiKeyInput } from './ApiKeyInput';

const API_SERVICES = [
  { id: 'youtube', name: 'YouTube', description: 'Required for video search' },
  { id: 'newsapi', name: 'News API', description: 'Required for news articles' },
  { id: 'serp', name: 'SERP API', description: 'Required for image search' },
  { id: 'gemini', name: 'Gemini AI', description: 'Required for AI analysis' },
] as const;

export const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    const keys = await apiKeyService.getApiKeys();
    setApiKeys(keys);
    setLoading(false);
  };

  const handleSaveKey = async (service: ApiKey['service'], keyValue: string) => {
    if (await apiKeyService.saveApiKey(service, keyValue)) {
      loadApiKeys();
    }
  };

  const handleDeleteKey = async (service: ApiKey['service']) => {
    if (await apiKeyService.deleteApiKey(service)) {
      loadApiKeys();
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      {API_SERVICES.map(({ id, name, description }) => (
        <ApiKeyInput
          key={id}
          service={id as ApiKey['service']}
          name={name}
          description={description}
          currentKey={apiKeys.find(k => k.service === id)}
          onSave={handleSaveKey}
          onDelete={handleDeleteKey}
        />
      ))}
    </div>
  );
};