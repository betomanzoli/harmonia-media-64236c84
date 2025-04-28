
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
  const { updateProject, getProjectById } = usePreviewProjects();
  
  useEffect(() => {
    if (previewId) {
      // Check if ID needs to be decoded
      const decodedId = getProjectIdFromPreviewLink(previewId) || previewId;
      console.log(`Setting actual project ID: ${decodedId} from preview ID: ${previewId}`);
      setActualProjectId(decodedId);
    }
  }, [previewId]);
  
  useEffect(() => {
    if (!isLoading && !projectData && actualProjectId) {
      console.error(`Project data not found for ID: ${actualProjectId}`);
      toast({
        title: "Prévia não encontrada",
        description: "O código de prévia fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [actualProjectId, projectData, isLoading, toast]);

  // Update the project with new status in both hooks and local storage
  const updateProjectStatus = (status: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    console.log(`Updating project status to ${status} for project ${actualProjectId}`);
    
    if (actualProjectId) {
      // First check if project exists
      const project = getProjectById(actualProjectId);
      if (!project) {
        console.error(`Project ${actualProjectId} not found for status update`);
        toast({
          title: "Erro ao atualizar status",
          description: "Projeto não encontrado. Tente recarregar a página.",
          variant: "destructive"
        });
        return;
      }
      
      // Update in preview projects storage
      const updateData: any = { 
        status,
        lastActivityDate: new Date().toLocaleDateString('pt-BR')
      };
      
      // Add feedback if provided
      if (feedback) {
        updateData.feedback = feedback;
      }
      
      const updatedProject = updateProject(actualProjectId, updateData);
      
      console.log("Project updated with new status:", updatedProject);
      
      // Update local state
      if (projectData) {
        setProjectData({
          ...projectData,
          status
        });
      }
      
      return updatedProject;
    }
    return null;
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    actualProjectId,
    updateProjectStatus
  };
};
