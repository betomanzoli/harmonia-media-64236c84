
// Import types from the central types file
import { ProjectItem, VersionItem, FeedbackItem, HistoryItem, HistoryEntry } from '@/types/project.types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
        
        // Use simple query structure to avoid parsing errors with complex queries
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectError) {
          logger.error('ADMIN', 'Error fetching project details', projectError);
          setProject(null);
          setIsLoading(false);
          return;
        }

        // Get client data in separate query
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', projectData.client_id)
          .single();

        if (clientError) {
          logger.error('ADMIN', 'Error fetching client data', clientError);
        }

        // Get package data in separate query
        const { data: packageData, error: packageError } = await supabase
          .from('packages')
          .select('*')
          .eq('id', projectData.package_id)
          .single();

        if (packageError) {
          logger.error('ADMIN', 'Error fetching package data', packageError);
        }

        // Get project files in separate query
        const { data: projectFilesData, error: projectFilesError } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', projectId);

        if (projectFilesError) {
          logger.error('ADMIN', 'Error fetching project files', projectFilesError);
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
        const transformedProject: ProjectItem = {
          id: projectData.id,
          client_name: clientData?.name || 'Cliente',
          client_email: clientData?.email,
          client_phone: clientData?.phone,
          project_title: projectData.title || 'Música Personalizada',
          package_type: packageData?.name || 'standard',
          status: projectData.status || 'waiting',
          created_at: projectData.created_at,
          last_activity_date: projectData.updated_at || projectData.created_at,
          expiration_date: projectData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          versions: projectFilesData?.length || 0,
          versionsList: projectFilesData?.map(file => ({
            id: file.id,
            title: file.title || '',
            name: file.title || '',
            description: '',
            audio_url: file.drive_url || '',
            created_at: file.created_at
          })) || [],
          // Process feedback items
          feedback_history: historyData?.filter(h => h.action === 'feedback').map(h => {
            // Safely handle details, which could be string, object, or null
            let details: any = {};
            
            if (typeof h.details === 'object' && h.details) {
              details = h.details;
            } else if (typeof h.details === 'string') {
              try {
                details = JSON.parse(h.details);
              } catch (e) {
                details = { message: h.details };
              }
            }
            
            const feedbackItem: FeedbackItem = {
              id: h.id,
              project_id: h.project_id,
              comment: typeof details.message === 'string' ? details.message : '',
              content: typeof details.message === 'string' ? details.message : '',
              created_at: h.created_at,
              status: typeof details.status === 'string' ? details.status : 'pending',
              version_id: typeof details.version_id === 'string' ? details.version_id : ''
            };
            
            return feedbackItem;
          }) || [],
          // Process history items
          history: historyData?.map(h => {
            // Safely convert details to string for description
            let description = '';
            if (typeof h.details === 'object' && h.details) {
              try {
                description = JSON.stringify(h.details);
              } catch (e) {
                description = String(h.details || '');
              }
            } else if (h.details) {
              description = String(h.details);
            }
            
            // Get user_id if available in details
            let user_id = '';
            if (typeof h.details === 'object' && h.details && h.details.user_id) {
              user_id = String(h.details.user_id);
            }
            
            return {
              id: h.id,
              project_id: h.project_id,
              action: h.action,
              description,
              created_at: h.created_at,
              user_id
            };
          }) || [],
          preview_code: projectData.preview_code,
          
          // Add camelCase aliases
          clientName: clientData?.name || 'Cliente',
          projectTitle: projectData.title || 'Música Personalizada',
          packageType: packageData?.name || 'standard',
          createdAt: projectData.created_at,
          lastActivityDate: projectData.updated_at || projectData.created_at,
          expirationDate: projectData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          clientEmail: clientData?.email,
          clientPhone: clientData?.phone,
          feedbackHistory: historyData?.filter(h => h.action === 'feedback').map(h => {
            let details: any = {};
            
            if (typeof h.details === 'object' && h.details) {
              details = h.details;
            } else if (typeof h.details === 'string') {
              try {
                details = JSON.parse(h.details);
              } catch (e) {
                details = { message: h.details };
              }
            }
            
            const feedbackItem: FeedbackItem = {
              id: h.id,
              project_id: h.project_id,
              comment: typeof details.message === 'string' ? details.message : '',
              content: typeof details.message === 'string' ? details.message : '',
              created_at: h.created_at,
              status: typeof details.status === 'string' ? details.status : 'pending',
              version_id: typeof details.version_id === 'string' ? details.version_id : ''
            };
            
            return feedbackItem;
          }) || [],
        };
        
        setProject(transformedProject);
        logger.info('ADMIN', 'Project loaded successfully', { 
          id: projectId, 
          name: transformedProject.client_name
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
          title: version.title,
          drive_url: version.audio_url || version.audioUrl,
          file_type: 'audio',
        })
        .select()
        .single();
      
      if (error) {
        logger.error('ADMIN', 'Error adding version', error);
        return null;
      }
      
      // Add history entry with properly formatted details
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'new_version',
          details: JSON.stringify({
            file_id: data.id,
            title: version.title,
            description: version.description
          })
        });
        
      logger.info('ADMIN', 'Version added successfully', { id: data.id });
      
      // Update the local project data
      if (project) {
        const newVersion: VersionItem = {
          id: data.id,
          title: version.title,
          name: version.title,
          description: version.description || '',
          audio_url: version.audio_url || version.audioUrl,
          created_at: data.created_at
        };
        
        // Update using the correct property name (versionsList, not versions_list)
        setProject({
          ...project,
          versions: (project.versions || 0) + 1,
          versionsList: [...(project.versionsList || []), newVersion]
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
          details: JSON.stringify({
            version_id: versionId
          })
        });
        
      logger.info('ADMIN', 'Version deleted successfully', { versionId });
      
      // Update the local project data
      if (project) {
        setProject({
          ...project,
          versions: Math.max(0, (project.versions || 0) - 1),
          versionsList: (project.versionsList || []).filter(v => v.id !== versionId)
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
      
      // Add history entry - convert updates to a simple object for storage
      const historyDetails: Record<string, string> = {};
      Object.entries(updates).forEach(([key, value]) => {
        // Only include primitive values in history details
        if (typeof value !== 'object') {
          historyDetails[key] = String(value);
        }
      });
      
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'update',
          details: JSON.stringify(historyDetails)
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
          details: JSON.stringify({
            previous_deadline: project?.expiration_date,
            new_deadline: newExpirationDate
          })
        });
        
      logger.info('ADMIN', 'Deadline extended successfully', { 
        projectId, 
        newDeadline: newExpirationDate 
      });
      
      // Update the local project data
      if (project) {
        setProject({
          ...project,
          expiration_date: newExpirationDate,
          expirationDate: newExpirationDate
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
      
      // Simplified query structure to avoid parser errors
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (projectsError) {
        logger.error('ADMIN', 'Error loading projects', projectsError);
        setError(`Erro ao carregar projetos: ${projectsError.message}`);
        setProjects([]);
        setIsLoading(false);
        return;
      }
      
      if (!projectsData || projectsData.length === 0) {
        logger.info('ADMIN', 'No projects found');
        setProjects([]);
        setIsLoading(false);
        return;
      }
      
      // Load client data
      const clientIds = projectsData
        .filter(project => project.client_id)
        .map(project => project.client_id);
        
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .in('id', clientIds);
        
      if (clientsError) {
        logger.error('ADMIN', 'Error loading clients', clientsError);
      }
      
      // Load package data
      const packageIds = projectsData
        .filter(project => project.package_id)
        .map(project => project.package_id);
        
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .in('id', packageIds);
        
      if (packagesError) {
        logger.error('ADMIN', 'Error loading packages', packagesError);
      }
      
      // Transform data to match the expected format
      const transformedProjects: ProjectItem[] = projectsData.map(project => {
        const client = clientsData?.find(c => c.id === project.client_id);
        const packageInfo = packagesData?.find(p => p.id === project.package_id);
        
        return {
          id: project.id,
          client_name: client?.name || 'Cliente',
          client_email: client?.email,
          client_phone: client?.phone,
          project_title: project.title || 'Música Personalizada',
          package_type: packageInfo?.name || 'standard',
          status: project.status || 'waiting',
          created_at: project.created_at,
          last_activity_date: project.updated_at || project.created_at,
          expiration_date: project.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          versions: 0, // Will load in separate query if needed
          versionsList: [],
          feedback_history: [],
          history: [],
          preview_code: project.preview_code,
          // Add camelCase aliases for front-end
          clientName: client?.name || 'Cliente',
          projectTitle: project.title || 'Música Personalizada',
          packageType: packageInfo?.name || 'standard',
          createdAt: project.created_at,
          lastActivityDate: project.updated_at || project.created_at,
          expirationDate: project.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
      
      setProjects(transformedProjects);
      logger.info('ADMIN', `Loaded ${transformedProjects.length} projects`);
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
