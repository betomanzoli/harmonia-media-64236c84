
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { LoginFormData } from '@/types/admin-auth';

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
      // Validação simples
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }
      
      // Simulação de login para o ambiente de desenvolvimento local
      // Em produção, este bloco seria substituído pela autenticação real
      if (process.env.NODE_ENV === 'development') {
        // Credenciais de teste para desenvolvimento
        if (email === 'admin@harmonia.ai' && password === 'senha123') {
          localStorage.setItem('adminAuth', JSON.stringify({
            user: { email },
            session: { expires_at: Date.now() + 3600000, access_token: 'fake-token-for-development' },
          }));
          
          setSuccess(true);
          setTimeout(() => {
            window.location.href = '/admin-j28s7d1k/dashboard';
          }, 1500);
          return;
        }
      }
      
      // Autenticação real com Supabase (não executada em desenvolvimento com as credenciais acima)
      const auth = supabase.auth;
      const { error: loginError } = await auth.signInWithPassword({
        email,
        password,
      });
      
      if (loginError) throw loginError;
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/admin-j28s7d1k/dashboard';
      }, 1500);
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Ocorreu um erro durante o login.';
      
      // Melhorar mensagens de erro para o usuário
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (errorMessage.includes('Email not confirmed')) {
        userFriendlyMessage = 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada.';
      }
      
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const handleResetPassword = useCallback(async () => {
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);
    
    try {
      if (!resetEmail) {
        throw new Error('Por favor, informe seu email.');
      }
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin-reset-password`,
      });
      
      if (resetError) throw resetError;
      
      setResetSuccess(true);
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        variant: 'default',
      });
      
      setTimeout(() => {
        setShowPasswordReset(false);
        // Limpar o estado após fechar o diálogo
        setTimeout(() => {
          setResetSuccess(false);
          setResetEmail('');
        }, 300);
      }, 3000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
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

  const formState: LoginFormData = {
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
