
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionStatus } = useAdminAuth();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if offline mode is active
    const offlineMode = sessionStorage.getItem('offline-admin-mode');
    if (offlineMode === 'true') {
      setIsOfflineMode(true);
      toast({
        title: "Modo offline ativo",
        description: "Você está navegando no modo demonstrativo com funcionalidades limitadas.",
        duration: 5000,
      });
    }
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Allow access in offline mode
  if (isOfflineMode) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
