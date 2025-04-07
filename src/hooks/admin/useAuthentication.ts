
import { useToast } from '@/hooks/use-toast';
import { supabase, testSupabaseConnection } from '@/lib/supabase';

interface UseAuthenticationProps {
  testConnection: () => Promise<void>;
  checkSecurityStatus: () => Promise<void>;
}

export function useAuthentication({ 
  testConnection, 
  checkSecurityStatus 
}: UseAuthenticationProps) {
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com email:", email);
      
      // Check connection first
      await testConnection();
      
      const connectionStatus = await testSupabaseConnection();
      if (!connectionStatus.connected) {
        return { 
          success: false, 
          error: `Problema de conexão com o Supabase: ${connectionStatus.error}` 
        };
      }
      
      console.log('Executando login com Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro de autenticação:", error);
        return { 
          success: false, 
          error: error.message || 'Falha na autenticação' 
        };
      }
      
      console.log("Login bem-sucedido:", data.user);
      
      // Check security settings after login
      checkSecurityStatus();
      
      toast({
        title: 'Login bem-sucedido',
        description: `Bem-vindo, ${data.user?.email}!`,
      });
      
      return { success: true };
    } catch (err: any) {
      console.error("Exceção durante login:", err);
      return { 
        success: false, 
        error: err.message || 'Ocorreu um erro durante o login' 
      };
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logout',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      toast({
        title: 'Erro',
        description: 'Falha ao desconectar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return {
    login,
    logout
  };
}
