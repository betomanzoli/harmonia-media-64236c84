
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  audioUrl?: string;
  url?: string; // Added the url property for backward compatibility
  dateAdded: string;
  recommended?: boolean;
  final?: boolean;
  additionalLinks?: {
    label: string;
    url: string;
  }[];
}

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  packageType: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  previewUrl: string;
  expirationDate: string;
  lastActivityDate: string;
  briefingId?: string;
  versionsList?: VersionItem[];
  feedback?: string;
  history?: {
    action: string;
    timestamp: string;
    data?: {
      message?: string;
      status?: string;
      version?: string;
    };
  }[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load projects from local storage and Supabase
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first for fast loading
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      let localProjects: ProjectItem[] = [];
      
      if (storedProjects) {
        localProjects = JSON.parse(storedProjects);
        console.log('Projects loaded from localStorage:', localProjects);
        setProjects(localProjects);
      } else {
        // Initialize with empty array if nothing found
        localProjects = [];
        console.log('No projects found in localStorage, initialized with empty array');
      }

      // Then try to fetch from Supabase to get the latest data
      try {
        const { data: supabaseProjects, error } = await supabase
          .from('preview_projects')
          .select('*');
          
        if (error) {
          console.error('Error loading projects from Supabase:', error);
          return;
        }
          
        if (supabaseProjects && supabaseProjects.length > 0) {
          console.log('Projects loaded from Supabase:', supabaseProjects);
          
          // Convert Supabase data to ProjectItem format
          const supabaseProjectItems: ProjectItem[] = await Promise.all(
            supabaseProjects.map(async (project) => {
              // Fetch versions for this project
              const { data: versionData, error: versionError } = await supabase
                .from('project_versions')
                .select('*')
                .eq('project_id', project.id);
                
              if (versionError) {
                console.error(`Error loading versions for project ${project.id}:`, versionError);
              }
              
              const versionsList: VersionItem[] = versionData ? versionData.map(v => ({
                id: v.version_id,
                name: v.name,
                description: v.description || '',
                fileId: v.file_id,
                audioUrl: v.audio_url,
                dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
                recommended: v.recommended
              })) : [];
              
              return {
                id: project.id,
                clientName: project.client_name,
                clientEmail: project.client_email || '',
                packageType: project.package_type || 'Música Personalizada',
                createdAt: new Date(project.created_at).toLocaleDateString('pt-BR'),
                status: project.status as 'waiting' | 'feedback' | 'approved',
                versions: versionsList.length,
                previewUrl: `/preview/${project.id}`,
                expirationDate: project.expiration_date ? new Date(project.expiration_date).toLocaleDateString('pt-BR') : '',
                lastActivityDate: project.last_activity_date ? new Date(project.last_activity_date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
                versionsList: versionsList,
                feedback: project.feedback
              };
            })
          );
          
          // Merge with local projects (local overrides if already exists)
          const mergedProjects = [...supabaseProjectItems];
          
          // Add any local projects that aren't in Supabase yet
          localProjects.forEach(localProject => {
            if (!mergedProjects.some(p => p.id === localProject.id)) {
              mergedProjects.push(localProject);
            }
          });
          
          setProjects(mergedProjects);
          
          // Update localStorage with merged data
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mergedProjects));
        }
      } catch (err) {
        console.error('Error in Supabase fetch:', err);
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to local storage and Supabase
  const saveProjects = useCallback(async (updatedProjects: ProjectItem[]) => {
    try {
      // Save to localStorage for offline access
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
      console.log('Projects saved to localStorage:', updatedProjects);
      
      // Save to Supabase for cross-device access
      for (const project of updatedProjects) {
        // Upsert project in preview_projects
        const { error: projectError } = await supabase
          .from('preview_projects')
          .upsert({
            id: project.id,
            client_name: project.clientName,
            client_email: project.clientEmail,
            project_title: project.packageType || 'Música Personalizada',
            package_type: project.packageType,
            status: project.status,
            feedback: project.feedback,
            expiration_date: project.expirationDate ? new Date(project.expirationDate) : null,
            last_activity_date: project.lastActivityDate ? new Date(project.lastActivityDate) : new Date()
          }, { onConflict: 'id' });
          
        if (projectError) {
          console.error(`Error saving project ${project.id} to Supabase:`, projectError);
        }
        
        // Save versions list to project_versions
        if (project.versionsList && project.versionsList.length > 0) {
          for (const version of project.versionsList) {
            const { error: versionError } = await supabase
              .from('project_versions')
              .upsert({
                project_id: project.id,
                version_id: version.id,
                name: version.name,
                description: version.description || '',
                file_id: version.fileId,
                audio_url: version.audioUrl,
                recommended: version.recommended || false
              }, { onConflict: 'project_id,version_id' });
              
            if (versionError) {
              console.error(`Error saving version ${version.id} for project ${project.id} to Supabase:`, versionError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }, []);

  // Format package type with capitalized first letter
  const formatPackageType = (packageType: string): string => {
    if (!packageType) return "Projeto de Música Personalizada";
    
    // Split by spaces and capitalize first letter of each word
    return packageType
      .split(' ')
      .map(word => {
        if (word.toLowerCase() === 'essencial' || 
            word.toLowerCase() === 'premium' || 
            word.toLowerCase() === 'profissional') {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      })
      .join(' ');
  };

  // Get project by ID - Modified to handle sync and async modes
  const getProjectById = useCallback((id: string): ProjectItem | null => {
    console.log("Getting project by ID:", id);
    
    // First try to find in local state for faster access
    const localProject = projects.find(project => project.id === id);
    
    if (localProject) {
      console.log("Found project in local state:", localProject);
      
      // Format package type if project exists
      if (localProject) {
        localProject.packageType = formatPackageType(localProject.packageType);
      }
      
      return localProject;
    }
    
    // If not found locally, return null
    // All async loading is now handled internally by loadProjects
    return null;
  }, [projects, formatPackageType]);

  // Method to fetch project by ID from Supabase (async)
  const fetchProjectById = useCallback(async (id: string): Promise<ProjectItem | null> => {
    try {
      console.log("Fetching project from Supabase:", id);
      const { data: projectData, error: projectError } = await supabase
        .from('preview_projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (projectError) {
        console.error(`Error fetching project ${id} from Supabase:`, projectError);
        return null;
      }
      
      if (!projectData) {
        console.log(`Project ${id} not found in Supabase`);
        return null;
      }
      
      // Fetch versions for this project
      const { data: versionData, error: versionError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', id);
        
      if (versionError) {
        console.error(`Error loading versions for project ${id}:`, versionError);
      }
      
      const versionsList: VersionItem[] = versionData ? versionData.map(v => ({
        id: v.version_id,
        name: v.name,
        description: v.description || '',
        fileId: v.file_id,
        audioUrl: v.audio_url,
        dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
        recommended: v.recommended
      })) : [];
      
      // Convert to ProjectItem format
      const projectItem: ProjectItem = {
        id: projectData.id,
        clientName: projectData.client_name,
        clientEmail: projectData.client_email || '',
        packageType: formatPackageType(projectData.package_type || 'Música Personalizada'),
        createdAt: new Date(projectData.created_at).toLocaleDateString('pt-BR'),
        status: projectData.status as 'waiting' | 'feedback' | 'approved',
        versions: versionsList.length,
        previewUrl: `/preview/${projectData.id}`,
        expirationDate: projectData.expiration_date ? new Date(projectData.expiration_date).toLocaleDateString('pt-BR') : '',
        lastActivityDate: projectData.last_activity_date ? new Date(projectData.last_activity_date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        versionsList: versionsList,
        feedback: projectData.feedback
      };
      
      console.log("Found project in Supabase:", projectItem);
      
      // Update local state with this project
      setProjects(prevProjects => {
        const updated = [...prevProjects];
        const index = updated.findIndex(p => p.id === id);
        if (index >= 0) {
          updated[index] = projectItem;
        } else {
          updated.push(projectItem);
        }
        
        // Update localStorage with updated projects
        localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updated));
        
        return updated;
      });
      
      return projectItem;
    } catch (err) {
      console.error(`Error getting project ${id}:`, err);
      return null;
    }
  }, [formatPackageType]);

  // Generate unique project ID
  const generateProjectId = useCallback(() => {
    // Get the highest existing project number
    const highestId = projects.reduce((max, project) => {
      const idNum = parseInt(project.id.replace('P', ''));
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    
    return `P${(highestId + 1).toString().padStart(4, '0')}`;
  }, [projects]);

  // Add new project
  const addProject = useCallback(async (project: Omit<ProjectItem, "id">) => {
    // Generate ID based on highest existing ID
    const newId = generateProjectId();
    
    // Create the new project with the briefing ID if available
    const newProject: ProjectItem = {
      ...project,
      id: newId,
      packageType: formatPackageType(project.packageType || ""),
      // Set default expiration date to 30 days from now if not provided
      expirationDate: project.expirationDate || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    };
    
    const updatedProjects = [...projects, newProject];
    console.log("Adding new project:", newProject);
    console.log("Updated projects list:", updatedProjects);
    
    setProjects(updatedProjects);
    
    // Save to storage (local and Supabase)
    await saveProjects(updatedProjects);
    
    return newId;
  }, [projects, generateProjectId, saveProjects, formatPackageType]);

  // Delete project
  const deleteProject = useCallback(async (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    console.log(`Deleting project ${id}`);
    console.log("Updated project list:", updatedProjects);
    
    setProjects(updatedProjects);
    await saveProjects(updatedProjects);
    
    // Delete from Supabase
    try {
      // Delete project versions first
      const { error: versionsError } = await supabase
        .from('project_versions')
        .delete()
        .eq('project_id', id);
        
      if (versionsError) {
        console.error(`Error deleting versions for project ${id} from Supabase:`, versionsError);
      }
      
      // Then delete the project
      const { error: projectError } = await supabase
        .from('preview_projects')
        .delete()
        .eq('id', id);
        
      if (projectError) {
        console.error(`Error deleting project ${id} from Supabase:`, projectError);
      }
    } catch (err) {
      console.error(`Error deleting project ${id} from Supabase:`, err);
    }
  }, [projects, saveProjects]);

  // Update project
  const updateProject = useCallback(async (id: string, updates: Partial<ProjectItem>) => {
    console.log(`Updating project ${id} with:`, updates);
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      console.error(`Project ${id} not found for updating`);
      return null;
    }
    
    // Format package type if provided
    const formattedUpdates = { ...updates };
    if (updates.packageType) {
      formattedUpdates.packageType = formatPackageType(updates.packageType);
    }
    
    // Add history entry if feedback is provided
    if (updates.status === 'feedback' && updates.feedback) {
      const feedbackEntry = {
        action: "Cliente enviou feedback",
        timestamp: new Date().toLocaleString('pt-BR'),
        data: { 
          message: updates.feedback,
          status: 'feedback'
        }
      };
      
      if (!formattedUpdates.history) {
        formattedUpdates.history = [...(projects[projectIndex].history || []), feedbackEntry];
      } else {
        formattedUpdates.history = [...formattedUpdates.history, feedbackEntry];
      }
    }
    
    // Add history entry if status changed to approved
    if (updates.status === 'approved' && projects[projectIndex].status !== 'approved') {
      const approvalEntry = {
        action: "Cliente aprovou o projeto",
        timestamp: new Date().toLocaleString('pt-BR'),
        data: { 
          message: "O cliente aprovou uma das versões propostas.",
          status: 'approved' 
        }
      };
      
      if (!formattedUpdates.history) {
        formattedUpdates.history = [...(projects[projectIndex].history || []), approvalEntry];
      } else {
        formattedUpdates.history = [...formattedUpdates.history, approvalEntry];
      }
    }
    
    // Add history entry if deadline extended
    if (updates.expirationDate && 
        updates.expirationDate !== projects[projectIndex].expirationDate && 
        !updates.history?.some(h => h.action.includes("Prazo estendido"))) {
      const deadlineEntry = {
        action: "Prazo estendido",
        timestamp: new Date().toLocaleString('pt-BR'),
        data: { 
          message: `Prazo estendido para ${updates.expirationDate}` 
        }
      };
      
      if (!formattedUpdates.history) {
        formattedUpdates.history = [...(projects[projectIndex].history || []), deadlineEntry];
      } else {
        formattedUpdates.history = [...formattedUpdates.history, deadlineEntry];
      }
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      ...formattedUpdates,
      lastActivityDate: updates.lastActivityDate || new Date().toLocaleDateString('pt-BR')
    };
    
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = updatedProject;
    
    console.log("Updated project:", updatedProject);
    console.log("Updated project list:", updatedProjects);
    
    setProjects(updatedProjects);
    await saveProjects(updatedProjects);
    
    return updatedProject;
  }, [projects, saveProjects, formatPackageType]);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    error,
    loadProjects,
    getProjectById,
    fetchProjectById,
    addProject,
    deleteProject,
    updateProject
  };
};
