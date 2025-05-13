
import React from 'react';

// Tipos de notificações que o sistema pode enviar
export type NotificationType = 
  | 'project_created' 
  | 'project_updated' 
  | 'preview_added' 
  | 'preview_approved' 
  | 'feedback_received'
  | 'briefing_submitted'
  | 'client_created';

// Interface para os ouvintes de notificação
interface NotificationListener {
  type: NotificationType;
  callback: (data: any) => void;
}

// Classe para gerenciar as notificações do sistema
class NotificationService {
  private listeners: NotificationListener[] = [];

  // Adiciona um ouvinte para um tipo específico de notificação
  public subscribe(type: NotificationType, callback: (data: any) => void) {
    this.listeners.push({ type, callback });
    
    // Retorna uma função para cancelar a inscrição
    return () => {
      this.listeners = this.listeners.filter(
        listener => !(listener.type === type && listener.callback === callback)
      );
    };
  }

  // Notifica todos os ouvintes que estão escutando um tipo específico de notificação
  public notify(type: NotificationType, data: any) {
    console.log(`Notificação enviada: ${type}`, data);
    
    this.listeners
      .filter(listener => listener.type === type)
      .forEach(listener => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error(`Erro ao processar notificação ${type}:`, error);
        }
      });
  }
  
  // Função para mostrar as estatísticas de notificação
  public getStats() {
    const countByType = this.listeners.reduce((acc, listener) => {
      acc[listener.type] = (acc[listener.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: this.listeners.length,
      byType: countByType
    };
  }
}

// Exporta uma única instância do serviço de notificação
export const notificationService = new NotificationService();

// Hooks de utilidade para usar o sistema de notificação
export const useNotificationSubscription = (type: NotificationType, callback: (data: any) => void) => {
  React.useEffect(() => {
    const unsubscribe = notificationService.subscribe(type, callback);
    return unsubscribe;
  }, [type, callback]);
};

// Função para enviar notificações de forma mais simples
export const sendNotification = (type: NotificationType, data: any) => {
  notificationService.notify(type, data);
};
