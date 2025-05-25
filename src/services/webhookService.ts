import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'test_message' | 'new_portfolio_item' | 'feedback_received' | 'new_customer' | 'client_message' | 'preview_approved';

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const webhookService = {
  getWebhookUrl: async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching webhook URL from database:', error);
      }
      
      if (data?.value && typeof data.value === 'object' && 'url' in data.value) {
        return String((data.value as { url: string }).url || '');
      }
      
      const localUrl = localStorage.getItem('marketing_webhook_url');
      if (localUrl) {
        return localUrl;
      }
      
      return '';
    } catch (error) {
      console.error('Error getting webhook URL:', error);
      return localStorage.getItem('marketing_webhook_url') || '';
    }
  },

  saveWebhookUrl: async (url: string): Promise<boolean> => {
    try {
      localStorage.setItem('marketing_webhook_url', url);
      
      const { data: existingData, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing webhook settings:', fetchError);
      }
      
      if (existingData?.id) {
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            value: { url: url },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
        
        if (error) {
          console.error('Error updating webhook URL in database:', error);
          return true;
        }
      } else {
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'marketing_webhook_url',
            value: { url }
          }]);
        
        if (error) {
          console.error('Error creating webhook URL in database:', error);
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      return false;
    }
  },

  sendToWebhook: async (url: string, payload: any): Promise<boolean> => {
    try {
      if (!url) {
        console.error('No webhook URL provided');
        return false;
      }
      
      console.log(`Sending data to webhook at ${url}`, payload);
      
      const validatedPayload = validatePayload(payload);
      
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedPayload),
            mode: 'no-cors' 
          });
          
          console.log('Webhook sent successfully, attempt', attempts + 1);
          return true;
        } catch (err) {
          attempts++;
          console.warn(`Webhook delivery attempt ${attempts} failed:`, err);
          
          if (attempts < maxAttempts) {
            const delay = Math.min(1000 * Math.pow(2, attempts) + Math.random() * 1000, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      console.error(`Webhook delivery failed after ${maxAttempts} attempts`);
      return false;
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

function validatePayload(payload: any): any {
  try {
    if (!payload.type) {
      payload.type = 'unknown';
    }
    
    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }
    
    if (!payload.data || typeof payload.data !== 'object') {
      payload.data = { content: payload.data || 'No data' };
    }
    
    if (payload.data) {
      Object.keys(payload.data).forEach(key => {
        if (payload.data[key] instanceof Date) {
          payload.data[key] = payload.data[key].toISOString();
        }
      });
    }
    
    return payload;
  } catch (e) {
    console.error('Error validating payload:', e);
    return {
      type: 'error',
      data: { error: 'Invalid payload format' },
      timestamp: new Date().toISOString()
    };
  }
}

export default webhookService;
