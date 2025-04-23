
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBriefings } from '@/hooks/admin/useBriefings';

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
  
  // Load projects from local storage
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
        console.log('Projects loaded from localStorage');
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
    // Save to localStorage as backup
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedProjects));
    console.log('Projects saved to localStorage');
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
