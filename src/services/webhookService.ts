
import { supabase } from '@/lib/supabase';

// Tipos de notificações que o sistema pode enviar
export type NotificationType = 
  | 'new_qualification'
  | 'new_payment'
  | 'new_briefing'
  | 'feedback_received'
  | 'preview_approved';

// Interface para dados de webhook
export interface WebhookData {
  type: NotificationType;
  data: any;
  timestamp: string;
}

// Serviço de webhook para integrações externas (Zapier, Make, etc.)
export const webhookService = {
  /**
   * Envia dados para um webhook configurado
   */
  sendToWebhook: async (webhookUrl: string, data: WebhookData) => {
    if (!webhookUrl) {
      console.warn('URL de webhook não fornecida');
      return { success: false, error: 'URL não fornecida' };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'no-cors', // Para evitar problemas de CORS com webhooks externos
      });

      // Como estamos usando mode: 'no-cors', não podemos verificar o status
      // Assumimos que a solicitação foi bem-sucedida
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtém a URL do webhook configurada no sistema
   */
  getWebhookUrl: async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'webhook_url')
        .single();

      if (error || !data) {
        console.error('Erro ao obter URL do webhook:', error);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Erro ao consultar configurações:', error);
      return null;
    }
  },

  /**
   * Salva uma nova URL de webhook no sistema
   */
  saveWebhookUrl: async (url: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert(
          { key: 'webhook_url', value: url },
          { onConflict: 'key' }
        );

      if (error) {
        console.error('Erro ao salvar URL do webhook:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return false;
    }
  }
};

export default webhookService;
