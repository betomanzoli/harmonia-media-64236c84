
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://oiwulrumjuqvszmyltau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pd3VscnVtanVxdnN6bXlsdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDQ2MjksImV4cCI6MjA1OTYyMDYyOX0.VvtorYEZafOLIx_qozAWBtalhQBBw81nPnWPvNlx4bA';

// Initialize the Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'harmonia-preview-auth',
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

// Export the email service
export { emailService } from './supabase/emailService';

// Test connection when the module loads
try {
  console.log('🔌 Cliente Supabase inicializado com nova conexão.');
  
  // Execute a simple query to validate the connection
  // Using Promise.then() to properly handle the response
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error('❌ Erro na conexão Supabase:', error);
      } else {
        // Safely access count property with proper type checking
        console.log(`✅ Conexão Supabase validada: ${data ? 'conectado' : 'sem dados'}`);
      }
    } catch (err) {
      console.error('❌ Erro ao testar conexão Supabase:', err);
    }
  };
  
  // Execute the connection check
  checkConnection();
  
} catch (err) {
  console.error('❌ Erro ao inicializar cliente Supabase:', err);
}
