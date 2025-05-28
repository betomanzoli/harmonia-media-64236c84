import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Usuário está autenticado, redireciona para a página principal do admin
        navigate('/admin-j28s7d1k');
      } else {
        // Usuário não está autenticado, redireciona para a página de login
        navigate('/admin-j28s7d1k/login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div>
      Autenticando...
    </div>
  );
};

export default AuthCallback;
