import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  authStatus: AuthStatus;
  user: User | null;
  checkAuthStatus: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authStatus: 'loading',
  user: null,
  checkAuthStatus: () => {},
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  // Check auth status on mount and listen for auth changes
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          setAuthStatus('authenticated');
        } else {
          setUser(null);
          setAuthStatus('unauthenticated');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('Checking auth status with Supabase...');
      
      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth status:', error);
        setAuthStatus('unauthenticated');
        setUser(null);
        return;
      }

      if (session?.user) {
        console.log('Valid session found for:', session.user.email);
        setUser(session.user);
        setAuthStatus('authenticated');
      } else {
        console.log('No valid session found');
        setUser(null);
        setAuthStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthStatus('unauthenticated');
      setUser(null);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Login attempt with Supabase:', username);
    
    try {
      setAuthStatus('loading');
      
      // Use real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        setAuthStatus('unauthenticated');
        setUser(null);
        return false;
      }

      if (data.session?.user) {
        console.log('Login successful with Supabase:', data.session.user.email);
        setUser(data.session.user);
        setAuthStatus('authenticated');
        return true;
      }

      console.log('Login failed: no session returned');
      setAuthStatus('unauthenticated');
      setUser(null);
      return false;
      
    } catch (error) {
      console.error('Login error:', error);
      setAuthStatus('unauthenticated');
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out from Supabase...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
      }
      
      // Clear state regardless of error
      setUser(null);
      setAuthStatus('unauthenticated');
      
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setAuthStatus('unauthenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ authStatus, user, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
