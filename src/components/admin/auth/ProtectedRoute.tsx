
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionStatus } = useAdminAuth();
  const { toast } = useToast();

  // Mostrar erro de conexão apenas se tivermos um problema de conexão real
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

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
