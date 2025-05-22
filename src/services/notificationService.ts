
type EventCallback = (data: any) => void;
type EventName = 'preview_approved' | 'feedback_received' | 'project_updated' | 'project_created' | string;

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  autoClose?: boolean;
  duration?: number;
}

class NotificationService {
  private subscribers: Map<EventName, EventCallback[]> = new Map();
  
  /**
   * Subscribe to an event
   * @param eventName The name of the event to subscribe to
   * @param callback The callback to execute when the event is triggered
   * @returns A function to unsubscribe
   */
  subscribe(eventName: EventName, callback: EventCallback): () => void {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    
    this.subscribers.get(eventName)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventName) || [];
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Notify all subscribers of an event
   * @param eventName The name of the event
   * @param data The data to pass to subscribers
   */
  notify(eventName: EventName, data: any): void {
    console.log(`Notification sent: ${eventName}`, data);
    
    if (!this.subscribers.has(eventName)) {
      return;
    }
    
    const callbacks = this.subscribers.get(eventName)!;
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error executing callback for event ${eventName}:`, error);
      }
    });
  }
  
  /**
   * Clear all subscribers for a specific event
   * @param eventName The event name to clear
   */
  clearEvent(eventName: EventName): void {
    this.subscribers.delete(eventName);
  }
  
  /**
   * Clear all subscribers
   */
  clearAll(): void {
    this.subscribers.clear();
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService();
