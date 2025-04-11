
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useLoginState = (onAuthenticate?: (email: string, password: string) => boolean) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [showDetailedError, setShowDetailedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Toggle diagnostic panel
  const toggleDiagnostics = () => {
    setShowConnectionStatus(!showConnectionStatus);
  };
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginErrorMessage(null);
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log("Tentando login com:", email);
    
    try {
      // Add a short delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use the provided authentication function if available
      if (onAuthenticate) {
        const success = onAuthenticate(email, password);
        if (success) {
          // Navigate after successful login
          toast({
            title: "Login bem-sucedido",
            description: "Você está sendo redirecionado para o painel administrativo.",
          });
          navigate('/admin-j28s7d1k/dashboard');
          return;
        } else {
          setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback authentication logic
      if ((email === 'admin@harmonia.com' && password === 'admin123456') || 
          (email === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt')) {
        // Store authentication information
        localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
        localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ 
          id: email === 'admin@harmonia.com' ? 'admin-1' : 'admin-2',
          email, 
          role: 'admin',
          createdAt: new Date().toISOString()
        }));
        
        toast({
          title: "Login bem-sucedido",
          description: "Você está sendo redirecionado para o painel administrativo.",
        });
        
        // Navigate to dashboard
        navigate('/admin-j28s7d1k/dashboard');
      } else {
        setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
      }
    } catch (error) {
      console.error("Erro durante login:", error);
      setLoginErrorMessage('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
    toggleDiagnostics,
    handleLogin,
    handlePasswordReset
  };
};
