
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ConnectionStatus, SecurityStatus } from '@/types/admin-auth';

export function useAuthState(offlineMode: boolean = false) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    tested: false,
    connected: false
  });
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    checked: false,
    hasIssues: false
  });

  // Effect to verify authentication session on mount
  useEffect(() => {
    // If in offline mode, set a mock user and skip real auth
    if (offlineMode) {
      console.log('Usando modo offline - simulando autenticação');
      setUser({
        id: 'offline-user-id',
        email: 'demo@example.com',
        app_metadata: { provider: 'offline' },
        user_metadata: { name: 'Demo User' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User);
      setIsLoading(false);
      setConnectionStatus({
        tested: true,
        connected: true, // Pretend we're connected in offline mode
        details: { offlineMode: true }
      });
      return;
    }
    
    // Check for active session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log('Verificando sessão de autenticação...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          throw error;
        }
        
        if (data?.session) {
          console.log("Sessão encontrada:", data.session.user.email);
          setUser(data.session.user);
        } else {
          console.log("Nenhuma sessão encontrada");
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao checar autenticação:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Execute initial verification
    checkSession();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Evento de autenticação:", event);
        if (session?.user) {
          console.log("Usuário autenticado:", session.user.email);
          setUser(session.user);
        } else {
          console.log("Usuário desconectado");
          setUser(null);
        }
      }
    );
    
    // Clean up listener when unmounting
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [offlineMode]);

  return {
    user,
    isLoading,
    setIsLoading,
    connectionStatus,
    setConnectionStatus,
    securityStatus,
    setSecurityStatus,
    isAuthenticated: offlineMode ? true : !!user
  };
}
