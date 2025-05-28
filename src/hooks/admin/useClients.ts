
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      toast({
        title: "Cliente criado",
        description: "Cliente criado com sucesso."
      });

      return data;
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
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...data } : client
      ));

      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso."
      });

      return data;
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
    loading,
    createClient,
    updateClient,
    deleteClient,
    reloadClients: loadClients
  };
};
