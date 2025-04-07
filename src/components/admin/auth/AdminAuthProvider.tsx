
import React from 'react';
import AdminAuthContext from '@/context/AdminAuthContext';
import { AdminAuthProviderProps } from '@/types/admin-auth';
import { useAuthState } from '@/hooks/admin/useAuthState';
import { useAuthActions } from '@/hooks/admin/useAuthActions';

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const {
    user,
    isLoading,
    setIsLoading,
    connectionStatus,
    setConnectionStatus,
    securityStatus,
    setSecurityStatus,
    isAuthenticated
  } = useAuthState();
  
  const { 
    login, 
    logout, 
    testConnection, 
    checkSecurityStatus 
  } = useAuthActions({
    setIsLoading,
    setConnectionStatus,
    setSecurityStatus
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
