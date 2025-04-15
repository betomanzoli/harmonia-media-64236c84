import { toast } from '@/hooks/use-toast';

type NotificationType = 
  | 'new_preview' 
  | 'preview_feedback' 
  | 'preview_approved' 
  | 'payment_received' 
  | 'project_update'
  | 'deadline_extended'
  | 'feedback_received'
  | 'new_order'
  | 'new_briefing';

interface NotificationData {
  projectId?: string;
  clientName?: string;
  clientEmail?: string;
  message?: string;
  expirationDate?: string;
  days?: number;
  newDate?: string;
  packageType?: string;
  amount?: number;
  [key: string]: any;
}

class NotificationService {
  private logNotification(type: NotificationType, data: NotificationData) {
    try {
      const now = new Date();
      const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
      
      const notificationLog = {
        type,
        data,
        timestamp,
        id: `notification-${Date.now()}`
      };
      
      const logs = JSON.parse(localStorage.getItem('notification-logs') || '[]');
      logs.unshift(notificationLog);
      const trimmedLogs = logs.slice(0, 1000);
      localStorage.setItem('notification-logs', JSON.stringify(trimmedLogs));
      
      return notificationLog;
    } catch (error) {
      console.error('Erro ao registrar notificação:', error);
      return null;
    }
  }
  
  public notify(type: NotificationType, data: NotificationData): boolean {
    console.log(`Enviando notificação tipo: ${type}`, data);
    
    const log = this.logNotification(type, data);
    
    let title = '';
    let description = '';
    
    switch (type) {
      case 'new_preview':
        title = 'Nova prévia enviada';
        description = `Prévia enviada para ${data.clientName} (${data.clientEmail})`;
        break;
      case 'preview_feedback':
        title = 'Feedback recebido';
        description = `${data.clientName} enviou feedback para o projeto ${data.projectId}`;
        break;
      case 'preview_approved':
        title = 'Prévia aprovada';
        description = `${data.clientName} aprovou a prévia do projeto ${data.projectId}`;
        break;
      case 'deadline_extended':
        title = 'Prazo estendido';
        description = `Prazo do projeto ${data.projectId} estendido em ${data.days} dias`;
        break;
      case 'feedback_received':
        title = 'Feedback recebido';
        description = `${data.clientName} enviou feedback para o projeto ${data.projectId}`;
        break;
      case 'new_order':
        title = 'Novo pedido';
        description = `Novo pedido recebido para ${data.clientName} (${data.clientEmail})`;
        break;
      case 'new_briefing':
        title = 'Novo briefing';
        description = `Novo briefing recebido para ${data.clientName} (${data.clientEmail})`;
        break;
      default:
        title = 'Notificação enviada';
        description = `Tipo: ${type}`;
    }
    
    toast({
      title,
      description,
    });
    
    return true;
  }
  
  public getNotificationHistory() {
    try {
      return JSON.parse(localStorage.getItem('notification-logs') || '[]');
    } catch (error) {
      console.error('Erro ao recuperar histórico de notificações:', error);
      return [];
    }
  }
  
  public clearNotificationHistory() {
    localStorage.removeItem('notification-logs');
    return true;
  }
}

export const notificationService = new NotificationService();
