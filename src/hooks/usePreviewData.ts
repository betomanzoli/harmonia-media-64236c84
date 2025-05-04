
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Log para depuração
      console.log(`usePreviewData chamado com previewId: ${previewId}`);
      
      // Try to decode the preview ID if it's in the encoded format
      // If not, treat it as a direct project ID (for backward compatibility)
      const decodedId = getProjectIdFromPreviewLink(previewId);
      const projectId = decodedId || previewId;
      
      setActualProjectId(projectId);
      console.log(`ID do projeto decodificado/direto: ${projectId}`);
      
      // Load project data
      setIsLoading(true);
      
      try {
        // Get from localStorage
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projetos em localStorage:', storedProjects);
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: ProjectItem) => p.id === projectId);
          
          if (project) {
            console.log('Projeto encontrado:', project);
            setProjectData(project);
          } else {
            console.log(`Projeto não encontrado para ID: ${projectId}`);
            setProjectData(null); // Explicitly set to null if not found
          }
        } else {
          console.log('Nenhum projeto encontrado no localStorage');
          setProjectData(null);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do projeto:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [previewId]);
  
  // Function to update project status and add information to history
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
          
          // Add history entry
          if (!projects[projectIndex].history) {
            projects[projectIndex].history = [];
          }
          
          projects[projectIndex].history.push({
            action: `Status alterado para ${newStatus}`,
            timestamp: new Date().toLocaleString('pt-BR'),
            data: {
              message: comments || `Cliente alterou o status do projeto para ${newStatus}`
            }
          });
          
          // Save back to localStorage
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
          
          // Update local state
          setProjectData(projects[projectIndex]);
          
          console.log('Projeto atualizado com sucesso:', projects[projectIndex]);
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
