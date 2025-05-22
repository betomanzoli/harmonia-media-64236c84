
import { useEffect } from 'react';
import { usePreviewProjects } from './usePreviewProjects';
import { notificationService, NotificationType } from '@/services/notificationService';

export const useProjectPreviewSync = () => {
  const { projects, updateProject } = usePreviewProjects();

  // Listen for preview status changes
  useEffect(() => {
    // When a preview is approved or receives feedback, update the corresponding project
    const unsubscribeApproved = notificationService.subscribe(
      'preview_approved',
      (data: { projectId: string, versionId: string, comments?: string }) => {
        console.log('Preview approved, updating project:', data);
        
        // Create history entry for approval
        const historyEntry = {
          action: 'Prévia aprovada pelo cliente',
          timestamp: new Date().toLocaleString('pt-BR'),
          data: {
            message: data.comments || 'Sem comentários adicionais',
            versionId: data.versionId
          }
        };
        
        // Find current project to add to existing history
        const currentProject = projects.find(p => p.id === data.projectId);
        const currentHistory = currentProject?.history || [];
        
        // Make sure we persist to localStorage immediately
        const updatedData = { 
          status: 'approved',
          lastActivityDate: new Date().toLocaleDateString('pt-BR'),
          history: [...currentHistory, historyEntry],
          feedback: data.comments || ''
        };
        
        // Update project with new data
        updateProject(data.projectId, updatedData);
        
        // Save to localStorage for persistence
        try {
          // Get existing preview projects from localStorage
          const storedData = localStorage.getItem('adminPreviewProjects');
          if (storedData) {
            const storedProjects = JSON.parse(storedData);
            
            // Find and update the specific project
            const updatedProjects = storedProjects.map((p: any) => 
              p.id === data.projectId 
                ? { ...p, ...updatedData } 
                : p
            );
            
            // Save back to localStorage
            localStorage.setItem('adminPreviewProjects', JSON.stringify(updatedProjects));
            console.log('Project approval status saved to localStorage');
          }
        } catch (error) {
          console.error('Error saving project approval to localStorage:', error);
        }
      }
    );
    
    const unsubscribeFeedback = notificationService.subscribe(
      'feedback_received',
      (data: { projectId: string, message: string, versionId?: string }) => {
        console.log('Feedback received, updating project:', data);
        
        // Create history entry for feedback
        const historyEntry = {
          action: 'Feedback recebido do cliente',
          timestamp: new Date().toLocaleString('pt-BR'),
          data: {
            message: data.message,
            versionId: data.versionId
          }
        };
        
        // Find current project to add to existing history
        const currentProject = projects.find(p => p.id === data.projectId);
        const currentHistory = currentProject?.history || [];
        
        // Make sure we persist to localStorage immediately
        const updatedData = { 
          status: 'feedback',
          feedback: data.message,
          lastActivityDate: new Date().toLocaleDateString('pt-BR'),
          history: [...currentHistory, historyEntry]
        };
        
        // Update project with new data
        updateProject(data.projectId, updatedData);
        
        // Save to localStorage for persistence
        try {
          // Get existing preview projects from localStorage
          const storedData = localStorage.getItem('adminPreviewProjects');
          if (storedData) {
            const storedProjects = JSON.parse(storedData);
            
            // Find and update the specific project
            const updatedProjects = storedProjects.map((p: any) => 
              p.id === data.projectId 
                ? { ...p, ...updatedData } 
                : p
            );
            
            // Save back to localStorage
            localStorage.setItem('adminPreviewProjects', JSON.stringify(updatedProjects));
            console.log('Project feedback status saved to localStorage');
          }
        } catch (error) {
          console.error('Error saving project feedback to localStorage:', error);
        }
      }
    );
    
    const unsubscribeCreated = notificationService.subscribe(
      'project_created',
      (data: { projectId: string }) => {
        console.log('Project created:', data);
        // Additional logic if necessary when a project is created
      }
    );
    
    return () => {
      unsubscribeApproved();
      unsubscribeFeedback();
      unsubscribeCreated();
    };
  }, [projects, updateProject]);

  return {
    // Function to synchronize status between projects and previews
    syncProjectStatus: (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
      // Update the project with the new status
      updateProject(projectId, { 
        status, 
        lastActivityDate: new Date().toLocaleDateString('pt-BR') 
      });
      
      // Notify about the status change
      notificationService.notify('project_updated', {
        projectId,
        status,
        timestamp: new Date().toISOString()
      });
    }
  };
};
