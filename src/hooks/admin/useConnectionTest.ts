
import { useToast } from '@/hooks/use-toast';
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

  // Function to test connection - now simplified without Supabase
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
      console.log('Testando conexão à internet...');
      
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
      
      // In our local auth implementation, we're always connected if we have internet
      setConnectionStatus({
        tested: true,
        connected: true,
        details: { localAuth: true },
        networkOnline: true,
        endpointStatus: 'available'
      });
      
      console.log('Conexão local estabelecida com sucesso');
      // If connected, check security status
      checkSecurityStatus();
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
        description: 'Ocorreu um erro ao verificar a conexão.',
        variant: 'destructive',
      });
    }
  };

  return { testConnection };
}
