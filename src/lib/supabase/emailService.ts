
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

/**
 * Send briefing confirmation email
 */
export const sendBriefingConfirmation = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: 'Confirmação de Briefing - Harmonia',
    body: `Olá ${name},\n\nAgradecemos pelo preenchimento do briefing. Em breve entraremos em contato para prosseguir com seu projeto.\n\nAtenciosamente,\nEquipe Harmonia`
  });
};

/**
 * Send preview notification email
 */
export const sendPreviewNotification = async (email: string, name: string, previewUrl: string) => {
  return sendEmail({
    to: email,
    subject: 'Novas Prévias Disponíveis - Harmonia',
    body: `Olá ${name},\n\nTemos o prazer de informar que novas prévias do seu projeto estão disponíveis para visualização.\n\nAcesse: ${previewUrl}\n\nAtenciosamente,\nEquipe Harmonia`
  });
};

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmation = async (email: string, name: string, packageName: string) => {
  return sendEmail({
    to: email,
    subject: 'Confirmação de Pagamento - Harmonia',
    body: `Olá ${name},\n\nConfirmamos o recebimento do pagamento para o pacote ${packageName}. Estamos preparando tudo para começar seu projeto.\n\nAtenciosamente,\nEquipe Harmonia`
  });
};

const emailService = {
  sendEmail,
  sendTestEmail,
  sendBriefingConfirmation,
  sendPreviewNotification,
  sendPaymentConfirmation
};

export default emailService;
