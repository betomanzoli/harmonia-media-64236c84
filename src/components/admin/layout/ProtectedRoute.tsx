import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho se necessário
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { authStatus, user } = useAuth();
  const location = useLocation();

  if (authStatus === 'loading') {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !user) {
    // Redireciona para a página de login se não estiver autenticado
    // Guarda a localização atual para redirecionar de volta após o login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se autenticado, renderiza o conteúdo da rota filha
  return <Outlet />;
};

export default ProtectedRoute;

