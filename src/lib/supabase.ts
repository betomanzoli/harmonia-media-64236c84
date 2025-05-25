
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Single Supabase client instance to prevent multiple GoTrueClient warnings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storageKey: 'harmonia-auth'
  },
  global: {
    headers: {
      'X-Client-Info': 'harmonia-music@1.0.0'
    }
  }
});

// Enhanced email service with all required methods
export const emailService = {
  sendEmail: async (to: string, subject: string, content: string = '') => {
    console.log('Email would be sent:', { to, subject, content });
    return Promise.resolve({ success: true });
  },
  
  sendBriefingConfirmation: async (to: string, clientName: string, briefingId: string = '') => {
    console.log('Briefing confirmation email would be sent:', { to, clientName, briefingId });
    return Promise.resolve({ success: true });
  },
  
  sendPreviewNotification: async (to: string, clientName: string, previewUrl: string) => {
    console.log('Preview notification email would be sent:', { to, clientName, previewUrl });
    return Promise.resolve({ success: true });
  },
  
  sendPaymentConfirmation: async (to: string, clientName: string, amount: string) => {
    console.log('Payment confirmation email would be sent:', { to, clientName, amount });
    return Promise.resolve({ success: true });
  }
};

export const getSupabaseUrl = () => supabaseUrl;
