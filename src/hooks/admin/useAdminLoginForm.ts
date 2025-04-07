
import { useState } from 'react';
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

  const loadDebugInfo = async () => {
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
  };

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
    await testConnection();
    await loadDebugInfo();
    setIsLoading(false);
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      const connectionTest = await testSupabaseConnection();
      const authTest = await testAuthSettings();
      
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify(connectionTest, null, 2),
        authSettings: JSON.stringify(authTest, null, 2),
      }));
      
      toast({
        title: 'Diagnóstico concluído',
        description: 'Informações de diagnóstico foram atualizadas',
      });
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao executar diagnóstico',
        variant: 'destructive',
      });
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
