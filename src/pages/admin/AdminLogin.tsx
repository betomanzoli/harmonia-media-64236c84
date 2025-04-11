
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2 } from 'lucide-react';

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
    const timeoutId = setTimeout(() => {
      // Adding a timeout to prevent infinite loading
      setIsCheckingAuth(false);
    }, 2000);
    
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
  
  // Function to authenticate with fixed credentials
  const authenticateAdmin = (email: string, password: string): boolean => {
    // Check specific credentials
    if (email === 'admin@harmonia.com' && password === 'admin123456') {
      // Store authentication information
      localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
      localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ 
        id: 'admin-1',
        email, 
        role: 'admin',
        createdAt: new Date().toISOString()
      }));
      
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando para o painel administrativo...'
      });
      
      navigate(from, { replace: true });
      return true;
    }
    
    return false;
  };
  
  if (isLoading && isCheckingAuth) {
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
