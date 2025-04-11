
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionStatus } = useAdminAuth();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineInitialized, setOfflineInitialized] = useState(false);
  const { toast } = useToast();
  
  // Effect to check if offline mode is active
  useEffect(() => {
    const checkOfflineMode = () => {
      const offlineMode = sessionStorage.getItem('offline-admin-mode');
      const isOffline = offlineMode === 'true';
      setIsOfflineMode(isOffline);
      
      if (isOffline && !offlineInitialized) {
        console.log('Modo offline ativo na área administrativa');
        toast({
          title: "Modo demonstrativo ativo",
          description: "Você está navegando no modo demonstrativo com funcionalidades limitadas.",
          duration: 5000,
        });
        setOfflineInitialized(true);
      }
    };
    
    checkOfflineMode();
    
    // Listen for storage changes (in case offline mode is toggled elsewhere)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offline-admin-mode') {
        checkOfflineMode();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast, offlineInitialized]);

  // Fix: Only show connection error if we're not in offline mode AND we have an actual connection problem
  useEffect(() => {
    if (connectionStatus && 
        !connectionStatus.connected && 
        !isOfflineMode && 
        connectionStatus.tested &&
        connectionStatus.error) {
      console.log("Conexão perdida na área protegida:", connectionStatus);
      toast({
        title: "Problema de conexão",
        description: "A conexão foi perdida. Algumas funcionalidades podem não estar disponíveis.",
        variant: "destructive",
      });
    }
  }, [connectionStatus, toast, isOfflineMode]);

  // Removendo a ativação automática do modo offline para desenvolvimento
  // A seção abaixo foi removida:
  // useEffect(() => {
  //   if (isLoading && !isOfflineMode && process.env.NODE_ENV === 'development') {
  //     console.log("Ativando modo offline automaticamente para ambiente de desenvolvimento");
  //     sessionStorage.setItem('offline-admin-mode', 'true');
  //     setIsOfflineMode(true);
  //   }
  // }, [isLoading, isOfflineMode]);

  if (isLoading && !isOfflineMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
          <button 
            onClick={() => {
              sessionStorage.setItem('offline-admin-mode', 'true');
              window.location.reload();
            }}
            className="mt-4 text-sm px-3 py-1 bg-harmonia-green text-white rounded-md"
          >
            Ativar modo offline
          </button>
        </div>
      </div>
    );
  }

  // Allow access in offline mode only if explicitly set
  if (isOfflineMode) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
