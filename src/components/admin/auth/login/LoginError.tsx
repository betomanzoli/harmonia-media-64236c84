
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface LoginErrorProps {
  error: string | null;
  detailedError?: string;
}

const LoginError: React.FC<LoginErrorProps> = ({ error, detailedError }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro de autenticação</AlertTitle>
      <AlertDescription>
        {error}
        {detailedError && (
          <div className="mt-2 text-xs bg-red-50 p-2 rounded">
            <p className="font-medium">Detalhes técnicos:</p>
            <p className="break-all">{detailedError}</p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LoginError;
