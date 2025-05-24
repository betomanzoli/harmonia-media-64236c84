import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  // Detectar navegador privado
  const isPrivateWindow = () => {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return false;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          const redirectTo = searchParams.get('redirect') || '/';
          const projectId = redirectTo.replace('/preview/', '');

          if (isPrivateWindow()) {
            // Redirecionar para transferência de sessão em navegadores privados
            const transferUrl = `/session-transfer?token=${session.access_token}&previewId=${projectId}`;
            navigate(transferUrl);
            return;
          }

          // Fluxo normal para navegadores não privados
          setPreviewAccessCookie(projectId);
          if (session.user.email) setPreviewEmailCookie(projectId, session.user.email);
          
          toast({
            title: "Acesso autorizado",
            description: "Autenticação realizada com sucesso.",
          });
          
          navigate(redirectTo);
        }
      } catch (error: any) {
        setError(error.message || 'Erro na autenticação');
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-4xl mb-4">✖</div>
          <h2 className="text-xl font-semibold mb-2">Erro de Acesso</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-harmonia-green text-white px-6 py-2 rounded hover:bg-harmonia-green/90"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-harmonia-green" />
        <p className="text-gray-600">Finalizando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
