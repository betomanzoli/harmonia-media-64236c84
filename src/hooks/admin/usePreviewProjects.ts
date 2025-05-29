
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  previewUrl: string;
  expirationDate: string;
  lastActivityDate: string;
  description?: string;
  feedback?: string;
  versionsList?: VersionItem[];
}

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended: boolean;
  dateAdded: string;
  final?: boolean;
  fileId?: string;
  additionalLinks?: { label: string; url: string }[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: ProjectItem[] = (data || []).map(project => ({
        id: project.id,
        clientName: project.client_name || 'Cliente sem nome',
        clientEmail: project.client_email || '',
        packageType: project.package_type || 'essencial',
        createdAt: new Date(project.created_at).toLocaleDateString('pt-BR'),
        status: project.status as 'waiting' | 'feedback' | 'approved',
        versions: Array.isArray(project.versions) ? project.versions.length : 0,
        previewUrl: `/client-preview/${project.preview_code}`,
        expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : '',
        lastActivityDate: new Date(project.updated_at || project.created_at).toLocaleDateString('pt-BR'),
        description: project.description,
        feedback: project.feedback,
        versionsList: Array.isArray(project.versions) ? project.versions : []
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async (projectData: Partial<ProjectItem>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.description || 'Novo Projeto',
          client_name: projectData.clientName,
          client_email: projectData.clientEmail,
          package_type: projectData.packageType,
          description: projectData.description,
          status: 'waiting',
          preview_code: Math.random().toString(36).substring(2, 14),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Projeto criado",
        description: "Projeto criado com sucesso."
      });

      return data.id;
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

  const updateProject = async (projectId: string, updates: Partial<ProjectItem>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.clientName) dbUpdates.client_name = updates.clientName;
      if (updates.clientEmail) dbUpdates.client_email = updates.clientEmail;
      if (updates.packageType) dbUpdates.package_type = updates.packageType;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.feedback) dbUpdates.feedback = updates.feedback;

      const { error } = await supabase
        .from('projects')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Projeto atualizado",
        description: "Projeto atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Não foi possível atualizar o projeto.",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Projeto removido",
        description: "Projeto removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao remover projeto",
        description: "Não foi possível remover o projeto.",
        variant: "destructive"
      });
    }
  };

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    reloadProjects: loadProjects
  };
};
