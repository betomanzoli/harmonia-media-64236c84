
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { authStatus, login } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Get the pathname to redirect to after login
  const from = location.state?.from?.pathname || '/admin-j28s7d1k/dashboard';
  
  // Check if already authenticated
  useEffect(() => {
    console.log('AdminLogin mounted, checking authentication...', authStatus);
    
    if (authStatus === 'authenticated') {
      console.log('User already authenticated, redirecting to dashboard');
      navigate(from, { replace: true });
    } else {
      // Only set isCheckingAuth to false when we have a definitive authStatus
      if (authStatus !== 'loading') {
        setIsCheckingAuth(false);
      }
    }
  }, [authStatus, navigate, from]);
  
  // Function to authenticate with correct credentials
  const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting to authenticate with:', email);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o painel administrativo...'
        });
        
        navigate(from, { replace: true });
        return true;
      } else {
        console.log('Authentication failed');
        toast({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: 'Erro de sistema',
        description: 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  if (authStatus === 'loading' || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  return <AdminLoginContainer onAuthenticate={authenticateAdmin} />;
};

export default AdminLogin;
