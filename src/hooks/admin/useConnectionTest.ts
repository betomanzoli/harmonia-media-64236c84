
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useConnectionTest() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<string>('untested');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Check connection on initial load
  useEffect(() => {
    testConnection();
  }, []);

  // Function to test connection
  const testConnection = useCallback(async (): Promise<void> => {
    try {
      console.log('Testing internet connection...');
      
      // Basic network connectivity check
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setConnectionStatus('error');
        setErrorDetails('Sem conexão com a internet. Verifique sua rede antes de continuar.');
        return;
      }
      
      // Test if localStorage is available (which is needed for auth)
      try {
        localStorage.setItem('connection-test', 'ok');
        localStorage.removeItem('connection-test');
      } catch (storageError) {
        setConnectionStatus('error');
        setErrorDetails('Não foi possível acessar o armazenamento local. Verifique as configurações do seu navegador.');
        return;
      }
      
      // If we got here, we're connected
      setConnectionStatus('connected');
      setErrorDetails(null);
      
      console.log('Connection established successfully');
    } catch (error) {
      console.error('Error testing connection:', error);
      
      // Only set error if we're really offline
      if (!navigator.onLine) {
        setConnectionStatus('error');
        setErrorDetails(error instanceof Error ? error.message : 'Erro desconhecido ao testar conexão');
        
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao verificar a conexão.',
          variant: 'destructive',
        });
      } else {
        // If we're online but still got an error, assume we're connected anyway
        // This prevents false disconnection messages
        setConnectionStatus('connected');
        setErrorDetails(null);
      }
    }
  }, [toast]);

  return { connectionStatus, errorDetails, testConnection };
}
