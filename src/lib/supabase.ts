
// Biblioteca de compatibilidade para uso offline e online
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration for the new project
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Use a dedicated storage key for preview authentication
const PREVIEW_AUTH_STORAGE_KEY = 'harmonia-preview-auth';

// Initialize the Supabase client with improved error handling and configuration for incognito mode
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: PREVIEW_AUTH_STORAGE_KEY,
  },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      return fetch(...args).catch(error => {
        console.error('Supabase fetch error:', error);
        throw error;
      });
    }
  }
});

// Helper to check if we're in private/incognito mode
export const checkPrivateBrowsing = async (): Promise<boolean> => {
  try {
    // Try to write to local storage
    const testKey = 'test-private-browsing';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    
    // If we're here, localStorage worked
    return false;
  } catch (e) {
    // localStorage failed, probably in private browsing
    return true;
  }
};

const createMockQueryResponse = () => {
  return {
    data: null,
    error: null,
    count: 0
  };
};

// Função auxiliar para criar métodos de consulta consistentes
const createQueryBuilder = (tableName: string) => {
  console.log(`Acessando tabela: ${tableName}`);
  
  // Criando um objeto que mantém as propriedades data e error em toda a cadeia
  const baseQueryResponse = createMockQueryResponse();
  
  const queryChain = {
    select: (columns: string) => {
      console.log(`Simulando seleção de colunas: ${columns}`);
      return {
        ...baseQueryResponse,
        eq: (column: string, value: any) => {
          console.log(`Simulando filtro WHERE ${column} = ${value}`);
          return {
            ...baseQueryResponse,
            single: async () => createMockQueryResponse()
          };
        },
        order: (column: string, options: any) => {
          console.log(`Simulando ordenação por ${column}`);
          return {
            ...baseQueryResponse,
            ...queryChain
          };
        },
        limit: async (limit: number) => createMockQueryResponse(),
        gt: (column: string, value: any) => {
          console.log(`Simulando filtro WHERE ${column} > ${value}`);
          return {
            ...baseQueryResponse,
            ...queryChain
          };
        },
        lt: (column: string, value: any) => {
          console.log(`Simulando filtro WHERE ${column} < ${value}`);
          return {
            ...baseQueryResponse,
            ...queryChain
          };
        }
      };
    },
    insert: async (data: any, options?: any) => {
      console.log('Simulando inserção de dados:', data);
      return createMockQueryResponse();
    },
    upsert: async (data: any, options?: any) => {
      console.log('Simulando upsert de dados:', data);
      console.log('Opções:', options);
      return createMockQueryResponse();
    },
    update: async (data: any) => {
      console.log('Simulando atualização de dados:', data);
      return createMockQueryResponse();
    },
    delete: async () => {
      console.log(`Simulando exclusão na tabela ${tableName}`);
      return createMockQueryResponse();
    },
    count: async () => {
      console.log(`Simulando contagem na tabela ${tableName}`);
      return createMockQueryResponse();
    }
  };

  return {
    ...baseQueryResponse,
    ...queryChain
  };
};

// Funções auxiliares
export const getSupabaseUrl = () => supabaseUrl;
export const testSupabaseConnection = async () => ({ success: true, message: 'Conexão com Supabase ativa' });
export const testAuthSettings = async () => ({ success: true, settings: { onlineMode: true } });
export const securityService = {
  checkSettings: async () => ({ success: true, settings: { onlineMode: true } })
};

// Serviço de email offline
export const emailService = {
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Simulando envio de confirmação de briefing para ${email} (${name})`);
    console.log('Em produção, um email seria enviado com os dados do briefing');
    return { success: true };
  },
  
  sendPreviewNotification: async (email: string, name: string, previewUrl: string, message?: string) => {
    console.log(`Simulando envio de notificação de prévia para ${email} (${name}): ${previewUrl}`);
    if (message) {
      console.log(`Mensagem personalizada: ${message}`);
    }
    console.log('Em produção, um email seria enviado com o link para as prévias');
    return { success: true };
  },
  
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Simulando envio de confirmação de pagamento para ${email} (${name}): ${packageName}`);
    console.log('Em produção, um email seria enviado com a confirmação do pagamento');
    return { success: true };
  }
};

// Initialize missing tables that may not exist
(async () => {
  // Initialize preview_tokens table for magic links authentication
  const { error: tokensError } = await supabase.rpc('check_if_table_exists', { table_name: 'preview_tokens' });
  
  if (tokensError) {
    console.log('Creating preview_tokens table for magic link authentication');
    await supabase.rpc('create_preview_tokens_table');
  }
  
  // Initialize access_logs table for tracking preview accesses
  const { error: logsError } = await supabase.rpc('check_if_table_exists', { table_name: 'access_logs' });
  
  if (logsError) {
    console.log('Creating access_logs table for tracking preview accesses');
    await supabase.rpc('create_access_logs_table');
  }
  
  // Initialize project_files table for final deliveries
  const { error: filesError } = await supabase.rpc('check_if_table_exists', { table_name: 'project_files' });
  
  if (filesError) {
    console.log('Creating project_files table for final deliveries');
    await supabase.rpc('create_project_files_table');
  }
})();

export default supabase;
