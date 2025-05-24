
import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  orders?: number;
  totalSpent?: number;
  status?: string;
  projects?: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const savedCustomers = localStorage.getItem('customers');
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      } else {
        // Mock data if none exists
        const mockCustomers: Customer[] = [
          {
            id: 'cust-' + Math.random().toString(36).substring(2, 10),
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '(11) 99999-9999',
            createdAt: '2023-05-15',
            orders: 2,
            totalSpent: 1200,
            status: 'active',
            projects: 2
          },
          {
            id: 'cust-' + Math.random().toString(36).substring(2, 10),
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(21) 98888-8888',
            createdAt: '2023-05-10',
            orders: 1,
            totalSpent: 500,
            status: 'active',
            projects: 1
          }
        ];
        setCustomers(mockCustomers);
        localStorage.setItem('customers', JSON.stringify(mockCustomers));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const getCustomerByEmail = (email: string) => {
    return customers.find(customer => customer.email === email);
  };

  const refreshCustomers = () => {
    // In a real implementation, this would fetch the latest customers from an API
    console.log("Refreshing customers...");
  };

  return {
    customers,
    isLoading,
    getCustomerByEmail,
    refreshCustomers
  };
}
