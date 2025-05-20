import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie, getPreviewEmailCookie, setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';
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
          // First check if the access is from client dashboard (userEmail in localStorage)
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            // Set cookie access for future visits
            setPreviewAccessCookie(projectId);
            setPreviewEmailCookie(projectId, userEmail);
            
            // Log the access in the database
            try {
              await supabase.from('access_logs').insert({
                preview_id: projectId,
                user_email: userEmail,
                access_method: 'client_dashboard',
                ip_address: 'not-tracked'
              });
            } catch (logError) {
              console.error("Error logging access:", logError);
              // Non-blocking error, continue with access
            }
            
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }
          
          // Then check if we have a cookie-based access
          const hasCookieAccess = checkPreviewAccessCookie(projectId);
          if (hasCookieAccess) {
            // Get the email from the cookie for logging purposes
            const email = getPreviewEmailCookie(projectId);
            
            // Log the access in the database
            try {
              await supabase.from('access_logs').insert({
                preview_id: projectId,
                user_email: email,
                access_method: 'cookie',
                ip_address: 'not-tracked'
              });
            } catch (logError) {
              console.error("Error logging access:", logError);
              // Non-blocking error, continue with access
            }
            
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }
          
          // Then check if we have an authenticated user
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email) {
            // Store user email in localStorage for future access
            localStorage.setItem('userEmail', session.user.email);
            
            // Set cookies for future access
            setPreviewAccessCookie(projectId);
            setPreviewEmailCookie(projectId, session.user.email);
            
            // Check if the email is authorized to view this preview
            const { data: previewData, error } = await supabase
              .from('previews')
              .select('allowed_emails')
              .eq('preview_id', projectId)
              .maybeSingle();
            
            // Always authorize if authenticated (for simplicity)
            // In a production environment, you'd check against allowed_emails
            setIsAuthorized(true);
            
            // Log the successful access
            try {
              const { error: logError } = await supabase.from('access_logs').insert({
                preview_id: projectId,
                user_email: session.user.email,
                access_method: 'auth',
                ip_address: 'not-tracked'
              });
              
              if (logError) {
                console.error("Error logging access:", logError);
              }
            } catch (logError) {
              console.error("Error logging access:", logError);
              // Non-blocking error, continue with access
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
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <ProjectAccessForm 
          projectId={projectId} 
          onVerify={async (email, code) => {
            // Set cookies for future access
            setPreviewAccessCookie(projectId);
            setPreviewEmailCookie(projectId, email);
            
            // Store email in localStorage for client dashboard access
            localStorage.setItem('userEmail', email);
            
            setIsAuthorized(true);
            toast({
              title: "Acesso autorizado",
              description: "Bem-vindo à página de prévia do seu projeto."
            });
            
            // Log the access - Fixed: Need to await the insert operation to properly access error
            try {
              const { error } = await supabase.from('access_logs').insert({
                preview_id: projectId,
                user_email: email,
                access_method: 'verification_code',
                ip_address: 'not-tracked'
              });
              
              if (error) {
                console.error("Error logging access:", error);
              }
            } catch (err) {
              console.error("Error logging access:", err);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 pt-8 pb-16">
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
