
import { supabase } from '@/lib/supabase';

const N8N_URL_TYPES = {
  PREVIEW_NOTIFICATION: 'preview_notification',
  PAYMENT_WEBHOOK: 'payment_webhook',
  BRIEFING_WEBHOOK: 'briefing_webhook',
  FEEDBACK_WEBHOOK: 'feedback_webhook',
  CHATBOT_WEBHOOK: 'chatbot_webhook'
};

class WebhookIntegrationService {
  public async getWebhookUrl(type: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', `webhook_url_${type}`)
        .single();

      if (error || !data) {
        console.error(`Error fetching webhook URL for ${type}:`, error);
        return null;
      }

      return data.value?.url || null;
    } catch (error) {
      console.error(`Error in getWebhookUrl for ${type}:`, error);
      return null;
    }
  }

  private async sendWebhookRequest(type: string, payload: any): Promise<boolean> {
    try {
      const webhookUrl = await this.getWebhookUrl(type);
      if (!webhookUrl) {
        console.error(`No webhook URL configured for ${type}`);
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: payload
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook response not OK: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log(`Webhook ${type} response:`, responseData);
      return true;
    } catch (error) {
      console.error(`Error sending webhook for ${type}:`, error);
      return false;
    }
  }

  public async saveWebhookUrl(type: string, url: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: `webhook_url_${type}`,
          value: { url }
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error(`Error saving webhook URL for ${type}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in saveWebhookUrl for ${type}:`, error);
      return false;
    }
  }

  async sendPreviewNotification(
    projectId: string,
    clientName: string,
    clientEmail: string,
    projectTitle: string,
    versions: Array<{id: string, name: string, audioUrl: string}>
  ): Promise<boolean> {
    return this.sendWebhookRequest(N8N_URL_TYPES.PREVIEW_NOTIFICATION, {
      projectId,
      clientName,
      clientEmail,
      projectTitle,
      versions,
      baseUrl: window.location.origin,
      timestamp: new Date().toISOString()
    });
  }

  async processBriefingSubmission(
    briefingId: string,
    clientName: string,
    clientEmail: string,
    packageType: string,
    briefingData: any
  ): Promise<boolean> {
    return this.sendWebhookRequest(N8N_URL_TYPES.BRIEFING_WEBHOOK, {
      briefingId,
      clientName,
      clientEmail,
      packageType,
      briefingData,
      timestamp: new Date().toISOString()
    });
  }

  async processPayment(
    paymentId: string,
    briefingId: string,
    clientName: string,
    clientEmail: string,
    packageType: string,
    amount: number,
    status: string
  ): Promise<boolean> {
    return this.sendWebhookRequest(N8N_URL_TYPES.PAYMENT_WEBHOOK, {
      payment_id: paymentId,
      briefing_id: briefingId,
      client_name: clientName,
      client_email: clientEmail,
      package_type: packageType,
      amount,
      status,
      timestamp: new Date().toISOString()
    });
  }

  async processPaymentNotification(
    paymentId: string,
    briefingId: string,
    clientEmail: string,
    packageType: string,
    amount: number
  ): Promise<boolean> {
    return this.sendWebhookRequest(N8N_URL_TYPES.PAYMENT_WEBHOOK, {
      payment_id: paymentId,
      briefing_id: briefingId,
      client_email: clientEmail,
      package_type: packageType,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  }

  async submitFeedback(
    projectId: string,
    clientName: string,
    clientEmail: string,
    feedback: string,
    status: 'approved' | 'revision' | 'feedback'
  ): Promise<boolean> {
    return this.sendWebhookRequest(N8N_URL_TYPES.FEEDBACK_WEBHOOK, {
      projectId,
      clientName,
      clientEmail,
      feedback,
      status,
      timestamp: new Date().toISOString()
    });
  }

  async processFeedbackSubmission(
    projectId: string,
    clientName: string,
    clientEmail: string,
    feedback: string,
    status: 'approved' | 'revision' | 'feedback'
  ): Promise<boolean> {
    return this.submitFeedback(projectId, clientName, clientEmail, feedback, status);
  }

  async sendChatbotMessage(
    message: string,
    userData: any
  ): Promise<{success: boolean, response?: string}> {
    try {
      const webhookUrl = await this.getWebhookUrl(N8N_URL_TYPES.CHATBOT_WEBHOOK);
      if (!webhookUrl) {
        console.error('No chatbot webhook URL configured');
        return { success: false };
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message,
            userData,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Chatbot webhook response not OK: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Chatbot webhook response:', responseData);
      return { 
        success: true, 
        response: responseData.response || 'Obrigado por sua mensagem! Estamos processando sua solicitação.'
      };
    } catch (error) {
      console.error('Error sending chatbot webhook:', error);
      return { success: false };
    }
  }
}

export const n8nIntegrationService = new WebhookIntegrationService();
