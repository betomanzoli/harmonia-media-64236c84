
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Handle the magic link callback
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/auth-error');
        return;
      }
      
      // Get the redirect URL from search params or default to homepage
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo);
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
