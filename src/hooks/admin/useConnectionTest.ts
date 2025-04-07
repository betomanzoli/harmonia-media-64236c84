
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useConnectionTest() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState('untested');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Function to test connection
  const testConnection = useCallback(async (): Promise<void> => {
    try {
      console.log('Testing internet connection...');
      
      // Basic network connectivity check
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setConnectionStatus('error');
        setErrorDetails('No internet connection. Please check your network before continuing.');
        return;
      }
      
      // In our local auth implementation, we're always connected if we have internet
      setConnectionStatus('connected');
      setErrorDetails(null);
      
      console.log('Local connection established successfully');
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error testing connection');
      
      toast({
        title: 'Error',
        description: 'An error occurred while checking the connection.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return { connectionStatus, errorDetails, testConnection };
}
