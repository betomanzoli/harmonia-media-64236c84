
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  
  // Verificar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem('harmonia-admin-auth-token');
    const userJson = localStorage.getItem('harmonia-admin-auth-user');
    
    if (token && userJson) {
      // Usuário já está autenticado, redirecionar para o dashboard
      navigate('/admin-j28s7d1k/dashboard');
    }
  }, [navigate]);
  
  return <AdminLoginContainer />;
};

export default AdminLogin;
