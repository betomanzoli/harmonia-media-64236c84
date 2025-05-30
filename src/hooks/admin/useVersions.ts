
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_id: string;
  name: string;
  description?: string;
  audio_url?: string;
  file_id?: string;
  recommended?: boolean;
  created_at: string;
}

export const useVersions = (projectId?: string) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
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
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVersions(data || []);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast({
        title: "Erro ao carregar versões",
        description: "Não foi possível carregar as versões do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (versionData: Omit<ProjectVersion, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .insert([versionData])
        .select()
        .single();

      if (error) throw error;

      setVersions(prev => [data, ...prev]);
      toast({
        title: "Versão criada",
        description: "Versão criada com sucesso."
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

  const updateVersion = async (id: string, updates: Partial<ProjectVersion>) => {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVersions(prev => prev.map(version => 
        version.id === id ? { ...version, ...data } : version
      ));

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

      setVersions(prev => prev.filter(version => version.id !== id));
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
    loadVersions();
  }, [projectId]);

  return {
    versions,
    loading,
    createVersion,
    updateVersion,
    deleteVersion,
    reloadVersions: loadVersions
  };
};
