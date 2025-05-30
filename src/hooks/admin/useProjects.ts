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
  versions?: any[]; // Para as versões
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('Loading projects from database...');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_versions (
            id,
            name,
            description,
            bandcamp_url,
            recommended,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);

      // Transform data to match Project interface
      const formattedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: (['waiting', 'feedback', 'approved'].includes(project.status) 
          ? project.status 
          : 'waiting') as 'waiting' | 'feedback' | 'approved',
        client_id: project.client_id,
        client_name: project.client_name,
        client_email: project.client_email,
        client_phone: project.client_phone,
        package_type: project.package_type,
        preview_code: project.preview_code,
        deadline: project.deadline,
        created_at: project.created_at,
        updated_at: project.updated_at,
        expires_at: project.expires_at,
        versions: project.project_versions || [] // Incluir versões
      }));

      console.log('Formatted projects:', formattedProjects);
      setProjects(formattedProjects);
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
      console.log('Creating project with data:', projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          preview_code: Math.random().toString(36).substring(2, 14),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created successfully:', data);

      // IMPORTANTE: Recarregar lista completa do banco
      await loadProjects();

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
      console.log('Updating project:', id, updates);
      
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      console.log('Project updated successfully:', data);

      // IMPORTANTE: Recarregar lista completa do banco
      await loadProjects();

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
      console.log('Deleting project:', id);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      console.log('Project deleted successfully');

      // IMPORTANTE: Recarregar lista completa do banco
      await loadProjects();

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

  // Listener para mudanças em tempo real
  useEffect(() => {
    loadProjects();

    // Configurar listener para mudanças em tempo real
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Real-time project change detected:', payload);
          // Recarregar projetos quando houver mudanças
          loadProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
