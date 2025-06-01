
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginContainer from '@/components/admin/auth/login/AdminLoginContainer';
import { useAuth } from '@/contexts/AuthContext';

const NewAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { authStatus, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log('🔍 [NewAdminLogin] Auth status changed:', authStatus, user?.email);

    if (authStatus === 'authenticated' && user) {
      console.log('✅ User is authenticated, redirecting to admin...');
      navigate('/admin/projects', { replace: true });
    }
  }, [authStatus, user, navigate, mounted]);

  const handleAuthenticate = async (email: string, password: string): Promise<boolean> => {
    console.log('🎉 Authentication callback triggered');
    // The actual authentication logic is handled by the AuthContext
    // This is just a callback for when authentication succeeds
    navigate('/admin/projects', { replace: true });
    return true;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
      </div>
    );
  }

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
          <p className="text-gray-400 text-sm mt-2">Conectando com Supabase...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'authenticated') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p className="text-white">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminLoginContainer onAuthenticate={handleAuthenticate} />
    </div>
  );
};

export default NewAdminLogin;
