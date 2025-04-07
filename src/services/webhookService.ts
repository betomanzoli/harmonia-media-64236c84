
// Serviço para gerenciar webhooks
import { supabase } from '@/lib/supabase';

// Definir os tipos aceitáveis de notificação
export type NotificationType = 'new_portfolio_item' | 'test_message' | 'feedback_received';

interface WebhookPayload {
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
    
    return data?.value || null;
  } catch (err) {
    console.error('Erro ao obter URL do webhook:', err);
    return null;
  }
};

const saveWebhookUrl = async (url: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({ key: 'webhook_url', value: url }, { onConflict: 'key' });
      
    if (error) {
      console.error('Erro ao salvar URL do webhook:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao salvar URL do webhook:', err);
    return false;
  }
};

const sendToWebhook = async (webhookUrl: string, payload: WebhookPayload): Promise<boolean> => {
  try {
    // Enviar dados para o webhook configurado
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors', // Necessário para alguns serviços de webhook
    });
    
    // Como estamos usando no-cors, não podemos verificar o status da resposta
    console.log('Webhook enviado:', payload);
    return true;
  } catch (err) {
    console.error('Erro ao enviar para webhook:', err);
    return false;
  }
};

export default {
  getWebhookUrl,
  saveWebhookUrl,
  sendToWebhook,
};
