
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock } from 'lucide-react';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Acesso à prévia: ${projectId}, Data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      const checkAuthorization = async () => {
        setIsLoading(true);
        
        try {
          // First check if we have a cookie-based access
          const hasCookieAccess = checkPreviewAccessCookie(projectId);
          if (hasCookieAccess) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }
          
          // Then check if we have an authenticated user
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email) {
            // Check if the email is authorized to view this preview
            const { data: previewData, error } = await supabase
              .from('previews')
              .select('allowed_emails')
              .eq('preview_id', projectId)
              .maybeSingle();
            
            if (error) {
              console.error("Error checking preview access:", error);
              setIsAuthorized(false);
            } else if (previewData && previewData.allowed_emails && 
                      previewData.allowed_emails.includes(session.user.email)) {
              setIsAuthorized(true);
            } else {
              // User is not authorized
              setIsAuthorized(false);
              toast({
                title: "Acesso não autorizado",
                description: "Seu email não tem permissão para acessar esta prévia.",
                variant: "destructive"
              });
              // Redirect to auth page
              navigate(`/auth/preview/${projectId}`);
            }
          } else {
            // No authenticated user, redirect to auth page
            navigate(`/auth/preview/${projectId}`);
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAuthorization();
    }
  }, [projectId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
            <h2 className="text-xl font-medium text-gray-800">Verificando acesso...</h2>
            <p className="text-gray-500">Estamos verificando suas credenciais para acessar a prévia musical.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">ID do projeto não encontrado</h2>
          <p className="text-gray-600">O link que você acessou não é válido.</p>
        </div>
      </div>
    );
  }

  // Show authentication form if not authorized yet
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProjectAccessForm 
          projectId={projectId} 
          onVerify={(email, code) => {
            setIsAuthorized(true);
            toast({
              title: "Acesso autorizado",
              description: "Bem-vindo à página de prévia do seu projeto."
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-md p-3 flex items-center">
          <Lock className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm text-green-700">
            Conteúdo exclusivo e protegido - Acesso pessoal
          </span>
        </div>
      </div>
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default PreviewPage;
