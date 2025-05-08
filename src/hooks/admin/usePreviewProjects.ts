
// Import types from the central types file
import { ProjectItem, VersionItem, FeedbackItem } from '@/types/project.types';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Re-export interfaces so they can be imported from this module
export type { ProjectItem, VersionItem, FeedbackItem };

export const usePreviewProject = (projectId: string | undefined) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        logger.debug('ADMIN', `Fetching project details for ID: ${projectId}`);
        
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id, title as project_title, status, created_at, updated_at as last_activity_date, preview_code, 
            deadline as expiration_date,
            clients(id, name as client_name, email as client_email, phone as client_phone),
            project_files(id, project_id, file_name as title, file_url as audio_url, file_type, created_at),
            packages(id, name as package_type, price, description, inclusions)
          `)
          .eq('id', projectId)
          .single();
        
        if (error) {
          logger.error('ADMIN', 'Error fetching project details', error);
          setProject(null);
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          logger.warn('ADMIN', `Project not found: ${projectId}`);
          setProject(null);
          setIsLoading(false);
          return;
        }
        
        // Get project history
        const { data: historyData, error: historyError } = await supabase
          .from('project_history')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (historyError) {
          logger.error('ADMIN', 'Error fetching project history', historyError);
        }
        
        // Transform data to match the expected format
        const projectData: ProjectItem = {
          id: data.id,
          client_name: data.clients?.client_name || 'Cliente',
          client_email: data.clients?.client_email,
          client_phone: data.clients?.client_phone,
          project_title: data.project_title || 'Música Personalizada',
          package_type: data.packages?.package_type || 'standard',
          status: data.status || 'waiting',
          created_at: data.created_at,
          last_activity_date: data.last_activity_date || data.created_at,
          expiration_date: data.expiration_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          versions: data.project_files?.length || 0,
          versions_list: data.project_files?.map(file => ({
            id: file.id,
            title: file.title,
            name: file.title,
            description: '',
            audio_url: file.audio_url,
            created_at: file.created_at
          })) || [],
          feedback_history: historyData?.filter(h => h.action === 'feedback').map(h => ({
            id: h.id,
            content: h.details?.message || '',
            created_at: h.created_at,
            status: h.details?.status || 'pending',
          })) || [],
          history: historyData || [],
          preview_code: data.preview_code
        };
        
        setProject(projectData);
        logger.info('ADMIN', 'Project loaded successfully', { 
          id: projectId, 
          name: projectData.client_name
        });
      } catch (error) {
        logger.error('ADMIN', 'Unexpected error loading project', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  const addVersion = async (projectId: string, version: VersionItem) => {
    try {
      logger.info('ADMIN', 'Adding new version', { projectId, version });
      
      const { data, error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: version.title,
          file_url: version.audio_url,
          file_type: 'audio',
        })
        .select()
        .single();
      
      if (error) {
        logger.error('ADMIN', 'Error adding version', error);
        return null;
      }
      
      // Add history entry
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'new_version',
          details: {
            file_id: data.id,
            title: version.title,
            description: version.description
          }
        });
        
      logger.info('ADMIN', 'Version added successfully', { id: data.id });
      
      // Update the local project data
      if (project) {
        const newVersion: VersionItem = {
          id: data.id,
          title: version.title,
          name: version.title,
          description: version.description,
          audio_url: version.audio_url,
          created_at: data.created_at
        };
        
        setProject({
          ...project,
          versions: (project.versions || 0) + 1,
          versions_list: [...(project.versions_list || []), newVersion]
        });
      }
      
      return data;
    } catch (error) {
      logger.error('ADMIN', 'Unexpected error adding version', error);
      return null;
    }
  };
  
  const deleteVersion = async (projectId: string, versionId: string) => {
    try {
      logger.info('ADMIN', 'Deleting version', { projectId, versionId });
      
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', versionId)
        .eq('project_id', projectId);
      
      if (error) {
        logger.error('ADMIN', 'Error deleting version', error);
        return false;
      }
      
      // Add history entry
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'delete_version',
          details: {
            version_id: versionId
          }
        });
        
      logger.info('ADMIN', 'Version deleted successfully', { versionId });
      
      // Update the local project data
      if (project) {
        setProject({
          ...project,
          versions: Math.max(0, (project.versions || 0) - 1),
          versions_list: (project.versions_list || []).filter(v => v.id !== versionId)
        });
      }
      
      return true;
    } catch (error) {
      logger.error('ADMIN', 'Unexpected error deleting version', error);
      return false;
    }
  };
  
  const updateProject = async (projectId: string, updates: Partial<ProjectItem>) => {
    try {
      logger.info('ADMIN', 'Updating project', { projectId, updates });
      
      // Convert from camelCase to snake_case for the Supabase update
      const dbUpdates: Record<string, any> = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.preview_code) dbUpdates.preview_code = updates.preview_code;
      if (updates.expiration_date) dbUpdates.deadline = updates.expiration_date;
      
      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', projectId);
      
      if (error) {
        logger.error('ADMIN', 'Error updating project', error);
        return false;
      }
      
      // Add history entry
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'update',
          details: updates
        });
        
      logger.info('ADMIN', 'Project updated successfully', { projectId });
      
      // Update the local project data
      if (project) {
        setProject({
          ...project,
          ...updates
        });
      }
      
      return true;
    } catch (error) {
      logger.error('ADMIN', 'Unexpected error updating project', error);
      return false;
    }
  };
  
  const extendDeadline = async (projectId: string) => {
    try {
      // Calculate new expiration date (current + 7 days)
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      const newExpirationDate = currentDate.toISOString();
      
      logger.info('ADMIN', 'Extending project deadline', { 
        projectId, 
        newDeadline: newExpirationDate 
      });
      
      const { error } = await supabase
        .from('projects')
        .update({ deadline: newExpirationDate })
        .eq('id', projectId);
      
      if (error) {
        logger.error('ADMIN', 'Error extending deadline', error);
        return false;
      }
      
      // Add history entry
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'extend_deadline',
          details: {
            previous_deadline: project?.expiration_date,
            new_deadline: newExpirationDate
          }
        });
        
      logger.info('ADMIN', 'Deadline extended successfully', { 
        projectId, 
        newDeadline: newExpirationDate 
      });
      
      // Update the local project data
      if (project) {
        setProject({
          ...project,
          expiration_date: newExpirationDate
        });
      }
      
      return true;
    } catch (error) {
      logger.error('ADMIN', 'Unexpected error extending deadline', error);
      return false;
    }
  };
  
  return {
    project,
    isLoading,
    addVersion,
    deleteVersion,
    updateProject,
    extendDeadline
  };
};

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('ADMIN', 'Loading all projects');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, title as project_title, status, created_at, updated_at as last_activity_date, 
          preview_code, deadline as expiration_date,
          clients(id, name as client_name, email as client_email, phone as client_phone),
          packages(id, name as package_type, price, description)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) {
        logger.error('ADMIN', 'Error loading projects', error);
        setError(`Erro ao carregar projetos: ${error.message}`);
        setProjects([]);
        setIsLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        logger.info('ADMIN', 'No projects found');
        setProjects([]);
        setIsLoading(false);
        return;
      }
      
      // Transform data to match the expected format
      const projectsData: ProjectItem[] = data.map(item => ({
        id: item.id,
        client_name: item.clients?.client_name || 'Cliente',
        client_email: item.clients?.client_email,
        client_phone: item.clients?.client_phone,
        project_title: item.project_title || 'Música Personalizada',
        package_type: item.packages?.package_type || 'standard',
        status: item.status || 'waiting',
        created_at: item.created_at,
        last_activity_date: item.last_activity_date || item.created_at,
        expiration_date: item.expiration_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        versions: 0, // Will load in separate query if needed
        versions_list: [],
        feedback_history: [],
        history: [],
        preview_code: item.preview_code
      }));
      
      setProjects(projectsData);
      logger.info('ADMIN', `Loaded ${projectsData.length} projects`);
    } catch (err) {
      logger.error('ADMIN', 'Unexpected error loading projects', err);
      setError('Erro inesperado ao carregar projetos.');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id) || null;
  };
  
  const updateProject = async (id: string, updates: Partial<ProjectItem>) => {
    try {
      logger.info('ADMIN', 'Updating project', { id, updates });
      
      // First update in Supabase
      const dbUpdates: Record<string, any> = {};
      
      // Convert from camelCase to snake_case for the DB update
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.project_title) dbUpdates.title = updates.project_title;
      if (updates.preview_code) dbUpdates.preview_code = updates.preview_code;
      if (updates.expiration_date) dbUpdates.deadline = updates.expiration_date;
      
      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) {
        logger.error('ADMIN', 'Error updating project in database', error);
        return false;
      }
      
      // Then update the local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id 
            ? { ...project, ...updates, last_activity_date: new Date().toISOString() } 
            : project
        )
      );
      
      logger.info('ADMIN', 'Project updated successfully', { id });
      return true;
    } catch (error) {
      logger.error('ADMIN', 'Unexpected error updating project', error);
      return false;
    }
  };
  
  return {
    projects,
    isLoading,
    error,
    reload: loadProjects,
    getProjectById,
    updateProject
  };
};
