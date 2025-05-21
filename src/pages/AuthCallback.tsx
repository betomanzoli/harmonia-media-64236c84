
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { setPreviewAccessCookie } from '@/utils/authCookies';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback triggered");
      
      try {
        // Handle the magic link callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth-error');
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
            setPreviewAccessCookie(projectId);
          }
          
          // Navigate to the redirect URL
          navigate(redirectTo);
        } else {
          console.error('No session found in auth callback');
          navigate('/auth-error');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/auth-error');
      }
    };
    
    handleAuthCallback();
  }, [navigate, searchParams]);

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
