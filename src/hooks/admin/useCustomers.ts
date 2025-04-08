
import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  projects: number;
  createdAt: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = () => {
    setIsLoading(true);
    
    // Em um ambiente real, isto seria uma chamada API
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@example.com',
          phone: '(11) 98765-4321',
          status: 'active',
          projects: 3,
          createdAt: '2025-03-10T08:00:00.000Z'
        },
        {
          id: '2',
          name: 'Maria Oliveira',
          email: 'maria.oliveira@example.com',
          phone: '(21) 91234-5678',
          status: 'active',
          projects: 2,
          createdAt: '2025-02-15T10:30:00.000Z'
        },
        {
          id: '3',
          name: 'Carlos Santos',
          email: 'carlos.santos@example.com',
          phone: '(31) 99876-5432',
          status: 'inactive',
          projects: 1,
          createdAt: '2025-01-20T14:45:00.000Z'
        },
        {
          id: '4',
          name: 'Ana Ferreira',
          email: 'ana.ferreira@example.com',
          phone: '(41) 98765-1234',
          status: 'active',
          projects: 4,
          createdAt: '2025-03-05T09:15:00.000Z'
        },
        {
          id: '5',
          name: 'Pedro Costa',
          email: 'pedro.costa@example.com',
          status: 'active',
          projects: 0,
          createdAt: '2025-04-01T11:20:00.000Z'
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const refreshCustomers = () => {
    loadCustomers();
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    isLoading,
    refreshCustomers
  };
};
