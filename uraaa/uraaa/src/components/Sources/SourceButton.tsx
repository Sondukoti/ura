import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SourceButtonProps {
  source: {
    id: string;
    name: string;
    icon: LucideIcon;
  };
  selected: boolean;
  available: boolean;
  onToggle: () => void;
}

export const SourceButton: React.FC<SourceButtonProps> = ({
  source,
  selected,
  available,
  onToggle,
}) => {
  const Icon = source.icon;

  return (
    <button
      onClick={available ? onToggle : undefined}
      disabled={!available}
      className={`
        flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${!available 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : selected
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      title={!available ? `${source.name} requires an API key` : undefined}
    >
      <Icon size={16} className="mr-2" />
      {source.name}
    </button>
  );
};