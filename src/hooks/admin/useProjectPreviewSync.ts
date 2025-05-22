
import { useEffect } from 'react';
import { usePreviewProjects } from './usePreviewProjects';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase'; 

export const useProjectPreviewSync = () => {
  const { projects, updateProject, loadProjects } = usePreviewProjects();

  // Escutar por alterações de status de prévias
  useEffect(() => {
    console.log("Setting up preview sync listeners");
    
    // Quando uma prévia é aprovada ou recebe feedback, atualiza o projeto correspondente
    const unsubscribeApproved = notificationService.subscribe(
      'preview_approved',
      async (data: { projectId: string, versionId: string }) => {
        console.log('Prévia aprovada, atualizando projeto:', data);
        
        // Update in memory state
        updateProject(data.projectId, { 
          status: 'approved',
          lastActivityDate: new Date().toLocaleDateString('pt-BR')
        });
        
        // Also update in database
        try {
          await supabase
            .from('preview_projects')
            .update({ 
              status: 'approved',
              last_activity_date: new Date().toISOString()
            })
            .eq('id', data.projectId);
            
          await supabase
            .from('projects')
            .update({ 
              status: 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.projectId);
        } catch (error) {
          console.error('Error updating project status after approval:', error);
        }
      }
    );
    
    const unsubscribeFeedback = notificationService.subscribe(
      'feedback_received',
      async (data: { projectId: string, message: string }) => {
        console.log('Feedback recebido, atualizando projeto:', data);
        
        // Update in memory state
        updateProject(data.projectId, { 
          status: 'feedback',
          feedback: data.message,
          lastActivityDate: new Date().toLocaleDateString('pt-BR')
        });
        
        // Also update in database
        try {
          await supabase
            .from('preview_projects')
            .update({ 
              status: 'feedback',
              feedback: data.message,
              last_activity_date: new Date().toISOString()
            })
            .eq('id', data.projectId);
            
          await supabase
            .from('projects')
            .update({ 
              status: 'feedback',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.projectId);
        } catch (error) {
          console.error('Error updating project status after feedback:', error);
        }
      }
    );
    
    const unsubscribeCreated = notificationService.subscribe(
      'project_created',
      (data: { projectId: string }) => {
        console.log('Projeto criado:', data);
        
        // Refresh the projects list to include the newly created project
        loadProjects();
      }
    );
    
    // Setup subscription to realtime changes
    const channel = supabase.channel('preview_projects_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'preview_projects' 
      }, (payload) => {
        console.log('Preview project updated in database:', payload);
        
        // Reload projects to reflect the changes
        loadProjects();
      })
      .subscribe();
    
    return () => {
      unsubscribeApproved();
      unsubscribeFeedback();
      unsubscribeCreated();
      supabase.removeChannel(channel);
    };
  }, [updateProject, loadProjects]);

  return {
    // Função para sincronizar status entre projetos e prévias
    syncProjectStatus: async (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
      // Atualiza o projeto com o novo status
      updateProject(projectId, { 
        status, 
        lastActivityDate: new Date().toLocaleDateString('pt-BR') 
      });
      
      // Atualizar também no banco de dados
      try {
        await supabase
          .from('preview_projects')
          .update({ 
            status, 
            last_activity_date: new Date().toISOString() 
          })
          .eq('id', projectId);
          
        await supabase
          .from('projects')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', projectId);
      } catch (error) {
        console.error('Error updating project status in database:', error);
      }
      
      // Notifica sobre a mudança de status
      notificationService.notify('project_updated', {
        projectId,
        status,
        timestamp: new Date().toISOString()
      });
    },
    
    // Função para iniciar um novo projeto a partir de um briefing
    createProjectFromBriefing: async (briefingId: string) => {
      // Esta função seria implementada para criar um projeto a partir 
      // de um briefing e notificar os componentes interessados
      notificationService.notify('project_created', {
        briefingId,
        timestamp: new Date().toISOString()
      });
    }
  };
};
