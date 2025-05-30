import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Define more specific types for auth status and user data
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  authStatus: AuthStatus;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
      console.log('Initial session check:', session ? 'Authenticated' : 'Unauthenticated');
    }).catch(error => {
      console.error('Error getting initial session:', error);
      setAuthStatus('unauthenticated');
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthStatus('loading');
    console.log('Login attempt with:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Supabase login error:', error.message);
        setAuthStatus('unauthenticated');
        return { success: false, error: error.message };
      }
      // onAuthStateChange will handle setting status to 'authenticated'
      console.log('Supabase login successful (event will update state)');
      return { success: true };
    } catch (error: any) {
      console.error('Login function error:', error);
      setAuthStatus('unauthenticated');
      return { success: false, error: error.message || 'An unexpected error occurred during login.' };
    }
  };

  const logout = async (): Promise<{ error?: string }> => {
    setAuthStatus('loading');
    console.log('Logout attempt');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error.message);
        // Even if logout fails, attempt to set state to unauthenticated
        setAuthStatus('unauthenticated'); 
        setUser(null);
        setSession(null);
        return { error: error.message };
      }
      // onAuthStateChange will handle setting status to 'unauthenticated'
      console.log('Supabase logout successful (event will update state)');
      return {};
    } catch (error: any) {
      console.error('Logout function error:', error);
      setAuthStatus('unauthenticated');
      setUser(null);
      setSession(null);
      return { error: error.message || 'An unexpected error occurred during logout.' };
    }
  };

  const value = {
    authStatus,
    user,
    session,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

