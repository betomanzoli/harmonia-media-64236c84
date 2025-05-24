
// Biblioteca de compatibilidade para uso offline e online
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration for the project
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Use a dedicated storage key for authentication to avoid conflicts
const AUTH_STORAGE_KEY = 'harmonia-auth';

// Initialize the Supabase client with improved error handling and configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: AUTH_STORAGE_KEY,
  },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      return fetch(...args)
        .then(response => {
          return response;
        })
        .catch(error => {
          // If we're offline, suppress network errors
          if (!navigator.onLine) {
            console.warn('Network request failed while offline:', error);
            // Return mock response for offline mode
            return new Response(JSON.stringify({ 
              data: [], 
              error: { message: 'Application is in offline mode' } 
            }), { 
              status: 200, 
              headers: { 'Content-Type': 'application/json' } 
            });
          }
          
          console.error('Supabase fetch error:', error);
          throw error;
        });
    }
  }
});

// Helper to check if we're in private/incognito mode
export const checkPrivateBrowsing = async (): Promise<boolean> => {
  try {
    // Try to write to local storage
    const testKey = 'test-private-browsing';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    
    // If we're here, localStorage worked
    return false;
  } catch (e) {
    // localStorage failed, probably in private browsing
    return true;
  }
};

// Enhanced auth state cleanup function to fix authentication issues
export const cleanupAuthState = () => {
  try {
    // Remove all auth related items from localStorage with comprehensive cleanup
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || 
          key.includes('sb-') || 
          key.includes('-auth-') ||
          key === AUTH_STORAGE_KEY) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage as well for complete cleanup
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('sb-') || 
            key.includes('-auth-') ||
            key === AUTH_STORAGE_KEY) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log('Auth state cleaned up successfully');
    return true;
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
    return false;
  }
};

// Test for Supabase connection - useful for diagnostics
export const testSupabaseConnection = async () => {
  try {
    if (!navigator.onLine) {
      return { success: false, message: 'Dispositivo offline' };
    }
    
    const { error } = await supabase.from('system_settings').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.warn('Supabase connection test failed:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true, message: 'Conexão com Supabase ativa' };
  } catch (err) {
    console.error('Connection test error:', err);
    return { success: false, message: 'Erro ao testar conexão' };
  }
};

// Auth settings test function
export const testAuthSettings = async () => {
  try {
    // Check if we can communicate with auth system
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { success: false, settings: { onlineMode: navigator.onLine } };
    }
    
    return { 
      success: true, 
      settings: { 
        onlineMode: navigator.onLine,
        sessionExists: !!data.session
      } 
    };
  } catch (err) {
    return { success: false, settings: { onlineMode: navigator.onLine } };
  }
};

// Security service
export const securityService = {
  checkSettings: async () => ({ success: true, settings: { onlineMode: navigator.onLine } })
};

// Offline-compatible email service
export const emailService = {
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Simulando envio de confirmação de briefing para ${email} (${name})`);
    console.log('Em produção, um email seria enviado com os dados do briefing');
    return { success: true };
  },
  
  sendPreviewNotification: async (email: string, name: string, previewUrl: string, message?: string) => {
    console.log(`Simulando envio de notificação de prévia para ${email} (${name}): ${previewUrl}`);
    if (message) {
      console.log(`Mensagem personalizada: ${message}`);
    }
    console.log('Em produção, um email seria enviado com o link para as prévias');
    return { success: true };
  },
  
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Simulando envio de confirmação de pagamento para ${email} (${name}): ${packageName}`);
    console.log('Em produção, um email seria enviado com a confirmação do pagamento');
    return { success: true };
  }
};

// Helper functions
export const getSupabaseUrl = () => supabaseUrl;

export default supabase;
