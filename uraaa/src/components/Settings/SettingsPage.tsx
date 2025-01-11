import React from 'react';
import { Header } from '../Layout/Header';
import { ApiKeyManager } from './ApiKeyManager';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <SettingsIcon className="h-6 w-6 mr-2" />
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your API keys and preferences
            </p>
          </div>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Keys</h2>
            <ApiKeyManager />
          </section>
        </div>
      </main>
    </div>
  );
};