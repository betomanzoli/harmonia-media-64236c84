
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useLoginState = (onAuthenticate?: (email: string, password: string) => boolean) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [showDetailedError, setShowDetailedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Toggle diagnostic panel
  const toggleDiagnostics = useCallback(() => {
    setShowConnectionStatus(!showConnectionStatus);
  }, [showConnectionStatus]);
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginErrorMessage(null);
    
    console.log("Tentando login com:", email, password);
    
    try {
      // Add a short delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use provided authentication function if available
      if (onAuthenticate) {
        const success = onAuthenticate(email, password);
        if (success) {
          return; // Redirect is handled in onAuthenticate
        } else {
          setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
        }
      } else {
        setLoginErrorMessage('Nenhum método de autenticação foi configurado.');
      }
    } catch (error) {
      console.error("Erro durante login:", error);
      setLoginErrorMessage('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // Handle password reset request
  const handlePasswordReset = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Email enviado",
      description: "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
    });
    setIsPasswordResetOpen(false);
  };
  
  return {
    activeTab,
    setActiveTab,
    showConnectionStatus,
    setShowConnectionStatus,
    isPasswordResetOpen,
    setIsPasswordResetOpen,
    loginErrorMessage,
    setLoginErrorMessage,
    showDetailedError,
    setShowDetailedError,
    isLoading,
    setIsLoading,
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    toggleDiagnostics,
    handleLogin,
    handlePasswordReset
  };
};
