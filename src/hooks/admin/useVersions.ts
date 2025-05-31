import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Version {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  bandcamp_url?: string;
  recommended: boolean;
  created_at: string;
  updated_at?: string;
}

export const useVersions = (projectId?: string) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadVersions = async () => {
    if (!projectId) {
      setVersions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading versions for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error loading versions:', error);
        throw error;
      }

      console.log('Versions loaded:', data);
      setVersions(data || []);
      
    } catch (error) {
      console.error('Error loading versions:', error);
      setVersions([]);
      toast({
        title: "Erro ao carregar versões",
        description: "Não foi possível carregar as versões do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addVersion = async (versionData: Omit<Version, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating version with data:', versionData);
      
      const { data, error } = await supabase
        .from('project_versions')
        .insert([{
          ...versionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating version:', error);
        throw error;
      }

      console.log('Version created successfully:', data);
      await loadVersions();

      toast({
        title: "Versão criada",
        description: "Nova versão adicionada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error creating version:', error);
      toast({
        title: "Erro ao criar versão",
        description: "Não foi possível criar a versão.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateVersion = async (id: string, updates: Partial<Version>) => {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await loadVersions();
      toast({
        title: "Versão atualizada",
        description: "Versão atualizada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error updating version:', error);
      toast({
        title: "Erro ao atualizar versão",
        description: "Não foi possível atualizar a versão.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteVersion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadVersions();
      toast({
        title: "Versão removida",
        description: "Versão removida com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Error deleting version:', error);
      toast({
        title: "Erro ao remover versão",
        description: "Não foi possível remover a versão.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeVersions = async () => {
      if (isMounted) {
        await loadVersions();
      }
    };

    initializeVersions();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return {
    versions,
    loading,
    addVersion,
    updateVersion,
    deleteVersion,
    reloadVersions: loadVersions
  };
};
