
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://oiwulrumjuqvszmyltau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pd3VscnVtanVxdnN6bXlsdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDQ2MjksImV4cCI6MjA1OTYyMDYyOX0.VvtorYEZafOLIx_qozAWBtalhQBBw81nPnWPvNlx4bA';

// Inicializar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Chave dedicada para sessão administrativa
  },
});

// Utility function to safely get the Supabase URL
export const getSupabaseUrl = () => supabaseUrl;

console.log('🔌 Cliente Supabase inicializado com nova conexão.');
