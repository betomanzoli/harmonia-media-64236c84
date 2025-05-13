
import { useState, useEffect, useCallback } from 'react';

export interface Customer {
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

  // Load customers from localStorage
  const loadCustomers = useCallback(() => {
    setIsLoading(true);
    
    try {
      const storedCustomers = localStorage.getItem('harmonIA_customers');
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        // Default data with proper typing
        const defaultCustomers: Customer[] = [
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
        ];
        setCustomers(defaultCustomers);
        localStorage.setItem('harmonIA_customers', JSON.stringify(defaultCustomers));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new customer (with duplicate check)
  const addCustomer = useCallback((customerData: Omit<Customer, 'id'>) => {
    const existingCustomer = customers.find(
      c => c.email.toLowerCase() === customerData.email.toLowerCase()
    );

    if (existingCustomer) {
      // Update existing customer with new project count
      const updatedCustomers = customers.map(c => {
        if (c.id === existingCustomer.id) {
          return {
            ...c,
            projects: customerData.projects || c.projects + 1,
            // Update other fields if needed
            name: customerData.name || c.name,
            phone: customerData.phone || c.phone
          };
        }
        return c;
      });
      
      setCustomers(updatedCustomers);
      localStorage.setItem('harmonIA_customers', JSON.stringify(updatedCustomers));
      return existingCustomer.id;
    }

    // Add new customer
    const newId = (customers.length + 1).toString();
    const newCustomer: Customer = {
      id: newId,
      ...customerData,
      status: customerData.status || 'active' as const
    };
    
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('harmonIA_customers', JSON.stringify(updatedCustomers));
    
    return newId;
  }, [customers]);

  // Get customer by email
  const getCustomerByEmail = useCallback((email: string) => {
    return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
  }, [customers]);

  // Update customer
  const updateCustomer = useCallback((id: string, data: Partial<Omit<Customer, 'id'>>) => {
    setCustomers(prevCustomers => {
      const updatedCustomers = prevCustomers.map(c => {
        if (c.id === id) {
          return { ...c, ...data };
        }
        return c;
      });
      localStorage.setItem('harmonIA_customers', JSON.stringify(updatedCustomers));
      return updatedCustomers;
    });
  }, []);

  // Delete customer
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prevCustomers => {
      const updatedCustomers = prevCustomers.filter(c => c.id !== id);
      localStorage.setItem('harmonIA_customers', JSON.stringify(updatedCustomers));
      return updatedCustomers;
    });
  }, []);

  // Refresh customers
  const refreshCustomers = useCallback(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    isLoading,
    refreshCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerByEmail
  };
};
