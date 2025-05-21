
import { useState, useCallback, useEffect } from 'react';

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
  [key: string]: any; // Allow for additional properties
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load projects from localStorage on mount
  const loadProjects = useCallback(async () => {
    console.log("==== LOADING PROJECTS ====");
    setIsLoading(true);
    try {
      // Check if localStorage is available
      const isLocalStorageAvailable = typeof localStorage !== 'undefined';
      console.log("Is localStorage available:", isLocalStorageAvailable);
      
      if (isLocalStorageAvailable) {
        const stored = localStorage.getItem('harmonIA_projects');
        console.log("Retrieved from localStorage:", stored ? 'Data found' : 'No data');
        
        if (stored) {
          try {
            const parsedProjects = JSON.parse(stored);
            console.log("Successfully parsed projects:", parsedProjects);
            setProjects(parsedProjects);
            console.log("Projects count:", parsedProjects.length);
            setIsLoading(false);
            return parsedProjects;
          } catch (parseError) {
            console.error('Error parsing stored projects:', parseError);
          }
        }
      }
      
      // Fallback to default data if no stored data or error
      const defaultProjects = [
        {
          id: 'P0001',
          clientName: 'Humberto Manzoli',
          clientEmail: 'cliente@exemplo.com',
          packageType: 'Essencial',
          createdAt: new Date().toLocaleDateString('pt-BR'),
          status: 'waiting' as const,
          versions: 0,
          previewUrl: `${window.location.origin}/preview/P0001`,
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          lastActivityDate: new Date().toLocaleDateString('pt-BR'),
          versionsList: []
        }
      ];
      
      setProjects(defaultProjects);
      console.log("Using default projects");
      
      // Save default data to localStorage
      if (isLocalStorageAvailable) {
        localStorage.setItem('harmonIA_projects', JSON.stringify(defaultProjects));
      }
      
      setIsLoading(false);
      return defaultProjects;
    } catch (error) {
      console.error('Error loading projects:', error);
      setIsLoading(false);
      return [];
    }
  }, []);
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('harmonIA_projects', JSON.stringify(projects));
    }
  }, [projects]);
  
  // Get a specific project by ID
  const getProjectById = useCallback((id: string) => {
    if (!id) return null;
    
    // Debug the search process
    console.log(`Looking for project with ID: ${id} among ${projects.length} projects`);
    
    // Try to find with exact match first
    let project = projects.find(p => p.id === id);
    if (project) {
      console.log("Project found with exact match");
      return project;
    }
    
    // If not found, try with case-insensitive comparison
    project = projects.find(p => 
      p.id.toLowerCase() === id.toLowerCase()
    );
    if (project) {
      console.log("Project found with case-insensitive match");
      return project;
    }
    
    // If still not found, try with trimmed strings
    project = projects.find(p => 
      p.id.trim() === id.trim()
    );
    if (project) {
      console.log("Project found with trimmed match");
      return project;
    }
    
    console.log(`No project found with ID: ${id}`);
    return null;
  }, [projects]);
  
  // Add a new project
  const addProject = useCallback((project: Omit<ProjectItem, 'id'> & { id?: string }) => {
    // If an ID is provided, use it; otherwise generate a new one
    const projectId = project.id || `P${String(projects.length + 1).padStart(4, '0')}`;
    
    const newProject: ProjectItem = {
      ...project,
      id: projectId,
      clientName: project.clientName || 'Unknown Client',
      clientEmail: project.clientEmail || 'unknown@example.com',
      createdAt: project.createdAt || new Date().toLocaleDateString('pt-BR'),
      status: project.status || 'waiting',
      versions: project.versions || 0
    };
    
    setProjects(prev => {
      // Make sure we're not adding a duplicate
      const projectExists = prev.some(p => p.id === projectId);
      if (projectExists) {
        console.log(`Project with ID ${projectId} already exists, updating instead of adding`);
        return prev.map(p => p.id === projectId ? { ...p, ...newProject } : p);
      }
      
      return [...prev, newProject];
    });
    
    return projectId;
  }, [projects]);
  
  // Update an existing project
  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    if (!id) return false;
    
    console.log(`Updating project with ID: ${id}`, updates);
    
    // Find the project by ID, case-insensitive
    let foundIndex = projects.findIndex(p => p.id.toLowerCase() === id.toLowerCase());
    
    if (foundIndex === -1) {
      console.log(`Project with ID ${id} not found, cannot update.`);
      return false;
    }
    
    // Get the existing project
    const existingProject = projects[foundIndex];
    
    // Handle history entries - append new to existing
    const updatedHistory = (() => {
      if (!updates.history) return existingProject.history || [];
      
      const currentHistory = existingProject.history || [];
      return [...currentHistory, ...updates.history];
    })();
    
    // Handle versionsList - special logic for adding/updating versions
    const updatedVersionsList = (() => {
      if (!updates.versionsList) return existingProject.versionsList || [];
      
      return updates.versionsList;
    })();
    
    // Create the updated project
    const updatedProject = {
      ...existingProject,
      ...updates,
      history: updatedHistory,
      versionsList: updatedVersionsList
    };
    
    // Update the projects array
    setProjects(prev => 
      prev.map((p, index) => 
        index === foundIndex ? updatedProject : p
      )
    );
    
    console.log("Project updated successfully");
    return true;
  }, [projects]);
  
  // Delete a project
  const deleteProject = useCallback((id: string) => {
    if (!id) return false;
    
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);
  
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
