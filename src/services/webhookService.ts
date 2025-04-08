
// Service to manage webhooks
import { supabase } from '@/lib/supabase';

// Define acceptable notification types
export type NotificationType = 'new_portfolio_item' | 'test_message' | 'feedback_received' | 'new_audio' | 'new_customer' | 'new_order' | 'new_invoice';

export interface WebhookPayload {
  type: NotificationType;
  data: any;
  timestamp: string;
}

const getWebhookUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'webhook_url')
      .single();
      
    if (error) {
      console.error('Erro ao buscar URL do webhook:', error);
      return null;
    }
    
    console.log('URL do webhook recuperada:', data?.value);
    return data?.value || null;
  } catch (err) {
    console.error('Erro ao obter URL do webhook:', err);
    return null;
  }
};

const saveWebhookUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('Salvando URL do webhook:', url);
    const { error } = await supabase
      .from('system_settings')
      .upsert({ key: 'webhook_url', value: url }, { onConflict: 'key' });
      
    if (error) {
      console.error('Erro ao salvar URL do webhook:', error);
      return false;
    }
    
    console.log('URL do webhook salva com sucesso');
    return true;
  } catch (err) {
    console.error('Erro ao salvar URL do webhook:', err);
    return false;
  }
};

const sendToWebhook = async (webhookUrl: string, payload: WebhookPayload): Promise<boolean> => {
  try {
    if (!webhookUrl) {
      console.error('URL do webhook não fornecida');
      return false;
    }
    
    console.log('Enviando para webhook:', webhookUrl, payload);
    
    // Send data to the configured webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors', // Required for some webhook services
    });
    
    // Since we're using no-cors, we can't check the response status
    // We consider it success if no exception occurred
    console.log('Webhook enviado com sucesso:', payload);
    return true;
  } catch (err) {
    console.error('Erro ao enviar para webhook:', err);
    return false;
  }
};

// Function to send a notification about a new item in any module
const sendItemNotification = async (
  type: NotificationType, 
  data: any, 
  customWebhookUrl?: string
): Promise<boolean> => {
  try {
    // Get the webhook URL from the database if not provided
    const webhookUrl = customWebhookUrl || await getWebhookUrl();
    
    if (!webhookUrl) {
      console.error('URL do webhook não encontrada');
      return false;
    }
    
    const payload: WebhookPayload = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    return await sendToWebhook(webhookUrl, payload);
  } catch (err) {
    console.error(`Erro ao enviar notificação para ${type}:`, err);
    return false;
  }
};

export default {
  getWebhookUrl,
  saveWebhookUrl,
  sendToWebhook,
  sendItemNotification
};
