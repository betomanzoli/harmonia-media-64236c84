
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie, debugCookies } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = async () => {
      if (!projectId) {
        setIsLoading(false);
        setCheckComplete(true);
        return;
      }

      try {
        // Log preview access for analytics and monitoring
        console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
        console.log(`User agent: ${navigator.userAgent}`);
        
        // Check for token in URL query parameter (magic link)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        let hasValidToken = false;
        
        if (token) {
          console.log('Token found in URL, verifying...');
          // Validate token against database
          const { data, error } = await supabase
            .from('preview_tokens')
            .select('*')
            .eq('preview_id', projectId)
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single();
          
          if (data && !error) {
            console.log('Valid token found, granting access');
            hasValidToken = true;
            
            // Set access cookie for future visits
            const { setPreviewAccessCookie } = await import('@/utils/authCookies');
            setPreviewAccessCookie(projectId);
            
            // Log access with token
            try {
              await supabase.from('access_logs').insert({
                preview_id: projectId,
                access_method: 'token',
                token_id: data.id
              });
            } catch (logError) {
              console.error('Failed to log token access:', logError);
              // Non-critical, continue anyway
            }
          } else {
            console.log('Invalid or expired token');
          }
        }
        
        // Debug cookies to help troubleshoot
        debugCookies();
        
        // 1. Verificar se há cookie de acesso
        const hasAccessCookie = checkPreviewAccessCookie(projectId);
        console.log("Has access cookie or localStorage:", hasAccessCookie);
        
        // 2. Verificar se o usuário está logado no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const hasActiveSession = !!session;
        console.log("Has active session:", hasActiveSession);
        
        // Se tiver cookie de acesso, sessão ativa ou token válido, permitir acesso
        if (hasAccessCookie || hasActiveSession || hasValidToken) {
          console.log("Authentication successful, allowing access");
          setIsAuthenticated(true);
          window.scrollTo(0, 0);
        } else {
          // Redirecionar para página de autenticação
          console.log("No authentication found, redirecting to auth page");
          console.log("Navigation to:", `/auth/preview/${projectId}`);
          
          // Use replace instead of navigate to avoid back button issues
          navigate(`/auth/preview/${projectId}`, { replace: true });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        toast({
          title: "Erro de acesso",
          description: "Não foi possível verificar seu acesso à prévia.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setCheckComplete(true);
      }
    };

    checkAuth();
  }, [projectId, navigate, toast]);

  // The component should only render content once the check is complete
  // This prevents flash of content before redirect
  if (!checkComplete || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="mt-4 text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">ID do projeto não encontrado</h2>
          <p className="text-black">O código de prévia fornecido não é válido.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Este caso não deveria acontecer pois já redirecionamos para a página de autenticação
    // mas mantemos como fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Acesso não autorizado</h2>
          <p className="text-black mb-4">Por favor, faça login para acessar esta prévia.</p>
          <button 
            onClick={() => navigate(`/auth/preview/${projectId}`)}
            className="bg-harmonia-green text-white px-4 py-2 rounded"
          >
            Fazer login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default MusicPreviewPage;
