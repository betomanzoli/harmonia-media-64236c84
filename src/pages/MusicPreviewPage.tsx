
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie, debugCookies, isPrivateBrowsing } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkComplete, setCheckComplete] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = async () => {
      if (!projectId) {
        setIsLoading(false);
        setCheckComplete(true);
        return;
      }

      try {
        // Check if in private browsing mode
        const privateModeDetected = await isPrivateBrowsing();
        setIsPrivateMode(privateModeDetected);
        console.log(`Navegador em modo privado: ${privateModeDetected}`);
        
        // Log preview access for analytics and monitoring
        console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
        console.log(`User agent: ${navigator.userAgent}`);
        
        // Debug cookies to help troubleshoot
        debugCookies();
        
        // 1. Verificar se há cookie de acesso (agora com suporte melhorado para modo privado)
        const hasAccessCookie = checkPreviewAccessCookie(projectId);
        console.log("Has access cookie or localStorage:", hasAccessCookie);
        
        // 2. Verificar se o usuário está logado no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const hasActiveSession = !!session;
        console.log("Has active session:", hasActiveSession);
        
        // Se tiver cookie de acesso ou sessão ativa, permitir acesso
        if (hasAccessCookie || hasActiveSession) {
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
      {isPrivateMode && (
        <div className="max-w-4xl mx-auto mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Você está usando o navegador em modo privado. Suas preferências e feedback podem ser perdidos ao fechar esta janela.
          </p>
        </div>
      )}
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default MusicPreviewPage;
