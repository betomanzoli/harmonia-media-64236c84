
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  packageType: string;
  deadline?: string;
  status: 'waiting' | 'in_progress' | 'revision_required' | 'approved' | 'completed';
  createdAt: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos.",
          variant: "destructive"
        });
        return;
      }

      const formattedProjects: Project[] = data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        clientId: project.client_id,
        packageType: project.package_id || 'não definido',
        deadline: project.deadline ? new Date(project.deadline).toISOString() : undefined,
        status: project.status || 'waiting',
        createdAt: new Date(project.created_at).toLocaleDateString('pt-BR')
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar projetos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description?: string;
    clientId: string;
    packageType: string;
    deadline?: string;
    status: 'waiting' | 'in_progress' | 'revision_required' | 'approved' | 'completed';
  }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          client_id: projectData.clientId,
          status: projectData.status,
          deadline: projectData.deadline ? new Date(projectData.deadline).toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o projeto.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });

      await loadProjects();
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar projeto.",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    isLoading,
    createProject,
    loadProjects
  };
};
