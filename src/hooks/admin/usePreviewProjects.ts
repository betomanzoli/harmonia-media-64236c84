
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBriefings } from '@/hooks/admin/useBriefings';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  audioUrl?: string;
  dateAdded: string;
  recommended?: boolean;
}

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
  briefingId?: string;
  versionsList?: VersionItem[];
  feedback?: string;
  history?: any[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { briefings } = useBriefings();
  
  // Load projects from local storage or Supabase
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('preview_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Projects loaded from Supabase:', data.length);
        // Map from database format to our format
        const mappedProjects: ProjectItem[] = data.map(item => ({
          id: item.id,
          clientName: item.client_name,
          clientEmail: item.client_email,
          packageType: item.package_type,
          createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
          status: item.status || 'waiting',
          versions: item.versions || 0,
          previewUrl: item.preview_url || '',
          expirationDate: item.expiration_date ? new Date(item.expiration_date).toLocaleDateString('pt-BR') : '',
          lastActivityDate: item.last_activity_date ? new Date(item.last_activity_date).toLocaleDateString('pt-BR') : '',
          briefingId: item.briefing_id,
          versionsList: item.versions_list,
          feedback: item.feedback,
          history: item.history
        }));
        
        setProjects(mappedProjects);
      } else {
        // If no data from Supabase, try local storage
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
          console.log('Projects loaded from localStorage');
        } else {
          // Initialize with empty array if nothing found
          setProjects([]);
          console.log('No projects found, initialized with empty array');
        }
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      
      // Fallback to localStorage if Supabase fails
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
        console.log('Fallback: Projects loaded from localStorage');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to both local storage and Supabase
  const saveProjects = useCallback(async (updatedProjects: ProjectItem[]) => {
    // Save to localStorage as backup
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
    
    try {
      // Save each project to Supabase
      for (const project of updatedProjects) {
        const { error } = await supabase
          .from('preview_projects')
          .upsert({
            id: project.id,
            client_name: project.clientName,
            client_email: project.clientEmail,
            package_type: project.packageType,
            status: project.status,
            versions: project.versions,
            preview_url: project.previewUrl || '',
            expiration_date: project.expirationDate ? new Date(project.expirationDate.split('/').reverse().join('-')) : null,
            last_activity_date: project.lastActivityDate ? new Date(project.lastActivityDate.split('/').reverse().join('-')) : null,
            briefing_id: project.briefingId || null,
            versions_list: project.versionsList || null,
            feedback: project.feedback || null,
            history: project.history || null
          }, { onConflict: 'id' });
          
        if (error) {
          console.error('Error saving project to Supabase:', error);
        }
      }
      console.log('Projects saved to Supabase');
    } catch (err) {
      console.error('Error saving projects to Supabase:', err);
    }
  }, []);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Get project by ID
  const getProjectById = useCallback((id: string) => {
    return projects.find(project => project.id === id) || null;
  }, [projects]);

  // Generate unique project ID linked to briefing if available
  const generateProjectId = useCallback(() => {
    // Get the highest existing project number
    const highestId = projects.reduce((max, project) => {
      const idNum = parseInt(project.id.replace('P', ''));
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    
    return `P${(highestId + 1).toString().padStart(4, '0')}`;
  }, [projects]);

  // Find corresponding briefing for a client
  const findClientBriefing = useCallback((clientEmail: string) => {
    return briefings.find(briefing => briefing.email === clientEmail);
  }, [briefings]);

  // Add new project
  const addProject = useCallback((project: Omit<ProjectItem, "id">) => {
    // Check if client has a briefing and use that ID if possible
    const clientBriefing = findClientBriefing(project.clientEmail);
    const briefingId = clientBriefing?.id;
    
    // Generate ID based on highest existing ID
    const newId = generateProjectId();
    
    // Create the new project with the briefing ID if available
    const newProject: ProjectItem = {
      ...project,
      id: newId,
      briefingId: briefingId
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // Save to storage
    saveProjects(updatedProjects);
    
    return newId;
  }, [projects, generateProjectId, findClientBriefing, saveProjects]);

  // Delete project
  const deleteProject = useCallback((id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    
    // Delete from Supabase
    try {
      supabase.from('preview_projects').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting project from Supabase:', err);
    }
    
    // Update local storage
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  // Update project
  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    );
    
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    return updatedProjects.find(p => p.id === id);
  }, [projects, saveProjects]);

  return {
    projects,
    isLoading,
    error,
    getProjectById,
    addProject,
    deleteProject,
    updateProject,
    loadProjects
  };
};
