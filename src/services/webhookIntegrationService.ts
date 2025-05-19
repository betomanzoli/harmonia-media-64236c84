
import webhookService, { NotificationType } from './webhookService';
import { supabase } from '@/lib/supabase';

// Enhanced webhook service specifically for n8n integrations
interface WebhookPayload {
  type: NotificationType;
  data: any;
  timestamp: string;
  source?: string;
}

export const n8nIntegrationService = {
  // Base URL for n8n workflows
  getN8nBaseUrl: (): string => {
    return 'https://humbrock.app.n8n.cloud/webhook';
  },
  
  // Get workflow-specific webhook URL with fallback
  getWebhookUrl: async (workflowType: 'preview' | 'payment' | 'briefing' | 'chatbot' | 'feedback'): Promise<string> => {
    try {
      // Try to load from database first
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', `webhook_url_${workflowType}`)
        .single();
      
      if (error || !data) {
        // Fall back to localStorage
        const url = localStorage.getItem(`webhook_url_${workflowType}`);
        
        if (url) return url;
        
        // Default URLs as fallback
        const defaultUrls: Record<string, string> = {
          preview: 'https://humbrock.app.n8n.cloud/webhook/16ae1112-2469-420d-8fcc-c9569152bd8f/preview',
          payment: 'https://humbrock.app.n8n.cloud/webhook/2469-420d-8fcc-c9569152bd8f/payment',
          briefing: 'https://humbrock.app.n8n.cloud/webhook/3698-5247-931a-dc5478af2c1b/briefing',
          chatbot: 'https://humbrock.app.n8n.cloud/webhook/16ae1112-2469-420d-8fcc-c9569152bd8f/chat',
          feedback: 'https://humbrock.app.n8n.cloud/webhook/7241-f932-8e41-bd674a239c6f/feedback'
        };
        
        return defaultUrls[workflowType];
      }
      
      return data.value;
    } catch (error) {
      console.error(`Error getting webhook URL for ${workflowType}:`, error);
      return `https://humbrock.app.n8n.cloud/webhook/default/${workflowType}`;
    }
  },
  
  saveWebhookUrl: async (workflowType: 'preview' | 'payment' | 'briefing' | 'chatbot' | 'feedback', url: string): Promise<boolean> => {
    try {
      // Save to localStorage for immediate use
      localStorage.setItem(`webhook_url_${workflowType}`, url);
      
      // Save to database for persistence
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: `webhook_url_${workflowType}`,
          value: url
        }, { 
          onConflict: 'key' 
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error saving webhook URL for ${workflowType}:`, error);
      return false;
    }
  },
  
  /**
   * Send preview notification to n8n
   * @param projectId Project ID
   * @param clientName Client name
   * @param clientEmail Client email
   * @param projectTitle Project title
   * @param versions Array of versions with audio URLs
   * @returns Promise<boolean> Success status
   */
  sendPreviewNotification: async (
    projectId: string,
    clientName: string,
    clientEmail: string,
    projectTitle: string,
    versions: Array<{id: string, name: string, audioUrl: string}>
  ): Promise<boolean> => {
    try {
      const webhookUrl = await n8nIntegrationService.getWebhookUrl('preview');
      
      const payload: WebhookPayload = {
        type: 'preview_approved',
        data: {
          projectId,
          clientName,
          clientEmail,
          projectTitle,
          versions,
          timestamp: new Date().toISOString(),
          baseUrl: window.location.origin,
          previewUrl: `${window.location.origin}/preview/${projectId}`
        },
        timestamp: new Date().toISOString(),
        source: 'harmonia_admin_panel'
      };
      
      return await webhookService.sendToWebhook(webhookUrl, payload);
    } catch (error) {
      console.error('Error sending preview notification:', error);
      return false;
    }
  },
  
  /**
   * Process payment confirmation through n8n
   * @param paymentId Payment identifier
   * @param briefingId Briefing ID
   * @param clientEmail Client email
   * @param packageType Package type purchased
   * @param amount Payment amount
   * @returns Promise<boolean> Success status
   */
  processPaymentNotification: async (
    paymentId: string,
    briefingId: string,
    clientEmail: string,
    packageType: string,
    amount: number
  ): Promise<boolean> => {
    try {
      const webhookUrl = await n8nIntegrationService.getWebhookUrl('payment');
      
      const payload: WebhookPayload = {
        type: 'new_customer',
        data: {
          paymentId,
          briefingId,
          clientEmail,
          packageType,
          amount,
          status: 'approved',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        source: 'harmonia_payment_processor'
      };
      
      return await webhookService.sendToWebhook(webhookUrl, payload);
    } catch (error) {
      console.error('Error processing payment notification:', error);
      return false;
    }
  },
  
  /**
   * Notify n8n about briefing submission
   * @param briefingId Briefing ID
   * @param clientName Client name
   * @param clientEmail Client email
   * @param packageType Package type
   * @param briefingData Briefing data object
   * @returns Promise<boolean> Success status
   */
  processBriefingSubmission: async (
    briefingId: string,
    clientName: string,
    clientEmail: string,
    packageType: string,
    briefingData: any
  ): Promise<boolean> => {
    try {
      const webhookUrl = await n8nIntegrationService.getWebhookUrl('briefing');
      
      const payload: WebhookPayload = {
        type: 'new_portfolio_item',
        data: {
          briefingId,
          clientName,
          clientEmail,
          packageType,
          briefingData,
          submittedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        source: 'harmonia_briefing_form'
      };
      
      return await webhookService.sendToWebhook(webhookUrl, payload);
    } catch (error) {
      console.error('Error processing briefing submission:', error);
      return false;
    }
  },
  
  /**
   * Process feedback from client about previews
   * @param projectId Project ID
   * @param clientName Client name
   * @param clientEmail Client email
   * @param feedback Feedback text
   * @param status Approval status
   * @returns Promise<boolean> Success status
   */
  processFeedbackSubmission: async (
    projectId: string,
    clientName: string,
    clientEmail: string,
    feedback: string,
    status: 'approved' | 'revision' | 'feedback'
  ): Promise<boolean> => {
    try {
      const webhookUrl = await n8nIntegrationService.getWebhookUrl('feedback');
      
      const payload: WebhookPayload = {
        type: 'feedback_received',
        data: {
          projectId,
          clientName,
          clientEmail,
          feedback,
          status,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        source: 'harmonia_preview_feedback'
      };
      
      return await webhookService.sendToWebhook(webhookUrl, payload);
    } catch (error) {
      console.error('Error processing feedback submission:', error);
      return false;
    }
  },
  
  /**
   * Send message to chatbot through n8n
   * @param message Message text
   * @param userData User data (optional)
   * @returns Promise<boolean> Success status
   */
  sendChatbotMessage: async (message: string, userData?: any): Promise<boolean> => {
    try {
      const webhookUrl = await n8nIntegrationService.getWebhookUrl('chatbot');
      
      const payload: WebhookPayload = {
        type: 'client_message',
        data: {
          message,
          userData,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        source: 'harmonia_chatbot'
      };
      
      return await webhookService.sendToWebhook(webhookUrl, payload);
    } catch (error) {
      console.error('Error sending chatbot message:', error);
      return false;
    }
  }
};

export default n8nIntegrationService;
