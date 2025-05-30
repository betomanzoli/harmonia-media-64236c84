
import React from 'react';
import { DiagnosticInfo } from '../DiagnosticsPanel';

interface AdvancedDiagnosticInfoProps {
  diagnosticInfo: DiagnosticInfo;
  showDebug: boolean;
}

const AdvancedDiagnosticInfo: React.FC<AdvancedDiagnosticInfoProps> = ({ 
  diagnosticInfo, 
  showDebug 
}) => {
  if (!showDebug) return null;
  
  return (
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
  );
};

export default AdvancedDiagnosticInfo;
