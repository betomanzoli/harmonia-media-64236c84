
import { useState } from 'react';

export interface PreviewProject {
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
  description?: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<PreviewProject[]>([]);

  const addProject = (projectData: Omit<PreviewProject, 'id'>) => {
    const newProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };

  const updateProject = (id: string, updates: Partial<PreviewProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject
  };
};
