
import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection, securityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AdminAuthContext from '@/context/AdminAuthContext';
import { AdminAuthProviderProps, ConnectionStatus } from '@/types/admin-auth';
import { User } from '@supabase/supabase-js';

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    tested: false,
    connected: false
  });
  const [securityStatus, setSecurityStatus] = useState<{
    checked: boolean;
    hasIssues: boolean;
    details?: any;
  }>({
    checked: false,
    hasIssues: false
  });
  const { toast } = useToast();
  
  // Função para testar a conexão com o Supabase
  const testConnection = async (): Promise<void> => {
    try {
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
      
      console.log('Status da conexão após teste:', result.connected ? 'Conectado' : 'Desconectado');
      if (!result.connected) {
        console.error('Erro de conexão:', result.error);
      } else {
        // Se conectado, verificar status de segurança
        checkSecurityStatus();
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus({
        tested: true,
        connected: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
  
  // Função para verificar o status de segurança
  const checkSecurityStatus = async () => {
    try {
      const result = await securityService.validateSecurity();
      
      setSecurityStatus({
        checked: true,
        hasIssues: !result.success,
        details: result
      });
      
      if (!result.success) {
        console.warn('Problemas de segurança detectados:', result.error);
        toast({
          title: 'Alerta de Segurança',
          description: 'Foram detectados problemas de segurança no Supabase. Acesse as configurações de segurança para resolver.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status de segurança:', error);
      setSecurityStatus({
        checked: true,
        hasIssues: true,
        details: {
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      });
    }
  };
  
  useEffect(() => {
    // Verificar se há uma sessão ativa
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
  
  const login = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com email:", email);
      
      // Verificar conexão primeiro
      await testConnection();
      
      if (!connectionStatus.connected) {
        return { 
          success: false, 
          error: `Problema de conexão com o Supabase: ${connectionStatus.error}` 
        };
      }
      
      console.log('Executando login com Supabase...');
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
      
      // Verificar configurações de segurança após login
      checkSecurityStatus();
      
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
    <AdminAuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        connectionStatus,
        securityStatus,
        login, 
        logout,
        testConnection,
        checkSecurityStatus
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
