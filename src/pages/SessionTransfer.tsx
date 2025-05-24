import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setPreviewAccessCookie } from '@/utils/authCookies';

const SessionTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get('token');
  const previewId = searchParams.get('previewId');

  useEffect(() => {
    const transferSession = async () => {
      try {
        if (!token || !previewId) {
          throw new Error('Parâmetros de transferência inválidos');
        }

        // Configurar cookies compatíveis com navegadores privados
        document.cookie = `sb-access-token=${token}; Path=/; Secure; SameSite=None; Partitioned`;
        setPreviewAccessCookie(previewId);

        // Redirecionar de volta para a prévia
        navigate(`/preview/${previewId}`);
        
      } catch (error) {
        console.error('Erro na transferência de sessão:', error);
        toast({
          title: "Erro de acesso",
          description: "Não foi possível transferir a sessão. Tente novamente.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    transferSession();
  }, [navigate, previewId, token, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
        <p className="text-gray-600">Transferindo sua sessão...</p>
      </div>
    </div>
  );
};

export default SessionTransfer;
