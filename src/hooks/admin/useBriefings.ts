
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Briefing {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'approved';
  description?: string;
  projectCreated: boolean;
  formData?: any;
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load briefings from projects table (since briefings table doesn't exist)
  const fetchBriefings = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          client_name,
          client_email,
          client_phone,
          package_type,
          status,
          description,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform projects data to match the Briefing interface
      const transformedBriefings: Briefing[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.client_name || 'Cliente sem nome',
        email: item.client_email || 'sem email',
        phone: item.client_phone || '',
        packageType: item.package_type || 'essencial',
        createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
        status: item.status === 'waiting' ? 'pending' : 'completed',
        description: item.description || 'Sem descrição',
        projectCreated: true,
        formData: {}
      }));
      
      setBriefings(transformedBriefings);
    } catch (err: any) {
      console.error('Error fetching briefings:', err);
      setError(err.message);
      
      // Fallback to localStorage if Supabase fails
      const storedBriefings = localStorage.getItem('harmonIA_briefings');
      if (storedBriefings) {
        setBriefings(JSON.parse(storedBriefings));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefings();
  }, [fetchBriefings]);

  const addBriefing = useCallback((briefing: Omit<Briefing, 'id'>) => {
    const id = `B${String(briefings.length + 1).padStart(3, '0')}`;
    const newBriefing = { ...briefing, id };
    
    // Store in local state
    setBriefings(prev => [...prev, newBriefing as Briefing]);
    
    // Save to localStorage for persistence
    const allBriefings = [...briefings, newBriefing as Briefing];
    localStorage.setItem('harmonIA_briefings', JSON.stringify(allBriefings));
    
    return id;
  }, [briefings]);

  const updateBriefingStatus = useCallback(async (id: string, status: Briefing['status']) => {
    try {
      // Update in Supabase projects table
      const { error } = await supabase
        .from('projects')
        .update({ status: status === 'pending' ? 'waiting' : 'completed' })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBriefings(prev => 
        prev.map(briefing => 
          briefing.id === id ? { ...briefing, status } : briefing
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error updating briefing status:', err);
      toast({
        title: "Erro ao atualizar status",
        description: err.message || "Não foi possível atualizar o status do briefing",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const updateBriefing = useCallback(async (id: string, updates: Partial<Briefing>) => {
    try {
      // Update in Supabase projects table
      const supabaseUpdates: any = {};
      
      if (updates.status) {
        supabaseUpdates.status = updates.status === 'pending' ? 'waiting' : 'completed';
      }
      
      if (updates.description) {
        supabaseUpdates.description = updates.description;
      }
      
      const { error } = await supabase
        .from('projects')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBriefings(prev => 
        prev.map(briefing => 
          briefing.id === id ? { ...briefing, ...updates } : briefing
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error updating briefing:', err);
      toast({
        title: "Erro ao atualizar briefing",
        description: err.message || "Não foi possível atualizar o briefing",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const deleteBriefing = useCallback(async (id: string) => {
    try {
      // Delete from Supabase projects table
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBriefings(prev => prev.filter(briefing => briefing.id !== id));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting briefing:', err);
      toast({
        title: "Erro ao excluir briefing",
        description: err.message || "Não foi possível excluir o briefing",
        variant: "destructive"
      });
      
      // Fallback to just removing from local state
      setBriefings(prev => prev.filter(briefing => briefing.id !== id));
      
      return false;
    }
  }, [toast]);

  const createProjectFromBriefing = useCallback(async (briefing: Briefing) => {
    // Since briefings are already projects, just return the existing ID
    return briefing.id;
  }, []);

  return {
    briefings,
    isLoading,
    error,
    addBriefing,
    updateBriefingStatus,
    updateBriefing,
    deleteBriefing,
    createProjectFromBriefing,
    fetchBriefings
  };
};
