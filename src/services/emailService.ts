
// Serviço simplificado de email para modo offline
import { emailService as supabaseEmailService } from '@/lib/supabase';

// Serviço de email simplificado
const emailService = {
  // Enviar confirmação de briefing
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Enviando confirmação de briefing para ${email} (${name})`);
    
    // Modo offline/demonstração - simular envio de email
    try {
      const result = await supabaseEmailService.sendBriefingConfirmation(email, name);
      
      // Simulação de email sendo enviado manualmente pelo administrador
      console.log(`Email de confirmação seria enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, recebemos seu briefing e estamos analisando.`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de briefing:', error);
      return { success: false, error };
    }
  },
  
  // Enviar notificação de prévia
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`Enviando notificação de prévia para ${email} (${name}): ${previewUrl}`);
    
    // Modo offline/demonstração - simular envio de email
    try {
      const result = await supabaseEmailService.sendPreviewNotification(email, name, previewUrl);
      
      // Simulação de email sendo enviado manualmente pelo administrador
      console.log(`Email de prévia seria enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, sua prévia está disponível em ${previewUrl}`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de prévia:', error);
      return { success: false, error };
    }
  },
  
  // Enviar confirmação de pagamento
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Enviando confirmação de pagamento para ${email} (${name}): ${packageName}`);
    
    // Modo offline/demonstração - simular envio de email
    try {
      const result = await supabaseEmailService.sendPaymentConfirmation(email, name, packageName);
      
      // Simulação de email sendo enviado manualmente pelo administrador
      console.log(`Email de confirmação de pagamento seria enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, recebemos seu pagamento para o pacote ${packageName}.`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de pagamento:', error);
      return { success: false, error };
    }
  }
};

export default emailService;
