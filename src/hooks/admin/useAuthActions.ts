
import { useToast } from '@/hooks/use-toast';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { securityService } from '@/lib/supabase/securityConfig';
import { ConnectionStatus, SecurityStatus } from '@/types/admin-auth';

interface UseAuthActionsProps {
  setIsLoading: (loading: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSecurityStatus: (status: SecurityStatus) => void;
}

export function useAuthActions({
  setIsLoading,
  setConnectionStatus,
  setSecurityStatus
}: UseAuthActionsProps) {
  const { toast } = useToast();

  // Function to test connection to Supabase
  const testConnection = async (): Promise<void> => {
    try {
      console.log('Testando conexão com o Supabase...');
      
      // Verificar conectividade básica da rede
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setConnectionStatus({
          tested: true,
          connected: false,
          error: 'Sem conexão com a internet. Verifique sua rede antes de continuar.'
        });
        return;
      }
      
      const result = await testSupabaseConnection();
      console.log('Resultado do teste de conexão:', result);
      
      setConnectionStatus({
        tested: true,
        connected: result.connected,
        error: result.error,
        details: result
      });
      
      if (!result.connected) {
        console.error('Erro de conexão detalhado:', result);
        toast({
          title: 'Problema de conexão',
          description: `Não foi possível conectar ao Supabase: ${result.error}`,
          variant: 'destructive',
        });
      } else {
        console.log('Conexão com Supabase estabelecida com sucesso');
        // If connected, check security status
        checkSecurityStatus();
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus({
        tested: true,
        connected: false,
        error: error instanceof Error 
          ? `Erro ao testar conexão: ${error.message}` 
          : 'Erro desconhecido ao testar conexão'
      });
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao verificar a conexão com o Supabase.',
        variant: 'destructive',
      });
    }
  };
  
  // Function to check security status
  const checkSecurityStatus = async () => {
    try {
      const result = await securityService.validateSecurity();
      
      setSecurityStatus({
        checked: true,
        hasIssues: !result.success,
        details: result
      });
      
      if (!result.success) {
        console.warn('Problemas de segurança detectados:', result.error);
        toast({
          title: 'Alerta de Segurança',
          description: 'Foram detectados problemas de segurança no Supabase. Acesse as configurações de segurança para resolver.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status de segurança:', error);
      setSecurityStatus({
        checked: true,
        hasIssues: true,
        details: {
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      });
    }
  };

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
    logout,
    testConnection,
    checkSecurityStatus
  };
}
