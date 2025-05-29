
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePreviewProjects } from './usePreviewProjects';
import emailService from '@/services/emailService';

export const useProjectPreviewSync = () => {
  const { updateProject, reloadProjects } = usePreviewProjects();

  useEffect(() => {
    // Set up real-time subscription for project changes
    const channel = supabase
      .channel('project-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Project updated:', payload);
          // Reload projects when any project is updated
          reloadProjects();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        async (payload) => {
          console.log('New feedback received:', payload);
          
          // Send notification email about new feedback
          if (payload.new && payload.new.project_id && payload.new.content) {
            try {
              await emailService.sendFeedbackNotification(
                payload.new.project_id,
                payload.new.content
              );
            } catch (error) {
              console.error('Error sending feedback notification:', error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reloadProjects]);

  const syncProjectStatus = async (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
    try {
      // Update project status in database
      const { error } = await supabase
        .from('projects')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Get project details for email notification
      const { data: project } = await supabase
        .from('projects')
        .select('client_email, title')
        .eq('id', projectId)
        .single();

      // Send email notification to client if email exists
      if (project && project.client_email) {
        try {
          await emailService.sendProjectUpdate(
            project.client_email,
            projectId,
            status
          );
        } catch (emailError) {
          console.error('Error sending project update email:', emailError);
        }
      }

    } catch (error) {
      console.error('Error syncing project status:', error);
      throw error;
    }
  };

  return {
    syncProjectStatus
  };
};
