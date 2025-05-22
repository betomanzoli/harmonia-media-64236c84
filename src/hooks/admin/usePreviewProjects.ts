import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  dateAdded: string;
  recommended?: boolean;
  final?: boolean;
}

export interface ProjectItem {
  id: string;
  clientName: string;
  status: string;
  packageType?: string;
  createdAt?: string;
  versions: number;
  lastActivityDate?: string;
  versionsList?: VersionItem[];
  feedback?: string;
  expirationDate?: string;
  history?: Array<{
    action: string;
    timestamp: string;
    data?: { message?: string; [key: string]: any };
  }>;
  previewUrl?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load projects from Supabase
  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Loading preview projects from Supabase");
      
      // First try to get from Supabase
      const { data, error } = await supabase
        .from('preview_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching preview projects:", error);
        throw error;
      }
      
      console.log("Fetched preview projects:", data);
      
      // Load versions for each project
      const projectsWithVersions = await Promise.all(data.map(async (project) => {
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });
        
        if (versionsError) {
          console.error(`Error fetching versions for project ${project.id}:`, versionsError);
        }
        
        // Get client details from projects table
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            clients (
              id,
              name,
              email,
              phone
            )
          `)
          .eq('id', project.id)
          .maybeSingle();
        
        if (projectError) {
          console.error(`Error fetching project details for ${project.id}:`, projectError);
        }
        
        const versionsList = versions?.map(v => ({
          id: v.version_id || v.id,
          name: v.name,
          description: v.description || '',
          fileId: v.file_id,
          dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
          recommended: v.recommended || false
        })) || [];
        
        // If version list is empty, create a default empty array
        const finalVersionsList = versionsList.length > 0 ? versionsList : [];
        
        return {
          id: project.id,
          clientName: project.client_name,
          status: project.status,
          packageType: project.package_type,
          createdAt: new Date(project.created_at).toLocaleDateString('pt-BR'),
          versions: finalVersionsList.length,
          lastActivityDate: project.last_activity_date 
            ? new Date(project.last_activity_date).toLocaleDateString('pt-BR')
            : new Date().toLocaleDateString('pt-BR'),
          versionsList: finalVersionsList,
          feedback: project.feedback || '',
          expirationDate: project.expiration_date 
            ? new Date(project.expiration_date).toLocaleDateString('pt-BR')
            : undefined,
          clientEmail: projectData?.clients?.email || '',
          clientPhone: projectData?.clients?.phone || '',
          previewUrl: `${window.location.origin}/preview/${project.id}`
        };
      }));
      
      setProjects(projectsWithVersions);
      
      // Also store in localStorage for fallback
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projectsWithVersions));
      
      return projectsWithVersions;
    } catch (error) {
      console.error("Error in loadProjects:", error);
      
      // Try to get from localStorage as fallback
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        setProjects(parsed);
        return parsed;
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Get project by ID
  const getProjectById = useCallback((id: string): ProjectItem | null => {
    const project = projects.find(p => p.id === id);
    if (project) return project;
    
    console.log(`Project ${id} not found in memory, looking in localStorage...`);
    
    // Try localStorage as fallback
    const storedProjects = localStorage.getItem('harmonIA_preview_projects');
    if (storedProjects) {
      const parsed = JSON.parse(storedProjects);
      const storedProject = parsed.find((p: ProjectItem) => p.id === id);
      return storedProject || null;
    }
    
    return null;
  }, [projects]);

  // Add a new project
  const addProject = useCallback((project: ProjectItem) => {
    console.log("Adding project:", project);
    
    // Add to local state
    setProjects(prev => [...prev, project]);
    
    // Update localStorage
    const updatedProjects = [...projects, project];
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
    
    // Also add to Supabase
    supabase
      .from('preview_projects')
      .insert({
        id: project.id,
        client_name: project.clientName,
        project_title: project.packageType || 'Nova música',
        package_type: project.packageType,
        status: project.status || 'waiting',
        created_at: new Date().toISOString(),
        last_activity_date: new Date().toISOString(),
        expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error adding project to Supabase:", error);
          
          // Show toast if there's an error
          toast({
            title: "Erro ao salvar projeto",
            description: "O projeto foi criado localmente, mas não foi salvo na nuvem",
            variant: "destructive",
          });
        }
      });
    
    return project.id;
  }, [projects, toast]);

  // Update a project
  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    console.log(`Updating project ${id} with:`, updates);
    
    try {
      // Find project to update
      const projectIndex = projects.findIndex(p => p.id === id);
      if (projectIndex === -1) {
        console.error(`Project ${id} not found`);
        return false;
      }
      
      // Create updated project
      const project = projects[projectIndex];
      const updatedProject = { ...project, ...updates };
      
      // Special handling for versionsList updates
      if (updates.versionsList) {
        updatedProject.versions = updates.versionsList.length;
        
        // Sync with project_versions table
        updates.versionsList.forEach(version => {
          if (!version.id.startsWith('existing_')) { // Skip existing versions
            supabase
              .from('project_versions')
              .upsert({
                project_id: id,
                version_id: version.id,
                name: version.name,
                description: version.description || '',
                file_id: version.fileId || null,
                recommended: version.recommended || false
              })
              .then(({ error }) => {
                if (error) {
                  console.error(`Error syncing version ${version.id} to Supabase:`, error);
                }
              });
          }
        });
      }
      
      // Update in Supabase preview_projects
      const supabaseUpdates: any = {};
      
      if ('status' in updates) supabaseUpdates.status = updates.status;
      if ('feedback' in updates) supabaseUpdates.feedback = updates.feedback;
      if ('lastActivityDate' in updates) supabaseUpdates.last_activity_date = new Date().toISOString();
      
      if (Object.keys(supabaseUpdates).length > 0) {
        supabase
          .from('preview_projects')
          .update(supabaseUpdates)
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating project in Supabase:", error);
            } else {
              // Also update the projects table to keep in sync
              supabase
                .from('projects')
                .update({
                  status: supabaseUpdates.status,
                  updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .then(({ error }) => {
                  if (error) {
                    console.error("Error updating main project record:", error);
                  }
                });
            }
          });
      }
      
      // Update in local state
      const newProjects = [...projects];
      newProjects[projectIndex] = updatedProject;
      setProjects(newProjects);
      
      // Update in localStorage
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(newProjects));
      
      return true;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      return false;
    }
  }, [projects]);

  // Delete a project
  const deleteProject = useCallback((id: string) => {
    console.log(`Deleting project ${id}`);
    
    // Update in Supabase
    supabase
      .from('preview_projects')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error("Error deleting project from Supabase:", error);
          
          // Show toast if there's an error
          toast({
            title: "Erro ao excluir projeto",
            description: "O projeto foi removido localmente, mas não da nuvem",
            variant: "destructive",
          });
        }
      });
    
    // Update in local state
    setProjects(prev => prev.filter(p => p.id !== id));
    
    // Update in localStorage
    const updatedProjects = projects.filter(p => p.id !== id);
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
    
    return true;
  }, [projects, toast]);

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
