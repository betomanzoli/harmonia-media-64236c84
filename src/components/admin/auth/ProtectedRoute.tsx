
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authStatus } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Add more detailed logging to help with debugging
  console.log('ProtectedRoute state:', { 
    authStatus, 
    path: location.pathname, 
    time: new Date().toISOString() 
  });

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    // If loading takes more than 3 seconds, redirect to login
    const timeoutId = setTimeout(() => {
      if (authStatus === 'loading') {
        console.log('Timeout atingido, redirecionando para login');
        // Force redirect to login
        window.location.href = '/admin-login';
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [authStatus]);

  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current path in state
  if (authStatus !== 'authenticated') {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
