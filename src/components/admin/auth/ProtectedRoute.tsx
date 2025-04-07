
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import applyAllSecurityConfigurations from '@/lib/supabase/applySecurityConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionStatus } = useAdminAuth();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
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

  // Effect to check and apply security configurations once when authenticated
  useEffect(() => {
    const checkAndApplySecurity = async () => {
      if (isAuthenticated && !securityChecked && !isOfflineMode) {
        setSecurityChecked(true);
        
        try {
          // Check and apply security settings
          console.log("Verificando e aplicando configurações de segurança...");
          
          // Try to apply RLS policies and other configurations
          const result = await applyAllSecurityConfigurations();
          
          if (result.success) {
            console.log("Configurações de segurança aplicadas com sucesso");
            
            // Notify user only if some changes were made
            if (!result.rlsConfigured || !result.passwordConfigured || !result.mfaConfigured) {
              toast({
                title: "Segurança atualizada",
                description: "Configurações de segurança do Supabase foram atualizadas.",
              });
            }
          } else {
            console.warn("Problemas ao aplicar configurações:", result.error);
            toast({
              title: "Aviso de segurança",
              description: "Algumas configurações de segurança não puderam ser aplicadas automaticamente.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao verificar/aplicar configurações de segurança:", error);
          toast({
            title: "Erro de segurança",
            description: "Houve um problema ao configurar as políticas de segurança.",
            variant: "destructive",
          });
        }
      }
    };
    
    checkAndApplySecurity();
  }, [isAuthenticated, securityChecked, isOfflineMode, toast]);

  // Add a special handler for when connection status changes
  useEffect(() => {
    if (connectionStatus && !connectionStatus.connected && !isOfflineMode) {
      console.log("Conexão com Supabase perdida na área protegida");
      toast({
        title: "Problema de conexão",
        description: "A conexão com o Supabase foi perdida. Algumas funcionalidades podem não estar disponíveis.",
        variant: "destructive",
      });
    }
  }, [connectionStatus, toast, isOfflineMode]);

  if (isLoading && !isOfflineMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
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
