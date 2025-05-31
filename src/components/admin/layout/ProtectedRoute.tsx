import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho se necessário
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute: React.FC = () => {
  const { authStatus, user } = useAuth();
  const location = useLocation();
  const [fallbackAuth, setFallbackAuth] = useState<{
    status: 'loading' | 'authenticated' | 'unauthenticated';
    user: any;
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ FALLBACK DIRETO AO SUPABASE SE AUTHCONTEXT FALHAR
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Se authStatus está em loading por mais de 3 segundos, usar fallback
    if (authStatus === 'loading') {
      timeoutRef.current = setTimeout(async () => {
        console.log('⏰ AuthContext timeout - using Supabase fallback');
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Supabase auth error:', error);
            setFallbackAuth({ status: 'unauthenticated', user: null });
            return;
          }

          if (session?.user) {
            console.log('✅ Supabase fallback: authenticated');
            setFallbackAuth({ status: 'authenticated', user: session.user });
          } else {
            console.log('🔒 Supabase fallback: unauthenticated');
            setFallbackAuth({ status: 'unauthenticated', user: null });
          }
        } catch (error) {
          console.error('💥 Supabase fallback failed:', error);
          setFallbackAuth({ status: 'unauthenticated', user: null });
        }
      }, 3000); // 3 segundos de timeout
    } else {
      // Se AuthContext resolver, limpar fallback
      setFallbackAuth(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [authStatus]);

  // ✅ USAR FALLBACK SE DISPONÍVEL, SENÃO USAR AUTHCONTEXT
  const effectiveAuthStatus = fallbackAuth ? fallbackAuth.status : authStatus;
  const effectiveUser = fallbackAuth ? fallbackAuth.user : user;

  console.log('🏠 ProtectedRoute state:', { 
    authContextStatus: authStatus,
    authContextUser: !!user,
    fallbackStatus: fallbackAuth?.status,
    fallbackUser: !!fallbackAuth?.user,
    effectiveStatus: effectiveAuthStatus,
    effectiveUser: !!effectiveUser,
    path: location.pathname
  });

  if (effectiveAuthStatus === 'loading') {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
          <p className="text-sm text-gray-500">Verificando autenticação...</p>
          <p className="text-xs text-gray-400">
            {fallbackAuth ? 'Usando verificação direta' : 'Aguardando AuthContext'}
          </p>
        </div>
      </div>
    );
  }

  if (effectiveAuthStatus === 'unauthenticated' || !effectiveUser) {
    // Redireciona para a página de login se não estiver autenticado
    // Guarda a localização atual para redirecionar de volta após o login
    console.log('🔒 Redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se autenticado, renderiza o conteúdo da rota filha
  console.log('✅ Rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;
