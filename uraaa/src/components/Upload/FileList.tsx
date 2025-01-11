import React from 'react';
import { File, Loader2 } from 'lucide-react';
import { StoredFile } from '../../types/files';

interface FileListProps {
  files: StoredFile[];
  loading: boolean;
}

export const FileList: React.FC<FileListProps> = ({ files, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {files.map((file) => (
        <li key={file.id} className="py-3 flex items-center space-x-3">
          <File className="h-5 w-5 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};