
import React, { createContext, useState, useEffect, useContext } from 'react';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthContextType {
  user: any | null;
  authStatus: AuthStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  authStatus: 'loading',
  login: async () => ({ success: false }),
  logout: () => {},
  checkAuthStatus: async () => false,
  forgotPassword: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false, message: '' })
};

export const AdminAuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  
  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<boolean> => {
    setAuthStatus('loading');
    
    try {
      // Check if user session exists in localStorage
      const session = localStorage.getItem('admin_session');
      
      if (session) {
        const userData = JSON.parse(session);
        // In a real implementation, validate the token with your backend
        setUser(userData);
        setAuthStatus('authenticated');
        return true;
      } else {
        setUser(null);
        setAuthStatus('unauthenticated');
        return false;
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setAuthStatus('unauthenticated');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // In a real implementation, this would call your authentication API
      if (email === 'admin@harmonia.media' && password === 'admin123') {
        const userData = {
          id: '1',
          email,
          name: 'Admin',
          role: 'admin'
        };
        
        // Store session in localStorage
        localStorage.setItem('admin_session', JSON.stringify(userData));
        
        setUser(userData);
        setAuthStatus('authenticated');
        
        return { success: true };
      }
      
      return { success: false, message: 'Credenciais inválidas' };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    // Remove session from localStorage
    localStorage.removeItem('admin_session');
    
    setUser(null);
    setAuthStatus('unauthenticated');
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call your password reset API
      return { success: true, message: 'Email de redefinição enviado' };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: 'Erro ao enviar email de redefinição' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call your password reset API
      return { success: true, message: 'Senha redefinida com sucesso' };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: 'Erro ao redefinir senha' };
    }
  };

  const value = {
    user,
    authStatus,
    login,
    logout,
    checkAuthStatus,
    forgotPassword,
    resetPassword
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
