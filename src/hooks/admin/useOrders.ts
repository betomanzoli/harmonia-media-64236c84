
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import webhookService, { NotificationType } from '@/services/webhookService';

interface Order {
  id: string;
  clientName: string;
  packageId: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchOrders = async () => {
    setIsLoading(true);
    // In a real app, this would fetch from an API or database
    try {
      // Mock data
      const mockOrders = [
        {
          id: 'ORD-001',
          clientName: 'João Silva',
          packageId: 'essencial',
          amount: 499,
          status: 'paid' as const
        },
        {
          id: 'ORD-002',
          clientName: 'Maria Souza',
          packageId: 'premium',
          amount: 799,
          status: 'pending' as const
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erro ao carregar pedidos',
        description: 'Não foi possível carregar os pedidos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addOrder = async (order: Order) => {
    try {
      // In a real app, this would send to an API or database
      setOrders(prevOrders => [...prevOrders, order]);
      
      // Send notification about new order
      webhookService.sendItemNotification('new_customer', {
        orderId: order.id,
        clientName: order.clientName,
        packageId: order.packageId,
        amount: order.amount,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'Pedido adicionado',
        description: `O pedido ${order.id} foi adicionado com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error adding order:', error);
      toast({
        title: 'Erro ao adicionar pedido',
        description: 'Não foi possível adicionar o pedido. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    orders,
    isLoading,
    fetchOrders,
    addOrder
  };
}
