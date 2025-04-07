
// Serviço simplificado de email para modo offline
import { emailService as supabaseEmailService } from '@/lib/supabase';

// Serviço de email simplificado
const emailService = {
  // Enviar confirmação de briefing
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Enviando confirmação de briefing para ${email} (${name})`);
    return supabaseEmailService.sendBriefingConfirmation(email, name);
  },
  
  // Enviar notificação de prévia
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`Enviando notificação de prévia para ${email} (${name}): ${previewUrl}`);
    return supabaseEmailService.sendPreviewNotification(email, name, previewUrl);
  },
  
  // Enviar confirmação de pagamento
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Enviando confirmação de pagamento para ${email} (${name}): ${packageName}`);
    return supabaseEmailService.sendPaymentConfirmation(email, name, packageName);
  }
};

export default emailService;
