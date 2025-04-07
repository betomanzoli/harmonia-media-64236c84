
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: {
    tested: boolean;
    connected: boolean;
    error?: string;
  };
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  testConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    error?: string;
  }>({
    tested: false,
    connected: false
  });
  const { toast } = useToast();
  
  // Função para testar a conexão com o Supabase
  const testConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionStatus({
      tested: true,
      connected: result.connected,
      error: result.error
    });
    
    if (!result.connected) {
      toast({
        title: 'Problema de conexão',
        description: `Não foi possível conectar ao Supabase: ${result.error}`,
        variant: 'destructive',
      });
    }
    
    return result;
  };
  
  useEffect(() => {
    // Verificar se há uma sessão ativa
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
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
        
        // Testar a conexão com o banco de dados
        await testConnection();
        
      } catch (err) {
        console.error("Erro ao checar autenticação:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Executar verificação inicial
    checkSession();
    
    // Configurar listener para mudanças de autenticação
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
    
    // Limpar listener ao desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Tentando fazer login com email:", email);
      
      // Verificar conexão primeiro
      const connectionTest = await testConnection();
      if (!connectionTest.connected) {
        return { 
          success: false, 
          error: `Problema de conexão com o Supabase: ${connectionTest.error}` 
        };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro de autenticação:", error);
        return { 
          success: false, 
          error: error.message || 'Falha na autenticação' 
        };
      }
      
      console.log("Login bem-sucedido:", data.user);
      setUser(data.user);
      
      toast({
        title: 'Login bem-sucedido',
        description: `Bem-vindo, ${data.user?.email}!`,
      });
      
      return { success: true };
    } catch (err: any) {
      console.error("Exceção durante login:", err);
      return { 
        success: false, 
        error: err.message || 'Ocorreu um erro durante o login' 
      };
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logout',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      toast({
        title: 'Erro',
        description: 'Falha ao desconectar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        connectionStatus,
        login, 
        logout,
        testConnection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Renomeando o hook de useAuth para useAdminAuth para consistência
export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
};

// Mantendo useAuth para compatibilidade com o código existente
export const useAuth = useAdminAuth;

export default AuthContext;
