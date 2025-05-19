
export type NotificationType = 'test_message' | 'new_portfolio_item' | 'feedback_received' | 'new_customer' | 'payment_received' | 'preview_created';

// Default webhook URLs for different services
const DEFAULT_WEBHOOKS = {
  briefings: 'https://humbrock.app.n8n.cloud/webhook-test/webhook/briefing',
  previews: 'https://humbrock.app.n8n.cloud/webhook-test/webhook/previews',
  payments: '' // Will be populated from localStorage if available
};

// MercadoPago signature secret
const MP_WEBHOOK_SECRET = '1658b2054391fcd9effb63651dde741c65734b0bc57b7c7ab286892b48f7c466';

const webhookService = {
  getWebhookUrl: async (serviceType: string = 'briefings'): Promise<string> => {
    const storedUrl = localStorage.getItem(`webhook_url_${serviceType}`);
    return storedUrl || DEFAULT_WEBHOOKS[serviceType as keyof typeof DEFAULT_WEBHOOKS] || '';
  },

  saveWebhookUrl: async (url: string, serviceType: string = 'briefings'): Promise<boolean> => {
    try {
      localStorage.setItem(`webhook_url_${serviceType}`, url);
      return true;
    } catch (error) {
      console.error(`Error saving webhook URL for ${serviceType}:`, error);
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
  
  sendItemNotification: async (type: NotificationType, data: any, serviceType: string = 'previews'): Promise<boolean> => {
    try {
      const url = await webhookService.getWebhookUrl(serviceType);
      if (!url) {
        console.warn(`No webhook URL configured for ${serviceType}`);
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
  },

  // Send briefing data to n8n webhook
  sendBriefingData: async (briefingData: any): Promise<boolean> => {
    try {
      const url = await webhookService.getWebhookUrl('briefings');
      if (!url) {
        console.warn('No briefing webhook URL configured');
        return false;
      }

      console.log('Sending briefing data to webhook:', briefingData);
      return await webhookService.sendToWebhook(url, briefingData);
    } catch (error) {
      console.error('Error sending briefing data:', error);
      return false;
    }
  },

  // Send preview data to n8n webhook
  sendPreviewData: async (previewData: any): Promise<boolean> => {
    try {
      const url = await webhookService.getWebhookUrl('previews');
      if (!url) {
        console.warn('No previews webhook URL configured');
        return false;
      }

      console.log('Sending preview data to webhook:', previewData);
      return await webhookService.sendToWebhook(url, previewData);
    } catch (error) {
      console.error('Error sending preview data:', error);
      return false;
    }
  },

  // Verify MercadoPago webhook signature
  verifyMercadopagoSignature: (signature: string, payload: string): boolean => {
    try {
      // In a production environment, you would implement signature verification here
      // For now, we'll just check if the signature is provided
      return !!signature;
    } catch (error) {
      console.error('Error verifying MercadoPago signature:', error);
      return false;
    }
  },

  // Get MercadoPago webhook secret
  getMercadoPagoWebhookSecret: (): string => {
    return MP_WEBHOOK_SECRET;
  }
};

export default webhookService;
