
import { useEffect } from 'react';
import { usePreviewProjects } from './usePreviewProjects';

export const useProjectPreviewSync = () => {
  const { updateProject } = usePreviewProjects();

  useEffect(() => {
    // Mock sync logic - será implementado na Fase 2
    console.log('Project preview sync initialized');
  }, [updateProject]);

  return {
    syncProjectStatus: (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
      updateProject(projectId, { 
        status, 
        lastActivityDate: new Date().toLocaleDateString('pt-BR') 
      });
    }
  };
};
