
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

type NotificationType = 'feedback_received' | 'preview_approved' | 'preview_created';

interface NotificationOptions {
  projectId: string;
  clientName?: string;
  message?: string;
  versionId?: string;
}

/**
 * Service for sending notifications to administrators and clients
 */
export const notificationService = {
  /**
   * Sends a notification based on type and options
   */
  notify: async (type: NotificationType, options: NotificationOptions): Promise<boolean> => {
    try {
      logger.info('NOTIFICATION', `Sending ${type} notification`, options);
      
      // Record notification in the database for tracking
      const { error } = await supabase
        .from('project_history')
        .insert({
          project_id: options.projectId,
          action: type,
          details: {
            ...options,
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        logger.error('NOTIFICATION', 'Failed to record notification', error);
        return false;
      }
      
      // For production, we would also implement email/SMS notifications here
      // using edge functions, but for now we'll just log them
      
      logger.info('NOTIFICATION', 'Notification recorded successfully');
      return true;
    } catch (err) {
      logger.error('NOTIFICATION', 'Failed to send notification', err);
      return false;
    }
  },
  
  /**
   * Special case for sending feedback notifications
   */
  notifyFeedback: async (projectId: string, clientName: string, feedback: string): Promise<boolean> => {
    return notificationService.notify('feedback_received', {
      projectId,
      clientName,
      message: feedback
    });
  },
  
  /**
   * Special case for sending approval notifications
   */
  notifyApproval: async (projectId: string, clientName: string, versionId: string): Promise<boolean> => {
    return notificationService.notify('preview_approved', {
      projectId,
      clientName,
      versionId
    });
  }
};
