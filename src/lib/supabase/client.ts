
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Initialize the Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Dedicated key for admin session
  },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      return fetch(...args).catch(error => {
        console.error('Supabase fetch error:', error);
        throw error;
      });
    }
  }
});

// Utility function to safely get the Supabase URL
export const getSupabaseUrl = () => supabaseUrl;

// Test connection when the module loads
try {
  console.log('🔌 Cliente Supabase inicializado com nova conexão.');
} catch (err) {
  console.error('❌ Erro ao inicializar cliente Supabase:', err);
}
