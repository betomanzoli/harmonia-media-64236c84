
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProject, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Always try to decode the preview ID
      const decodedId = getProjectIdFromPreviewLink(previewId);
      
      if (!decodedId) {
        setIsLoading(false);
        return;
      }
      
      setActualProjectId(decodedId);
      console.log(`Carregando dados da prévia: ${decodedId}`);
      
      // Load project data
      setIsLoading(true);
      
      try {
        // Try to get from localStorage
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: ProjectItem) => p.id === decodedId);
          
          if (project) {
            setProjectData(project);
          } else {
            console.log(`Projeto não encontrado: ${decodedId}`);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do projeto:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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

  // Função para atualizar o status do projeto e adicionar informação ao histórico
  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`Atualizando status do projeto ${actualProjectId} para ${newStatus}`);
      console.log(`Feedback do cliente: ${comments}`);
      
      // Get all projects
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const projectIndex = projects.findIndex((p: ProjectItem) => p.id === actualProjectId);
        
        if (projectIndex !== -1) {
          // Update project status
          projects[projectIndex].status = newStatus;
          
          // Add feedback if provided
          if (comments.trim()) {
            if (!projects[projectIndex].feedbackHistory) {
              projects[projectIndex].feedbackHistory = [];
            }
            
            projects[projectIndex].feedbackHistory.push({
              id: `feedback_${Date.now()}`,
              content: comments,
              createdAt: new Date().toISOString(),
              status: 'pending',
              versionId: actualProjectId
            });
            
            projects[projectIndex].feedback = comments;
          }
          
          // Update lastActivityDate
          projects[projectIndex].lastActivityDate = new Date().toISOString();
          
          // Save back to localStorage
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
          
          // Update local state
          setProjectData({
            ...projectData,
            status: newStatus,
            feedback: comments || projectData.feedback,
            feedbackHistory: projects[projectIndex].feedbackHistory
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
