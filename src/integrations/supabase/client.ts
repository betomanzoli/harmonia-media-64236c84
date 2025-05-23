
/**
 * Supabase client configuration
 */

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key must be defined in environment variables');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
