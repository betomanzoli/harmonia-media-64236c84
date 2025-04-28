
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

export interface PreviewProjectData {
  clientName: string;
  projectTitle: string;
  projectId?: string;
  packageType?: string;
  creationDate?: string;
  status: 'waiting' | 'feedback' | 'approved';
}

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { projectData, setProjectData, isLoading } = usePreviewProject(actualProjectId || undefined);
  const { toast } = useToast();
  const { updateProject } = usePreviewProjects();
  
  useEffect(() => {
    if (previewId) {
      // Check if ID needs to be decoded
      const decodedId = getProjectIdFromPreviewLink(previewId) || previewId;
      setActualProjectId(decodedId);
      
      console.log(`Carregando dados da prévia: ${decodedId}`);
    }
  }, [previewId]);
  
  useEffect(() => {
    if (!isLoading && !projectData && actualProjectId) {
      toast({
        title: "Prévia não encontrada",
        description: "O código de prévia fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [actualProjectId, projectData, isLoading, toast]);

  // Update the project with new status in both hooks and local storage
  const updateProjectStatus = (status: 'waiting' | 'feedback' | 'approved') => {
    if (actualProjectId) {
      // Update in preview projects storage
      updateProject(actualProjectId, { 
        status,
        lastActivityDate: new Date().toLocaleDateString('pt-BR')
      });
      
      // Update local state
      if (projectData) {
        setProjectData({
          ...projectData,
          status
        });
      }
    }
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    actualProjectId,
    updateProjectStatus
  };
};
