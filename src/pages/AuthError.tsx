
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const AuthError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro de autenticação</h1>
        <p className="text-gray-500 mb-6">
          Ocorreu um erro durante o processo de autenticação. Por favor, tente novamente.
        </p>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => navigate(-1)}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Voltar e tentar novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Voltar à página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
