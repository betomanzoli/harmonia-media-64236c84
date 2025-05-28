
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'waiting' | 'feedback' | 'approved';
  client_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  package_type?: string;
  preview_code?: string;
  deadline?: string;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'preview_code'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          preview_code: Math.random().toString(36).substring(2, 14)
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Projeto criado",
        description: "Projeto criado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o projeto.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...data } : project
      ));

      toast({
        title: "Projeto atualizado",
        description: "Projeto atualizado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Não foi possível atualizar o projeto.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Projeto removido",
        description: "Projeto removido com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao remover projeto",
        description: "Não foi possível remover o projeto.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    reloadProjects: loadProjects
  };
};
