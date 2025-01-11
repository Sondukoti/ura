import { supabase } from './supabase';
import { Profile } from '../types/database';
import toast from 'react-hot-toast';

export const profileService = {
  async getProfile() {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) {
      toast.error('Error fetching profile');
      return null;
    }
    
    return profile as Profile;
  },

  async updateProfile(updates: Partial<Profile>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', supabase.auth.getUser().then(({ data }) => data.user?.id));

    if (error) {
      toast.error('Error updating profile');
      return false;
    }

    toast.success('Profile updated successfully');
    return true;
  }
};