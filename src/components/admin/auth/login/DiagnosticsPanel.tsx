
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, Bug, Loader2 } from 'lucide-react';

interface DiagnosticInfo {
  connectionDetails: string;
  authSettings: string;
  supabaseUrl: string;
  storageInfo: string;
}

interface DiagnosticsPanelProps {
  diagnosticInfo: DiagnosticInfo;
  connectionStatus: { connected: boolean };
  onRunDiagnostics: () => Promise<void>;
  isLoading: boolean;
}

const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({
  diagnosticInfo,
  connectionStatus,
  onRunDiagnostics,
  isLoading
}) => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <Alert className="mt-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Informações de diagnóstico</AlertTitle>
      <AlertDescription className="text-xs space-y-2">
        <p>Status da conexão: {connectionStatus.connected ? 'Conectado' : 'Desconectado'}</p>
        <p>URL do Supabase: {diagnosticInfo.supabaseUrl || 'Não disponível'}</p>
        <p>Local Storage: {diagnosticInfo.storageInfo}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 w-full"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Ocultar detalhes' : 'Mostrar detalhes avançados'}
        </Button>
        {showDebug && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1 w-full"
            onClick={onRunDiagnostics}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando diagnóstico...
              </>
            ) : (
              <>
                <Bug className="mr-2 h-4 w-4" />
                Executar diagnóstico completo
              </>
            )}
          </Button>
        )}
        {showDebug && (
          <div className="mt-2 space-y-2 bg-slate-100 p-2 rounded text-xs">
            <h4 className="font-bold">Detalhes da conexão:</h4>
            <pre className="whitespace-pre-wrap break-all">{diagnosticInfo.connectionDetails}</pre>
            
            <h4 className="font-bold">Configurações de autenticação:</h4>
            <pre className="whitespace-pre-wrap break-all">{diagnosticInfo.authSettings}</pre>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DiagnosticsPanel;
