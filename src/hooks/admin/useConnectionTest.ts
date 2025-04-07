
import { useToast } from '@/hooks/use-toast';
import { testSupabaseConnection } from '@/lib/supabase';
import { ConnectionStatus } from '@/types/admin-auth';

interface UseConnectionTestProps {
  setIsLoading: (loading: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  checkSecurityStatus: () => Promise<void>;
  offlineMode?: boolean;
}

export function useConnectionTest({
  setIsLoading,
  setConnectionStatus,
  checkSecurityStatus,
  offlineMode = false
}: UseConnectionTestProps) {
  const { toast } = useToast();

  // Function to test connection to Supabase
  const testConnection = async (): Promise<void> => {
    if (offlineMode) {
      // In offline mode, simulate a successful connection
      setConnectionStatus({
        tested: true,
        connected: true,
        details: { offlineMode: true },
        networkOnline: true,
        endpointStatus: 'offline_mode'
      });
      return;
    }
    
    try {
      console.log('Testando conexão com o Supabase...');
      
      // Verificar conectividade básica da rede
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setConnectionStatus({
          tested: true,
          connected: false,
          error: 'Sem conexão com a internet. Verifique sua rede antes de continuar.',
          endpointStatus: 'offline'
        });
        return;
      }
      
      const result = await testSupabaseConnection();
      console.log('Resultado do teste de conexão:', result);
      
      setConnectionStatus({
        tested: true,
        connected: result.connected,
        error: result.error,
        details: result,
        endpointStatus: result.endpointStatus || 'unknown'
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
          : 'Erro desconhecido ao testar conexão',
        endpointStatus: 'error'
      });
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao verificar a conexão com o Supabase.',
        variant: 'destructive',
      });
    }
  };

  return { testConnection };
}
