
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Info, Bug, Loader2 } from 'lucide-react';
import ConnectionStatusIndicator from './components/ConnectionStatusIndicator';
import BasicDiagnosticInfo from './components/BasicDiagnosticInfo';
import AdvancedDiagnosticInfo from './components/AdvancedDiagnosticInfo';

// Interface for diagnostic information
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
          <ConnectionStatusIndicator isOnline={isOnline} />
        </div>
        
        <BasicDiagnosticInfo diagnosticInfo={diagnosticInfo} />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 w-full"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Ocultar detalhes' : 'Mostrar detalhes avançados'}
        </Button>
        
        <AdvancedDiagnosticInfo 
          diagnosticInfo={diagnosticInfo} 
          showDebug={showDebug} 
        />
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
