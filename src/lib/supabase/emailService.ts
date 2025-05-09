
import { supabase } from './client';
import { ContractContent } from '@/components/service-card/ContractDetails';

// Helper for creating email content
const createEmailContent = (to: string, subject: string, content: string) => {
  return {
    to,
    subject,
    content
  };
};

// Get contract text based on package name
const getContractText = (packageName: string): string => {
  if (packageName.includes('Premium')) {
    return ContractContent.getPremiumContract();
  } else if (packageName.includes('Profissional')) {
    return ContractContent.getProfissionalContract();
  } else {
    return ContractContent.getEssencialContract();
  }
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
      
      // Get contract text based on package name
      const contractText = getContractText(packageName);
      
      const emailContent = createEmailContent(
        email,
        'Pagamento Confirmado - harmonIA',
        `
          <h1>Olá ${name},</h1>
          <p>Seu pagamento para o pacote "${packageName}" foi confirmado com sucesso!</p>
          <p>O próximo passo é preencher o briefing detalhado para que possamos iniciar a produção 
          da sua música personalizada.</p>
          <p>Abaixo está uma cópia do contrato de prestação de serviços que você aceitou:</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 15px 0; max-height: 300px; overflow-y: auto;">
            ${contractText}
          </div>
          <p>Você pode acessar o briefing a qualquer momento através do seu painel de cliente 
          ou pelo link que enviamos.</p>
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
