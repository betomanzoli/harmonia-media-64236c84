
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie, debugCookies, isPrivateBrowsing } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkComplete, setCheckComplete] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

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
        
        let hasAccess = false;

        // 1. If we have a token, validate it with the edge function
        if (token) {
          console.log("Token found, validating...");
          try {
            const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/validate-preview-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                preview_id: projectId,
                token: token
              })
            });

            const result = await response.json();
            
            if (result.valid) {
              console.log("Token validation successful");
              hasAccess = true;
              setProjectData(result.project);
            } else {
              console.error("Token validation failed:", result.error);
            }
          } catch (tokenError) {
            console.error("Error validating token:", tokenError);
          }
        }

        // 2. If token validation failed or no token, check cookie/localStorage
        if (!hasAccess) {
          // Check if there's cookie or localStorage access
          const hasAccessCookie = checkPreviewAccessCookie(projectId);
          console.log("Has access cookie or localStorage:", hasAccessCookie);
          
          // Check if the user is logged in to Supabase
          const { data: { session } } = await supabase.auth.getSession();
          const hasActiveSession = !!session;
          console.log("Has active session:", hasActiveSession);
          
          // If there's cookie access or session, allow access
          if (hasAccessCookie || hasActiveSession) {
            console.log("Cookie/session authentication successful");
            hasAccess = true;
          }
        }
        
        // If any authentication method succeeded, allow access
        if (hasAccess) {
          console.log("Authentication successful, allowing access");
          setIsAuthenticated(true);
          window.scrollTo(0, 0);

          // Log the access in Supabase for analytics
          if (projectId) {
            try {
              await supabase
                .from('access_logs')
                .insert({
                  preview_id: projectId,
                  access_method: token ? 'token' : 'cookie',
                  user_email: null // Anonymous access
                });
            } catch (logError) {
              console.error("Failed to log access:", logError);
              // Continue even if logging fails
            }
          }
        } else {
          // Redirect to authentication page
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
  }, [projectId, navigate, toast, token]);

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
      <MusicPreviewSystem projectId={projectId} projectData={projectData} token={token} />
    </div>
  );
};

export default MusicPreviewPage;
