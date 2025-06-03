// src/hooks/admin/useProjects.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generatePreviewLink } from '@/utils/previewLinkUtils';
import { logProjectHistory } from '@/utils/historyLogger';
import { useAuth } from '@/contexts/AuthContext';

// Interface atualizada para incluir bandcamp_private_url
export interface ProjectVersion {
  id: string;
  project_id: string;
  name: string;
  description?: string | null;
  embed_url?: string | null; // URL de embed gerada
  audio_url?: string | null; // Campo legado ou URL original pública
  original_bandcamp_url?: string | null; // Input original do embed/url público
  bandcamp_private_url?: string | null; // <-- NOVO CAMPO
  recommended: boolean;
  final?: boolean | null;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  status: 'waiting' | 'feedback' | 'approved';
  package_type?: string | null;
  created_at: string;
  updated_at?: string | null;
  expires_at?: string | null;
  preview_code?: string | null;
  feedback?: string | null;
  approved_version_id?: string | null;
  versions: ProjectVersion[];
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*, versions:project_versions(*)') // Seleciona tudo e aninha versões
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Ajusta o formato dos dados se necessário (Supabase v2+ pode retornar aninhado)
      const formattedProjects = (projectsData || []).map(p => ({
        ...p,
        status: p.status as 'waiting' | 'feedback' | 'approved',
        versions: (p.versions || []) as ProjectVersion[]
      }));

      console.log("[useProjects] Projetos carregados:", formattedProjects);
      setProjects(formattedProjects);

    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(`Erro ao carregar projetos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();

    const changesChannel = supabase
      .channel('public-db-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'projects' }, 
          (payload) => {
            console.log('Project change received!', payload);
            loadProjects();
          }
      )
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'project_versions' }, 
          (payload) => {
            console.log('Version change received!', payload);
            loadProjects(); // Recarrega tudo para manter a consistência
          }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changesChannel);
    };

  }, [loadProjects]);

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
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (newProject) {
        const previewCode = await generatePreviewLink(newProject.id);
        if (previewCode) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ preview_code: previewCode })
            .eq('id', newProject.id);
          if (updateError) console.warn('Failed to update project with preview code:', updateError);
          
          await logProjectHistory(newProject.id, 'project_created', {
            title: newProject.title,
            client: projectData.client_name
          }, user?.id);
        }
      }
      // Listener cuidará da atualização da lista
      return { success: true, project: newProject };
    } catch (error: any) {
      console.error('Error creating project:', error);
      return { success: false, error: `Erro ao criar projeto: ${error.message}` };
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Omit<Project, 'versions' | 'id'>>) => {
     try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      await logProjectHistory(projectId, 'project_updated', {
        fields: Object.keys(updates)
      }, user?.id);
      // Listener cuidará da atualização
      return { success: true };
    } catch (error: any) {
      console.error('Error updating project:', error);
      return { success: false, error: `Erro ao atualizar projeto: ${error.message}` };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { data: projectData } = await supabase.from('projects').select('title').eq('id', projectId).single();

      // Deleta versões, histórico e depois o projeto
      await supabase.from('project_versions').delete().eq('project_id', projectId);
      await supabase.from('project_history').delete().eq('project_id', projectId);
      const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId);

      if (projectError) throw projectError;

      await logProjectHistory(projectId, 'project_deleted', {
        title: projectData?.title || 'N/A'
      }, user?.id);
      // Listener cuidará da atualização
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting project:', error);
      return { success: false, error: `Erro ao deletar projeto: ${error.message}` };
    }
  };

  // Função atualizada para aceitar bandcamp_private_url
  const addVersionToProject = async (projectId: string, versionData: {
    name: string;
    description?: string | null;
    embed_url?: string | null;
    original_bandcamp_url?: string | null;
    bandcamp_private_url?: string | null; // <-- NOVO CAMPO
    recommended?: boolean;
  }) => {
    try {
      // Garante que apenas um dos URLs (embed ou private) seja salvo
      const dataToInsert = {
        project_id: projectId,
        name: versionData.name,
        description: versionData.description,
        embed_url: versionData.bandcamp_private_url ? null : versionData.embed_url,
        original_bandcamp_url: versionData.bandcamp_private_url ? null : versionData.original_bandcamp_url,
        bandcamp_private_url: versionData.bandcamp_private_url,
        recommended: versionData.recommended || false,
      };

      const { data: newVersion, error } = await supabase
        .from('project_versions')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;

      await logProjectHistory(projectId, 'version_added', {
        versionName: newVersion.name,
        type: versionData.bandcamp_private_url ? 'private_link' : 'embed/public_url',
        recommended: versionData.recommended
      }, user?.id);
      // Listener cuidará da atualização
      return { success: true, version: newVersion as ProjectVersion };
    } catch (error: any) {
      console.error('Error adding version:', error);
      return { success: false, error: `Erro ao adicionar versão: ${error.message}` };
    }
  };

  const deleteVersion = async (versionId: string, projectId: string) => {
    try {
      const { data: versionData } = await supabase.from('project_versions').select('name').eq('id', versionId).single();
      const { error } = await supabase.from('project_versions').delete().eq('id', versionId);

      if (error) throw error;

      await logProjectHistory(projectId, 'version_deleted', {
        versionName: versionData?.name || 'N/A',
        versionId: versionId
      }, user?.id);
      // Listener cuidará da atualização
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting version:', error);
      return { success: false, error: `Erro ao deletar versão: ${error.message}` };
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

