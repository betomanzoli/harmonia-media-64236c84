
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(() => {
    // This is a simplified mock implementation
    // In a real app, you'd check tokens in localStorage or cookies
    const storedToken = localStorage.getItem('admin-auth-token');
    
    if (storedToken) {
      console.log('Auth token found, setting status to authenticated');
      setAuthStatus('authenticated');
    } else {
      console.log('No auth token found, setting status to unauthenticated');
      setAuthStatus('unauthenticated');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Login attempt with:', username);
    // This is a simplified mock implementation
    // In a real app, you'd make an API call to validate credentials
    if ((username === 'admin@harmonia.com' && password === 'admin123456') || 
        (username === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt')) {
      localStorage.setItem('admin-auth-token', 'mock-token');
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
  };

  const logout = () => {
    console.log('Logging out, removing auth token');
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
