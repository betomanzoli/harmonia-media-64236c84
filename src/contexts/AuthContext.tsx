import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // ✅ CORREÇÃO: useEffect mais robusto
  useEffect(() => {
    let subscription: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Verificar sessão inicial
        await checkAuthStatus();
        
        // Configurar listener apenas após verificação inicial
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mountedRef.current) return;
            
            console.log('🔄 Auth state changed:', event, session?.user?.email);
            
            if (session?.user) {
              setUser(session.user);
              setAuthStatus('authenticated');
              
              // ✅ FORÇAR REDIRECIONAMENTO APÓS LOGIN BEM-SUCEDIDO
              if (event === 'SIGNED_IN') {
                console.log('🚀 Login successful, redirecting...');
                setTimeout(() => {
                  if (mountedRef.current) {
                    window.location.href = '/admin/projects';
                  }
                }, 500);
              }
            } else {
              setUser(null);
              setAuthStatus('unauthenticated');
            }
          }
        );
        
        subscription = authSubscription;
        setIsInitialized(true);
        
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mountedRef.current) {
          setAuthStatus('unauthenticated');
          setUser(null);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ✅ CORREÇÃO: Timeout para evitar loading infinito
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (authStatus === 'loading' && isInitialized) {
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current && authStatus === 'loading') {
          console.log('⏰ Auth timeout - setting to unauthenticated');
          setAuthStatus('unauthenticated');
          setUser(null);
        }
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [authStatus, isInitialized]);

  const checkAuthStatus = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      console.log('🔍 Checking auth status with Supabase...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error checking auth status:', error);
        if (mountedRef.current) {
          setAuthStatus('unauthenticated');
          setUser(null);
        }
        return;
      }

      if (session?.user) {
        console.log('✅ Valid session found for:', session.user.email);
        if (mountedRef.current) {
          setUser(session.user);
          setAuthStatus('authenticated');
        }
      } else {
        console.log('🔒 No valid session found');
        if (mountedRef.current) {
          setUser(null);
          setAuthStatus('unauthenticated');
        }
      }
    } catch (error) {
      console.error('💥 Auth check error:', error);
      if (mountedRef.current) {
        setAuthStatus('unauthenticated');
        setUser(null);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!mountedRef.current) return false;
    
    console.log('🔑 Login attempt with Supabase:', username);
    
    try {
      setAuthStatus('loading');
      
      // ✅ CORREÇÃO: Validação de entrada
      if (!username || !password) {
        console.error('❌ Email or password missing');
        setAuthStatus('unauthenticated');
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Supabase login error:', error.message);
        if (mountedRef.current) {
          setAuthStatus('unauthenticated');
          setUser(null);
        }
        return false;
      }

      if (data.session?.user) {
        console.log('✅ Login successful with Supabase:', data.session.user.email);
        if (mountedRef.current) {
          setUser(data.session.user);
          setAuthStatus('authenticated');
        }
        
        // ✅ CORREÇÃO: Redirecionamento forçado
        setTimeout(() => {
          if (mountedRef.current) {
            console.log('🚀 Forcing redirect to admin');
            window.location.href = '/admin/projects';
          }
        }, 300);
        
        return true;
      }

      console.log('❌ Login failed: no session returned');
      if (mountedRef.current) {
        setAuthStatus('unauthenticated');
        setUser(null);
      }
      return false;
      
    } catch (error) {
      console.error('💥 Login error:', error);
      if (mountedRef.current) {
        setAuthStatus('unauthenticated');
        setUser(null);
      }
      return false;
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out from Supabase...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
      } else {
        console.log('✅ Logout successful');
      }
      
    } catch (error) {
      console.error('💥 Logout error:', error);
    } finally {
      // ✅ CORREÇÃO: Sempre limpar estado
      if (mountedRef.current) {
        setUser(null);
        setAuthStatus('unauthenticated');
      }
      
      // Redirecionar para login
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 100);
    }
  };

  return (
    <AuthContext.Provider value={{ authStatus, user, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
