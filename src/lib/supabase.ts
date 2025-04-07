
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
    
    // Verificar se a URL está correta
    if (!supabaseUrl || !supabaseUrl.includes('https://')) {
      return { 
        connected: false, 
        error: 'URL do Supabase inválida ou não configurada'
      };
    }
    
    // Verificar se a chave anônima está presente
    if (!supabaseAnonKey) {
      return { 
        connected: false, 
        error: 'Chave anônima do Supabase não configurada'
      };
    }
    
    // Teste simples: buscar a versão do Supabase
    try {
      const { data: versionData, error: versionError } = await supabase.rpc('version');
      
      if (versionError) {
        console.error('Erro ao verificar versão do Supabase:', versionError);
        
        // Tentar um teste alternativo com uma tabela
        try {
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
        } catch (tableErr) {
          console.error('Exceção ao testar conexão com tabela:', tableErr);
          return { 
            connected: false, 
            error: tableErr instanceof Error ? tableErr.message : 'Erro ao testar tabela' 
          };
        }
      }
      
      console.log('Conexão com o Supabase bem-sucedida! Versão:', versionData);
      return { connected: true, data: versionData };
      
    } catch (rpcErr) {
      console.error('Exceção ao chamar RPC:', rpcErr);
      
      // Falhou com RPC, tentar com tabela
      try {
        const { data, error } = await supabase.from('system_settings').select('count(*)', { count: 'exact' });
        
        if (error) {
          console.error('Também falhou com tabela:', error);
          return { 
            connected: false, 
            error: `Falha em ambos os métodos: ${error.message}` 
          };
        }
        
        console.log('Conexão bem-sucedida via tabela!');
        return { connected: true, data };
      } catch (finalErr) {
        console.error('Todas as tentativas falharam:', finalErr);
        return { 
          connected: false, 
          error: 'Todas as tentativas de conexão falharam' 
        };
      }
    }
  } catch (err) {
    console.error('Exceção geral ao testar conexão:', err);
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
    
    // Primeiro, verificar se já existe uma sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      return { 
        success: false, 
        error: `Problema com sessão: ${sessionError.message}` 
      };
    }
    
    // Se não houver sessão ativa, testar o serviço de autenticação
    if (!sessionData?.session) {
      try {
        // Apenas verificar se o serviço de autenticação responde
        const { data, error } = await supabase.auth.getUser();
        
        if (error && error.status !== 401) {  // 401 é esperado quando não autenticado
          console.error('Erro ao verificar serviço de autenticação:', error);
          return { 
            success: false, 
            error: `Serviço de autenticação com problema: ${error.message}` 
          };
        }
        
        return { 
          success: true, 
          message: 'Serviço de autenticação está respondendo normalmente' 
        };
      } catch (authErr) {
        console.error('Exceção ao verificar autenticação:', authErr);
        return { 
          success: false, 
          error: 'Falha ao acessar o serviço de autenticação' 
        };
      }
    }
    
    return { 
      success: true, 
      message: 'Usuário autenticado', 
      user: sessionData.session.user.email 
    };
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
