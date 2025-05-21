
import { ProjectItem } from '@/types/preview.types';

export const getProjectById = (projects: ProjectItem[], id: string): ProjectItem | null => {
  if (!id) return null;
  
  // Try to find with exact match first
  let project = projects.find(p => p.id === id);
  
  // If not found, try with case-insensitive comparison
  if (!project) {
    project = projects.find(p => 
      p.id.toLowerCase() === id.toLowerCase()
    );
  }
  
  // If still not found, try with trimmed strings
  if (!project) {
    project = projects.find(p => 
      p.id.trim() === id.trim()
    );
  }
  
  return project || null;
};

export const createDefaultProject = (): ProjectItem => {
  return {
    id: 'P0001',
    clientName: 'Humberto Manzoli',
    clientEmail: 'cliente@exemplo.com',
    packageType: 'Essencial',
    createdAt: new Date().toLocaleDateString('pt-BR'),
    status: 'waiting' as const,
    versions: 0,
    previewUrl: `${window.location.origin}/preview/P0001`,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    lastActivityDate: new Date().toLocaleDateString('pt-BR'),
    versionsList: []
  };
};

export const formatProjectId = (id: string): string => {
  // Remove any spaces
  return id.trim();
};
