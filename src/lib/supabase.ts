
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://oiwulrumjuqvszmyltau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pd3VscnVtanVxdnN6bXlsdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDQ2MjksImV4cCI6MjA1OTYyMDYyOX0.VvtorYEZafOLIx_qozAWBtalhQBBw81nPnWPvNlx4bA';

// Initialize the Supabase client with improved error handling and incognito browser compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'harmonia-preview-auth',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.49.4', // Specify client version explicitly
    },
    fetch: (...args: Parameters<typeof fetch>) => {
      // Add custom fetch handler with enhanced error logging
      return fetch(...args)
        .catch(error => {
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
  // Using async/await with proper error handling
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*', { head: true })
        .limit(1);
        
      if (error) {
        console.error('❌ Erro na conexão Supabase:', error);
      } else {
        console.log(`✅ Conexão Supabase validada: ${data !== null ? 'conectado' : 'sem dados'}`);
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
