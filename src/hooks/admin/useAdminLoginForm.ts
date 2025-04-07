
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useDiagnostics } from '@/hooks/admin/useDiagnostics';
import { useLoginOperations } from '@/hooks/admin/useLoginOperations';

export interface DebugInfo {
  connectionDetails: string;
  authSettings: string;
  supabaseUrl: string;
  storageInfo: string;
}

export function useAdminLoginForm() {
  const { login, connectionStatus, testConnection, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [detailedErrorInfo, setDetailedErrorInfo] = useState<string>('');
  const { toast } = useToast();

  // Import diagnostic functionality
  const { 
    debugInfo, 
    loadDebugInfo, 
    runDiagnostics 
  } = useDiagnostics();

  // Import login operations
  const { 
    handleSubmit, 
    handleRetryConnection, 
    handlePasswordReset 
  } = useLoginOperations({
    login,
    testConnection,
    navigate,
    setIsLoading,
    setLoginError,
    setDetailedErrorInfo,
    toast,
    loadDebugInfo
  });

  return {
    isLoading,
    loginError,
    showPasswordReset,
    setShowPasswordReset,
    detailedErrorInfo,
    debugInfo,
    connectionStatus,
    isAuthenticated,
    handleSubmit,
    handleRetryConnection,
    runDiagnostics,
    handlePasswordReset,
    loadDebugInfo
  };
}
