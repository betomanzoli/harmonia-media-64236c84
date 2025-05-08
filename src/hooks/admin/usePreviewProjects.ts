
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';

export interface AdditionalLink {
  label: string;
  url: string;
}

export interface VersionItem {
  id: string;
  name: string;
  description: string;
  audioUrl?: string;
  file_url?: string; // Add this field as optional since some components expect it
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
  created_at?: string; // For compatibility with different naming conventions
  fileId?: string;
  dateAdded?: string;
  additionalLinks?: (AdditionalLink | string)[];
}

export interface FeedbackItem {
  id: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'processed';
  versionId?: string;
}

export interface HistoryEntry {
  action: string;
  timestamp: string;
  data?: {
    message: string;
    [key: string]: any;
  };
}

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  status: string;
  createdAt: string;
  expirationDate: string;
  versions: number;
  packageType: string;
  previewUrl?: string; 
  versionsList?: VersionItem[];
  previews?: VersionItem[]; // Adding this for backwards compatibility
  projectTitle?: string;
  feedbackHistory?: FeedbackItem[];
  feedback?: string;
  history?: HistoryEntry[];
  lastActivityDate?: string;
  preview_code?: string; // Added preview_code property
}

// Mock data storage (in a real app, this would be an API call)
let mockProjects: ProjectItem[] = [];

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load projects from localStorage or initialize with mock data
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Always try to get from localStorage first
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      
      if (storedProjects && JSON.parse(storedProjects).length > 0) {
        // Use stored projects if they exist
        mockProjects = JSON.parse(storedProjects);
      } else {
        // Initialize with empty array if no projects
        mockProjects = [];
        localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
      }
      
      // Ensure all projects have a preview_code set
      mockProjects = mockProjects.map(project => {
        if (!project.preview_code) {
          // Generate a unique preview code for this project
          project.preview_code = generatePreviewLink(project.id, project.clientEmail || project.clientName);
        }
        return project;
      });
      
      // Save back the updated projects
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }

    return mockProjects;
  }, [toast]);
  
  // Initialize projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  // Add a new project - Ensure we're generating encoded preview links
  const addProject = (project: Partial<ProjectItem>) => {
    // Generate ID
    const newId = `P${String(mockProjects.length + 1).padStart(4, '0')}`;
    
    // Create expiration date (default to 7 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    // Generate an encoded preview link for this project
    const encodedPreviewId = generatePreviewLink(newId);
    
    const newProject: ProjectItem = {
      id: newId,
      clientName: project.clientName || 'Cliente',
      clientEmail: project.clientEmail,
      clientPhone: project.clientPhone, // Include phone in the project
      status: 'waiting',
      createdAt: new Date().toISOString(),
      expirationDate: expirationDate.toISOString(),
      versions: project.versionsList?.length || 0,
      packageType: project.packageType || 'Música Personalizada',
      projectTitle: project.projectTitle || project.packageType || 'Música Personalizada',
      previewUrl: `/preview/${encodedPreviewId}`, // Use encoded ID here
      versionsList: project.versionsList || [],
      feedbackHistory: [],
      history: [],
      lastActivityDate: new Date().toISOString(),
      preview_code: encodedPreviewId // Store the preview code
    };
    
    mockProjects = [newProject, ...mockProjects];
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
    
    return newId;
  };
  
  // Delete a project
  const deleteProject = (projectId: string) => {
    mockProjects = mockProjects.filter(p => p.id !== projectId);
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
  };

  // Get a single project by ID
  const getProjectById = (projectId: string) => {
    // First, try to find by ID
    let project = mockProjects.find(p => p.id === projectId);
    
    // If not found by ID, try to find by preview_code
    if (!project) {
      project = mockProjects.find(p => p.preview_code === projectId);
    }
    
    return project;
  };
  
  // Update a project
  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) return null;
    
    mockProjects[index] = { ...mockProjects[index], ...updates };
    
    // Update version count if versions list was updated
    if (updates.versionsList) {
      mockProjects[index].versions = updates.versionsList.length;
    }
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
    
    return mockProjects[index];
  };
  
  // Add a version to a project
  const addVersion = (projectId: string, version: VersionItem) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return null;
    
    if (!project.versionsList) {
      project.versionsList = [];
    }
    
    // Generate a version ID if not provided
    if (!version.id) {
      version.id = `v${project.versionsList.length + 1}`;
    }
    
    // Set creation timestamp if not provided
    if (!version.createdAt && !version.created_at) {
      version.createdAt = new Date().toISOString();
    }
    
    project.versionsList.push(version);
    project.versions = project.versionsList.length;
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
    
    return version;
  };
  
  // Delete a version from a project
  const deleteVersion = (projectId: string, versionId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project || !project.versionsList) return false;
    
    project.versionsList = project.versionsList.filter(v => v.id !== versionId);
    project.versions = project.versionsList.length;
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
    
    return true;
  };
  
  // Extend a project's deadline by 7 days
  const extendDeadline = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return false;
    
    const currentExpiration = new Date(project.expirationDate);
    const newExpiration = new Date(currentExpiration);
    newExpiration.setDate(currentExpiration.getDate() + 7);
    
    project.expirationDate = newExpiration.toISOString();
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockProjects));
    
    return true;
  };

  return {
    projects,
    isLoading,
    addProject,
    deleteProject,
    getProjectById,
    updateProject,
    loadProjects,
    addVersion,
    deleteVersion,
    extendDeadline
  };
};

// Hook for working with a single preview project
export const usePreviewProject = (projectId?: string) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    getProjectById, 
    updateProject: updateProjectInList, 
    addVersion: addVersionToProject,
    deleteVersion: deleteVersionFromProject,
    extendDeadline: extendProjectDeadline
  } = usePreviewProjects();
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    const fetchProject = async () => {
      setIsLoading(true);
      
      try {
        // First look for the project by ID directly
        let foundProject = getProjectById(projectId);
        
        // If not found, try to look for it by preview_code
        if (!foundProject) {
          foundProject = getProjectById(projectId);
          console.log(`[usePreviewProject] Looking up by preview_code ${projectId} returned:`, foundProject);
        }
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          // If project is not found in the list, try to get from localStorage
          const localProject = localStorage.getItem(`previewProject_${projectId}`);
          if (localProject) {
            setProject(JSON.parse(localProject));
          } else {
            setProject(null);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, getProjectById]);
  
  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    const updated = updateProjectInList(projectId, updates);
    if (updated) {
      setProject(updated);
    }
    return updated;
  };
  
  const addVersion = (projectId: string, version: VersionItem) => {
    const addedVersion = addVersionToProject(projectId, version);
    if (addedVersion && project) {
      const updatedVersionsList = [...(project.versionsList || []), addedVersion];
      setProject({
        ...project,
        versionsList: updatedVersionsList,
        versions: updatedVersionsList.length
      });
    }
    return addedVersion;
  };
  
  const deleteVersion = (projectId: string, versionId: string) => {
    const success = deleteVersionFromProject(projectId, versionId);
    if (success && project && project.versionsList) {
      const updatedVersionsList = project.versionsList.filter(v => v.id !== versionId);
      setProject({
        ...project,
        versionsList: updatedVersionsList,
        versions: updatedVersionsList.length
      });
    }
    return success;
  };
  
  const extendDeadline = (projectId: string) => {
    const success = extendProjectDeadline(projectId);
    if (success && project) {
      const currentExpiration = new Date(project.expirationDate);
      const newExpiration = new Date(currentExpiration);
      newExpiration.setDate(currentExpiration.getDate() + 7);
      
      setProject({
        ...project,
        expirationDate: newExpiration.toISOString()
      });
    }
    return success;
  };
  
  return {
    project,
    isLoading,
    updateProject,
    addVersion,
    deleteVersion,
    extendDeadline
  };
};
