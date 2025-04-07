
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '@/types/admin-auth';

interface ConnectionAlertProps {
  connectionStatus: ConnectionStatus;
  onRetry: () => Promise<void>;
  isLoading: boolean;
}

const ConnectionAlert: React.FC<ConnectionAlertProps> = ({
  connectionStatus,
  onRetry,
  isLoading
}) => {
  if (!connectionStatus.tested || connectionStatus.connected) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Problema de conexão</AlertTitle>
      <AlertDescription>
        Não foi possível conectar ao backend: {connectionStatus.error}
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 w-full"
          onClick={onRetry}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;
