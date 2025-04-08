
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  success: boolean;
  error: string | null;
  showPasswordReset: boolean;
  resetEmail: string;
  resetLoading: boolean;
  resetSuccess: boolean;
  resetError: string | null;
}

export const useAdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(false);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleResetEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }
      
      // Verificar credenciais específicas
      if (email === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt') {
        // Armazenar informações de autenticação
        localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
        localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email, role: 'admin' }));
        
        setSuccess(true);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o painel administrativo...'
        });
        
        setTimeout(() => {
          window.location.href = '/admin-j28s7d1k/dashboard';
        }, 1000);
        return;
      }
      
      // Caso as credenciais não sejam as esperadas
      throw new Error('Credenciais inválidas. Por favor, verifique seu email e senha.');
      
    } catch (err: any) {
      console.error('Erro de login:', err);
      const errorMessage = err.message || 'Ocorreu um erro durante o login.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, toast]);

  const handleResetPassword = useCallback(async () => {
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);
    
    try {
      if (!resetEmail) {
        throw new Error('Por favor, forneça seu email.');
      }
      
      // Simular envio de email de redefinição
      if (resetEmail === 'contato@harmonia.media') {
        setResetSuccess(true);
        toast({
          title: 'Email enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
          variant: 'default',
        });
        
        setTimeout(() => {
          setShowPasswordReset(false);
          // Limpar estado após fechar o diálogo
          setTimeout(() => {
            setResetSuccess(false);
            setResetEmail('');
          }, 300);
        }, 3000);
      } else {
        throw new Error('Email não encontrado no sistema.');
      }
      
    } catch (err: any) {
      console.error('Erro na redefinição de senha:', err);
      setResetError(err.message || 'Ocorreu um erro ao solicitar a redefinição de senha.');
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail, toast]);

  const closeResetDialog = useCallback(() => {
    setShowPasswordReset(false);
    setResetEmail('');
    setResetError(null);
    setResetSuccess(false);
  }, []);

  const openResetDialog = useCallback(() => {
    setShowPasswordReset(true);
  }, []);

  const formState: LoginFormState = {
    email,
    password,
    loading,
    success,
    error,
    resetEmail,
    resetLoading,
    resetSuccess,
    resetError,
    showPasswordReset,
  };

  const formHandlers = {
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    resetForm,
    handleResetEmailChange,
    handleResetPassword,
    openResetDialog,
    closeResetDialog,
  };

  return { formState, formHandlers };
};
