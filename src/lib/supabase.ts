
// Biblioteca de compatibilidade para uso offline

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
  // Adicionar método from para simulação de consultas de banco de dados
  from: (table: string) => {
    console.log(`Simulando consulta na tabela: ${table}`);
    return {
      select: (columns: string) => {
        console.log(`Simulando seleção de colunas: ${columns}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Simulando filtro WHERE ${column} = ${value}`);
            return {
              single: async () => {
                console.log('Simulando retorno de resultado único');
                return { data: null, error: null };
              }
            };
          },
          order: (column: string, options: any) => {
            console.log(`Simulando ordenação por ${column}`);
            return {
              limit: async (limit: number) => {
                console.log(`Simulando limitação a ${limit} resultados`);
                return { data: [], error: null };
              }
            };
          },
          limit: async (limit: number) => {
            console.log(`Simulando limitação a ${limit} resultados`);
            return { data: [], error: null };
          }
        };
      },
      insert: async (data: any, options?: any) => {
        console.log('Simulando inserção de dados:', data);
        return { data: null, error: null };
      },
      upsert: async (data: any, options?: any) => {
        console.log('Simulando upsert de dados:', data);
        console.log('Opções:', options);
        return { data: null, error: null };
      }
    };
  },
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.log(`Simulando invocação da função ${functionName}:`, options);
      return { data: null, error: null };
    }
  }
};

// Serviço de email offline
export const emailService = {
  sendBriefingConfirmation: async (email: string, name: string) => {
    console.log(`Simulando envio de confirmação de briefing para ${email} (${name})`);
    return { success: true };
  },
  
  sendPreviewNotification: async (email: string, name: string, previewUrl: string) => {
    console.log(`Simulando envio de notificação de prévia para ${email} (${name}): ${previewUrl}`);
    return { success: true };
  },
  
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log(`Simulando envio de confirmação de pagamento para ${email} (${name}): ${packageName}`);
    return { success: true };
  }
};

// Funções auxiliares
export const getSupabaseUrl = () => 'https://offline-mode.example.com';
export const testSupabaseConnection = async () => ({ success: true, message: 'Modo offline ativo' });
export const testAuthSettings = async () => ({ success: true, settings: { offlineMode: true } });
export const securityService = {
  checkSettings: async () => ({ success: true, settings: { offlineMode: true } })
};

export default supabase;
