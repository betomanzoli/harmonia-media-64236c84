
import { useState, useEffect, useCallback } from 'react';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  audioUrl?: string;
  url?: string; // Added the url property for backward compatibility
  dateAdded: string;
  recommended?: boolean;
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
  history?: any[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load projects from local storage
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        console.log('Projects loaded from localStorage:', parsedProjects);
        setProjects(parsedProjects);
      } else {
        // Initialize with empty array if nothing found
        setProjects([]);
        console.log('No projects found, initialized with empty array');
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to local storage
  const saveProjects = useCallback(async (updatedProjects: ProjectItem[]) => {
    try {
      // Save to localStorage
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
      console.log('Projects saved to localStorage:', updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }, []);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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

  // Get project by ID
  const getProjectById = useCallback((id: string) => {
    console.log("Getting project by ID:", id);
    console.log("Available projects:", projects);
    
    const project = projects.find(project => project.id === id);
    console.log("Found project:", project);
    
    // Format package type if project exists
    if (project) {
      project.packageType = formatPackageType(project.packageType);
    }
    
    return project || null;
  }, [projects]);

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
  const addProject = useCallback((project: Omit<ProjectItem, "id">) => {
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
    
    // Save to storage
    saveProjects(updatedProjects);
    
    return newId;
  }, [projects, generateProjectId, saveProjects]);

  // Delete project
  const deleteProject = useCallback((id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    console.log(`Deleting project ${id}`);
    console.log("Updated project list:", updatedProjects);
    
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  // Update project
  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
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
    saveProjects(updatedProjects);
    
    return updatedProject;
  }, [projects, saveProjects]);

  return {
    projects,
    isLoading,
    error,
    loadProjects,
    getProjectById,
    addProject,
    deleteProject,
    updateProject
  };
};
