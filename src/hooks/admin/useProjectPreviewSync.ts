
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
        
        // Encontrar o projeto atual para poder adicionar ao histórico existente
        const currentProject = projects.find(p => p.id === data.projectId);
        const currentHistory = currentProject?.history || [];
        
        updateProject(data.projectId, { 
          status: 'approved',
          lastActivityDate: new Date().toLocaleDateString('pt-BR'),
          history: [...currentHistory, historyEntry],
          feedback: data.comments || ''
        });
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
        
        // Encontrar o projeto atual para poder adicionar ao histórico existente
        const currentProject = projects.find(p => p.id === data.projectId);
        const currentHistory = currentProject?.history || [];
        
        updateProject(data.projectId, { 
          status: 'feedback',
          feedback: data.message,
          lastActivityDate: new Date().toLocaleDateString('pt-BR'),
          history: [...currentHistory, historyEntry]
        });
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
