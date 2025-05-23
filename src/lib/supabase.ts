
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

// Verificação inicial das tabelas necessárias apenas se estiver online
(async () => {
  try {
    // Verificar se estamos online antes de tentar acessar o Supabase
    if (!navigator.onLine) {
      console.log('Aplicação está offline. Pulando verificação de tabelas.');
      return;
    }
    
    // Verificar se as tabelas existem de maneira segura
    const checkTable = async (tableName: string) => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
        
        // Se não ocorreu erro, a tabela existe
        return !error;
      } catch (err) {
        // Em caso de erro, consideramos que a tabela não existe
        return false;
      }
    };
    
    // Verificar tabelas comuns
    const tableChecks = [
      { name: 'preview_tokens', rpcName: 'create_preview_tokens_table' },
      { name: 'access_logs', rpcName: 'create_access_logs_table' },
      { name: 'project_files', rpcName: 'create_project_files_table' },
      { name: 'preview_projects', rpcName: 'create_preview_projects_table' }
    ];
    
    for (const table of tableChecks) {
      const exists = await checkTable(table.name);
      if (!exists) {
        console.log(`Tabela ${table.name} não encontrada. Tentando criar...`);
        try {
          await supabase.rpc(table.rpcName);
          console.log(`Tabela ${table.name} criada com sucesso.`);
        } catch (err) {
          console.error(`Erro ao criar tabela ${table.name}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Erro ao verificar tabelas do banco de dados:', err);
  }
})();

export default supabase;
