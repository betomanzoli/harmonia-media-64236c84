
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw, Wifi } from 'lucide-react';

interface ConnectionAlertProps {
  connectionStatus: string;
  retryConnection: () => Promise<void>;
  toggleDiagnostics: () => void;
}

const ConnectionAlert: React.FC<ConnectionAlertProps> = ({
  connectionStatus,
  retryConnection,
  toggleDiagnostics
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryConnection();
    setIsRetrying(false);
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Problema de conexão</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Não foi possível conectar ao backend. Por favor, verifique sua conexão e tente novamente.</p>
        
        <div className="flex flex-col space-y-2 mt-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
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
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={toggleDiagnostics}
          >
            Ver diagnósticos
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;
