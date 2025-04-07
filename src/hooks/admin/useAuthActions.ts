
import { ConnectionStatus, SecurityStatus } from '@/types/admin-auth';
import { useConnectionTest } from '@/hooks/admin/useConnectionTest';
import { useSecurityCheck } from '@/hooks/admin/useSecurityCheck';
import { useAuthentication } from '@/hooks/admin/useAuthentication';

interface UseAuthActionsProps {
  setIsLoading: (loading: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSecurityStatus: (status: SecurityStatus) => void;
}

export function useAuthActions({
  setIsLoading,
  setConnectionStatus,
  setSecurityStatus
}: UseAuthActionsProps) {
  // Use the security check hook
  const { checkSecurityStatus } = useSecurityCheck({ 
    setSecurityStatus 
  });
  
  // Use the connection test hook
  const { testConnection } = useConnectionTest({
    setIsLoading,
    setConnectionStatus,
    checkSecurityStatus
  });
  
  // Use the authentication hook
  const { login, logout } = useAuthentication({
    testConnection,
    checkSecurityStatus
  });

  return {
    login,
    logout,
    testConnection,
    checkSecurityStatus
  };
}
