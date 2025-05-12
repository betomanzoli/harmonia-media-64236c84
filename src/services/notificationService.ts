
import webhookService, { NotificationType } from '@/services/webhookService';
import { useToast } from '@/hooks/use-toast';

// Tipos de eventos que podem ser notificados
export type EventType = 
  | 'new_briefing' 
  | 'new_order' 
  | 'new_preview' 
  | 'feedback_received' 
  | 'payment_confirmed'
  | 'file_uploaded'
  | 'file_updated';

// Interface para armazenar callbacks de notificação
interface NotificationHandlers {
  [key: string]: Array<(data: any) => void>;
}

class NotificationService {
  private handlers: NotificationHandlers = {};
  private webhookEnabled: boolean = false;
  
  // Registra um handler para um tipo de evento
  subscribe(eventType: EventType, handler: (data: any) => void) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    
    this.handlers[eventType].push(handler);
    
    // Retorna uma função para cancelar a inscrição
    return () => {
      this.handlers[eventType] = this.handlers[eventType].filter(h => h !== handler);
    };
  }
  
  // Envia uma notificação para todos os handlers registrados para o evento
  notify(eventType: EventType, data: any) {
    // Registra o evento no console
    console.log(`[Notification] Evento: ${eventType}`, data);
    
    // Notifica handlers locais
    if (this.handlers[eventType]) {
      this.handlers[eventType].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Erro ao processar notificação (${eventType}):`, error);
        }
      });
    }
    
    // Envia para webhook se estiver configurado
    this.sendToWebhook(eventType, data);
    
    return true;
  }
  
  // Envia para webhook externo (se configurado)
  async sendToWebhook(eventType: EventType, data: any) {
    try {
      // Mapear o tipo de evento para o tipo de notificação do webhook
      const notificationType = this.mapEventToNotificationType(eventType);
      if (!notificationType) return false;
      
      // Enviar para o webhook
      const result = await webhookService.sendItemNotification(notificationType, data);
      return result;
    } catch (error) {
      console.error(`Erro ao enviar notificação para webhook (${eventType}):`, error);
      return false;
    }
  }
  
  // Mapeia tipos de eventos internos para tipos de notificação do webhook
  private mapEventToNotificationType(eventType: EventType): NotificationType | null {
    const mapping: Record<EventType, NotificationType> = {
      new_briefing: 'new_portfolio_item',
      new_order: 'new_order',
      new_preview: 'feedback_received',
      feedback_received: 'feedback_received',
      payment_confirmed: 'new_customer',
      file_uploaded: 'new_audio',
      file_updated: 'new_audio'
    };
    
    return mapping[eventType] || null;
  }
  
  // Ativa ou desativa a funcionalidade de webhook
  setWebhookEnabled(enabled: boolean) {
    this.webhookEnabled = enabled;
  }
}

// Singleton para compartilhar o serviço em toda a aplicação
export const notificationService = new NotificationService();

// Hook para usar o serviço em componentes
export function useNotificationService() {
  const { toast } = useToast();
  
  const notifyWithToast = (eventType: EventType, data: any, showToast: boolean = true) => {
    notificationService.notify(eventType, data);
    
    if (showToast) {
      // Mensagens customizadas para diferentes tipos de eventos
      const messages: Record<EventType, {title: string, description: string}> = {
        new_briefing: {
          title: "Novo briefing recebido",
          description: "Um novo briefing foi enviado por um cliente."
        },
        new_order: {
          title: "Novo pedido recebido",
          description: "Um novo pedido foi registrado no sistema."
        },
        new_preview: {
          title: "Nova prévia disponível",
          description: "Uma nova prévia foi adicionada e está pronta para revisão."
        },
        feedback_received: {
          title: "Feedback recebido",
          description: "Um cliente enviou feedback sobre uma prévia."
        },
        payment_confirmed: {
          title: "Pagamento confirmado",
          description: "Um pagamento foi confirmado com sucesso."
        },
        file_uploaded: {
          title: "Arquivo enviado",
          description: "Um novo arquivo foi enviado para o sistema."
        },
        file_updated: {
          title: "Arquivo atualizado",
          description: "Um arquivo existente foi atualizado."
        }
      };
      
      const message = messages[eventType] || {
        title: "Notificação",
        description: `Evento ${eventType} ocorreu.`
      };
      
      toast({
        title: message.title,
        description: message.description,
      });
    }
    
    return true;
  };
  
  return {
    notify: notifyWithToast,
    subscribe: notificationService.subscribe.bind(notificationService),
    sendToWebhook: notificationService.sendToWebhook.bind(notificationService),
    setWebhookEnabled: notificationService.setWebhookEnabled.bind(notificationService)
  };
}

export default notificationService;
