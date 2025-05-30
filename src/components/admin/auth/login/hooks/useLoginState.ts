
import { useState } from 'react';

type AuthenticateFunction = (email: string, password: string) => Promise<boolean>;

export function useLoginState(onAuthenticate?: AuthenticateFunction) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [showDetailedError, setShowDetailedError] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  
  // Handler for email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  // Handler for password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // Toggle diagnostic information
  const toggleDiagnostics = () => {
    setShowConnectionStatus(prev => !prev);
    setShowDetailedError(prev => !prev);
  };
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLoginErrorMessage('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    setLoginErrorMessage(null);
    
    try {
      if (onAuthenticate) {
        const success = await onAuthenticate(email, password);
        
        if (success) {
          setLoginSuccess(true);
          console.log('Login bem-sucedido');
        } else {
          setLoginErrorMessage('Credenciais inválidas. Por favor, tente novamente.');
          console.log('Login falhou: credenciais inválidas');
        }
      } else {
        // Demo mode without authentication function
        console.log('Modo demonstração (sem função de autenticação)');
        
        // Simulate successful login after delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoginSuccess(true);
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      setLoginErrorMessage('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password reset
  const handlePasswordReset = async (resetEmail: string) => {
    setIsLoading(true);
    
    try {
      // Simulate password reset after delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Redefinição de senha solicitada para:', resetEmail);
      setIsPasswordResetOpen(false);
    } catch (error) {
      console.error('Erro ao processar redefinição de senha:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    email,
    password,
    isLoading,
    loginSuccess,
    loginErrorMessage,
    showDetailedError,
    showConnectionStatus,
    isPasswordResetOpen,
    setIsPasswordResetOpen,
    handleEmailChange,
    handlePasswordChange,
    toggleDiagnostics,
    handleLogin,
    handlePasswordReset
  };
}
