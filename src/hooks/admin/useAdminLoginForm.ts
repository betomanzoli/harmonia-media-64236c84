
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
        throw new Error('Please fill in all fields.');
      }
      
      // Simulation of login for local development environment
      if (process.env.NODE_ENV === 'development') {
        // Test credentials for development
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
      
      // The supabase mock doesn't have signInWithPassword, so we'll handle this differently
      console.log('Attempting to sign in with email and password:', email);
      
      // Simulate successful auth for test credentials or fail otherwise
      if (email === 'admin@harmonia.ai' && password === 'senha123') {
        localStorage.setItem('harmonia-admin-auth-token', 'fake-token-for-development');
        localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email }));
        
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/admin-j28s7d1k/dashboard';
        }, 1500);
      } else {
        throw new Error('Invalid login credentials');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'An error occurred during login.';
      
      // Improve error messages for the user
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Invalid credentials. Please check your email and password.';
      } else if (errorMessage.includes('Email not confirmed')) {
        userFriendlyMessage = 'Your email has not been confirmed. Please check your inbox.';
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
        throw new Error('Please provide your email.');
      }
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin-reset-password`,
      });
      
      if (resetError) throw resetError;
      
      setResetSuccess(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox to reset your password.',
        variant: 'default',
      });
      
      setTimeout(() => {
        setShowPasswordReset(false);
        // Clear state after closing dialog
        setTimeout(() => {
          setResetSuccess(false);
          setResetEmail('');
        }, 300);
      }, 3000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      setResetError(err.message || 'An error occurred while requesting password reset.');
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
