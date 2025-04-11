
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionStatus } = useAdminAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Show connection error only if we have a real connection problem
  useEffect(() => {
    if (connectionStatus && 
        !connectionStatus.connected && 
        connectionStatus.tested &&
        connectionStatus.error) {
      console.log("Conexão perdida na área protegida:", connectionStatus);
      toast({
        title: "Problema de conexão",
        description: "A conexão foi perdida. Algumas funcionalidades podem não estar disponíveis.",
        variant: "destructive",
      });
    }
  }, [connectionStatus, toast]);

  // Add a console log to help with debugging
  console.log('ProtectedRoute state:', { isAuthenticated, isLoading, connectionStatus });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current path in state
  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
