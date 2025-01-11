import React from 'react';
import { ApiKey } from '../../types/database';
import { Link } from 'react-router-dom';

interface SourcesHintProps {
  sources: Array<{
    id: string;
    name: string;
    requiresKey: boolean;
  }>;
  availableServices: Set<ApiKey['service']>;
}

export const SourcesHint: React.FC<SourcesHintProps> = ({ sources, availableServices }) => {
  const missingKeys = sources.some(
    s => s.requiresKey && !availableServices.has(s.id as ApiKey['service'])
  );

  if (!missingKeys) return null;

  return (
    <p className="text-sm text-gray-500">
      Some features require API keys. Configure them in{' '}
      <Link to="/settings" className="text-indigo-600 hover:text-indigo-500">
        Settings
      </Link>
    </p>
  );
};