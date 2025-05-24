
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar clientes:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os clientes.",
          variant: "destructive"
        });
        return;
      }

      const formattedCustomers: Customer[] = data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        createdAt: new Date(client.created_at).toLocaleDateString('pt-BR')
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar clientes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          company: customerData.company
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o cliente.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });

      await loadCustomers();
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const getCustomerByEmail = (email: string): Customer | null => {
    return customers.find(customer => customer.email === email) || null;
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    isLoading,
    refreshCustomers: loadCustomers,
    addCustomer: (customerData: Omit<Customer, "id">) => {
      createCustomer(customerData);
      return `temp_${Date.now()}`;
    },
    updateCustomer: (id: string, data: Partial<Customer>) => {
      console.log('Update customer:', id, data);
    },
    deleteCustomer: (id: string) => {
      console.log('Delete customer:', id);
    },
    getCustomerByEmail,
    createCustomer
  };
};
