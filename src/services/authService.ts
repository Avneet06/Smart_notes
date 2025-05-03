import { supabase } from '../lib/supabase';

export const authService = {
  // Register new user
  register: async (email: string, password: string, name: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      if (!user) throw new Error('Registration failed');

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('Login failed');

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
      };
    } catch (error) {
      return null;
    }
  },
};