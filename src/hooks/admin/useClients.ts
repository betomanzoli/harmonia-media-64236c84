
import { useState, useEffect, useCallback } from 'react';
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

  // Carregar clientes do Supabase
  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading clients from Supabase...');
      
      const { data: supabaseClients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedClients: Client[] = (supabaseClients || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        createdAt: new Date(client.created_at).toLocaleDateString('pt-BR')
      }));

      setClients(formattedClients);
      console.log(`Loaded ${formattedClients.length} clients from Supabase`);
      
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar os clientes do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Adicionar novo cliente
  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding new client:', clientData);
      
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

      // Recarregar clientes
      await loadClients();
      
      toast({
        title: "Cliente adicionado",
        description: `Cliente ${clientData.name} foi adicionado com sucesso.`
      });

      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível adicionar o cliente ao banco de dados.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadClients, toast]);

  // Atualizar cliente
  const updateClient = useCallback(async (clientId: string, updates: Partial<Client>) => {
    try {
      console.log('Updating client:', clientId, updates);
      
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId);

      if (error) throw error;

      // Recarregar clientes
      await loadClients();
      
      toast({
        title: "Cliente atualizado",
        description: "Cliente foi atualizado com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadClients, toast]);

  // Deletar cliente
  const deleteClient = useCallback(async (clientId: string) => {
    try {
      console.log('Deleting client:', clientId);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      // Recarregar clientes
      await loadClients();
      
      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao deletar cliente",
        description: "Não foi possível deletar o cliente.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadClients, toast]);

  // Carregar clientes na inicialização
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    isLoading,
    loadClients,
    addClient,
    updateClient,
    deleteClient
  };
};
