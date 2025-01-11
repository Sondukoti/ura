import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 
          onClick={() => navigate('/')}
          className="text-xl font-semibold text-gray-900 cursor-pointer"
        >
          Research Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{authState.user?.email}</span>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={signOut}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};