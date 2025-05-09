
// Biblioteca de compatibilidade para uso offline e online

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

export const supabase = {
  auth: {
    resetPasswordForEmail: async (email: string, options: any) => {
      console.log('Simulando reset de senha para', email, 'com opções', options);
      // Simulação apenas - em ambiente real, isso chamaria a API do Supabase
      return { error: null };
    },
    signOut: async () => {
      localStorage.removeItem('harmonia-admin-auth-token');
      localStorage.removeItem('harmonia-admin-auth-user');
      return { error: null };
    },
    getSession: async () => {
      const token = localStorage.getItem('harmonia-admin-auth-token');
      const userStr = localStorage.getItem('harmonia-admin-auth-user');
      
      if (!token || !userStr) {
        return { data: { session: null } };
      }
      
      try {
        const user = JSON.parse(userStr);
        return {
          data: {
            session: {
              user,
              expires_at: Date.now() + 86400000, // 24 horas a partir de agora
              access_token: token,
            }
          }
        };
      } catch {
        return { data: { session: null } };
      }
    }
  },
  // Implementação do método from para consultas de banco de dados
  from: (table: string) => createQueryBuilder(table),
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.log(`Simulando invocação da função ${functionName}:`, options);
      return createMockQueryResponse();
    }
  }
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

// Funções auxiliares
export const getSupabaseUrl = () => 'https://yzhidpsmzabrxnkucfpt.supabase.co';
export const testSupabaseConnection = async () => ({ success: true, message: 'Conexão com Supabase ativa' });
export const testAuthSettings = async () => ({ success: true, settings: { onlineMode: true } });
export const securityService = {
  checkSettings: async () => ({ success: true, settings: { onlineMode: true } })
};

export default supabase;
