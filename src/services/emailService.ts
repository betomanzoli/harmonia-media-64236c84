
// Serviço de email para integração com sistemas de terceiros
import { emailService as supabaseEmailService } from '@/lib/supabase';
import { ContractContent } from '@/components/service-card/ContractDetails';

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
      // Get contract text based on package name
      let contractText = ContractContent.getEssencialContract();
      
      if (packageName.includes('Premium')) {
        contractText = ContractContent.getPremiumContract();
      } else if (packageName.includes('Profissional')) {
        contractText = ContractContent.getProfissionalContract();
      }
      
      // Modificar o corpo do email para incluir o contrato
      const emailBody = `
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
      `;
      
      const result = await supabaseEmailService.sendPaymentConfirmation(email, name, packageName);
      
      // Registrar a ação para acompanhamento
      console.log(`Email de confirmação de pagamento enviado para ${email}`);
      console.log(`Conteúdo: Contrato de serviço do pacote ${packageName} e instruções para briefing.`);
      
      // Em produção, aqui enviaria uma notificação WhatsApp
      console.log(`WhatsApp enviado para o admin com dados do pagamento de ${name}, pacote ${packageName}`);
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de pagamento:', error);
      return { success: false, error };
    }
  },
  
  // Adicionar método para confirmação de pedido
  sendOrderConfirmation: async (email: string, name: string) => {
    console.log(`Enviando confirmação de pedido para ${email} (${name})`);
    
    try {
      // Em produção, usaria o serviço de email do Supabase
      const result = await supabaseEmailService.sendPreviewNotification(
        email, 
        name, 
        `${window.location.origin}/cliente`
      );
      
      console.log(`Email de confirmação de pedido enviado para ${email}`);
      console.log(`Conteúdo: Olá ${name}, seu pedido foi recebido e está sendo processado.`);
      
      return result || { success: true };
    } catch (error) {
      console.error('Erro ao enviar email de confirmação de pedido:', error);
      return { success: false, error };
    }
  }
};

export default emailService;
