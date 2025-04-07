
import React from 'react';
import { AdminAuthContextType } from '@/types/admin-auth';

// Create the context with a default value
const AdminAuthContext = React.createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  connectionStatus: { tested: false, connected: false },
  login: async () => ({ success: false, error: 'Context not initialized' }),
  logout: async () => {},
  testConnection: async () => {},
});

export default AdminAuthContext;
