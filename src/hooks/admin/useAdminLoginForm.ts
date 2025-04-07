import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { AdminLoginFormData } from '@/types/admin';
import { testSupabaseConnection, testAuthSettings, securityService } from '@/lib/supabase';

interface ConnectionStatus {
  tested: boolean;
  connected: boolean;
  message: string;
}

interface DiagnosticInfo {
  supabaseUrl: string;
  authSettings: any;
  securitySettings: any;
}

export function useAdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [detailedErrorInfo, setDetailedErrorInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<DiagnosticInfo>({
    supabaseUrl: '',
    authSettings: null,
    securitySettings: null,
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    tested: false,
    connected: false,
    message: 'Aguardando teste de conexão...',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to test the connection to Supabase
  const testConnection = useCallback(async () => {
    setIsLoading(true);
    setConnectionStatus({ tested: false, connected: false, message: 'Testando conexão...' });
    
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setConnectionStatus({ tested: true, connected: true, message: result.message });
      } else {
        setConnectionStatus({ tested: true, connected: false, message: 'Falha ao conectar: ' + result.message });
      }
    } catch (error: any) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus({
        tested: true,
        connected: false,
        message: 'Erro ao testar conexão: ' + (error.message || 'Erro desconhecido'),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    setDetailedErrorInfo(null);

    try {
      const { data: authResponse, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Erro de login:', error);
        setLoginError('Credenciais inválidas. Verifique seu email e senha.');
        setDetailedErrorInfo(error);
        toast({
          title: "Erro ao logar",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(true);
        localStorage.setItem('harmonia-admin-auth-token', authResponse.session?.access_token || '');
        localStorage.setItem('harmonia-admin-auth-user', JSON.stringify(authResponse.session?.user));
        navigate('/admin-j28s7d1k/dashboard');
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a) ${authResponse.session?.user.email}`,
        });
      }
    } catch (err: any) {
      console.error('Erro durante o login:', err);
      setLoginError('Ocorreu um erro ao processar o login. Tente novamente mais tarde.');
      setDetailedErrorInfo(err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar o login. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to retry the connection
  const handleRetryConnection = async () => {
    await testConnection();
  };

  // Function to run diagnostics
  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const auth = await testAuthSettings();
      const security = await securityService.checkSettings();
      setDebugInfo(prev => ({
        ...prev,
        authSettings: auth.settings,
        securitySettings: security.settings
      }));
      toast({
        title: "Diagnóstico completo",
        description: "As configurações foram verificadas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao executar diagnóstico:', error);
      toast({
        title: "Erro no diagnóstico",
        description: "Ocorreu um erro ao executar o diagnóstico. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin-j28s7d1k/atualizar-senha`,
      });

      if (error) {
        console.error('Erro ao solicitar reset de senha:', error);
        toast({
          title: "Erro ao resetar senha",
          description: "Ocorreu um erro ao solicitar o reset de senha. Verifique o email e tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Enviamos um link para resetar sua senha. Verifique sua caixa de entrada e spam.",
        });
        setShowPasswordReset(false);
      }
    } catch (error: any) {
      console.error('Erro ao enviar email de reset:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar o email de reset. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load debug information
  const loadDebugInfo = useCallback(() => {
    setDebugInfo(prev => ({
      ...prev,
      supabaseUrl: supabase.getUrl ? supabase.getUrl() : 'URL não disponível',
    }));
  }, []);
  
  const enableOfflineMode = async (): Promise<void> => {
    try {
      sessionStorage.setItem('offline-admin-mode', 'true');
      localStorage.setItem('harmonia-admin-auth-token', 'DEMO_TOKEN');
      
      const demoUser = {
        id: 'demo-user',
        email: 'demo@harmonia.ai',
        role: 'admin',
        name: 'Usuário Demo'
      };
      
      localStorage.setItem('harmonia-admin-auth-user', JSON.stringify(demoUser));
      console.log('Modo offline ativado');
      
      // Usando void para garantir que o tipo de retorno é Promise<void>
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao ativar modo offline:', error);
      return Promise.resolve();
    }
  };
  
  return {
    isLoading,
    loginError,
    showPasswordReset,
    setShowPasswordReset,
    detailedErrorInfo,
    debugInfo,
    connectionStatus,
    isAuthenticated,
    handleSubmit,
    handleRetryConnection,
    runDiagnostics,
    handlePasswordReset,
    loadDebugInfo,
    enableOfflineMode,
  };
}
