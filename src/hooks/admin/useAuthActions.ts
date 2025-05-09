
import { ConnectionStatus, SecurityStatus } from '@/types/admin-auth';
import { useConnectionTest } from '@/hooks/admin/useConnectionTest';
import { useSecurityCheck } from '@/hooks/admin/useSecurityCheck';
import { useAuthentication } from '@/hooks/admin/useAuthentication';

interface UseAuthActionsProps {
  setIsLoading: (loading: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSecurityStatus: (status: SecurityStatus) => void;
  offlineMode?: boolean;
}

export function useAuthActions({
  setIsLoading,
  setConnectionStatus,
  setSecurityStatus,
  offlineMode = false
}: UseAuthActionsProps) {
  // Use the security check hook
  const { checkSecurityStatus } = useSecurityCheck({ 
    setSecurityStatus,
    offlineMode 
  });
  
  // The issue is here - we need to use the hook without parameters
  const { connectionStatus, errorDetails, testConnection } = useConnectionTest();
  
  // Use the authentication hook
  const { login, logout } = useAuthentication({
    testConnection,
    checkSecurityStatus,
    offlineMode
  });

  return {
    login,
    logout,
    testConnection,
    checkSecurityStatus
  };
}
