
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
  
  const LOCAL_STORAGE_KEY = 'harmonIA_preview_projects';
  
  // Load projects from local storage
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage
      const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
      console.log('Attempting to load projects from localStorage, key exists:', storedProjects !== null);
      
      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects);
          console.log('Projects loaded from localStorage:', parsedProjects);
          setProjects(parsedProjects);
        } catch (parseError) {
          console.error('Error parsing projects from localStorage:', parseError);
          setProjects([]);
          // If there's a parse error, remove the corrupted data
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } else {
        // Initialize with empty array if nothing found
        console.log('No projects found in localStorage, initializing with empty array');
        setProjects([]);
        
        // Save empty array to ensure the key exists
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        } catch (e) {
          console.error('Failed to initialize empty projects array in localStorage:', e);
        }
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
    console.log('Attempting to save projects to localStorage:', updatedProjects);
    try {
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));
      console.log('Projects saved to localStorage successfully, key:', LOCAL_STORAGE_KEY);
      
      // Verify the data was saved correctly
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!savedData) {
        console.error('Verification failed: Projects not found in localStorage after saving');
      } else {
        console.log('Verification passed: Projects found in localStorage after saving');
      }
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
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
    console.log("Projects array length:", projects.length);
    console.log("Projects array type:", Array.isArray(projects) ? "Array" : typeof projects);
    
    if (!Array.isArray(projects)) {
      console.error("Projects is not an array:", projects);
      return null;
    }
    
    const project = projects.find(project => project.id === id);
    console.log("Found project:", project);
    
    // Format package type if project exists
    if (project) {
      project.packageType = formatPackageType(project.packageType);
    } else {
      console.warn(`Project with ID ${id} not found in localStorage`);
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
    
    console.log("Adding new project:", newProject);
    
    // Make a copy of the projects array to avoid reference issues
    const updatedProjects = [...projects, newProject];
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
    
    // Create a copy of the projects array to avoid reference issues
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = updatedProject;
    
    console.log("Updated project:", updatedProject);
    console.log("Updated project list (in RAM):", updatedProjects);
    
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
