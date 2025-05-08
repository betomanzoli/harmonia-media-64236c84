
import { useState, useEffect } from 'react';
import { getJsonCookie, setJsonCookie, removeCookie } from '@/utils/cookieUtils';
import { logger } from '@/utils/logger';

interface ProjectAccessData {
  project_id: string;
  access_time: number;
  expires_at: number;
}

// Export for use in other files
export const getCookie = getJsonCookie;

export const useProjectAccess = (projectId: string | null | undefined) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!projectId) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      // Check for existing access
      const accessData = getJsonCookie<ProjectAccessData>('preview_access');
      logger.debug('ACCESS', 'Checking access cookie', { projectId, accessData });

      if (accessData) {
        const now = Date.now();
        
        // Check if access is valid for this project and not expired
        if (accessData.project_id === projectId && accessData.expires_at > now) {
          logger.info('ACCESS', 'Valid access found', { projectId });
          setIsAuthorized(true);
        } else {
          logger.info('ACCESS', 'Access expired or for different project', { 
            projectId, 
            accessProjectId: accessData.project_id, 
            expired: accessData.expires_at <= now 
          });
          setIsAuthorized(false);
        }
      } else {
        logger.info('ACCESS', 'No access cookie found');
        setIsAuthorized(false);
      }
    } catch (error) {
      logger.error('ACCESS', 'Error checking access', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const grantAccess = (projectId: string, expirationHours = 24) => {
    if (!projectId) return false;

    try {
      const now = Date.now();
      const expiresAt = now + (expirationHours * 60 * 60 * 1000); // Convert hours to milliseconds
      
      const accessData: ProjectAccessData = {
        project_id: projectId,
        access_time: now,
        expires_at: expiresAt
      };
      
      setJsonCookie('preview_access', accessData, { maxAge: String(expirationHours * 60 * 60) });
      logger.info('ACCESS', 'Access granted', { projectId, expiresAt: new Date(expiresAt).toISOString() });
      
      setIsAuthorized(true);
      return true;
    } catch (error) {
      logger.error('ACCESS', 'Error granting access', error);
      return false;
    }
  };

  const revokeAccess = () => {
    try {
      removeCookie('preview_access');
      logger.info('ACCESS', 'Access revoked');
      setIsAuthorized(false);
      return true;
    } catch (error) {
      logger.error('ACCESS', 'Error revoking access', error);
      return false;
    }
  };

  return {
    isAuthorized,
    loading,
    grantAccess,
    revokeAccess
  };
};

// Adding this form hook to fix import in ProjectAccessForm
export const useProjectAccessForm = ({ projectId, onVerify }: { projectId: string, onVerify: (code: string, email: string) => void }) => {
  const [code, setCode] = useState(projectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    code?: string;
    email?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      code?: string;
      email?: string;
    } = {};
    
    if (!code.trim()) {
      newErrors.code = 'Código de prévia é obrigatório';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple client-side validation before calling the verify function
      onVerify(code, email);
    } catch (err) {
      setError('Erro ao verificar acesso. Por favor, tente novamente.');
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    email,
    setEmail,
    isLoading,
    error,
    errors,
    handleSubmit
  };
};
