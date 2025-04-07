
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
  }
};

export default supabase;
