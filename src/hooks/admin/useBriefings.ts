import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { n8nIntegrationService } from '@/services/webhookIntegrationService';

// Type definitions for briefing data
export interface Briefing {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType: string;
  status: 'pending' | 'completed' | 'approved';
  createdAt: string;
  projectCreated: boolean;
  data?: any;
  description?: string;
  formData?: Record<string, any>;
}

export function useBriefings() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Use the general hook for Supabase data operations
  const {
    data: briefingsData,
    isLoading,
    error,
    fetchData: fetchBriefings,
    addItem,
    updateItem,
    deleteItem
  } = useSupabaseData<any>('briefings', {
    orderBy: { column: 'created_at', ascending: false },
    transformData: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.data?.name || item.data?.clientName || 'Cliente sem nome',
        email: item.data?.email || item.data?.clientEmail || 'email@example.com',
        phone: item.data?.phone || item.data?.clientPhone || '',
        packageType: item.package_type || 'standard',
        status: item.status || 'pending',
        createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
        projectCreated: !!item.project_id,
        data: item.data || {},
        description: item.data?.description || '',
        formData: item.data?.formData || {}
      }));
    }
  });
  
  // Add a new briefing
  const addBriefing = async (briefingData: any) => {
    try {
      console.log("Creating briefing with data:", briefingData);
      
      const briefingId = await addItem({
        data: briefingData,
        package_type: briefingData.packageType,
        status: 'pending',
      });
      
      // Notify n8n workflow about the new briefing
      await n8nIntegrationService.processBriefingSubmission(
        briefingId?.id || uuidv4(),
        briefingData.name,
        briefingData.email,
        briefingData.packageType,
        briefingData
      );
      
      return briefingId;
    } catch (error) {
      console.error("Error in addBriefing:", error);
      throw error;
    }
  };
  
  // Update briefing status
  const updateBriefingStatus = async (id: string, status: 'pending' | 'completed' | 'approved') => {
    return await updateItem(id, { status });
  };
  
  // Update a briefing
  const updateBriefing = async (id: string, briefingData: any) => {
    try {
      console.log("Updating briefing:", id, briefingData);
      
      const { data: existingBriefing, error } = await supabase
        .from('briefings')
        .select('data, package_type')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      const updatedData = {
        ...existingBriefing.data,
        name: briefingData.name,
        email: briefingData.email,
        phone: briefingData.phone,
        updatedAt: new Date().toISOString()
      };
      
      const result = await updateItem(id, {
        data: updatedData,
        package_type: briefingData.packageType || existingBriefing.package_type
      });
      
      return result;
    } catch (error) {
      console.error("Error in updateBriefing:", error);
      throw error;
    }
  };
  
  // Delete a briefing
  const deleteBriefing = async (id: string) => {
    return await deleteItem(id);
  };
  
  // Create a project from briefing
  const createProjectFromBriefing = useCallback(async (briefing: Briefing) => {
    try {
      setIsProcessing(true);
      
      // Create a new project ID
      const projectId = uuidv4();
      
      // Create client if it doesn't exist
      let clientId = null;
      const { data: existingClients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', briefing.email);
        
      if (clientError) throw clientError;
      
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
      } else {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: briefing.name,
            email: briefing.email,
            phone: briefing.phone
          })
          .select()
          .single();
          
        if (createError) throw createError;
        clientId = newClient.id;
      }
      
      // Create the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `Projeto para ${briefing.name}`,
          description: `Projeto criado a partir do briefing ${briefing.id}`,
          client_id: clientId,
          status: 'waiting'
        })
        .select()
        .single();
        
      if (projectError) throw projectError;
      
      // Update the briefing with project reference
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          project_id: projectId
        })
        .eq('id', briefing.id);
        
      if (updateError) throw updateError;
      
      // Create project history entry
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'project_created',
          details: {
            briefingId: briefing.id,
            clientName: briefing.name,
            clientEmail: briefing.email,
            packageType: briefing.packageType,
            timestamp: new Date().toISOString()
          }
        });
        
      if (historyError) {
        console.error("Error creating project history:", historyError);
        // Not throwing error here as it's not critical
      }
      
      // Notify about project creation
      await n8nIntegrationService.processBriefingSubmission(
        briefing.id,
        briefing.name,
        briefing.email,
        briefing.packageType,
        {
          ...briefing.data,
          projectCreated: true,
          projectId
        }
      );
      
      // Refresh the briefings list
      fetchBriefings();
      
      toast({
        title: "Projeto criado",
        description: `Projeto criado com sucesso a partir do briefing.`
      });
      
      return projectId;
    } catch (error: any) {
      console.error("Error creating project:", error);
      
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Não foi possível criar o projeto.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchBriefings, toast]);

  return {
    briefings: briefingsData,
    isLoading,
    error,
    isProcessing,
    fetchBriefings,
    addBriefing,
    updateBriefing,
    updateBriefingStatus,
    deleteBriefing,
    createProjectFromBriefing
  };
}
