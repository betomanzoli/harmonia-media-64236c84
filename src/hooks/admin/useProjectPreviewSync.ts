
import { useEffect } from 'react';
import { usePreviewProjects } from './usePreviewProjects';
import { notificationService, NotificationType } from '@/services/notificationService';

export const useProjectPreviewSync = () => {
  const { projects, updateProject } = usePreviewProjects();

  // Escutar por alterações de status de prévias
  useEffect(() => {
    // Quando uma prévia é aprovada ou recebe feedback, atualiza o projeto correspondente
    const unsubscribeApproved = notificationService.subscribe(
      'preview_approved',
      (data: { projectId: string, versionId: string }) => {
        console.log('Prévia aprovada, atualizando projeto:', data);
        updateProject(data.projectId, { 
          status: 'approved',
          last_activity_date: new Date().toLocaleDateString('pt-BR')
        });
      }
    );
    
    const unsubscribeFeedback = notificationService.subscribe(
      'feedback_received',
      (data: { projectId: string, message: string }) => {
        console.log('Feedback recebido, atualizando projeto:', data);
        updateProject(data.projectId, { 
          status: 'feedback',
          feedback: data.message,
          last_activity_date: new Date().toLocaleDateString('pt-BR')
        });
      }
    );
    
    const unsubscribeCreated = notificationService.subscribe(
      'project_created',
      (data: { projectId: string }) => {
        console.log('Projeto criado:', data);
        // Alguma lógica adicional se necessário quando um projeto é criado
      }
    );
    
    return () => {
      unsubscribeApproved();
      unsubscribeFeedback();
      unsubscribeCreated();
    };
  }, [updateProject]);

  return {
    // Função para sincronizar status entre projetos e prévias
    syncProjectStatus: (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
      // Atualiza o projeto com o novo status
      updateProject(projectId, { 
        status, 
        last_activity_date: new Date().toLocaleDateString('pt-BR') 
      });
      
      // Notifica sobre a mudança de status
      notificationService.notify('project_updated', {
        projectId,
        status,
        timestamp: new Date().toISOString()
      });
    }
  };
};
