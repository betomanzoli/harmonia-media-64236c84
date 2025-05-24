import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SecureAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Verificando autenticação...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obter parâmetros da URL
        const accessToken = searchParams.get('access_token');
        const expiresAt = searchParams.get('expires_at');
        const previewId = searchParams.get('preview_id');
        const refreshToken = searchParams.get('refresh_token');

        setStatusMessage('Configurando sessão...');

        if (accessToken && expiresAt) {
          // Configurar sessão do Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
            expires_at: Number(expiresAt),
            expires_in: Math.floor((Number(expiresAt) - Date.now()) / 1000),
            token_type: 'bearer',
            user: null
          });

          if (error) {
            console.error('Erro na autenticação:', error);
            throw error;
          }

          setStatusMessage('Redirecionando para prévia...');

          // Armazenar dados da sessão
          const sessionData = {
            previewId,
            authenticatedAt: new Date().toISOString(),
            expiresAt: Number(expiresAt)
          };

          try {
            localStorage.setItem('previewAuthData', JSON.stringify(sessionData));
          } catch {
            sessionStorage.setItem('previewAuthTemp', JSON.stringify(sessionData));
          }

          // Aguardar um momento para garantir que a sessão foi configurada
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Redirecionar para a página de prévia
          if (previewId) {
            navigate(`/preview/${previewId}`, { replace: true });
          } else {
            navigate('/preview-error', { replace: true });
          }

        } else {
          throw new Error('Parâmetros de autenticação inválidos');
        }

      } catch (error) {
        console.error('Erro no callback de autenticação:', error);
        
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar sua identidade. Tente novamente.",
          variant: "destructive"
        });

        setStatusMessage('Erro na autenticação');
        
        // Redirecionar para página de erro após 3 segundos
        setTimeout(() => {
          navigate('/auth-error', { replace: true });
        }, 3000);
        
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-8">
        <div className="flex justify-center">
          <Loader2 className={`h-12 w-12 ${isProcessing ? 'animate-spin' : ''} text-harmonia-green`} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Autenticação Segura
        </h2>
        <p className="text-gray-600 max-w-md">
          {statusMessage}
        </p>
        {!isProcessing && (
          <button 
            onClick={() => navigate('/auth-error')}
            className="mt-4 px-4 py-2 bg-harmonia-green text-white rounded hover:bg-harmonia-green/90"
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
};

export default SecureAuthCallback;
