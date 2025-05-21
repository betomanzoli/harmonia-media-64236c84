
import { supabase } from '@/lib/supabase';

export type NotificationType = 'test_message' | 'new_portfolio_item' | 'feedback_received' | 'new_customer' | 'client_message' | 'preview_approved';

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const webhookService = {
  getWebhookUrl: async (): Promise<string> => {
    try {
      // Try to get webhook URL from Supabase
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching webhook URL from database:', error);
      }
      
      // If found in database, return it
      if (data?.value?.url) {
        return data.value.url;
      }
      
      // Fallback to localStorage
      const localUrl = localStorage.getItem('marketing_webhook_url');
      if (localUrl) {
        return localUrl;
      }
      
      // Default URL if nothing is found
      return '';
    } catch (error) {
      console.error('Error getting webhook URL:', error);
      return localStorage.getItem('marketing_webhook_url') || '';
    }
  },

  saveWebhookUrl: async (url: string): Promise<boolean> => {
    try {
      // Save to localStorage as fallback
      localStorage.setItem('marketing_webhook_url', url);
      
      // Check if setting exists
      const { data: existingData, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing webhook settings:', fetchError);
      }
      
      if (existingData?.id) {
        // Update existing setting
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            value: { url: url },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
        
        if (error) {
          console.error('Error updating webhook URL in database:', error);
          return true; // Still return true since we saved to localStorage
        }
      } else {
        // Create new setting
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'marketing_webhook_url',
            value: { url }
          }]);
        
        if (error) {
          console.error('Error creating webhook URL in database:', error);
          return true; // Still return true since we saved to localStorage
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
      
      // Validate payload format
      const validatedPayload = validatePayload(payload);
      
      // Add retry mechanism with exponential backoff
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          // Use no-cors mode to avoid CORS issues with external webhooks
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
            // Exponential backoff with jitter
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

// Helper function to validate and format payload
function validatePayload(payload: any): any {
  try {
    // Ensure payload has required structure
    if (!payload.type) {
      payload.type = 'unknown';
    }
    
    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }
    
    // Make sure data is an object
    if (!payload.data || typeof payload.data !== 'object') {
      payload.data = { content: payload.data || 'No data' };
    }
    
    // Convert dates to strings if needed
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
    // Return a safe default payload
    return {
      type: 'error',
      data: { error: 'Invalid payload format' },
      timestamp: new Date().toISOString()
    };
  }
}

export default webhookService;
