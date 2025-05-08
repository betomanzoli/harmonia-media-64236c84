
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
      
      setJsonCookie('preview_access', accessData, { maxAge: expirationHours * 60 * 60 });
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
