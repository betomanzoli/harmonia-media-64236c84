
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/admin-login' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // If no session, user is not authenticated
        if (!session) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Check if user has admin role in our database
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (userError || !userData) {
          console.error("Error checking admin status or user is not admin:", userError);
          setIsAuthenticated(true);
          setIsAdmin(false);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="mt-4 text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if authenticated and admin
  return <>{children}</>;
};

export default ProtectedRoute;
