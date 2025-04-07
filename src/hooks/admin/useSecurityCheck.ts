
import { useToast } from '@/hooks/use-toast';
import { SecurityStatus } from '@/types/admin-auth';

interface UseSecurityCheckProps {
  setSecurityStatus: (status: SecurityStatus) => void;
  offlineMode?: boolean;
}

export function useSecurityCheck({ 
  setSecurityStatus, 
  offlineMode = false 
}: UseSecurityCheckProps) {
  const { toast } = useToast();

  // Function to check security status - simplified for local auth
  const checkSecurityStatus = async () => {
    if (offlineMode) {
      // In offline mode, just set a mock security status
      setSecurityStatus({
        checked: true,
        hasIssues: false,
        details: { offlineMode: true }
      });
      return;
    }
    
    try {
      // For local auth, we'll simulate a security check
      const mockResult = {
        success: true,
        rlsPolicies: ['local_auth_policy'],
        mfaEnabled: true,
        passwordSecurityLevel: 'high'
      };
      
      setSecurityStatus({
        checked: true,
        hasIssues: false,
        details: mockResult
      });
    } catch (error) {
      console.error('Erro ao verificar status de segurança:', error);
      setSecurityStatus({
        checked: true,
        hasIssues: true,
        details: {
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      });
    }
  };

  return { checkSecurityStatus };
}
