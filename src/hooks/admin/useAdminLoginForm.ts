
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { testSupabaseConnection, testAuthSettings, supabase, getSupabaseUrl } from '@/lib/supabase';

export interface DebugInfo {
  connectionDetails: string;
  authSettings: string;
  supabaseUrl: string;
  storageInfo: string;
}

export function useAdminLoginForm() {
  const { login, connectionStatus, testConnection, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [detailedErrorInfo, setDetailedErrorInfo] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    connectionDetails: 'Não testado',
    authSettings: 'Não testado',
    supabaseUrl: '',
    storageInfo: '',
  });
  const { toast } = useToast();

  const loadDebugInfo = useCallback(async () => {
    try {
      const supabaseUrlInfo = getSupabaseUrl() || 'URL não disponível';
      
      let storageInfo = 'Não disponível';
      try {
        const storageTested = localStorage.getItem('harmonia-admin-auth-tested');
        const storageSession = localStorage.getItem('harmonia-admin-auth');
        storageInfo = `Teste: ${storageTested ? 'Presente' : 'Ausente'}, Sessão: ${storageSession ? 'Presente' : 'Ausente'}`;
      } catch (e) {
        storageInfo = `Erro ao acessar localStorage: ${e instanceof Error ? e.message : 'Desconhecido'}`;
      }
      
      setDebugInfo(prev => ({
        ...prev,
        supabaseUrl: supabaseUrlInfo,
        storageInfo
      }));
    } catch (e) {
      console.error('Erro ao carregar informações de diagnóstico:', e);
    }
  }, []);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError(null);
    setDetailedErrorInfo('');
    
    console.log("Tentando fazer login com:", { email: values.email });
    
    try {
      localStorage.setItem('harmonia-admin-auth-tested', 'true');
    } catch (e) {
      console.warn('Não foi possível usar localStorage:', e);
    }
    
    try {
      const { success, error } = await login(values.email, values.password);
      
      if (success) {
        navigate('/admin-j28s7d1k/dashboard');
      } else {
        console.error("Erro de login:", error);
        setLoginError(error || 'Credenciais inválidas. Por favor, tente novamente.');
        toast({
          title: 'Falha no login',
          description: error || 'Credenciais inválidas. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Erro durante login:", error);
      setLoginError('Ocorreu um erro durante o login');
      setDetailedErrorInfo(error.message || 'Erro desconhecido');
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = async () => {
    setIsLoading(true);
    try {
      // Limpar erros anteriores
      setLoginError(null);
      setDetailedErrorInfo('');

      // Verifica se há internet
      if (!navigator.onLine) {
        throw new Error('Sem conexão com a internet. Verifique sua rede e tente novamente.');
      }

      // Testa a conexão com o Supabase
      console.log('Tentando reconectar com o Supabase...');
      await testConnection();
      
      // Atualiza informações de diagnóstico
      await loadDebugInfo();
      
      // Se chegou até aqui sem erros, mostra um toast de sucesso
      if (connectionStatus.connected) {
        toast({
          title: 'Conexão reestabelecida',
          description: 'Conexão com o Supabase foi restaurada com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao reconectar:', error);
      setLoginError('Falha ao tentar reconectar');
      setDetailedErrorInfo(error instanceof Error ? error.message : 'Erro desconhecido');
      
      toast({
        title: 'Falha na reconexão',
        description: 'Não foi possível restabelecer a conexão. Verifique sua rede.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      // Verificação básica de conectividade com a internet
      if (!navigator.onLine) {
        throw new Error('Sem conexão com a internet. Verifique sua rede.');
      }

      // Teste do endpoint do Supabase
      const supabaseUrl = getSupabaseUrl();
      
      // Adicionar timestamp para evitar cache
      const testUrl = `${supabaseUrl}/.well-known/ready?ts=${Date.now()}`;
      console.log('Testando disponibilidade do Supabase via fetch direto:', testUrl);
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          // Tempo limite de 5 segundos
          signal: AbortSignal.timeout(5000)
        });
        
        const connectivityStatus = response.ok 
          ? 'Endpoint do Supabase está respondendo' 
          : `Endpoint responde com status ${response.status}`;
        
        console.log('Resposta do teste de disponibilidade:', connectivityStatus);
      } catch (fetchErr) {
        console.error('Erro no teste direto do endpoint:', fetchErr);
      }
      
      // Testes padrão
      const connectionTest = await testSupabaseConnection();
      const authTest = await testAuthSettings();
      
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify(connectionTest, null, 2),
        authSettings: JSON.stringify(authTest, null, 2),
      }));
      
      toast({
        title: 'Diagnóstico concluído',
        description: connectionTest.connected 
          ? 'Conexão com o Supabase estabelecida com sucesso!' 
          : 'Problemas de conexão detectados. Verifique os detalhes.',
      });
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao executar diagnóstico completo.',
        variant: 'destructive',
      });
      
      // Atualiza as informações de erro para exibição
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify({
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
          online: navigator.onLine
        }, null, 2)
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async (email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, forneça um email válido para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin-reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para instruções de redefinição de senha.',
      });
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
    loadDebugInfo
  };
}
