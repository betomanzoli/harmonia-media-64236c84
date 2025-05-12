
import { useState, useEffect } from 'react';
import { AdminUser, ConnectionStatus, SecurityStatus } from '@/types/admin-auth';
import { localAuthService } from '@/lib/auth/localAuthService';

export function useAuthState(offlineMode: boolean = false) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    tested: true, // Mark as tested by default
    connected: navigator.onLine // Set initial connection status based on navigator.onLine
  });
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    checked: false,
    hasIssues: false
  });

  // Effect to verify authentication session on mount
  useEffect(() => {
    // If in offline mode, set a mock user and skip real auth
    if (offlineMode) {
      console.log('Usando modo offline - simulando autenticação');
      setUser({
        id: 'offline-user-id',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      setIsLoading(false);
      setConnectionStatus({
        tested: true,
        connected: true, // Pretend we're connected in offline mode
        details: { offlineMode: true }
      });
      return;
    }
    
    // Check for active session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log('Verificando sessão de autenticação...');
        const currentUser = localAuthService.getUser();
        const isAuthenticated = localAuthService.isAuthenticated();
        
        if (currentUser && isAuthenticated) {
          console.log("Sessão encontrada:", currentUser.email);
          setUser(currentUser);
        } else {
          console.log("Nenhuma sessão encontrada");
          setUser(null);
        }
        
        // Update connection status based on navigator.onLine
        setConnectionStatus(prev => ({
          ...prev,
          connected: navigator.onLine,
          tested: true
        }));
      } catch (err) {
        console.error("Erro ao checar autenticação:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Execute initial verification
    checkSession();
    
    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'harmonia-admin-auth-user' || event.key === 'harmonia-admin-auth-token') {
        checkSession();
      }
    };
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      console.log("Aplicação voltou a ficar online");
      setConnectionStatus(prev => ({
        ...prev,
        connected: true,
        error: undefined
      }));
    };
    
    const handleOffline = () => {
      console.log("Aplicação entrou em modo offline");
      setConnectionStatus(prev => ({
        ...prev,
        connected: false,
        error: "Sem conexão com a internet"
      }));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up listeners when unmounting
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineMode]);

  return {
    user,
    isLoading,
    setIsLoading,
    connectionStatus,
    setConnectionStatus,
    securityStatus,
    setSecurityStatus,
    isAuthenticated: offlineMode ? true : !!user
  };
}
