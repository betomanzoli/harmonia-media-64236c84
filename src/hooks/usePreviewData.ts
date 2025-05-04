
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Log for debugging
      console.log(`usePreviewData called with previewId: ${previewId}`);
      
      // Check if this is an encoded link or direct ID
      const isEncodedLink = isValidEncodedPreviewLink(previewId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      // For encoded links, decode the project ID
      // For direct IDs, only allow admin access
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      let projectId: string | null = null;
      
      if (isEncodedLink) {
        // Process encoded link
        const decodedId = getProjectIdFromPreviewLink(previewId);
        console.log(`Decoded project ID: ${decodedId}`);
        projectId = decodedId;
      } else if (isAdmin) {
        // Allow direct access for admins only
        console.log(`Admin direct access for ID: ${previewId}`);
        projectId = previewId;
      } else {
        // Invalid link for non-admin users
        console.log("Invalid direct link access for non-admin user");
        projectId = null;
      }
      
      setActualProjectId(projectId);
      
      if (!projectId) {
        console.log("No valid project ID, skipping data load");
        setIsLoading(false);
        return;
      }
      
      // Load project data
      setIsLoading(true);
      
      try {
        // Get from localStorage
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projects in localStorage:', storedProjects ? 'Found' : 'Not found');
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: ProjectItem) => p.id === projectId);
          
          if (project) {
            console.log('Project found:', project);
            setProjectData(project);
          } else {
            console.log(`Project not found for ID: ${projectId}`);
            setProjectData(null);
          }
        } else {
          console.log('No projects found in localStorage');
          setProjectData(null);
        }
      } catch (error) {
        console.error('Error loading project data:', error);
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

      console.log(`Updating project ${actualProjectId} status to ${newStatus}`);
      console.log(`Client feedback: ${comments}`);
      
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
          
          console.log('Project successfully updated:', projects[projectIndex]);
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
