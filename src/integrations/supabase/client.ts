
import { createClient } from '@supabase/supabase-js';

// Get Supabase URLs and keys from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
