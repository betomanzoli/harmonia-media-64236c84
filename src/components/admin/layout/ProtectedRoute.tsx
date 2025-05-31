import React, { useEffect } from 'react'; // ✅ ADICIONAR useEffect
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { authStatus, user, checkAuthStatus } = useAuth(); // ✅ ADICIONAR checkAuthStatus
  const location = useLocation();

  // ✅ ADICIONAR ESTE useEffect (SOLUÇÃO 2):
  useEffect(() => {
    // Timeout para evitar carregamento infinito
    const timeoutId = setTimeout(() => {
      if (authStatus === 'loading') {
        console.log('Auth timeout reached, checking auth status again');
        checkAuthStatus(); // Tentar verificar auth novamente
      }
    }, 3000); // 3 segundos máximo

    return () => clearTimeout(timeoutId);
  }, [authStatus, checkAuthStatus]);

  // ✅ ADICIONAR LOGS PARA DEBUG:
  console.log('ProtectedRoute state:', { 
    authStatus, 
    user: !!user, 
    path: location.pathname, 
    time: new Date().toISOString() 
  });

  if (authStatus === 'loading') {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
        <p className="ml-2 text-gray-600">Verificando autenticação...</p> {/* ✅ ADICIONAR TEXTO */}
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !user) {
    // Redireciona para a página de login se não estiver autenticado
    console.log('User not authenticated, redirecting to login'); // ✅ ADICIONAR LOG
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se autenticado, renderiza o conteúdo da rota filha
  console.log('User authenticated, rendering protected content'); // ✅ ADICIONAR LOG
  return <Outlet />;
};

export default ProtectedRoute;
