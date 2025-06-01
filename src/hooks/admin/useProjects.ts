import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generatePreviewLink } from '@/utils/previewLinkUtils';

// Interface atualizada para incluir embed_url e original_bandcamp_url
export interface ProjectVersion {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  embed_url: string; // <-- Campo para URL de embed gerada
  original_bandcamp_url?: string; // <-- Campo opcional para URL original
  recommended: boolean;
  final?: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  status: 'waiting' | 'feedback' | 'approved';
  package_type?: string;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  preview_code?: string;
  feedback?: string;
  versions: ProjectVersion[]; // <-- Usa a interface atualizada
}

// Função auxiliar para registrar histórico (será usada depois)
// const logProjectHistory = async (projectId: string, actionType: string, details: any) => {
//   try {
//     await supabase.from('project_history').insert({ project_id: projectId, action_type: actionType, details: details });
//   } catch (error) {
//     console.error(`Error logging history (${actionType}):`, error);
//   }
// };

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Carrega projetos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Carrega versões para cada projeto
      const projectsWithVersions = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: versions, error: versionsError } = await supabase
            .from('project_versions')
            .select('*') // Seleciona todas as colunas, incluindo embed_url
            .eq('project_id', project.id)
            .order('created_at', { ascending: false });

          if (versionsError) {
            console.error('Error loading versions for project:', project.id, versionsError);
          }

          return {
            ...project,
            status: project.status as 'waiting' | 'feedback' | 'approved',
            versions: (versions || []) as ProjectVersion[] // Cast para a interface correta
          };
        })
      );

      setProjects(projectsWithVersions);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(`Erro ao carregar projetos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();

    // Configura listener para mudanças na tabela de projetos
    const projectListener = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        console.log('Project change received!', payload);
        loadProjects(); // Recarrega tudo ao detectar mudança em projetos
      })
      .subscribe();

    // Configura listener para mudanças na tabela de versões
    const versionListener = supabase
      .channel('public:project_versions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_versions' }, payload => {
        console.log('Version change received!', payload);
        loadProjects(); // Recarrega tudo ao detectar mudança em versões
      })
      .subscribe();

    // Limpa listeners ao desmontar
    return () => {
      supabase.removeChannel(projectListener);
      supabase.removeChannel(versionListener);
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
          // created_at é gerenciado pelo Supabase (default now())
          // updated_at será null inicialmente
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Exemplo: expira em 30 dias
        }])
        .select()
        .single();

      if (error) throw error;

      // Gera preview code após criar o projeto
      if (newProject) {
        const previewCode = await generatePreviewLink(newProject.id);
        if (previewCode) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ preview_code: previewCode })
            .eq('id', newProject.id);
          if (updateError) {
            console.warn('Failed to update project with preview code:', updateError);
          }
          // await logProjectHistory(newProject.id, 'project_created', { title: newProject.title }); // Adicionar log de histórico
        }
      }

      // loadProjects() será chamado pelo listener, não precisa chamar aqui
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
          updated_at: new Date().toISOString() // Atualiza timestamp
        })
        .eq('id', projectId);

      if (error) throw error;

      // await logProjectHistory(projectId, 'project_updated', { fields: Object.keys(updates) }); // Adicionar log de histórico
      // loadProjects() será chamado pelo listener
      return { success: true };
    } catch (error: any) {
      console.error('Error updating project:', error);
      return { success: false, error: `Erro ao atualizar projeto: ${error.message}` };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      // 1. Deleta versões associadas (importante por causa da FK)
      const { error: versionsError } = await supabase
        .from('project_versions')
        .delete()
        .eq('project_id', projectId);

      if (versionsError) throw versionsError;

      // 2. Deleta o histórico associado (se existir)
      // const { error: historyError } = await supabase
      //   .from('project_history')
      //   .delete()
      //   .eq('project_id', projectId);
      // if (historyError) console.warn('Could not delete project history:', historyError); // Não bloquear se falhar

      // 3. Deleta o projeto
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      // await logProjectHistory(projectId, 'project_deleted', {}); // Adicionar log de histórico (pode ser difícil se o projeto já foi deletado)
      // loadProjects() será chamado pelo listener
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting project:', error);
      return { success: false, error: `Erro ao deletar projeto: ${error.message}` };
    }
  };

  // Função atualizada para aceitar embed_url e original_bandcamp_url
  const addVersionToProject = async (projectId: string, versionData: {
    name: string;
    description?: string;
    embed_url: string; // <-- Recebe embed_url
    original_bandcamp_url?: string; // <-- Recebe URL original
    recommended?: boolean;
  }) => {
    try {
      const { data: newVersion, error } = await supabase
        .from('project_versions')
        .insert([{
          project_id: projectId,
          // version_id não é mais necessário se 'id' for uuid gerado pelo Supabase
          ...versionData,
          recommended: versionData.recommended || false,
          // created_at é gerenciado pelo Supabase
        }])
        .select()
        .single();

      if (error) throw error;

      // await logProjectHistory(projectId, 'version_added', { versionName: newVersion.name }); // Adicionar log de histórico
      // loadProjects() será chamado pelo listener
      return { success: true, version: newVersion as ProjectVersion };
    } catch (error: any) {
      console.error('Error adding version:', error);
      return { success: false, error: `Erro ao adicionar versão: ${error.message}` };
    }
  };

  const deleteVersion = async (versionId: string, projectId: string) => { // Adicionado projectId para log
    try {
      // Opcional: buscar nome da versão antes de deletar para log
      // const { data: versionData } = await supabase.from('project_versions').select('name').eq('id', versionId).single();

      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', versionId);

      if (error) throw error;

      // await logProjectHistory(projectId, 'version_deleted', { versionId: versionId, versionName: versionData?.name || 'N/A' }); // Adicionar log de histórico
      // loadProjects() será chamado pelo listener
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
    loadProjects, // Expor para recarga manual se necessário
    createProject,
    updateProject,
    deleteProject,
    addVersionToProject,
    deleteVersion
  };
};

