interface NotificationPayload {
  [key: string]: any;
}

class NotificationService {
  private handlers: Record<string, Array<(data: any) => void>> = {};

  // Register a handler for a specific event type
  public subscribe(eventType: string, handler: (data: any) => void): () => void {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers[eventType] = this.handlers[eventType].filter(h => h !== handler);
    };
  }

  // Trigger notification for an event type
  public notify(eventType: string, payload: NotificationPayload): void {
    console.log(`📢 Notification service: ${eventType}`, payload);
    
    // Save to localStorage for persistence
    try {
      const notifications = this.getStoredNotifications();
      notifications.push({ 
        type: eventType, 
        payload, 
        timestamp: new Date().toISOString() 
      });
      
      // Keep only the most recent 100 notifications
      if (notifications.length > 100) {
        notifications.shift();
      }
      
      localStorage.setItem('harmonIA_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
    
    // Call registered handlers
    if (this.handlers[eventType]) {
      this.handlers[eventType].forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in notification handler for ${eventType}:`, error);
        }
      });
    }
    
    // Also call global handlers
    if (this.handlers['*']) {
      this.handlers['*'].forEach(handler => {
        try {
          handler({ type: eventType, payload });
        } catch (error) {
          console.error(`Error in global notification handler:`, error);
        }
      });
    }
  }

  // Get all stored notifications
  public getStoredNotifications(): Array<{ type: string; payload: any; timestamp: string }> {
    try {
      const storedNotifications = localStorage.getItem('harmonIA_notifications');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error('Error retrieving stored notifications:', error);
      return [];
    }
  }
  
  // Clear all notifications
  public clearNotifications(): void {
    localStorage.removeItem('harmonIA_notifications');
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
