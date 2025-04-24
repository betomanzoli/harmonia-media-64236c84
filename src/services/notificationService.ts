
import { toast } from '@/hooks/use-toast';

// Types
export type NotificationType = 
  | 'new_preview'       // New preview available for client
  | 'feedback_received' // Client sent feedback
  | 'preview_approved'  // Client approved a preview
  | 'payment_received'  // Payment received
  | 'project_completed' // Project completed
  | 'project_updated'   // General project update
  | 'briefing_received' // New briefing received
  | 'new_order';        // New order received

export interface NotificationData {
  projectId?: string;
  clientName?: string;
  clientEmail?: string;
  message?: string;
  versionId?: string;
  previewUrl?: string;
  timestamp?: string;
  [key: string]: any;
}

// Mock notification service for demo purposes
class NotificationService {
  private notificationHistory: Array<{
    type: NotificationType;
    data: NotificationData;
    timestamp: string;
    read: boolean;
  }> = [];

  constructor() {
    // Try to load notification history from localStorage
    try {
      const savedNotifications = localStorage.getItem('harmonIA_notifications');
      if (savedNotifications) {
        this.notificationHistory = JSON.parse(savedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications() {
    try {
      localStorage.setItem(
        'harmonIA_notifications', 
        JSON.stringify(this.notificationHistory)
      );
    } catch (error) {
      console.error('Error saving notifications to localStorage', error);
    }
  }

  // Get all notifications
  public getAllNotifications() {
    return this.notificationHistory;
  }

  // Get unread notifications count
  public getUnreadCount(): number {
    return this.notificationHistory.filter(n => !n.read).length;
  }

  // Mark notification as read
  public markAsRead(index: number) {
    if (index >= 0 && index < this.notificationHistory.length) {
      this.notificationHistory[index].read = true;
      this.saveNotifications();
    }
  }

  // Mark all as read
  public markAllAsRead() {
    this.notificationHistory = this.notificationHistory.map(n => ({
      ...n,
      read: true
    }));
    this.saveNotifications();
  }

  // Add a new notification
  public notify(type: NotificationType, data: NotificationData) {
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Add to history
    this.notificationHistory.unshift({
      type,
      data,
      timestamp: new Date().toISOString(),
      read: false
    });

    // Keep only the last 100 notifications
    if (this.notificationHistory.length > 100) {
      this.notificationHistory = this.notificationHistory.slice(0, 100);
    }

    // Save to localStorage
    this.saveNotifications();

    // Display in UI
    this.showNotificationToast(type, data);

    // Send email if applicable
    this.sendEmailNotification(type, data);

    console.log(`Notification sent: ${type}`, data);
    return true;
  }

  // Display notification in UI
  private showNotificationToast(type: NotificationType, data: NotificationData) {
    let title = 'Notificação';
    let description = '';

    switch (type) {
      case 'new_preview':
        title = 'Nova prévia disponível';
        description = `Uma nova prévia foi adicionada ao projeto ${data.projectId}`;
        break;
      case 'feedback_received':
        title = 'Feedback recebido';
        description = `${data.clientName || 'Cliente'} enviou um feedback sobre a prévia`;
        break;
      case 'preview_approved':
        title = 'Prévia aprovada';
        description = `${data.clientName || 'Cliente'} aprovou uma versão da prévia`;
        break;
      case 'payment_received':
        title = 'Pagamento recebido';
        description = 'Um novo pagamento foi recebido';
        break;
      case 'project_completed':
        title = 'Projeto concluído';
        description = `O projeto ${data.projectId} foi concluído com sucesso`;
        break;
      case 'project_updated':
        title = 'Projeto atualizado';
        description = 'O projeto foi atualizado com novas informações';
        break;
    }

    // Display toast notification
    toast({
      title,
      description,
    });
  }

  // Send email notification (demo - would connect to an email service in production)
  private sendEmailNotification(type: NotificationType, data: NotificationData) {
    if (!data.clientEmail) return;
    
    // In a real implementation, this would send an actual email
    console.log(`Email notification would be sent to ${data.clientEmail} about: ${type}`);
  }
}

// Singleton instance
export const notificationService = new NotificationService();
