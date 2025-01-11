import { supabase } from '../lib/supabase';
import { StoredFile } from '../types/files';

export const fileStorage = {
  async uploadFile(file: File): Promise<StoredFile> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('research-files')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error('Failed to upload file');
    }

    const { data: fileData, error: insertError } = await supabase
      .from('files')
      .insert({
        name: file.name,
        path: uploadData.path,
        size: file.size,
        type: file.type,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('Failed to save file metadata');
    }

    return fileData as StoredFile;
  },

  async getFiles(): Promise<StoredFile[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch files');
    }

    return data as StoredFile[];
  },

  getFileUrl(path: string): string {
    const { data } = supabase.storage
      .from('research-files')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
};