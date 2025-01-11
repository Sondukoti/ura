import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { StoredFile } from '../types/files';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { fileStorage } from '../utils/fileStorage';

export function useFileUpload() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();

  const uploadFile = useCallback(async (file: File) => {
    if (!authState.user) {
      toast.error('Please sign in to upload files');
      return;
    }

    setLoading(true);
    try {
      const storedFile = await fileStorage.uploadFile(file);
      setFiles(prev => [...prev, storedFile]);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  }, [authState.user]);

  return { files, loading, uploadFile };
}