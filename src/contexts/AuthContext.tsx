
import { createContext, useState, useEffect, useMemo, ReactNode, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabaseClient from '@/integrations/supabase/client'; // Updated import statement

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null, data: { user: null, session: null } }),
  signOut: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      setLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn: (email: string, password: string) => 
        supabaseClient.auth.signInWithPassword({ email, password }),
      signOut: () => supabaseClient.auth.signOut(),
    }),
    [user, session, loading]
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
