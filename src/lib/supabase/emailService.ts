
/**
 * Email service for Supabase integration
 * Handles sending emails via Supabase Edge Functions
 */

import { supabaseClient } from './index';

/**
 * Send an email using Supabase Edge Functions
 */
export const sendEmail = async (data: {
  to: string;
  subject: string;
  body: string;
  from?: string;
}) => {
  try {
    const { to, subject, body, from = 'no-reply@harmonia.com' } = data;
    
    // Call the email edge function (example implementation - would be connected to a real service)
    const { data: response, error } = await supabaseClient.functions.invoke('send-email', {
      body: { to, subject, body, from }
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
};

/**
 * Send a test email
 */
export const sendTestEmail = async (email: string) => {
  return sendEmail({
    to: email,
    subject: 'Test Email from Harmonia',
    body: 'This is a test email from the Harmonia system.'
  });
};

const emailService = {
  sendEmail,
  sendTestEmail
};

export default emailService;
