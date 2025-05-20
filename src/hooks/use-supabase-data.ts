
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useSupabaseData<T>(
  tableName: string, 
  options: { 
    orderBy?: { column: string; ascending?: boolean },
    transformData?: (data: any[]) => T[]
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from(tableName).select('*');
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }
      
      const { data: fetchedData, error } = await query;
      
      if (error) throw error;
      
      const transformedData = options.transformData 
        ? options.transformData(fetchedData || [])
        : (fetchedData || []) as T[];
      
      setData(transformedData);
      console.log(`Loaded ${transformedData.length} items from ${tableName}`);
    } catch (err: any) {
      console.error(`Error loading data from ${tableName}:`, err);
      setError(err.message || `Failed to load data from ${tableName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Partial<T>) => {
    try {
      console.log(`Adding item to ${tableName}:`, item);
      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([item])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Item adicionado",
        description: `O item foi adicionado com sucesso.`
      });
      
      // Refresh data after adding
      fetchData();
      
      return insertedData?.[0] || null;
    } catch (err: any) {
      console.error(`Error adding item to ${tableName}:`, err);
      toast({
        title: "Erro ao adicionar",
        description: err.message || `Não foi possível adicionar o item.`,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      console.log(`Updating item in ${tableName}:`, {id, updates});
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Item atualizado",
        description: `O item foi atualizado com sucesso.`
      });
      
      // Refresh data after updating
      fetchData();
      
      return true;
    } catch (err: any) {
      console.error(`Error updating item in ${tableName}:`, err);
      toast({
        title: "Erro ao atualizar",
        description: err.message || `Não foi possível atualizar o item.`,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      console.log(`Deleting item from ${tableName}:`, id);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Item removido",
        description: `O item foi removido com sucesso.`
      });
      
      // Refresh data after deletion
      fetchData();
      
      return true;
    } catch (err: any) {
      console.error(`Error deleting item from ${tableName}:`, err);
      toast({
        title: "Erro ao remover",
        description: err.message || `Não foi possível remover o item.`,
        variant: "destructive"
      });
      return false;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    addItem,
    updateItem,
    deleteItem
  };
}
