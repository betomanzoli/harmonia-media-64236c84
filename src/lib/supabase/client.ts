
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://oiwulrumjuqvszmyltau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pd3VscnVtanVxdnN6bXlsdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDQ2MjksImV4cCI6MjA1OTYyMDYyOX0.VvtorYEZafOLIx_qozAWBtalhQBBw81nPnWPvNlx4bA';

// Initialize the Supabase client with proxy settings to avoid CORS issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Dedicated key for admin session
  },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      return fetch(...args);
    }
  }
});

// Utility function to safely get the Supabase URL
export const getSupabaseUrl = () => supabaseUrl;

// Test connection when the module loads
(async () => {
  try {
    const { error } = await supabase.from('system_settings').select('count(*)', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    }
  } catch (err) {
    console.error('❌ Exceção ao verificar conexão Supabase:', err);
  }
})();

console.log('🔌 Cliente Supabase inicializado com nova conexão.');
