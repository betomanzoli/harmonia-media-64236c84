
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generatePreviewLink } from '@/utils/previewLinkUtils';

export interface ProjectVersion {
  id: string;
  name: string;
  description?: string;
  audio_url?: string;
  embed_url?: string;
  bandcamp_private_url?: string;
  original_bandcamp_url?: string;
  recommended: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_id?: string;
  status: 'waiting' | 'feedback' | 'approved';
  package_type?: string;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  preview_code?: string;
  feedback?: string;
  approved_version_id?: string;
  versions: ProjectVersion[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projectsWithVersions = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: versions, error: versionsError } = await supabase
            .from('project_versions')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: false });

          if (versionsError) {
            console.error('Error loading versions for project:', project.id, versionsError);
          }

          return {
            ...project,
            status: project.status as 'waiting' | 'feedback' | 'approved',
            versions: versions || []
          };
        })
      );

      setProjects(projectsWithVersions);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (projectData: {
    title: string;
    client_name: string;
    client_email?: string;
    client_phone?: string;
    package_type?: string;
    status?: 'waiting' | 'feedback' | 'approved';
  }) => {
    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          status: projectData.status || 'waiting',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (newProject) {
        const previewCode = await generatePreviewLink(newProject.id);
        if (previewCode) {
          await supabase
            .from('projects')
            .update({ preview_code: previewCode })
            .eq('id', newProject.id);
        }
      }

      await loadProjects();
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: 'Erro ao criar projeto' };
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      await loadProjects();
      return { success: true };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: 'Erro ao atualizar projeto' };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await supabase
        .from('project_versions')
        .delete()
        .eq('project_id', projectId);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await loadProjects();
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: 'Erro ao deletar projeto' };
    }
  };

  const addVersionToProject = async (projectId: string, versionData: {
    name: string;
    description?: string;
    audio_url: string;
    embed_url?: string;
    bandcamp_private_url?: string;
    original_bandcamp_url?: string;
    recommended?: boolean;
  }) => {
    try {
      const { data: newVersion, error } = await supabase
        .from('project_versions')
        .insert([{
          project_id: projectId,
          name: versionData.name,
          description: versionData.description,
          audio_url: versionData.audio_url,
          embed_url: versionData.embed_url,
          bandcamp_private_url: versionData.bandcamp_private_url,
          original_bandcamp_url: versionData.original_bandcamp_url,
          recommended: versionData.recommended || false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      await loadProjects();
      return { success: true, version: newVersion };
    } catch (error: any) {
      console.error("Error adding version:", error);
      return { success: false, error: error.message || 'Erro ao adicionar versão' };
    }
  };

  const deleteVersion = async (versionId: string) => {
    try {
      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', versionId);

      if (error) throw error;

      await loadProjects();
      return { success: true };
    } catch (error) {
      console.error('Error deleting version:', error);
      return { success: false, error: 'Erro ao deletar versão' };
    }
  };

  return {
    projects,
    isLoading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    addVersionToProject,
    deleteVersion
  };
};
