
import { useState, useEffect } from 'react';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved' | 'processing';
  versions?: Array<{
    id: string;
    name: string;
    url: string;
    feedback?: string;
    isApproved?: boolean;
  }>;
}

export function usePreviewProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'P0001',
      clientName: 'João Silva',
      clientEmail: 'joao@example.com',
      packageType: 'Profissional',
      createdAt: '10/05/2023',
      status: 'waiting',
      versions: []
    },
    {
      id: 'P0002',
      clientName: 'Maria Santos',
      clientEmail: 'maria@example.com',
      packageType: 'Premium',
      createdAt: '15/05/2023',
      status: 'feedback',
      versions: []
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = () => {
    setIsLoading(true);
    // In a real app, this would be an API call to load projects
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return { 
    projects,
    isLoading,
    loadProjects,
    deleteProject
  };
}
