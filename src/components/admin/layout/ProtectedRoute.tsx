import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho se necessário
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { authStatus, user } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // ✅ CORREÇÃO PARA LOOP INFINITO:
  useEffect(() => {
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Timeout de segurança para evitar carregamento infinito
    if (authStatus === 'loading') {
      console.log('🔍 Auth status: loading, setting timeout...');
      
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current && authStatus === 'loading') {
          console.log('⏰ Auth timeout reached - may need to check AuthContext');
          // Não forçamos mudança de estado aqui, apenas logamos
          // O AuthContext deve resolver o estado eventualmente
        }
      }, 8000); // 8 segundos de timeout
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [authStatus]);

  // ✅ CLEANUP AO DESMONTAR:
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ✅ LOGS PARA DEBUG (removível em produção):
  console.log('🏠 ProtectedRoute render:', { 
    authStatus, 
    hasUser: !!user, 
    path: location.pathname,
    timestamp: new Date().toISOString()
  });

  if (authStatus === 'loading') {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
          <p className="text-sm text-gray-500">Verificando autenticação...</p>
          <p className="text-xs text-gray-400">Aguarde alguns segundos</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !user) {
    // Redireciona para a página de login se não estiver autenticado
    // Guarda a localização atual para redirecionar de volta após o login
    console.log('🔒 Redirecting to login - authStatus:', authStatus, 'user:', !!user);
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se autenticado, renderiza o conteúdo da rota filha
  console.log('✅ Rendering protected content for authenticated user');
  return <Outlet />;
};

export default ProtectedRoute;
