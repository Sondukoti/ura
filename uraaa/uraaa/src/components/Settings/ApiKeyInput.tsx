import React, { useState } from 'react';
import { Key, Save, Trash2 } from 'lucide-react';
import { ApiKey } from '../../types/database';

interface ApiKeyInputProps {
  service: ApiKey['service'];
  name: string;
  description: string;
  currentKey?: ApiKey;
  onSave: (service: ApiKey['service'], key: string) => void;
  onDelete: (service: ApiKey['service']) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  service,
  name,
  description,
  currentKey,
  onSave,
  onDelete,
}) => {
  const [keyValue, setKeyValue] = useState('');
  const [isEditing, setIsEditing] = useState(!currentKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyValue.trim()) {
      onSave(service, keyValue.trim());
      setIsEditing(false);
      setKeyValue('');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Key className="h-5 w-5 mr-2 text-gray-400" />
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {currentKey && !isEditing && (
          <button
            onClick={() => onDelete(service)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder={`Enter your ${name} API key`}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">API key is set</div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};