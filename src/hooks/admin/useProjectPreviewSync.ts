
import { useEffect } from 'react';
import { usePreviewProjects } from './usePreviewProjects';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase'; 

export const useProjectPreviewSync = () => {
  const { projects, updateProject, loadProjects } = usePreviewProjects();

  // Listen for changes in preview status
  useEffect(() => {
    console.log("Setting up preview sync listeners");
    
    // When a preview is approved or receives feedback, update the corresponding project
    const unsubscribeApproved = notificationService.subscribe(
      'preview_approved',
      async (data: { projectId: string, versionId: string }) => {
        console.log('Preview approved, updating project:', data);
        
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
        console.log('Feedback received, updating project:', data);
        
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
        console.log('Project created:', data);
        
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
    // Function to synchronize status between projects and previews
    syncProjectStatus: async (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
      // Update the project with the new status
      updateProject(projectId, { 
        status, 
        lastActivityDate: new Date().toLocaleDateString('pt-BR') 
      });
      
      // Update in the database as well
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
      
      // Notify about the status change
      notificationService.notify('project_updated', {
        projectId,
        status,
        timestamp: new Date().toISOString()
      });
    },
    
    // Function to create a new project from a briefing
    createProjectFromBriefing: async (briefingId: string) => {
      // This function would be implemented to create a project from a briefing
      // and notify interested components
      notificationService.notify('project_created', {
        briefingId,
        timestamp: new Date().toISOString()
      });
    }
  };
};
