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
  versions?: any[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading projects from database...');
      
      // ✅ TESTE SIMPLES PRIMEIRO (sem JOIN)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Raw Supabase response:', { data, error });
      console.log('📋 Data received from Supabase:', data);
      console.log('📊 Number of projects from DB:', data?.length || 0);

      if (error) {
        console.error('❌ Supabase error:', error);
        setProjects([]);
        toast({
          title: "Erro ao carregar projetos",
          description: `Erro Supabase: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        console.log('⚠️ No data returned from Supabase');
        setProjects([]);
        return;
      }

      console.log('🔄 Starting data formatting...');

      const formattedProjects = Array.isArray(data) 
        ? data.map((project, index) => {
            console.log(`🔄 Formatting project ${index + 1}:`, project);
            return {
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
              versions: [] // ✅ Simplificado por enquanto
            };
          })
        : [];

      console.log('✅ Formatted projects:', formattedProjects);
      console.log('📊 Formatted projects count:', formattedProjects.length);
      console.log('🎯 Setting projects state...');
      
      setProjects(formattedProjects);
      console.log('✅ Projects state updated successfully');
      
    } catch (error) {
      console.error('💥 Error loading projects:', error);
      setProjects([]);
      toast({
        title: "Erro inesperado",
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      console.log('🏁 Setting loading to false...');
      setLoading(false);
      console.log('✅ Loading state updated');
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'preview_code'>) => {
    try {
      console.log('🆕 Creating project with data:', projectData);
      
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
        console.error('❌ Error creating project:', error);
        throw error;
      }

      console.log('✅ Project created successfully:', data);
      
      // ✅ Recarregar projetos
      console.log('🔄 Reloading projects after creation...');
      await loadProjects();

      toast({
        title: "Projeto criado",
        description: "Projeto criado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('💥 Error creating project:', error);
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
      console.log('🔄 Updating project:', id, updates);
      
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

      console.log('✅ Project updated successfully:', data);
      await loadProjects();

      toast({
        title: "Projeto atualizado",
        description: "Projeto atualizado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('💥 Error updating project:', error);
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
      console.log('🗑️ Deleting project:', id);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Project deleted successfully');
      await loadProjects();

      toast({
        title: "Projeto removido",
        description: "Projeto removido com sucesso."
      });

      return true;
    } catch (error) {
      console.error('💥 Error deleting project:', error);
      toast({
        title: "Erro ao remover projeto",
        description: "Não foi possível remover o projeto.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 useProjects useEffect triggered');
    let isMounted = true;
    
    const initializeProjects = async () => {
      console.log('🔄 Initializing projects...');
      if (isMounted) {
        await loadProjects();
      }
    };

    initializeProjects();

    return () => {
      console.log('🧹 useProjects cleanup');
      isMounted = false;
    };
  }, []);

  // ✅ ADICIONE LOG FINAL
  console.log('🏠 useProjects hook returning:', { 
    projectsCount: projects.length, 
    loading,
    projects: projects.slice(0, 2) // Primeiros 2 para debug
  });

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    reloadProjects: loadProjects
  };
};
