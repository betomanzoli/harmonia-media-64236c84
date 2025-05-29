
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  description?: string;
  feedback?: string;
  versionsList?: VersionItem[];
}

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended: boolean;
  dateAdded: string;
  final?: boolean;
  fileId?: string;
  additionalLinks?: { label: string; url: string }[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data temporário - será substituído na Fase 2
  useEffect(() => {
    setProjects([
      {
        id: 'P0001',
        clientName: 'João Silva',
        clientEmail: 'joao@email.com',
        packageType: 'essencial',
        createdAt: '20/01/2024',
        status: 'waiting',
        versions: 1,
        previewUrl: '',
        expirationDate: '20/02/2024',
        lastActivityDate: '20/01/2024',
        description: 'Música personalizada para aniversário',
        versionsList: []
      }
    ]);
  }, []);

  const addProject = (projectData: Partial<ProjectItem>) => {
    const newId = `P${(projects.length + 1).toString().padStart(4, '0')}`;
    const newProject: ProjectItem = {
      id: newId,
      clientName: projectData.clientName || '',
      clientEmail: projectData.clientEmail || '',
      packageType: projectData.packageType || 'essencial',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'waiting',
      versions: 0,
      previewUrl: '',
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      description: projectData.description,
      versionsList: []
    };
    
    setProjects(prev => [...prev, newProject]);
    return newId;
  };

  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject
  };
};
