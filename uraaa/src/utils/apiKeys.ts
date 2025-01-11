import { supabase } from '../lib/supabase';
import { ApiKeyError } from './apiErrors';
import toast from 'react-hot-toast';

export async function getApiKey(service: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('service', service)
      .maybeSingle();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new ApiKeyError(service);
    }

    if (!data?.key_value) {
      throw new ApiKeyError(service);
    }

    return data.key_value;
  } catch (error) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    console.error('Error fetching API key:', error);
    toast.error('Failed to fetch API key. Please try again.');
    throw new ApiKeyError(service);
  }
}