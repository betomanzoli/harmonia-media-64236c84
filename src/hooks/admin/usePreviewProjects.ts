
import { useState, useEffect } from 'react';
import { mockPreviewProjects } from '@/utils/mockPreviewsData';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  status: string;
  createdAt: string;
  versions: any[];
}

export function usePreviewProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // Make sure mockPreviewProjects items all have the required versions property
      const projectsWithVersions = mockPreviewProjects.map(project => ({
        ...project,
        versions: project.versions || []
      }));
      setProjects(projectsWithVersions);
      setIsLoading(false);
    }, 500);
  }, []);

  const addProject = (newProject: Omit<ProjectItem, 'id' | 'createdAt'>) => {
    const project: ProjectItem = {
      ...newProject,
      id: `PRJ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString().split('T')[0],
      versions: []
    };
    
    setProjects(prev => [...prev, project]);
    return project.id;
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  return {
    projects,
    isLoading,
    addProject,
    deleteProject,
    updateProject
  };
}
