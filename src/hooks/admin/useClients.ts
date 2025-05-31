
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedClients = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        createdAt: client.created_at
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company
        }])
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        createdAt: data.created_at
      };

      setClients(prev => [newClient, ...prev]);
      toast({
        title: "Cliente criado",
        description: "Cliente criado com sucesso."
      });

      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.company !== undefined) dbUpdates.company = updates.company;

      const { data, error } = await supabase
        .from('clients')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedClient: Client = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        createdAt: data.created_at
      };

      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));

      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso."
      });

      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    reloadClients: loadClients
  };
};
