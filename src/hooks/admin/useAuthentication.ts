
import { useToast } from '@/hooks/use-toast';
import { localAuthService } from '@/lib/auth/localAuthService';

interface UseAuthenticationProps {
  testConnection: () => Promise<void>;
  checkSecurityStatus: () => Promise<void>;
  offlineMode?: boolean;
}

export function useAuthentication({ 
  testConnection, 
  checkSecurityStatus,
  offlineMode = false
}: UseAuthenticationProps) {
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com email:", email);
      
      // Check connection first
      await testConnection();
      
      console.log('Executando login local...');
      const { success, error, user } = await localAuthService.login(email, password);
      
      if (!success || !user) {
        console.error("Erro de autenticação:", error);
        return { 
          success: false, 
          error: error || 'Falha na autenticação' 
        };
      }
      
      console.log("Login bem-sucedido:", user);
      
      // Check security settings after login
      checkSecurityStatus();
      
      toast({
        title: 'Login bem-sucedido',
        description: `Bem-vindo, ${user.email}!`,
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
      await localAuthService.logout();
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
