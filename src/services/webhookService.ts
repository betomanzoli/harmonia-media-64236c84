
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
    // Consideramos como sucesso o fato de não ter ocorrido exceção
    console.log('Webhook enviado com sucesso:', payload);
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
