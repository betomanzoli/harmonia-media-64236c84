
import { useToast } from '@/hooks/use-toast';
import { securityService } from '@/lib/supabase/securityConfig';
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

  // Function to check security status
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
      const result = await securityService.validateSecurity();
      
      setSecurityStatus({
        checked: true,
        hasIssues: !result.success,
        details: result
      });
      
      if (!result.success) {
        console.warn('Problemas de segurança detectados:', result.error);
        toast({
          title: 'Alerta de Segurança',
          description: 'Foram detectados problemas de segurança no Supabase. Acesse as configurações de segurança para resolver.',
          variant: 'destructive',
        });
      }
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
