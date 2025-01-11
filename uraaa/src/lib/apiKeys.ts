import { supabase } from './supabase';
import { ApiKey } from '../types/database';
import toast from 'react-hot-toast';

export const apiKeyService = {
  async getApiKeys() {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('service');
    
    if (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Error fetching API keys');
      return [];
    }
    
    return apiKeys as ApiKey[];
  },

  async saveApiKey(service: ApiKey['service'], keyValue: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to save API keys');
      return false;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert(
          {
            user_id: user.id,
            service,
            key_value: keyValue,
            last_used: new Date().toISOString()
          },
          {
            onConflict: 'user_id,service',
            ignoreDuplicates: false
          }
        );

      if (error) {
        throw error;
      }

      toast.success('API key saved successfully');
      return true;
    } catch (error) {
      console.error('API key save error:', error);
      toast.error('Error saving API key');
      return false;
    }
  },

  async deleteApiKey(service: ApiKey['service']) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to delete API keys');
      return false;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .match({ 
          user_id: user.id,
          service 
        });

      if (error) {
        throw error;
      }

      toast.success('API key deleted successfully');
      return true;
    } catch (error) {
      console.error('API key delete error:', error);
      toast.error('Error deleting API key');
      return false;
    }
  }
};