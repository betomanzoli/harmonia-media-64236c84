
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VersionItem {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  recommended: boolean;
  dateAdded: string;
  final?: boolean;
  additionalLinks?: Array<{
    label: string;
    url: string;
  }>;
}

export interface PreviewProject {
  id: string;
  title?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  packageType?: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  versionsList?: VersionItem[];
  createdAt: string;
  lastActivityDate: string;
  expirationDate?: string;
  previewUrl: string;
  feedback?: string;
  history?: Array<{
    action: string;
    timestamp: string;
    data?: {
      message?: string;
      status?: string;
    };
  }>;
  preview_code?: string;
}

// Export ProjectItem as alias for PreviewProject for backward compatibility
export type ProjectItem = PreviewProject;

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<PreviewProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar projetos do Supabase
  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading projects from Supabase...');
      
      const { data: supabaseProjects, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_versions (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProjects: PreviewProject[] = (supabaseProjects || []).map(project => ({
        id: project.id,
        title: project.title,
        clientName: project.client_name || 'Cliente',
        clientEmail: project.client_email,
        clientPhone: project.client_phone,
        packageType: project.package_type || 'Padrão',
        status: project.status as 'waiting' | 'feedback' | 'approved',
        versions: project.project_versions?.length || 0,
        versionsList: project.project_versions?.map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description || '',
          audioUrl: v.audio_url || '',
          fileId: v.file_id,
          recommended: v.recommended || false,
          dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
          final: v.name?.includes('FINAL') || false
        })) || [],
        createdAt: new Date(project.created_at).toLocaleDateString('pt-BR'),
        lastActivityDate: new Date(project.updated_at).toLocaleDateString('pt-BR'),
        expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : undefined,
        previewUrl: `/client-preview/${project.preview_code || project.id}`,
        feedback: project.feedback,
        preview_code: project.preview_code
      }));

      setProjects(formattedProjects);
      console.log(`Loaded ${formattedProjects.length} projects from Supabase`);
      
      return formattedProjects;
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar os projetos do banco de dados.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Adicionar novo projeto
  const addProject = useCallback(async (projectData: Partial<PreviewProject>) => {
    try {
      console.log('Adding new project:', projectData);
      
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title || `Projeto ${projectData.clientName}`,
          client_name: projectData.clientName,
          client_email: projectData.clientEmail,
          client_phone: projectData.clientPhone,
          package_type: projectData.packageType || 'essencial',
          status: 'waiting',
          description: projectData.title,
          preview_code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }])
        .select()
        .single();

      if (error) throw error;

      // Recarregar projetos
      await loadProjects();
      
      toast({
        title: "Projeto criado",
        description: `Projeto para ${projectData.clientName} foi criado com sucesso.`
      });

      return newProject.id;
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o projeto no banco de dados.",
        variant: "destructive"
      });
      return null;
    }
  }, [loadProjects, toast]);

  // Atualizar projeto
  const updateProject = useCallback(async (projectId: string, updates: Partial<PreviewProject>) => {
    try {
      console.log('Updating project:', projectId, updates);
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          client_name: updates.clientName,
          client_email: updates.clientEmail,
          client_phone: updates.clientPhone,
          package_type: updates.packageType,
          status: updates.status,
          feedback: updates.feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Recarregar projetos
      await loadProjects();
      
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Não foi possível atualizar o projeto.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadProjects, toast]);

  // Adicionar versão ao projeto
  const addVersionToProject = useCallback(async (projectId: string, versionData: VersionItem) => {
    try {
      console.log('Adding version to project:', projectId, versionData);
      
      const { error } = await supabase
        .from('project_versions')
        .insert([{
          project_id: projectId,
          name: versionData.name,
          description: versionData.description,
          audio_url: versionData.audioUrl,
          file_id: versionData.fileId,
          recommended: versionData.recommended,
          version_id: `v${Date.now()}`
        }]);

      if (error) throw error;

      // Recarregar projetos
      await loadProjects();
      
      return true;
    } catch (error) {
      console.error('Error adding version:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Não foi possível adicionar a versão.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadProjects, toast]);

  // Deletar versão do projeto
  const deleteVersionFromProject = useCallback(async (projectId: string, versionId: string) => {
    try {
      console.log('Deleting version:', versionId);
      
      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', versionId);

      if (error) throw error;

      // Recarregar projetos
      await loadProjects();
      
      return true;
    } catch (error) {
      console.error('Error deleting version:', error);
      toast({
        title: "Erro ao deletar versão",
        description: "Não foi possível deletar a versão.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadProjects, toast]);

  // Deletar projeto
  const deleteProject = useCallback(async (projectId: string) => {
    try {
      console.log('Deleting project:', projectId);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Recarregar projetos
      await loadProjects();
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao deletar projeto",
        description: "Não foi possível deletar o projeto.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadProjects, toast]);

  // Buscar projeto por ID
  const getProjectById = useCallback((projectId: string) => {
    return projects.find(p => p.id === projectId) || null;
  }, [projects]);

  // Carregar projetos na inicialização
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    addVersionToProject,
    deleteVersionFromProject,
    getProjectById
  };
};
