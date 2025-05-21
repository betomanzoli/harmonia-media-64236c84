
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        // Log preview access for analytics and monitoring
        console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
        
        // 1. Verificar se há cookie de acesso
        const hasAccessCookie = checkPreviewAccessCookie(projectId);
        
        // 2. Verificar se o usuário está logado no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const hasActiveSession = !!session;
        
        // Se tiver cookie de acesso ou sessão ativa, permitir acesso
        if (hasAccessCookie || hasActiveSession) {
          setIsAuthenticated(true);
          window.scrollTo(0, 0);
        } else {
          // Redirecionar para página de autenticação
          navigate(`/auth/preview/${projectId}`);
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
      }
    };

    checkAuth();
  }, [projectId, navigate, toast]);

  if (isLoading) {
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
    // Esse caso não deveria acontecer pois já redirecionamos para a página de autenticação
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
