
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

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
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'X-Client-Info': 'supabase-js/2.49.4', // Specify client version explicitly
    },
    fetch: (...args: Parameters<typeof fetch>) => {
      // Add custom fetch handler with enhanced error logging
      return fetch(...args)
        .then(response => {
          if (!response.ok) {
            console.error('Supabase fetch error - non-ok response:', {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
            });
          } else {
            console.log('Supabase fetch success:', {
              url: response.url,
              status: response.status,
            });
          }
          return response;
        })
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
  console.log('🔌 URL:', supabaseUrl);
  console.log('🔌 Navegador em modo privado/incógnito:', !window.localStorage);
  
  // Execute a simple query to validate the connection
  // Using async/await with proper error handling
  const checkConnection = async () => {
    try {
      console.log('🔌 Testando conexão Supabase...');
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
