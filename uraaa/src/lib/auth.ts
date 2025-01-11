import { supabase } from './supabase';
import toast from 'react-hot-toast';

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  async signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Registration successful! Please check your email.');
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out!');
    } catch (error: any) {
      toast.error(error.message);
    }
  }
};