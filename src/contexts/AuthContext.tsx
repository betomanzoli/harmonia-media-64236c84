
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Update AuthStatus type to match the actual string literals used in the code
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  authStatus: AuthStatus;
  checkAuthStatus: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authStatus: 'loading',
  checkAuthStatus: () => {},
  login: async () => false,
  logout: () => {},
});

// Helper function to clean up local storage auth data
const cleanupAuthData = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.includes('auth') || key.includes('supabase')) {
      localStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(() => {
    try {
      // Check for both token formats to ensure compatibility
      const storedToken = localStorage.getItem('admin-auth-token') || 
                          localStorage.getItem('sb-ivueqxyuflxsiecqvmgt-auth-token');
                          
      const storedUser = localStorage.getItem('admin-auth-user') || 
                        localStorage.getItem('sb-ivueqxyuflxsiecqvmgt-auth-user');
      
      console.log('Checking auth status. Token exists:', !!storedToken, 'User exists:', !!storedUser);
      
      if (storedToken && storedUser) {
        console.log('Auth token found, setting status to authenticated');
        setAuthStatus('authenticated');
      } else {
        console.log('No auth token found, setting status to unauthenticated');
        setAuthStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus('unauthenticated');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Login attempt with:', username);
    
    try {
      // Clear any existing tokens first to prevent conflicts
      cleanupAuthData();
      
      // Enhanced login logic with hardcoded credentials for development
      if ((username.toLowerCase() === 'admin@harmonia.com' && password === 'admin123456') || 
          (username.toLowerCase() === 'contato@harmonia.media' && password === 'harmonia2023')) {
        
        // Generate a timestamp-based token
        const mockToken = 'mock-token-' + new Date().getTime();
        
        // Store auth data in localStorage
        localStorage.setItem('admin-auth-token', mockToken);
        const userData = {
          email: username,
          name: username === 'admin@harmonia.com' ? 'Admin User' : 'Contato User',
          role: 'admin'
        };
        localStorage.setItem('admin-auth-user', JSON.stringify(userData));
        
        console.log('Login successful, token stored');
        setAuthStatus('authenticated');
        return true;
      }
      
      console.log('Login failed, invalid credentials');
      setAuthStatus('unauthenticated');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthStatus('unauthenticated');
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out, removing auth token');
    cleanupAuthData();
    setAuthStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ authStatus, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
