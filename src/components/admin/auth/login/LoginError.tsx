
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LoginErrorProps {
  error: string | null;
  detailedError?: string;
  toggleDiagnostics: () => void;
}

const LoginError: React.FC<LoginErrorProps> = ({ error, detailedError, toggleDiagnostics }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro de autenticação</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        {detailedError && (
          <div className="mt-2 text-xs bg-red-50 p-2 rounded">
            <p className="font-medium">Detalhes técnicos:</p>
            <p className="break-all">{detailedError}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 w-full"
          onClick={toggleDiagnostics}
        >
          Ver diagnósticos do sistema
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LoginError;
