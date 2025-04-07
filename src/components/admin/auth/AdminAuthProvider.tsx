
import React, { useState, useEffect } from 'react';
import AdminAuthContext from '@/context/AdminAuthContext';
import { AdminAuthProviderProps } from '@/types/admin-auth';
import { useAuthState } from '@/hooks/admin/useAuthState';
import { useAuthActions } from '@/hooks/admin/useAuthActions';
import { useToast } from '@/hooks/use-toast';

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if offline mode is active from session storage
    const isOffline = sessionStorage.getItem('offline-admin-mode') === 'true';
    setOfflineMode(isOffline);
    
    if (isOffline) {
      console.log('Aplicação funcionando em modo offline/demo');
    }
    
    // Listen for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offline-admin-mode') {
        setOfflineMode(event.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const {
    user,
    isLoading,
    setIsLoading,
    connectionStatus,
    setConnectionStatus,
    securityStatus,
    setSecurityStatus,
    isAuthenticated
  } = useAuthState(offlineMode);
  
  const { 
    login, 
    logout, 
    testConnection, 
    checkSecurityStatus 
  } = useAuthActions({
    setIsLoading,
    setConnectionStatus,
    setSecurityStatus,
    offlineMode
  });
  
  return (
    <AdminAuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        connectionStatus,
        securityStatus,
        login, 
        logout,
        testConnection,
        checkSecurityStatus
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
