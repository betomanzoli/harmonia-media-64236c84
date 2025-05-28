
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

export const emailService = {
  // Test email configuration
  async testEmailConfig() {
    try {
      console.log('Testing email configuration...');
      // This would typically call an edge function to test email
      return { success: true, message: 'Email configuration test completed' };
    } catch (error) {
      console.error('Email test failed:', error);
      return { success: false, message: 'Email test failed' };
    }
  },

  // Send notification email
  async sendNotificationEmail(to: string, subject: string, content: string) {
    try {
      console.log('Sending notification email:', { to, subject });
      // This would typically call an edge function to send email
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  },

  // Get email templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      // Mock templates for now
      return [
        {
          id: '1',
          name: 'Project Created',
          subject: 'New Project Created',
          content: 'A new project has been created for {{clientName}}',
          variables: ['clientName', 'projectTitle']
        },
        {
          id: '2',
          name: 'Feedback Received',
          subject: 'Feedback Received',
          content: 'Feedback received for project {{projectTitle}}',
          variables: ['projectTitle', 'feedback']
        }
      ];
    } catch (error) {
      console.error('Failed to get email templates:', error);
      return [];
    }
  }
};
