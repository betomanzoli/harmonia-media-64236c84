import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_id: string; // Assuming this might be a display ID or similar, keeping it
  name: string;
  description?: string;
  audio_url?: string;
  file_id?: string; // Assuming this relates to Supabase Storage
  bandcamp_url?: string; // Added based on useProjects query
  recommended?: boolean;
  created_at: string;
}

export const useVersions = (projectId?: string) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadVersions = async (idToLoad?: string) => {
    const targetProjectId = idToLoad || projectId;
    if (!targetProjectId) {
      console.log('useVersions: No project ID provided, clearing versions.');
      setVersions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`useVersions: Loading versions for project ID: ${targetProjectId}`);
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', targetProjectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useVersions: Supabase error loading versions:', error);
        throw error;
      }

      console.log('useVersions: Raw versions data from Supabase:', data);
      // Ensure data matches ProjectVersion structure
      const formattedVersions = (data || []).map(v => ({
        id: v.id,
        project_id: v.project_id,
        version_id: v.version_id || v.id, // Fallback if version_id is missing
        name: v.name,
        description: v.description,
        audio_url: v.audio_url,
        file_id: v.file_id,
        bandcamp_url: v.bandcamp_url,
        recommended: v.recommended,
        created_at: v.created_at,
      }));
      console.log('useVersions: Formatted versions:', formattedVersions);
      setVersions(formattedVersions);
    } catch (error) {
      console.error('useVersions: Error in loadVersions:', error);
      toast({
        title: "Erro ao carregar versões",
        description: "Não foi possível carregar as versões do projeto.",
        variant: "destructive"
      });
      setVersions([]); // Clear versions on error
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (versionData: Omit<ProjectVersion, 'id' | 'created_at'>) => {
    if (!versionData.project_id) {
        toast({ title: "Erro", description: "ID do projeto é necessário para criar uma versão.", variant: "destructive" });
        return null;
    }
    try {
      console.log('useVersions: Creating version with data:', versionData);
      const { data, error } = await supabase
        .from('project_versions')
        .insert([{
            ...versionData,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('useVersions: Error creating version:', error);
        throw error;
      }

      console.log('useVersions: Version created successfully:', data);
      // Listener should handle the update, no manual reload needed here if listener works
      // await loadVersions(versionData.project_id); // Removed manual reload

      toast({
        title: "Versão criada",
        description: "Versão criada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('useVersions: Error in createVersion:', error);
      toast({
        title: "Erro ao criar versão",
        description: "Não foi possível criar a versão.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateVersion = async (id: string, updates: Partial<ProjectVersion>) => {
    try {
      console.log('useVersions: Updating version:', id, updates);
      const { data, error } = await supabase
        .from('project_versions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('useVersions: Error updating version:', error);
        throw error;
      }

      console.log('useVersions: Version updated successfully:', data);
      // Listener should handle the update
      // await loadVersions(data.project_id); // Removed manual reload

      toast({
        title: "Versão atualizada",
        description: "Versão atualizada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('useVersions: Error in updateVersion:', error);
      toast({
        title: "Erro ao atualizar versão",
        description: "Não foi possível atualizar a versão.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteVersion = async (id: string, currentProjectId?: string) => {
    try {
      console.log('useVersions: Deleting version:', id);
      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('useVersions: Error deleting version:', error);
        throw error;
      }

      console.log('useVersions: Version deleted successfully');
      // Listener should handle the update
      // if (currentProjectId) await loadVersions(currentProjectId); // Removed manual reload

      toast({
        title: "Versão removida",
        description: "Versão removida com sucesso."
      });

      return true;
    } catch (error) {
      console.error('useVersions: Error in deleteVersion:', error);
      toast({
        title: "Erro ao remover versão",
        description: "Não foi possível remover a versão.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Load initial data and set up listener
  useEffect(() => {
    if (projectId) {
      loadVersions(projectId);

      // Setup real-time listener for project_versions table
      const channel = supabase
        .channel(`project_versions_changes_for_${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_versions',
            filter: `project_id=eq.${projectId}` // Only listen for changes related to the current project
          },
          (payload) => {
            console.log(`useVersions: Real-time change detected for project ${projectId}:`, payload);
            // Reload versions for the specific project when a change occurs
            loadVersions(projectId);
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`useVersions: Successfully subscribed to changes for project ${projectId}`);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`useVersions: Subscription error for project ${projectId}:`, status, err);
            // Optionally, try to resubscribe or notify the user
          }
        });

      // Cleanup function to remove the channel when the component unmounts or projectId changes
      return () => {
        console.log(`useVersions: Unsubscribing from changes for project ${projectId}`);
        supabase.removeChannel(channel);
      };
    } else {
      // If no projectId, clear versions and ensure no listener is active
      setVersions([]);
      setLoading(false);
    }
  }, [projectId]); // Rerun effect if projectId changes

  return {
    versions,
    loading,
    createVersion,
    updateVersion,
    deleteVersion,
    reloadVersions: () => loadVersions(projectId) // Expose reload function bound to current projectId
  };
};

