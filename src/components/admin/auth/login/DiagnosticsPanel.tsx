
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, Bug, Loader2, Wifi, WifiOff } from 'lucide-react';

// Updated interface to match the expected properties
export interface DiagnosticInfo {
  environment: string;
  supportsIndexedDB: boolean;
  supportsFetch: boolean;
  supportsWebSockets: boolean;
  browserName: string;
  browserVersion: string;
  operatingSystem: string;
  cookiesEnabled: boolean;
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  timezone: string;
  language: string;
  userAgent: string;
  screenResolution: string;
  connectionType?: string;
  connectionSpeed?: string;
  storageInfo: {
    localStorageSize: string;
    sessionStorageSize: string;
  };
  connectionDetails: {
    rtt?: number;
    downlink?: number;
    effectiveType?: string;
    saveData?: boolean;
  };
  authSettings: string;
  supabaseUrl: string;
}

interface DiagnosticsPanelProps {
  diagnosticInfo: DiagnosticInfo;
}

const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({ diagnosticInfo }) => {
  const [showDebug, setShowDebug] = useState(false);
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  return (
    <div className="mt-4 text-xs border rounded p-3 bg-gray-50">
      <div className="font-medium mb-2 flex items-center">
        <Info className="h-4 w-4 mr-1" />
        Informações de diagnóstico
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="mr-2">Status da conexão:</span>
          {isOnline ? (
            <span className="text-green-600 font-medium flex items-center">
              <Wifi className="h-3 w-3 mr-1" /> Conectado
            </span>
          ) : (
            <span className="text-red-600 font-medium flex items-center">
              <WifiOff className="h-3 w-3 mr-1" /> Desconectado
            </span>
          )}
        </div>
        
        <p>Navegador: {diagnosticInfo.browserName} {diagnosticInfo.browserVersion}</p>
        <p>Sistema: {diagnosticInfo.operatingSystem}</p>
        <p>Storage: {diagnosticInfo.localStorageAvailable ? 'Disponível' : 'Indisponível'}</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 w-full"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Ocultar detalhes' : 'Mostrar detalhes avançados'}
        </Button>
        
        {showDebug && (
          <div className="mt-2 space-y-2 bg-slate-100 p-2 rounded text-xs">
            <h4 className="font-bold">Detalhes técnicos:</h4>
            <p>URL do Supabase: {diagnosticInfo.supabaseUrl}</p>
            <p>Timezone: {diagnosticInfo.timezone}</p>
            <p>Idioma: {diagnosticInfo.language}</p>
            <p>Resolução: {diagnosticInfo.screenResolution}</p>
            <p>Cookies: {diagnosticInfo.cookiesEnabled ? 'Habilitados' : 'Desabilitados'}</p>
            
            <h4 className="font-bold">Configurações de autenticação:</h4>
            <pre className="whitespace-pre-wrap break-all text-xs overflow-auto max-h-20">
              {diagnosticInfo.authSettings}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
