
/**
 * Main export file for Supabase services
 */

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key must be defined in environment variables');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  return supabaseClient.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabaseClient.auth.signOut();
};

export const getSession = async () => {
  return supabaseClient.auth.getSession();
};

export const getUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return data.user;
};

// Export emailService
export { default as emailService } from './emailService';

// Export the client as default and also as named export
export { supabaseClient as supabase };
export default supabaseClient;
