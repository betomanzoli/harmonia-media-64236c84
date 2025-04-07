
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
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

  // Effect to check and apply security configurations once when authenticated
  useEffect(() => {
    const checkAndApplySecurity = async () => {
      if (isAuthenticated && !securityChecked) {
        setSecurityChecked(true);
        
        try {
          // Verificar e aplicar configurações de segurança
          console.log("Verificando e aplicando configurações de segurança...");
          
          // Tenta aplicar políticas RLS e outras configurações
          const result = await applyAllSecurityConfigurations();
          
          if (result.success) {
            console.log("Configurações de segurança aplicadas com sucesso");
            
            // Notificar usuário apenas se alguma mudança foi feita
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
