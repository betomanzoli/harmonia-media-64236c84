
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, cleanupAuthState } from '@/lib/supabase';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  // Check auth status on mount with improved error handling
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(() => {
    try {
      // Clean up any stale auth state first to avoid conflicts
      if (localStorage.getItem('auth-status-checked') !== 'true') {
        cleanupAuthState();
        localStorage.setItem('auth-status-checked', 'true');
      }
      
      // This is a simplified mock implementation
      // In a real app, you'd check tokens in localStorage or cookies
      const storedToken = localStorage.getItem('admin-auth-token');
      const storedUser = localStorage.getItem('admin-auth-user');
      
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
      // Clear any existing auth state to prevent conflicts
      cleanupAuthState();
      
      // This is a simplified mock implementation
      // In a real app, you'd make an API call to validate credentials
      if ((username === 'admin@harmonia.com' && password === 'admin123456') || 
          (username === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt')) {
        localStorage.setItem('admin-auth-token', 'mock-token-' + new Date().getTime());
        const userData = {
          email: username,
          name: username === 'admin@harmonia.com' ? 'Admin User' : 'Contato User',
          role: 'admin'
        };
        localStorage.setItem('admin-auth-user', JSON.stringify(userData));
        setAuthStatus('authenticated');
        console.log('Login successful, token stored');
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
    // Clean up auth state completely
    cleanupAuthState();
    localStorage.removeItem('admin-auth-token');
    localStorage.removeItem('admin-auth-user');
    setAuthStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ authStatus, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
