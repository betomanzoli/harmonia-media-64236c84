
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
};

export default AuthContext;
