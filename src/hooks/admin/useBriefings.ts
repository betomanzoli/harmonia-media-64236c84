
import { useState, useCallback, useEffect } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/admin/useCustomers';

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
  const { getCustomerByEmail, addCustomer, updateCustomer } = useCustomers();

  // Load briefings from Supabase
  const fetchBriefings = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select(`
          id,
          package_type,
          status,
          data,
          created_at,
          updated_at,
          completed_at,
          project_id,
          clients (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match the Briefing interface
      const transformedBriefings: Briefing[] = data.map((item: any) => ({
        id: item.id,
        name: item.clients?.name || item.data?.client_name || 'Cliente sem nome',
        email: item.clients?.email || item.data?.client_email || 'sem email',
        phone: item.clients?.phone || item.data?.client_phone || '',
        packageType: item.package_type,
        createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
        status: item.status,
        description: item.data?.description || 'Sem descrição',
        projectCreated: !!item.project_id,
        formData: item.data || {}
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
      // Update in Supabase
      const { error } = await supabase
        .from('briefings')
        .update({ status })
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
      
      // Also update localStorage
      const updatedBriefings = briefings.map(briefing => 
        briefing.id === id ? { ...briefing, status } : briefing
      );
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
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
  }, [briefings, toast]);

  const updateBriefing = useCallback(async (id: string, updates: Partial<Briefing>) => {
    try {
      // Get the existing briefing from state
      const existingBriefing = briefings.find(b => b.id === id);
      if (!existingBriefing) {
        throw new Error("Briefing não encontrado");
      }
      
      // Transform updates to match Supabase schema
      const supabaseUpdates: any = {};
      
      // Only update the 'data' field in Supabase if formData is provided
      if (updates.formData) {
        supabaseUpdates.data = {
          ...(existingBriefing.formData || {}),
          ...updates.formData
        };
      }
      
      // Map status if provided
      if (updates.status) {
        supabaseUpdates.status = updates.status;
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('briefings')
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
      
      // Also update localStorage
      const updatedBriefings = briefings.map(briefing => 
        briefing.id === id ? { ...briefing, ...updates } : briefing
      );
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
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
  }, [briefings, toast]);

  const deleteBriefing = useCallback(async (id: string) => {
    try {
      // Soft delete in Supabase
      const { error } = await supabase
        .from('briefings')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBriefings(prev => prev.filter(briefing => briefing.id !== id));
      
      // Also update localStorage
      const updatedBriefings = briefings.filter(briefing => briefing.id !== id);
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
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
      const updatedBriefings = briefings.filter(briefing => briefing.id !== id);
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
      return false;
    }
  }, [briefings, toast]);

  const createProjectFromBriefing = useCallback(async (briefing: Briefing) => {
    try {
      // Check if client exists or create a new one
      let clientId: string | null = null;
      const existingClient = getCustomerByEmail(briefing.email);
      
      if (existingClient) {
        clientId = existingClient.id;
        // Update project count for this client
        updateCustomer(clientId, {
          projects: existingClient.projects + 1
        });
      } else {
        // Create a new client
        const newClientData = {
          name: briefing.name,
          email: briefing.email,
          phone: briefing.phone,
          status: 'active' as const,
          projects: 1,
          createdAt: new Date().toISOString()
        };
        clientId = addCustomer(newClientData);
        
        // Also try to create in Supabase
        try {
          const { data: client, error } = await supabase
            .from('clients')
            .insert([
              {
                name: briefing.name,
                email: briefing.email,
                phone: briefing.phone
              }
            ])
            .select()
            .single();
          
          if (client && !error) {
            clientId = client.id;
          }
        } catch (err) {
          console.error('Error creating client in Supabase:', err);
          // Continue with local client ID
        }
      }
      
      // Generate a unique project ID
      const projectId = createId();
      
      // Create a project in Supabase
      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            id: projectId,
            title: briefing.description || `Projeto para ${briefing.name}`,
            client_id: clientId,
            status: 'waiting',
            description: briefing.description,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Create a preview project
      const previewId = `P${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 14); // 14 days expiration
      
      // Create preview record in localStorage
      const previewProjects = JSON.parse(localStorage.getItem('harmonIA_preview_projects') || '[]');
      const newPreviewProject = {
        id: previewId,
        clientName: briefing.name,
        clientEmail: briefing.email,
        clientPhone: briefing.phone,
        packageType: briefing.packageType,
        createdAt: new Date().toISOString(),
        expirationDate: expirationDate.toISOString(),
        status: 'waiting',
        projectId: project.id,
        projectTitle: briefing.description || `Música para ${briefing.name}`,
        lastActivityDate: new Date().toISOString(),
        versionsList: []
      };
      
      previewProjects.push(newPreviewProject);
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(previewProjects));
      
      // Try to create in Supabase as well
      try {
        await supabase
          .from('preview_projects')
          .insert([
            {
              id: previewId,
              client_name: briefing.name,
              project_title: briefing.description || `Música para ${briefing.name}`,
              package_type: briefing.packageType,
              status: 'waiting',
              expiration_date: expirationDate.toISOString(),
              last_activity_date: new Date().toISOString()
            }
          ]);
      } catch (err) {
        console.error('Error creating preview project in Supabase:', err);
        // Continue with local storage
      }
      
      // Update the briefing to link it to the project
      const { error: updateError } = await supabase
        .from('briefings')
        .update({ project_id: project.id })
        .eq('id', briefing.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setBriefings(prev => 
        prev.map(b => 
          b.id === briefing.id ? { ...b, projectCreated: true } : b
        )
      );
      
      // Save updated briefings
      const updatedBriefings = briefings.map(b => 
        b.id === briefing.id ? { ...b, projectCreated: true } : b
      );
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
      return project.id;
    } catch (err: any) {
      console.error('Error creating project from briefing:', err);
      toast({
        title: "Erro ao criar projeto",
        description: err.message || "Não foi possível criar o projeto a partir do briefing",
        variant: "destructive"
      });
      
      // Create a project ID for the fallback
      const projectId = `P${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
      
      // Store in localStorage as fallback
      // Create a project in localStorage
      const storedProjects = localStorage.getItem('harmonIA_projects') || '[]';
      const projects = JSON.parse(storedProjects);
      
      const newProject = {
        id: projectId,
        title: briefing.description || `Projeto para ${briefing.name}`,
        clientName: briefing.name,
        status: 'em_andamento',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        packageType: briefing.packageType
      };
      
      const updatedProjects = [...projects, newProject];
      localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
      
      // Update local state
      setBriefings(prev => 
        prev.map(b => 
          b.id === briefing.id ? { ...b, projectCreated: true } : b
        )
      );
      
      return projectId;
    }
  }, [briefings, toast, getCustomerByEmail, updateCustomer, addCustomer]);

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
