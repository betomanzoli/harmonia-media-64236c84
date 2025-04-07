
import { supabase } from './client';

// Helper for creating email content
const createEmailContent = (to: string, subject: string, content: string) => {
  return {
    to,
    subject,
    content
  };
};

// Email Service using Supabase Edge Functions
export const emailService = {
  async sendBriefingConfirmation(email: string, name: string) {
    try {
      console.log('Enviando confirmação de briefing para:', email);
      
      const emailContent = createEmailContent(
        email,
        'Briefing Recebido - harmonIA',
        `
          <h1>Olá ${name},</h1>
          <p>Recebemos seu briefing com sucesso! Nossa equipe já está analisando suas informações.</p>
          <p>Entraremos em contato em breve para discutir os próximos passos.</p>
          <p>Atenciosamente,<br>Equipe harmonIA</p>
        `
      );
      
      const response = await supabase.functions.invoke('send-email', {
        body: emailContent
      });
      
      console.log('Resposta da função send-email:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Falha ao enviar email');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar confirmação de briefing:', error);
      return { success: false, error };
    }
  },
  
  async sendPreviewNotification(email: string, name: string, previewUrl: string) {
    try {
      console.log('Enviando notificação de prévia para:', email);
      
      const emailContent = createEmailContent(
        email,
        'Novas Prévias Disponíveis - harmonIA',
        `
          <h1>Olá ${name},</h1>
          <p>Suas prévias já estão disponíveis para avaliação!</p>
          <p>Acesse o link abaixo para ouvir e dar seu feedback:</p>
          <p><a href="${previewUrl}" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Ver Prévias</a></p>
          <p>Atenciosamente,<br>Equipe harmonIA</p>
        `
      );
      
      const response = await supabase.functions.invoke('send-email', {
        body: emailContent
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Falha ao enviar email');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar notificação de prévia:', error);
      return { success: false, error };
    }
  },
  
  async sendPaymentConfirmation(email: string, name: string, packageName: string) {
    try {
      console.log('Enviando confirmação de pagamento para:', email);
      
      const emailContent = createEmailContent(
        email,
        'Pagamento Confirmado - harmonIA',
        `
          <h1>Olá ${name},</h1>
          <p>Seu pagamento para o pacote "${packageName}" foi confirmado com sucesso!</p>
          <p>Agora podemos dar início ao seu projeto. Nossa equipe entrará em contato em breve para alinhar os próximos passos.</p>
          <p>Atenciosamente,<br>Equipe harmonIA</p>
        `
      );
      
      const response = await supabase.functions.invoke('send-email', {
        body: emailContent
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Falha ao enviar email');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar confirmação de pagamento:', error);
      return { success: false, error };
    }
  },
};
