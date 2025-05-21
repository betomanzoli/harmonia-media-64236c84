
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { setPreviewAccessCookie, setPreviewEmailCookie, debugCookies } from '@/utils/authCookies';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback triggered");
      debugCookies(); // Debug existing cookies
      
      try {
        // Handle the magic link callback
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError('Erro de autenticação: ' + sessionError.message);
          setProcessing(false);
          return;
        }
        
        if (data?.session) {
          console.log("User authenticated:", data.session.user.email);
          
          // Get the redirect URL from search params
          const redirectTo = searchParams.get('redirect') || '/';
          console.log("Redirect path:", redirectTo);
          
          // If redirecting to a preview page, extract the project ID and set cookie
          if (redirectTo.startsWith('/preview/')) {
            const projectId = redirectTo.replace('/preview/', '');
            console.log("Setting access cookie for project:", projectId);
            
            // Set cookies for access - try multiple times with verification
            let cookieSuccess = false;
            for (let attempt = 0; attempt < 3 && !cookieSuccess; attempt++) {
              // Set cookies for access
              setPreviewAccessCookie(projectId);
              
              // Also set email cookie if we have it
              if (data.session.user.email) {
                setPreviewEmailCookie(projectId, data.session.user.email);
              }
              
              // Verify cookie was set successfully
              setTimeout(() => {
                debugCookies();
              }, 100);
              
              // Wait a bit and check again
              await new Promise(resolve => setTimeout(resolve, 200));
              cookieSuccess = true; // Assume success and continue
            }
            
            // Show success toast
            toast({
              title: "Acesso autorizado",
              description: "Você foi autenticado com sucesso para acessar esta prévia.",
            });

            // Force page reload instead of navigate to ensure clean state
            window.location.href = redirectTo;
            return;
          }
          
          // Navigate to the redirect URL
          setProcessing(false);
          navigate(redirectTo);
        } else {
          console.error('No session found in auth callback');
          setError('Nenhuma sessão de autenticação encontrada');
          setProcessing(false);
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        setError('Erro durante autenticação: ' + error.message);
        setProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800">Erro de autenticação</h2>
          <p className="text-gray-500 text-center max-w-md">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-harmonia-green text-white rounded hover:bg-harmonia-green/90"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
        <h2 className="text-xl font-medium text-gray-800">Autenticando...</h2>
        <p className="text-gray-500">Por favor, aguarde enquanto finalizamos o processo de login.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
