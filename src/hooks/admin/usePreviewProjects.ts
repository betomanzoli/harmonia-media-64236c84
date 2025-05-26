import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  recommended?: boolean;
  final?: boolean;
  dateAdded?: string;
  url?: string;
  audioUrl?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  packageType?: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  previewUrl?: string;
  expirationDate?: string;
  lastActivityDate?: string;
  versionsList?: VersionItem[];
  briefingId?: string;
  history?: any[];
  feedback?: string;
  [key: string]: any;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load projects from Supabase
  const loadProjects = useCallback(async () => {
    console.log("==== LOADING PROJECTS FROM SUPABASE ====");
    setIsLoading(true);
    
    try {
      // First fetch projects
      const { data: supabaseProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error loading projects from Supabase:', projectsError);
        throw projectsError;
      }

      if (!supabaseProjects || supabaseProjects.length === 0) {
        console.log('No projects found in Supabase');
        setProjects([]);
        return [];
      }

      console.log('Raw projects from Supabase:', supabaseProjects.map(p => ({
        id: p.id,
        client_name: p.client_name,
        title: p.title,
        status: p.status
      })));

      // Fetch all project versions and history separately
      const projectIds = supabaseProjects.map(p => p.id);
      
      const { data: allVersions, error: versionsError } = await supabase
        .from('project_versions')
        .select('*')
        .in('project_id', projectIds);

      const { data: allHistory, error: historyError } = await supabase
        .from('project_history')
        .select('*')
        .in('project_id', projectIds);

      if (versionsError) {
        console.error('Error fetching project versions:', versionsError);
      }

      if (historyError) {
        console.error('Error fetching project history:', historyError);
      }

      console.log('Fetched versions:', allVersions || []);
      console.log('Fetched history:', allHistory || []);

      // Transform Supabase data to ProjectItem format
      const transformedProjects: ProjectItem[] = supabaseProjects.map(project => {
        const projectVersions = (allVersions || []).filter(v => v.project_id === project.id);
        const projectHistory = (allHistory || []).filter(h => h.project_id === project.id);

        const versionsList: VersionItem[] = projectVersions.map(version => ({
          id: version.version_id,
          name: version.name,
          description: version.description,
          fileId: version.file_id,
          audioUrl: version.audio_url,
          recommended: version.recommended,
          dateAdded: version.created_at
        }));

        const history = projectHistory.map(h => ({
          action: h.action,
          timestamp: new Date(h.created_at).toLocaleString('pt-BR'),
          data: h.details
        }));

        const transformedProject = {
          id: project.id,
          clientName: project.client_name || 'Cliente',
          clientEmail: project.client_email || '',
          clientPhone: project.client_phone,
          packageType: project.package_type,
          createdAt: new Date(project.created_at).toLocaleDateString('pt-BR'),
          status: project.status as 'waiting' | 'feedback' | 'approved',
          versions: versionsList.length,
          previewUrl: `${window.location.origin}/preview/${project.id}`,
          expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : undefined,
          lastActivityDate: new Date(project.updated_at || project.created_at).toLocaleDateString('pt-BR'),
          versionsList,
          history,
          feedback: project.feedback
        };

        console.log(`Transformed project ${project.id}:`, {
          originalClientName: project.client_name,
          transformedClientName: transformedProject.clientName,
          originalTitle: project.title,
          status: transformedProject.status
        });

        return transformedProject;
      });

      console.log("Final transformed projects:", transformedProjects.length);
      setProjects(transformedProjects);
      return transformedProjects;
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  // Get a specific project by ID
  const getProjectById = useCallback((id: string) => {
    if (!id) return null;
    
    console.log(`Looking for project with ID: ${id} among ${projects.length} projects`);
    
    const project = projects.find(p => p.id === id);
    if (project) {
      console.log("Project found:", {
        id: project.id,
        clientName: project.clientName,
        status: project.status
      });
      return project;
    }
    
    console.log(`No project found with ID: ${id}`);
    return null;
  }, [projects]);
  
  // Add a new project
  const addProject = useCallback(async (project: Omit<ProjectItem, 'id'> & { id?: string }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: project.packageType || 'Projeto musical',
          client_name: project.clientName,
          client_email: project.clientEmail,
          client_phone: project.clientPhone,
          package_type: project.packageType,
          status: project.status || 'waiting',
          expires_at: project.expirationDate ? new Date(project.expirationDate.split('/').reverse().join('-')).toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding project:', error);
        return null;
      }

      // Refresh projects list
      await loadProjects();
      
      return data.id;
    } catch (error) {
      console.error('Error adding project:', error);
      return null;
    }
  }, [loadProjects]);
  
  // Update an existing project
  const updateProject = useCallback(async (id: string, updates: Partial<ProjectItem>) => {
    if (!id) return false;
    
    console.log(`Updating project with ID: ${id}`, updates);
    
    try {
      // Transform updates to Supabase format
      const supabaseUpdates: any = {};
      
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.feedback) supabaseUpdates.feedback = updates.feedback;
      if (updates.clientName) supabaseUpdates.client_name = updates.clientName;
      if (updates.clientEmail) supabaseUpdates.client_email = updates.clientEmail;
      if (updates.clientPhone) supabaseUpdates.client_phone = updates.clientPhone;
      if (updates.packageType) supabaseUpdates.package_type = updates.packageType;
      if (updates.expirationDate) {
        supabaseUpdates.expires_at = new Date(updates.expirationDate.split('/').reverse().join('-')).toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        return false;
      }

      // Handle history entries
      if (updates.history && updates.history.length > 0) {
        for (const historyEntry of updates.history) {
          await supabase
            .from('project_history')
            .insert({
              project_id: id,
              action: historyEntry.action,
              details: historyEntry.data
            });
        }
      }

      // Handle version list updates
      if (updates.versionsList) {
        // This would require more complex logic to sync versions
        // For now, we'll just refresh the projects list
      }

      // Refresh projects list
      await loadProjects();
      
      console.log("Project updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  }, [loadProjects]);
  
  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    if (!id) return false;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }

      // Refresh projects list
      await loadProjects();
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }, [loadProjects]);
  
  return {
    projects,
    isLoading,
    loadProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
  };
};

export default usePreviewProjects;
