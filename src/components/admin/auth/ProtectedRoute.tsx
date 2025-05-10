
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
    // If loading takes more than 2 seconds, check again
    const timeoutId = setTimeout(() => {
      if (authStatus === 'loading') {
        console.log('Auth timeout reached, checking auth status again');
        checkAuthStatus();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [authStatus, checkAuthStatus]);

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
    console.log('User not authenticated, redirecting to login');
    
    // Use Navigate component instead of directly modifying window.location
    // This allows React Router to handle the navigation properly
    return <Navigate to="/admin-j28s7d1k" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
