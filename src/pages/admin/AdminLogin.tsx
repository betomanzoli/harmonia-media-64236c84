
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { localAuthService } from '@/lib/auth/localAuthService';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Get the pathname to redirect to after login
  const from = location.state?.from?.pathname || '/admin-j28s7d1k/dashboard';
  
  // Check if already authenticated
  useEffect(() => {
    console.log('AdminLogin montado, verificando autenticação...');
    
    const timeoutId = setTimeout(() => {
      // Adding a timeout to prevent infinite loading
      setIsCheckingAuth(false);
    }, 1000); // Reduced timeout to 1 second
    
    if (!isLoading) {
      clearTimeout(timeoutId);
      setIsCheckingAuth(false);
      
      if (isAuthenticated) {
        console.log('Usuário já autenticado, redirecionando para o dashboard');
        navigate(from, { replace: true });
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, isAuthenticated, navigate, from]);
  
  // Function to authenticate with correct credentials
  const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
    console.log('Tentando autenticar com:', email);
    
    try {
      const result = await localAuthService.login(email, password);
      
      if (result.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o painel administrativo...'
        });
        
        navigate(from, { replace: true });
        return true;
      } else {
        console.log('Falha na autenticação:', result.error);
        toast({
          title: 'Erro de autenticação',
          description: result.error || 'Credenciais inválidas',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      toast({
        title: 'Erro de sistema',
        description: 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  if (isLoading || isCheckingAuth) {
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
