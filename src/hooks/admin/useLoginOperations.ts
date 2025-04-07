
import { useToast } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';

interface LoginOperationsProps {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  testConnection: () => Promise<void>;
  navigate: NavigateFunction;
  setIsLoading: (loading: boolean) => void;
  setLoginError: (error: string | null) => void;
  setDetailedErrorInfo: (info: string) => void;
  toast: ReturnType<typeof useToast>;
  loadDebugInfo: () => Promise<void>;
}

export function useLoginOperations({
  login,
  testConnection,
  navigate,
  setIsLoading,
  setLoginError,
  setDetailedErrorInfo,
  toast,
  loadDebugInfo
}: LoginOperationsProps) {
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
        toast.toast({
          title: 'Falha no login',
          description: error || 'Credenciais inválidas. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Erro durante login:", error);
      setLoginError('Ocorreu um erro durante o login');
      setDetailedErrorInfo(error.message || 'Erro desconhecido');
      toast.toast({
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

      // Testa a conexão
      console.log('Tentando reconectar...');
      await testConnection();
      
      // Atualiza informações de diagnóstico
      await loadDebugInfo();
      
      // Se chegou até aqui sem erros, mostra um toast de sucesso
      toast.toast({
        title: 'Conexão reestabelecida',
        description: 'Conexão foi restaurada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao reconectar:', error);
      setLoginError('Falha ao tentar reconectar');
      setDetailedErrorInfo(error instanceof Error ? error.message : 'Erro desconhecido');
      
      toast.toast({
        title: 'Falha na reconexão',
        description: 'Não foi possível restabelecer a conexão. Verifique sua rede.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async (email: string) => {
    if (!email || !email.includes('@')) {
      toast.toast({
        title: 'Email inválido',
        description: 'Por favor, forneça um email válido para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular envio de email para redefinição de senha no modo offline
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para instruções de redefinição de senha.',
      });
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast.toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    handleRetryConnection,
    handlePasswordReset
  };
}
