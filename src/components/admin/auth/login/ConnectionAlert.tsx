
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
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

  // Verifica se há conexão com a internet
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Problema de conexão</AlertTitle>
      <AlertDescription>
        {!isOnline ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <WifiOff className="h-4 w-4 mr-2" />
              <span>Sem conexão com a internet. Verifique sua rede antes de continuar.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Não foi possível conectar ao backend: {connectionStatus.error}</p>
            <div className="text-xs mt-1">
              <p>Possíveis causas:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Servidor Supabase pode estar temporariamente indisponível</li>
                <li>Problemas de rede ou firewall</li>
                <li>Configurações incorretas de API</li>
              </ul>
            </div>
          </div>
        )}
        
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
              {isOnline ? <RefreshCw className="mr-2 h-4 w-4" /> : <Wifi className="mr-2 h-4 w-4" />}
              {isOnline ? 'Tentar novamente' : 'Verificar conexão'}
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;
