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
        const accessToken = searchParams.get('access_token');
        const expiresAt = searchParams.get('expires_at');
        const previewId = searchParams.get('preview_id');

        if (!accessToken || !expiresAt) {
          throw new Error('Parâmetros de autenticação inválidos');
        }

        setStatusMessage('Configurando sessão...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          expires_at: Number(expiresAt),
        });

        if (error) throw error;

        // Persistência híbrida de sessão
        const sessionData = {
          previewId,
          expiresAt: Number(expiresAt),
          timestamp: new Date().toISOString()
        };

        try {
          localStorage.setItem('previewAuth', JSON.stringify(sessionData));
        } catch {
          sessionStorage.setItem('previewAuthTemp', JSON.stringify(sessionData));
        }

        navigate(`/preview/${previewId}`, { replace: true });

      } catch (error) {
        toast({
          title: "Falha na autenticação",
          description: error.message,
          variant: "destructive"
        });
        setTimeout(() => navigate('/auth-error'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className={`h-12 w-12 mx-auto ${isProcessing ? 'animate-spin' : ''} text-harmonia-green`} />
        <p className="text-gray-600">{statusMessage}</p>
      </div>
    </div>
  );
};

export default SecureAuthCallback;
