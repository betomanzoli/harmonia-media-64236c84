
import { toast } from '@/hooks/use-toast';

type NotificationType = 
  | 'new_preview' 
  | 'preview_feedback' 
  | 'preview_approved' 
  | 'payment_received' 
  | 'project_update'
  | 'deadline_extended';

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
  // Registrar todas as notificações no localStorage para manter histórico
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
      
      // Adicionar ao histórico no localStorage
      const logs = JSON.parse(localStorage.getItem('notification-logs') || '[]');
      logs.unshift(notificationLog); // Adicionar ao início para mostrar os mais recentes primeiro
      
      // Limitar a 1000 registros
      const trimmedLogs = logs.slice(0, 1000);
      localStorage.setItem('notification-logs', JSON.stringify(trimmedLogs));
      
      return notificationLog;
    } catch (error) {
      console.error('Erro ao registrar notificação:', error);
      return null;
    }
  }
  
  // Simular o envio de notificação por email (em produção, isso chamaria uma API real)
  public notify(type: NotificationType, data: NotificationData): boolean {
    console.log(`Enviando notificação tipo: ${type}`, data);
    
    // Registrar no histórico
    const log = this.logNotification(type, data);
    
    // Em um ambiente real, aqui chamaria uma API para enviar o email
    // Por enquanto, vamos simular o envio e mostrar um toast
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
  
  // Obter histórico de notificações
  public getNotificationHistory() {
    try {
      return JSON.parse(localStorage.getItem('notification-logs') || '[]');
    } catch (error) {
      console.error('Erro ao recuperar histórico de notificações:', error);
      return [];
    }
  }
  
  // Limpar histórico de notificações
  public clearNotificationHistory() {
    localStorage.removeItem('notification-logs');
    return true;
  }
}

export const notificationService = new NotificationService();
