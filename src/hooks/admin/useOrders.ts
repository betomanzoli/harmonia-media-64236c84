
import { useState, useEffect, useCallback } from 'react';
import notificationService from '@/services/notificationService';

interface OrderCustomer {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  customer: OrderCustomer;
  createdAt: string;
  status: 'pending' | 'in progress' | 'completed' | 'cancelled';
  value: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  packageType: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = () => {
    setIsLoading(true);
    
    // Em um ambiente real, isto seria uma chamada API
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD-2025-001',
          customer: {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@example.com'
          },
          createdAt: '2025-04-01T10:30:00.000Z',
          status: 'in progress',
          value: 750.00,
          items: [
            { name: 'Pacote Profissional', quantity: 1, price: 750.00 }
          ],
          packageType: 'Profissional'
        },
        {
          id: 'ORD-2025-002',
          customer: {
            id: '2',
            name: 'Maria Oliveira',
            email: 'maria.oliveira@example.com'
          },
          createdAt: '2025-03-28T14:15:00.000Z',
          status: 'completed',
          value: 1250.00,
          items: [
            { name: 'Pacote Premium', quantity: 1, price: 1250.00 }
          ],
          packageType: 'Premium'
        },
        {
          id: 'ORD-2025-003',
          customer: {
            id: '3',
            name: 'Carlos Santos',
            email: 'carlos.santos@example.com'
          },
          createdAt: '2025-03-25T09:45:00.000Z',
          status: 'cancelled',
          value: 450.00,
          items: [
            { name: 'Pacote Essencial', quantity: 1, price: 450.00 }
          ],
          packageType: 'Essencial'
        },
        {
          id: 'ORD-2025-004',
          customer: {
            id: '4',
            name: 'Ana Ferreira',
            email: 'ana.ferreira@example.com'
          },
          createdAt: '2025-04-05T16:20:00.000Z',
          status: 'pending',
          value: 450.00,
          items: [
            { name: 'Pacote Essencial', quantity: 1, price: 450.00 }
          ],
          packageType: 'Essencial'
        },
        {
          id: 'ORD-2025-005',
          customer: {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@example.com'
          },
          createdAt: '2025-03-15T11:10:00.000Z',
          status: 'completed',
          value: 750.00,
          items: [
            { name: 'Pacote Profissional', quantity: 1, price: 750.00 }
          ],
          packageType: 'Profissional'
        },
        {
          id: 'ORD-2025-006',
          customer: {
            id: '4',
            name: 'Ana Ferreira',
            email: 'ana.ferreira@example.com'
          },
          createdAt: '2025-03-20T13:25:00.000Z',
          status: 'in progress',
          value: 1250.00,
          items: [
            { name: 'Pacote Premium', quantity: 1, price: 1250.00 }
          ],
          packageType: 'Premium'
        },
        {
          id: 'ORD-2025-007',
          customer: {
            id: '5',
            name: 'Pedro Costa',
            email: 'pedro.costa@example.com'
          },
          createdAt: '2025-04-07T08:40:00.000Z',
          status: 'pending',
          value: 750.00,
          items: [
            { name: 'Pacote Profissional', quantity: 1, price: 750.00 }
          ],
          packageType: 'Profissional'
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const refreshOrders = useCallback(() => {
    loadOrders();
    
    // Adicionar notificação para novos pedidos
    notificationService.notify('new_order', {
      id: `order-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    isLoading,
    refreshOrders
  };
}
