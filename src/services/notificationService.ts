
type NotificationType = 
  | 'new_preview' 
  | 'feedback_received' 
  | 'preview_approved' 
  | 'payment_received'
  | 'project_created';

interface NotificationData {
  projectId?: string;
  clientName?: string;
  clientEmail?: string;
  message?: string;
  versionId?: string;
  [key: string]: any;
}

class NotificationService {
  notify(type: NotificationType, data: NotificationData) {
    // Em uma implementação real, isso enviaria notificações para os canais adequados
    // como webhook, email, SMS, etc.
    console.log(`[Notificação ${type}]:`, data);
    
    // Armazenar notificação no localStorage para persistência
    const notifications = this.getStoredNotifications();
    
    notifications.push({
      id: `notification-${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('harmonIA_notifications', JSON.stringify(notifications));
    
    // Verificar se há handlers específicos para este tipo de notificação
    switch (type) {
      case 'feedback_received':
        // Em uma implementação real, poderia enviar um email para a equipe
        console.log(`[Email] Nova feedback recebido do cliente ${data.clientName} para o projeto ${data.projectId}`);
        break;
        
      case 'preview_approved':
        // Em uma implementação real, poderia atualizar o status do projeto e enviar um email
        console.log(`[Email] Prévia aprovada pelo cliente ${data.clientName} para o projeto ${data.projectId}`);
        break;
        
      default:
        break;
    }
  }
  
  getStoredNotifications() {
    const stored = localStorage.getItem('harmonIA_notifications');
    return stored ? JSON.parse(stored) : [];
  }
  
  getRecentNotifications(limit = 5) {
    const notifications = this.getStoredNotifications();
    return notifications.slice(-limit).reverse();
  }
  
  getUnreadCount() {
    const notifications = this.getStoredNotifications();
    const lastRead = localStorage.getItem('harmonIA_last_notification_read');
    
    if (!lastRead) return notifications.length;
    
    return notifications.filter(n => n.timestamp > lastRead).length;
  }
  
  markAllAsRead() {
    localStorage.setItem('harmonIA_last_notification_read', new Date().toISOString());
    return this.getUnreadCount();
  }
}

export const notificationService = new NotificationService();
