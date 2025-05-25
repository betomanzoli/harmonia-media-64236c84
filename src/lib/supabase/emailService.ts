
import { supabase } from '@/integrations/supabase/client';

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
