
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

  // Check if there's internet connection
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
  
  // Check if this might be a CORS issue
  const isCorsIssue = connectionStatus.error?.includes('Failed to fetch') || 
                       connectionStatus.error?.includes('CORS') ||
                       connectionStatus.details?.errorType === 'fetch';

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
            
            {isCorsIssue && (
              <div className="text-xs mt-1 bg-red-50 p-2 rounded border border-red-200">
                <p className="font-medium">Possível problema de CORS detectado!</p>
                <p>Este problema geralmente ocorre ao tentar acessar o Supabase de certos navegadores ou ambientes. Tente:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Usar o modo de demonstração (botão abaixo)</li>
                  <li>Usar o navegador Chrome</li>
                  <li>Desabilitar extensões de bloqueio de conteúdo</li>
                </ul>
              </div>
            )}
            
            <div className="text-xs mt-1 bg-gray-50 p-2 rounded">
              <p className="font-medium">Possíveis soluções:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Verifique se há algum bloqueador de conteúdo (ad-blocker, firewall) impedindo conexões</li>
                <li>Desative extensões de navegador que possam estar interferindo</li>
                <li>Tente acessar usando uma rede diferente</li>
                <li>Se o problema persistir, pode haver manutenção no servidor Supabase</li>
              </ul>
            </div>
            
            {connectionStatus.details && (
              <div className="bg-amber-50 border border-amber-200 p-2 rounded mt-3">
                <p className="text-amber-800 text-xs mb-1 font-medium">Informações de diagnóstico:</p>
                <p className="text-amber-700 text-xs break-all">
                  URL: {connectionStatus.details?.url || "Desconhecida"}<br/>
                  Erro: {connectionStatus.details?.error || "Desconhecido"}<br/>
                  Tipo: {connectionStatus.details?.errorType || "Desconhecido"}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col space-y-2 mt-3">
          <Button 
            variant="outline" 
            className="w-full"
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
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              sessionStorage.setItem('offline-admin-mode', 'true');
              window.location.reload();
            }}
          >
            Usar modo de demonstração (offline)
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;
