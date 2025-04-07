
import { createClient } from '@supabase/supabase-js';

// Usar valores de ambiente ou valores fornecidos pelo usuário
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://thqxrpvbnrbdcyjtcgwo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocXhycHZibm5yYmRjeWp0Y2d3byIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEyNTEzMjEzLCJleHAiOjIwMjgwODkyMTN9.C4-pzdZ59Nd0z_jVBTxpPyxX1WD1FLOjEUSNL1eDZR8';

// Verificar se estamos usando valores reais ou padrão
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Usando chaves padrão do Supabase. Configure as variáveis de ambiente para produção.');
}

// Criar o cliente Supabase com os valores disponíveis
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para enviar email através de Edge Function do Supabase
export async function sendEmail(to: string, subject: string, content: string, templateId?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        content,
        templateId
      }
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao chamar a função de email:', error);
    return { success: false, error };
  }
}

// Funções auxiliares para tipos comuns de emails
export const emailService = {
  // Email para quando o cliente envia um briefing
  sendBriefingConfirmation: async (to: string, name: string) => {
    const subject = 'Briefing Recebido - harmonIA';
    const content = `
      <h1>Olá, ${name}!</h1>
      <p>Recebemos seu briefing e estamos ansiosos para trabalhar no seu projeto musical.</p>
      <p>Nossa equipe analisará os detalhes fornecidos e entrará em contato em breve.</p>
      <p>Atenciosamente,<br>Equipe harmonIA</p>
    `;
    return sendEmail(to, subject, content, 'briefing-confirmation');
  },

  // Email para quando novas prévias estão disponíveis
  sendPreviewNotification: async (to: string, name: string, previewLink: string) => {
    const subject = 'Suas Prévias Musicais estão Disponíveis - harmonIA';
    const content = `
      <h1>Olá, ${name}!</h1>
      <p>Suas prévias musicais estão prontas para avaliação!</p>
      <p>Acesse o link abaixo para ouvir e fornecer seu feedback:</p>
      <p><a href="${previewLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Ver Prévias</a></p>
      <p>Atenciosamente,<br>Equipe harmonIA</p>
    `;
    return sendEmail(to, subject, content, 'preview-notification');
  },

  // Email para confirmação de pagamento
  sendPaymentConfirmation: async (to: string, name: string, packageName: string) => {
    const subject = 'Confirmação de Pagamento - harmonIA';
    const content = `
      <h1>Olá, ${name}!</h1>
      <p>Obrigado por escolher a harmonIA! Seu pagamento para o pacote <strong>${packageName}</strong> foi confirmado.</p>
      <p>Em breve iniciaremos o trabalho em seu projeto musical.</p>
      <p>Atenciosamente,<br>Equipe harmonIA</p>
    `;
    return sendEmail(to, subject, content, 'payment-confirmation');
  }
};
