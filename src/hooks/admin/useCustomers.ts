
import { useState, useEffect } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  projects?: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cus_001',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-9999',
      status: 'active',
      projects: 2
    },
    {
      id: 'cus_002',
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '(21) 98888-8888',
      status: 'active',
      projects: 1
    },
    {
      id: 'cus_003',
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      status: 'inactive',
      projects: 0
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshCustomers = () => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const getCustomerByEmail = (email: string) => {
    return customers.find(customer => customer.email === email);
  };

  useEffect(() => {
    refreshCustomers();
  }, []);

  return {
    customers,
    isLoading,
    refreshCustomers,
    getCustomerByEmail
  };
}
