
// Serviço de email para integração com sistemas de terceiros
import { emailService as supabaseEmailService } from '@/lib/supabase';

// Serviço de email
const emailService = {
  // Enviar confirmação de briefing
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Enviando confirmação de briefing para ${email} (${name})`);
    
    try {
      const result = await supabaseEmailService.sendBriefingConfirmation(email, name);
      
      // Registrar a ação para acompanhamento
      console.log(`Email de confirmação enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, recebemos seu briefing e estamos analisando.`);
      
      // Em produção, aqui enviaria uma notificação WhatsApp
      console.log(`WhatsApp enviado para o admin com os dados do novo cliente ${name}, ${email}`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de briefing:', error);
      return { success: false, error };
    }
  },
  
  // Enviar notificação de prévia
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`Enviando notificação de prévia para ${email} (${name}): ${previewUrl}`);
    
    try {
      const result = await supabaseEmailService.sendPreviewNotification(email, name, previewUrl);
      
      // Registrar a ação para acompanhamento
      console.log(`Email de prévia enviado para ${email}`);
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
    
    try {
      const result = await supabaseEmailService.sendPaymentConfirmation(email, name, packageName);
      
      // Registrar a ação para acompanhamento
      console.log(`Email de confirmação de pagamento enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, recebemos seu pagamento para o pacote ${packageName}.`);
      
      // Em produção, aqui enviaria uma notificação WhatsApp
      console.log(`WhatsApp enviado para o admin com dados do pagamento de ${name}, pacote ${packageName}`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de pagamento:', error);
      return { success: false, error };
    }
  }
};

export default emailService;
