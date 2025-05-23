
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/admin-j28s7d1k/login'
}) => {
  const { authStatus, checkAuthStatus } = useAdminAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const validateAuth = async () => {
      await checkAuthStatus();
      setIsChecking(false);
    };
    
    validateAuth();
  }, [checkAuthStatus]);

  if (isChecking || authStatus === 'loading') {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    // Redirect to login page if not authenticated
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
