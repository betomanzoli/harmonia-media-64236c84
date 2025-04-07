
import { useState } from 'react';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: string;
  versions: number;
  previewUrl: string;
  expirationDate: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'HAR-2025-0001',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      packageType: 'Profissional',
      createdAt: '05/04/2025',
      status: 'waiting',
      versions: 3,
      previewUrl: '/previews/preview123',
      expirationDate: '12/04/2025'
    },
    {
      id: 'HAR-2025-0002',
      clientName: 'Maria Oliveira',
      clientEmail: 'maria.oliveira@email.com',
      packageType: 'Premium',
      createdAt: '06/04/2025',
      status: 'feedback',
      versions: 5,
      previewUrl: '/previews/preview456',
      expirationDate: '13/04/2025'
    },
    {
      id: 'HAR-2025-0003',
      clientName: 'Carlos Mendes',
      clientEmail: 'carlos.mendes@email.com',
      packageType: 'Essencial',
      createdAt: '07/04/2025',
      status: 'approved',
      versions: 2,
      previewUrl: '/previews/preview789',
      expirationDate: '14/04/2025'
    }
  ]);

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newId = `HAR-2025-000${projects.length + 1}`;
    setProjects(prev => [
      {
        ...project,
        id: newId
      },
      ...prev
    ]);
    return newId;
  };

  return {
    projects,
    setProjects,
    addProject
  };
};
