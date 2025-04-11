
import { useState } from 'react';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientId?: string; // Making clientId optional
  packageType: string;
  createdAt: string;
  status: string;
  versions: number;
  previewUrl: string;
  expirationDate: string;
  lastActivityDate?: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'HAR-2025-0001',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      clientId: 'CLIENT-001', // Added clientId
      packageType: 'Profissional',
      createdAt: '05/04/2025',
      status: 'waiting',
      versions: 3,
      previewUrl: '/preview/HAR-2025-0001',
      expirationDate: '12/04/2025',
      lastActivityDate: '05/04/2025'
    },
    {
      id: 'HAR-2025-0002',
      clientName: 'Maria Oliveira',
      clientEmail: 'maria.oliveira@email.com',
      clientId: 'CLIENT-002', // Added clientId
      packageType: 'Premium',
      createdAt: '06/04/2025',
      status: 'feedback',
      versions: 5,
      previewUrl: '/preview/HAR-2025-0002',
      expirationDate: '13/04/2025',
      lastActivityDate: '08/04/2025'
    },
    {
      id: 'HAR-2025-0003',
      clientName: 'Carlos Mendes',
      clientEmail: 'carlos.mendes@email.com',
      clientId: 'CLIENT-003', // Added clientId
      packageType: 'Essencial',
      createdAt: '07/04/2025',
      status: 'approved',
      versions: 2,
      previewUrl: '/preview/HAR-2025-0003',
      expirationDate: '14/04/2025',
      lastActivityDate: '09/04/2025'
    }
  ]);

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newId = `HAR-2025-000${projects.length + 1}`;
    const newProject = {
      ...project,
      id: newId,
      previewUrl: `/preview/${newId}`
    };
    
    setProjects(prev => [newProject, ...prev]);
    return newId;
  };

  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProjectById = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  return {
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById
  };
};
