
import { supabase } from '@/integrations/supabase/client';

export interface EmailService {
  sendPaymentConfirmation: (email: string, name: string, packageName: string) => Promise<void>;
  sendNotification: (to: string, subject: string, message: string) => Promise<void>;
  sendProjectUpdate: (email: string, projectId: string, status: string) => Promise<void>;
  sendFeedbackNotification: (projectId: string, feedback: string) => Promise<void>;
}

const emailService: EmailService = {
  async sendPaymentConfirmation(email: string, name: string, packageName: string) {
    try {
      // Log to project activity
      console.log('Sending payment confirmation email:', { email, name, packageName });
      
      // In a real implementation, you would call an edge function
      // await supabase.functions.invoke('send-email', {
      //   body: {
      //     type: 'payment_confirmation',
      //     to: email,
      //     data: { name, packageName }
      //   }
      // });

      // For now, simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      throw error;
    }
  },

  async sendNotification(to: string, subject: string, message: string) {
    try {
      console.log('Sending notification email:', { to, subject, message });
      
      // In a real implementation, you would call an edge function
      // await supabase.functions.invoke('send-email', {
      //   body: {
      //     type: 'notification',
      //     to,
      //     subject,
      //     message
      //   }
      // });

      // For now, simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  async sendProjectUpdate(email: string, projectId: string, status: string) {
    try {
      console.log('Sending project update email:', { email, projectId, status });
      
      // Get project details from Supabase
      const { data: project } = await supabase
        .from('projects')
        .select('title, client_name, preview_code')
        .eq('id', projectId)
        .single();

      if (project) {
        const previewUrl = `${window.location.origin}/client-preview/${project.preview_code}`;
        
        // In a real implementation, you would call an edge function
        // await supabase.functions.invoke('send-email', {
        //   body: {
        //     type: 'project_update',
        //     to: email,
        //     data: {
        //       projectTitle: project.title,
        //       clientName: project.client_name,
        //       status,
        //       previewUrl
        //     }
        //   }
        // });
      }

      // For now, simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending project update:', error);
      throw error;
    }
  },

  async sendFeedbackNotification(projectId: string, feedback: string) {
    try {
      console.log('Sending feedback notification:', { projectId, feedback });
      
      // Get project details
      const { data: project } = await supabase
        .from('projects')
        .select('title, client_name, client_email')
        .eq('id', projectId)
        .single();

      if (project && project.client_email) {
        // In a real implementation, send email to admin about new feedback
        // await supabase.functions.invoke('send-email', {
        //   body: {
        //     type: 'feedback_notification',
        //     to: 'admin@harmonia.com', // Admin email
        //     data: {
        //       projectTitle: project.title,
        //       clientName: project.client_name,
        //       clientEmail: project.client_email,
        //       feedback
        //     }
        //   }
        // });
      }

      // For now, simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending feedback notification:', error);
      throw error;
    }
  }
};

export default emailService;
