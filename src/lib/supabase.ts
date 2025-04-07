
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thqxrpvbnrbdcyjtcgwo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocXhycHZibm5yYmRjeWp0Y2d3byIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEyNTEzMjEzLCJleHAiOjIwMjgwODkyMTN9.C4-pzdZ59Nd0z_jVBTxpPyxX1WD1FLOjEUSNL1eDZR8';

console.warn('⚠️ Usando chaves padrão do Supabase. Configure as variáveis de ambiente para produção.');
console.log('URL Supabase:', supabaseUrl);

// Inicializar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Chave dedicada para sessão administrativa
  },
});

// Adicionando função para diagnóstico de conexão
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com o Supabase...');
    
    // Primeiro teste: verificar conexão básica
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    
    if (versionError) {
      console.error('Erro ao verificar versão do Supabase:', versionError);
      
      // Tentar um teste alternativo se o primeiro falhar
      const { data, error } = await supabase.from('system_settings').select('count(*)', { count: 'exact' });
      
      if (error) {
        console.error('Erro de conexão com o Supabase (tabela):', error);
        return { 
          connected: false, 
          error: `Falha na conexão: ${error.message}. Código: ${error.code}`
        };
      }
      
      console.log('Conexão com tabela system_settings bem-sucedida!');
      return { connected: true, data };
    }
    
    console.log('Conexão com o Supabase bem-sucedida! Versão:', versionData);
    return { connected: true, data: versionData };
  } catch (err) {
    console.error('Exceção ao testar conexão:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

// Testar autenticação específica
export const testAuthSettings = async () => {
  try {
    console.log('Verificando configurações de autenticação...');
    
    // Tentar obter configurações do projeto, isso requer um usuário admin
    // Isso é apenas para diagnóstico e será removido em produção
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Erro ao verificar configurações de autenticação:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exceção ao verificar configurações de autenticação:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

console.log('🔌 Cliente Supabase inicializado.');

// Serviço de email usando Edge Functions do Supabase
export const emailService = {
  async sendBriefingConfirmation(email: string, name: string) {
    try {
      console.log('Enviando confirmação de briefing para:', email);
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Briefing Recebido - harmonIA',
          html: `
            <h1>Olá ${name},</h1>
            <p>Recebemos seu briefing com sucesso! Nossa equipe já está analisando suas informações.</p>
            <p>Entraremos em contato em breve para discutir os próximos passos.</p>
            <p>Atenciosamente,<br>Equipe harmonIA</p>
          `,
        },
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
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Novas Prévias Disponíveis - harmonIA',
          content: `
            <h1>Olá ${name},</h1>
            <p>Suas prévias já estão disponíveis para avaliação!</p>
            <p>Acesse o link abaixo para ouvir e dar seu feedback:</p>
            <p><a href="${previewUrl}" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Ver Prévias</a></p>
            <p>Atenciosamente,<br>Equipe harmonIA</p>
          `,
        },
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
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Pagamento Confirmado - harmonIA',
          content: `
            <h1>Olá ${name},</h1>
            <p>Seu pagamento para o pacote "${packageName}" foi confirmado com sucesso!</p>
            <p>Agora podemos dar início ao seu projeto. Nossa equipe entrará em contato em breve para alinhar os próximos passos.</p>
            <p>Atenciosamente,<br>Equipe harmonIA</p>
          `,
        },
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
