
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
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

// Utility function to safely get the Supabase URL
export const getSupabaseUrl = () => supabaseUrl;

// Utility function for validating configuration
const validateConfiguration = () => {
  const issues = [];
  
  if (!supabaseUrl || !supabaseUrl.includes('https://')) {
    issues.push('URL do Supabase inválida ou não configurada');
  }
  
  if (!supabaseAnonKey) {
    issues.push('Chave anônima do Supabase não configurada');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// RPC test for connection checking
const testRpcConnection = async () => {
  try {
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('Erro ao verificar versão do Supabase:', error);
      return { success: false, error, message: error.message };
    }
    
    return { success: true, data, message: 'RPC funcionando corretamente' };
  } catch (err) {
    console.error('Exceção ao chamar RPC:', err);
    return { 
      success: false, 
      error: err, 
      message: err instanceof Error ? err.message : 'Erro desconhecido no teste RPC' 
    };
  }
};

// Table test for connection checking
const testTableConnection = async () => {
  try {
    const { data, error } = await supabase.from('system_settings').select('count(*)', { count: 'exact' });
    
    if (error) {
      console.error('Erro de conexão com o Supabase (tabela):', error);
      return { 
        success: false, 
        error, 
        message: `Falha ao acessar tabela: ${error.message}. Código: ${error.code}` 
      };
    }
    
    return { 
      success: true, 
      data, 
      message: 'Conexão com tabela system_settings bem-sucedida' 
    };
  } catch (err) {
    console.error('Exceção ao testar conexão com tabela:', err);
    return { 
      success: false, 
      error: err, 
      message: err instanceof Error ? err.message : 'Erro ao testar tabela' 
    };
  }
};

// Adicionando função para diagnóstico de conexão
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com o Supabase...');
    
    // Verificar configuração
    const config = validateConfiguration();
    if (!config.isValid) {
      return { 
        connected: false, 
        error: config.issues.join(', ')
      };
    }
    
    // Testar RPC primeiro
    const rpcResult = await testRpcConnection();
    
    if (rpcResult.success) {
      console.log('Conexão RPC com o Supabase bem-sucedida!');
      return { connected: true, data: rpcResult.data };
    }
    
    // Se RPC falhar, testar tabela
    console.log('Teste RPC falhou, tentando teste de tabela...');
    const tableResult = await testTableConnection();
    
    if (tableResult.success) {
      console.log('Conexão com tabela bem-sucedida!');
      return { connected: true, data: tableResult.data };
    }
    
    // Ambos os testes falharam
    return { 
      connected: false, 
      error: `Falha em ambos os métodos: ${rpcResult.message}, ${tableResult.message}` 
    };
    
  } catch (err) {
    console.error('Exceção geral ao testar conexão:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

// Função para verificar se há uma sessão ativa
const checkExistingSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao verificar sessão:', error);
      return { success: false, error: error.message };
    }
    
    if (data?.session) {
      return { 
        success: true, 
        hasSession: true, 
        user: data.session.user.email
      };
    }
    
    return { success: true, hasSession: false };
  } catch (err) {
    console.error('Exceção ao verificar sessão:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

// Função para verificar o serviço de autenticação
const checkAuthService = async () => {
  try {
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
  } catch (err) {
    console.error('Exceção ao verificar autenticação:', err);
    return { 
      success: false, 
      error: 'Falha ao acessar o serviço de autenticação' 
    };
  }
};

// Testar autenticação específica
export const testAuthSettings = async () => {
  try {
    console.log('Verificando configurações de autenticação...');
    
    // Verificar se já existe uma sessão
    const sessionResult = await checkExistingSession();
    
    if (!sessionResult.success) {
      return { 
        success: false, 
        error: `Problema com sessão: ${sessionResult.error}` 
      };
    }
    
    // Se houver sessão ativa, retornar informações do usuário
    if (sessionResult.hasSession) {
      return { 
        success: true, 
        message: 'Usuário autenticado', 
        user: sessionResult.user 
      };
    }
    
    // Se não houver sessão ativa, testar o serviço de autenticação
    return await checkAuthService();
    
  } catch (err) {
    console.error('Exceção ao verificar configurações de autenticação:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

console.log('🔌 Cliente Supabase inicializado.');

// Email Service
const createEmailContent = (to: string, subject: string, content: string) => {
  return {
    to,
    subject,
    content
  };
};

// Serviço de email usando Edge Functions do Supabase
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
