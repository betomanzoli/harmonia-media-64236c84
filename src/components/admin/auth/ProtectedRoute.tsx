
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authStatus, checkAuthStatus } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Add more detailed logging to help with debugging
  console.log('ProtectedRoute state:', { 
    authStatus, 
    path: location.pathname, 
    time: new Date().toISOString() 
  });

  // Refresh authentication state when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    // If loading takes more than 3 seconds, redirect to login
    const timeoutId = setTimeout(() => {
      if (authStatus === 'loading') {
        console.log('Timeout atingido, redirecionando para login');
        toast({
          title: "Problema de autenticação",
          description: "Não foi possível verificar seu login. Por favor, faça login novamente.",
          variant: "destructive"
        });
        // Force redirect to login
        window.location.href = '/admin-j28s7d1k/login';
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [authStatus, toast]);

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
    
    // Use Navigate component instead of directly modifying window.location
    // This allows React Router to handle the navigation properly
    return <Navigate to="/admin-j28s7d1k/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
