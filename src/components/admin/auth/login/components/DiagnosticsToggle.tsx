
import React from 'react';

interface DiagnosticsToggleProps {
  showConnectionStatus: boolean;
  toggleDiagnostics: () => void;
}

const DiagnosticsToggle: React.FC<DiagnosticsToggleProps> = ({ 
  showConnectionStatus, 
  toggleDiagnostics 
}) => {
  return (
    <div className="mt-6 text-center">
      <button 
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
        onClick={toggleDiagnostics}
      >
        {showConnectionStatus ? "Ocultar diagnóstico" : "Verificar conexão"}
      </button>
    </div>
  );
};

export default DiagnosticsToggle;
