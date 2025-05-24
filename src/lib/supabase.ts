
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivueqxyuflxsiecqvmgt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Email service for Supabase
export const emailService = {
  // Send briefing confirmation email
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`[MOCK] Sending briefing confirmation to ${email}`);
    // In a real implementation, this would call a Supabase Edge Function or similar
    return { success: true };
  },
  
  // Send preview notification email
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`[MOCK] Sending preview notification to ${email} with URL: ${previewUrl}`);
    // In a real implementation, this would call a Supabase Edge Function or similar
    return { success: true };
  },
  
  // Send payment confirmation email
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`[MOCK] Sending payment confirmation to ${email} for package: ${packageName}`);
    // In a real implementation, this would call a Supabase Edge Function or similar
    return { success: true };
  }
};

export default supabase;
