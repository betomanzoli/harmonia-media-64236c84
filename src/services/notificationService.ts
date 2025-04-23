
/**
 * Serviço de Notificações
 * Responsável por enviar notificações aos clientes e administradores
 */
import emailService from '@/services/emailService';
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'new_preview' 
  | 'feedback_received'
  | 'preview_approved'
  | 'payment_confirmed'
  | 'briefing_received'
  | 'new_briefing'
  | 'new_order';

interface NotificationData {
  projectId?: string;
  clientName?: string;
  clientEmail?: string;
  message?: string;
  versionId?: string;
  packageName?: string;
  expirationDate?: string;
  [key: string]: any;
}

const webhookUrl = localStorage.getItem('previews_webhookUrl') || '';

export const notificationService = {
  /**
   * Envia uma notificação
   * @param type Tipo de notificação
   * @param data Dados da notificação
   */
  notify: async (type: NotificationType, data: NotificationData) => {
    console.log(`Enviando notificação: ${type}`, data);
    
    // Preparar notificação para envio
    const notificationData = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    // Registrar notificação no banco de dados
    try {
      const { error } = await supabase.from('notifications')
        .insert([
          { 
            type,
            data: notificationData,
            project_id: data.projectId || null,
            client_email: data.clientEmail || null,
            status: 'pending'
          }
        ]);
        
      if (error) {
        console.error('Erro ao registrar notificação:', error);
      }
    } catch (err) {
      console.error('Falha ao registrar notificação no banco:', err);
    }
    
    // Enviar email baseado no tipo de notificação
    try {
      switch (type) {
        case 'new_preview':
          if (data.clientEmail && data.clientName) {
            const previewUrl = data.projectId ? 
              `${window.location.origin}/preview/${data.projectId}` : '';
              
            await emailService.sendPreviewNotification(
              data.clientEmail,
              data.clientName,
              previewUrl
            );
            
            console.log(`E-mail de prévia enviado para: ${data.clientEmail}`);
          }
          break;
          
        case 'feedback_received':
          // Enviar email para administrador sobre feedback recebido
          console.log('Feedback recebido do cliente:', data.clientName);
          // Em produção, enviar email para administrador
          break;
          
        case 'preview_approved':
          // Enviar email para administrador sobre prévia aprovada
          console.log('Prévia aprovada pelo cliente:', data.clientName);
          // Em produção, enviar email para administrador
          break;
          
        case 'payment_confirmed':
          if (data.clientEmail && data.clientName && data.packageName) {
            await emailService.sendPaymentConfirmation(
              data.clientEmail,
              data.clientName,
              data.packageName
            );
            
            console.log(`E-mail de pagamento enviado para: ${data.clientEmail}`);
          }
          break;
          
        case 'briefing_received':
        case 'new_briefing':
          if (data.clientEmail && data.clientName) {
            await emailService.sendBriefingConfirmation(
              data.clientEmail,
              data.clientName
            );
            
            console.log(`E-mail de confirmação de briefing enviado para: ${data.clientEmail}`);
          }
          break;
          
        case 'new_order':
          if (data.clientEmail && data.clientName) {
            await emailService.sendOrderConfirmation(
              data.clientEmail,
              data.clientName
            );
            
            console.log(`E-mail de confirmação de pedido enviado para: ${data.clientEmail}`);
          }
          break;
      }
    } catch (err) {
      console.error('Erro ao enviar notificação por e-mail:', err);
    }
    
    // Enviar para webhook se configurado (integração com outros serviços)
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notificationData)
        });
        
        if (!response.ok) {
          console.error('Erro ao enviar para webhook:', await response.text());
        } else {
          console.log('Notificação enviada para webhook com sucesso');
        }
      } catch (err) {
        console.error('Falha ao enviar para webhook:', err);
      }
    } else {
      console.log('Webhook não configurado, notificação não enviada');
    }
    
    return true;
  }
};

export default notificationService;
