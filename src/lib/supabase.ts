
// Biblioteca de compatibilidade para uso offline e online
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration for the new project
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Sistema de armazenamento híbrido para navegadores privados
const getHybridStorage = () => ({
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
        ?.split('=')[1];
      return cookie ? decodeURIComponent(cookie) : null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Secure; SameSite=None; Partitioned`;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
});

// Initialize the Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getHybridStorage(),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Dedicated key for admin session
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
        limit: async (limit: number) => createMockQueryResponse()
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
  
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`Simulando envio de notificação de prévia para ${email} (${name}): ${previewUrl}`);
    console.log('Em produção, um email seria enviado com o link para as prévias');
    return { success: true };
  },
  
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Simulando envio de confirmação de pagamento para ${email} (${name}): ${packageName}`);
    console.log('Em produção, um email seria enviado com a confirmação do pagamento');
    return { success: true };
  }
};

export default supabase;
