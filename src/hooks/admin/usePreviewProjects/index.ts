
import { useState, useCallback, useEffect } from 'react';
import { ProjectItem, VersionItem } from '@/types/preview.types';
import { loadProjectsFromStorage, saveProjectsToStorage } from '@/utils/storage.utils';
import { getProjectById as findProjectById, createDefaultProject, formatProjectId } from '@/utils/project.utils';

// Re-export the types
export type { ProjectItem, VersionItem };

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load projects from localStorage on mount
  const loadProjects = useCallback(async () => {
    console.log("==== LOADING PROJECTS ====");
    setIsLoading(true);
    try {
      const storedProjects = loadProjectsFromStorage();
      
      if (storedProjects) {
        setProjects(storedProjects);
        setIsLoading(false);
        return storedProjects;
      }
      
      // Fallback to default data if no stored data
      const defaultProjects = [createDefaultProject()];
      
      setProjects(defaultProjects);
      console.log("Using default projects");
      
      // Save default data to localStorage
      saveProjectsToStorage(defaultProjects);
      
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
    saveProjectsToStorage(projects);
  }, [projects]);
  
  // Get a specific project by ID
  const getProjectById = useCallback((id: string) => {
    return findProjectById(projects, id);
  }, [projects]);
  
  // Add a new project
  const addProject = useCallback((project: Omit<ProjectItem, 'id'> & { id?: string }) => {
    // If an ID is provided, use it; otherwise generate a new one
    const projectId = formatProjectId(project.id || `P${String(projects.length + 1).padStart(4, '0')}`);
    
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
    
    const formattedId = formatProjectId(id);
    
    // Find the project by ID, case-insensitive
    let foundIndex = projects.findIndex(p => p.id.toLowerCase() === formattedId.toLowerCase());
    
    if (foundIndex === -1) {
      console.log(`Project with ID ${formattedId} not found, cannot update.`);
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
