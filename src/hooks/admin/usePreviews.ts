
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { n8nIntegrationService } from '@/services/webhookIntegrationService';

export function usePreviews() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Fetch previews for a specific project
  const fetchPreviewsByProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const { data: previewsData, error } = await supabase
        .from('previews')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return previewsData || [];
    } catch (error) {
      console.error('Error fetching previews:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new preview
  const createPreview = async (
    projectId: string,
    title: string,
    description: string,
    allowedEmails: string[]
  ) => {
    try {
      const previewId = uuidv4().slice(0, 8);
      
      const { data, error } = await supabase
        .from('previews')
        .insert({
          preview_id: previewId,
          project_id: projectId,
          title,
          description,
          allowed_emails: allowedEmails,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating preview:', error);
      throw error;
    }
  };

  // Send notification for a preview
  const sendPreviewNotification = async (
    projectId: string,
    clientName: string,
    clientEmail: string,
    projectTitle: string,
    versions: Array<{id: string, name: string, audioUrl: string}>
  ) => {
    setIsSending(true);
    try {
      // First, try to use the edge function for more robust processing
      try {
        const response = await supabase.functions.invoke('preview-notification', {
          body: {
            projectId,
            clientName,
            clientEmail,
            projectTitle,
            versions
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        console.log("Preview notification sent via edge function:", response.data);
        
        toast({
          title: "Notificação enviada",
          description: `O cliente ${clientName} foi notificado sobre as novas prévias.`
        });
        
        return true;
      } catch (edgeFunctionError) {
        console.error("Edge function error, falling back to n8n webhook:", edgeFunctionError);
        
        // Fall back to n8n webhook if edge function fails
        const success = await n8nIntegrationService.sendPreviewNotification(
          projectId,
          clientName,
          clientEmail,
          projectTitle,
          versions
        );
        
        if (!success) {
          throw new Error("Failed to send notification via n8n webhook");
        }
        
        toast({
          title: "Notificação enviada via n8n",
          description: `O cliente ${clientName} foi notificado sobre as novas prévias.`
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error sending preview notification:', error);
      toast({
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação de prévia.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  // Update preview status
  const updatePreviewStatus = async (previewId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('previews')
        .update({ is_active: isActive })
        .eq('id', previewId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating preview status:', error);
      throw error;
    }
  };

  // Delete a preview
  const deletePreview = async (previewId: string) => {
    try {
      const { error } = await supabase
        .from('previews')
        .delete()
        .eq('id', previewId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting preview:', error);
      throw error;
    }
  };

  return {
    isLoading,
    isSending,
    fetchPreviewsByProject,
    createPreview,
    sendPreviewNotification,
    updatePreviewStatus,
    deletePreview
  };
}
