
import React, { createContext, useContext, useState, useCallback } from 'react';

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

  const checkAuthStatus = useCallback(() => {
    // This is a simplified mock implementation
    // In a real app, you'd check tokens in localStorage or cookies
    const storedToken = localStorage.getItem('admin-auth-token');
    
    if (storedToken) {
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // This is a simplified mock implementation
    // In a real app, you'd make an API call to validate credentials
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('admin-auth-token', 'mock-token');
      setAuthStatus('authenticated');
      return true;
    }
    
    setAuthStatus('unauthenticated');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-auth-token');
    setAuthStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ authStatus, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
