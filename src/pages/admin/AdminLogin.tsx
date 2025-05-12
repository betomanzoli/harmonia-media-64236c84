
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('harmonia-admin-auth-token');
    const userJson = localStorage.getItem('harmonia-admin-auth-user');
    
    if (token && userJson) {
      console.log('Usuário já autenticado, redirecionando para o dashboard');
      // User is already authenticated, redirect to dashboard
      navigate('/admin-j28s7d1k/dashboard');
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);
  
  // Function to authenticate manually with fixed credentials
  const authenticateAdmin = (email: string, password: string): boolean => {
    // Check specific credentials
    if (email === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt') {
      // Store authentication information
      localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
      localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email, role: 'admin' }));
      
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando para o painel administrativo...'
      });
      
      return true;
    }
    
    return false;
  };
  
  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Verificando autenticação...</div>;
  }
  
  return <AdminLoginContainer onAuthenticate={authenticateAdmin} />;
};

export default AdminLogin;
