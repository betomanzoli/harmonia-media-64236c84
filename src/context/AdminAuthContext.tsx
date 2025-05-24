
import React, { createContext, useContext } from 'react';
import { AdminAuthContextType } from '@/types/admin-auth';

// Create the context with a default value
const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  connectionStatus: { tested: false, connected: false },
  login: async () => ({ success: false, error: 'Context not initialized' }),
  logout: async () => {},
  testConnection: async () => {},
});

// Export the useAdminAuth hook directly from the context file
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};

export default AdminAuthContext;
