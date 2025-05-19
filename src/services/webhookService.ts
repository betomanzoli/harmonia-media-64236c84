
export type NotificationType = 
  | 'test_message' 
  | 'new_portfolio_item' 
  | 'feedback_received' 
  | 'new_customer' 
  | 'client_message'
  | 'preview_approved'
  | 'new_preview';

const webhookService = {
  getWebhookUrl: async (): Promise<string> => {
    return localStorage.getItem('webhook_url') || '';
  },

  saveWebhookUrl: async (url: string): Promise<boolean> => {
    try {
      localStorage.setItem('webhook_url', url);
      return true;
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      return false;
    }
  },

  sendToWebhook: async (url: string, payload: any): Promise<boolean> => {
    try {
      console.log(`Sending data to webhook at ${url}`, payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Use no-cors to avoid CORS issues with external webhooks
      });
      
      console.log('Webhook response:', response);
      return true;
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      return false;
    }
  },
  
  sendItemNotification: async (type: NotificationType, data: any): Promise<boolean> => {
    try {
      const url = await webhookService.getWebhookUrl();
      if (!url) {
        console.warn('No webhook URL configured');
        return false;
      }
      
      const payload = {
        type,
        data,
        timestamp: new Date().toISOString()
      };
      
      return await webhookService.sendToWebhook(url, payload);
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
};

export default webhookService;
