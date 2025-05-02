import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AdditionalLink {
  label: string;
  url: string;
}

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  fileId?: string;
  createdAt: string;
  dateAdded?: string;
  recommended?: boolean;
  final?: boolean;
  additionalLinks?: AdditionalLink[];
}

export interface FeedbackItem {
  id: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'processed';
  versionId?: string;
}

export interface HistoryEntry {
  action: string;
  timestamp: string;
  data?: {
    message: string;
    [key: string]: any;
  };
}

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  status: string;
  createdAt: string;
  expirationDate: string;
  versions: number;
  packageType: string;
  previewUrl?: string; // Added previewUrl property to fix the TypeScript error
  versionsList?: VersionItem[];
  feedbackHistory?: FeedbackItem[];
  feedback?: string;
  history?: HistoryEntry[];
  lastActivityDate?: string;
}

// Mock data storage (in a real app, this would be an API call)
let mockProjects: ProjectItem[] = [];

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load projects from localStorage or initialize with mock data
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedProjects = localStorage.getItem('preview_projects');
      if (storedProjects) {
        mockProjects = JSON.parse(storedProjects);
      } else {
        // Initialize with some mock data if there are no stored projects
        mockProjects = [
          {
            id: 'P0001',
            clientName: 'Carlos Silva',
            clientEmail: 'carlos@example.com',
            clientPhone: '5511987654321',
            status: 'waiting',
            createdAt: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            versions: 2,
            packageType: 'Pacote Profissional',
            versionsList: [
              {
                id: 'v1',
                name: 'Versão Romântica',
                description: 'Uma versão mais suave e romântica, ideal para momentos íntimos.',
                audioUrl: 'https://example.com/song1.mp3',
                createdAt: new Date().toISOString(),
                recommended: true
              },
              {
                id: 'v2',
                name: 'Versão Animada',
                description: 'Uma versão mais alegre e animada, perfeita para celebrações.',
                audioUrl: 'https://example.com/song2.mp3',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
              }
            ],
            feedbackHistory: []
          },
          {
            id: 'P0002',
            clientName: 'Maria Oliveira',
            clientEmail: 'maria@example.com',
            clientPhone: '5511912345678',
            status: 'feedback',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            versions: 3,
            packageType: 'Pacote Premium',
            versionsList: [
              {
                id: 'v1',
                name: 'Versão Clássica',
                description: 'Arranjo com piano e violino',
                audioUrl: 'https://example.com/song3.mp3',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'v2',
                name: 'Versão Pop',
                description: 'Arranjo moderno com batidas eletrônicas',
                audioUrl: 'https://example.com/song4.mp3',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'v3',
                name: 'Versão Acústica',
                description: 'Versão simplificada com violão',
                audioUrl: 'https://example.com/song5.mp3',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                recommended: true
              }
            ],
            feedbackHistory: [
              {
                id: 'f1',
                content: 'Gostei muito da versão acústica, mas poderia ter um pouco mais de violão no refrão.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                versionId: 'v3'
              }
            ],
            feedback: 'Gostei muito da versão acústica, mas poderia ter um pouco mais de violão no refrão.'
          },
          {
            id: 'P0003',
            clientName: 'João Pereira',
            clientEmail: 'joao@example.com',
            clientPhone: '5511987654321',
            status: 'approved',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            versions: 2,
            packageType: 'Pacote Essencial',
            versionsList: [
              {
                id: 'v1',
                name: 'Versão Original',
                description: 'Composição original conforme briefing',
                audioUrl: 'https://example.com/song6.mp3',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'v2',
                name: 'Versão Refinada',
                description: 'Versão com ajustes conforme feedback',
                audioUrl: 'https://example.com/song7.mp3',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                recommended: true
              },
              {
                id: 'vfinal',
                name: 'Versão Final',
                description: 'Versão masterizada para entrega',
                audioUrl: 'https://example.com/song_final.mp3',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                final: true
              }
            ],
            feedbackHistory: [
              {
                id: 'f1',
                content: 'Ficou maravilhoso! Aprovado!',
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'processed',
                versionId: 'v2'
              }
            ],
            feedback: 'Ficou maravilhoso! Aprovado!'
          }
        ];
        localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
      }
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }

    return mockProjects;
  }, [toast]);
  
  // Initialize projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  // Add a new project
  const addProject = (project: Partial<ProjectItem>) => {
    // Generate ID
    const newId = `P${String(mockProjects.length + 1).padStart(4, '0')}`;
    
    // Create expiration date (default to 7 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    const newProject: ProjectItem = {
      id: newId,
      clientName: project.clientName || 'Cliente',
      clientEmail: project.clientEmail,
      clientPhone: project.clientPhone,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      expirationDate: expirationDate.toISOString(),
      versions: project.versionsList?.length || 0,
      packageType: project.packageType || 'Música Personalizada',
      versionsList: project.versionsList || [],
      feedbackHistory: [],
      history: [],
      lastActivityDate: new Date().toISOString()
    };
    
    mockProjects = [newProject, ...mockProjects];
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
    
    return newId;
  };
  
  // Delete a project
  const deleteProject = (projectId: string) => {
    mockProjects = mockProjects.filter(p => p.id !== projectId);
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
  };

  // Get a single project by ID
  const getProjectById = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId);
  };
  
  // Update a project
  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) return null;
    
    mockProjects[index] = { ...mockProjects[index], ...updates };
    
    // Update version count if versions list was updated
    if (updates.versionsList) {
      mockProjects[index].versions = updates.versionsList.length;
    }
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
    
    return mockProjects[index];
  };
  
  // Add a version to a project
  const addVersion = (projectId: string, version: VersionItem) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return null;
    
    if (!project.versionsList) {
      project.versionsList = [];
    }
    
    // Generate a version ID if not provided
    if (!version.id) {
      version.id = `v${project.versionsList.length + 1}`;
    }
    
    // Set creation timestamp if not provided
    if (!version.createdAt) {
      version.createdAt = new Date().toISOString();
    }
    
    project.versionsList.push(version);
    project.versions = project.versionsList.length;
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
    
    return version;
  };
  
  // Delete a version from a project
  const deleteVersion = (projectId: string, versionId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project || !project.versionsList) return false;
    
    project.versionsList = project.versionsList.filter(v => v.id !== versionId);
    project.versions = project.versionsList.length;
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
    
    return true;
  };
  
  // Extend a project's deadline by 7 days
  const extendDeadline = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return false;
    
    const currentExpiration = new Date(project.expirationDate);
    const newExpiration = new Date(currentExpiration);
    newExpiration.setDate(currentExpiration.getDate() + 7);
    
    project.expirationDate = newExpiration.toISOString();
    
    setProjects([...mockProjects]);
    
    // Save to localStorage
    localStorage.setItem('preview_projects', JSON.stringify(mockProjects));
    
    return true;
  };

  return {
    projects,
    isLoading,
    addProject,
    deleteProject,
    getProjectById,
    updateProject,
    loadProjects,
    addVersion,
    deleteVersion,
    extendDeadline
  };
};

// Hook for working with a single preview project
export const usePreviewProject = (projectId?: string) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    getProjectById, 
    updateProject: updateProjectInList, 
    addVersion: addVersionToProject,
    deleteVersion: deleteVersionFromProject,
    extendDeadline: extendProjectDeadline
  } = usePreviewProjects();
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    const fetchProject = async () => {
      setIsLoading(true);
      
      try {
        const foundProject = getProjectById(projectId);
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          // If project is not found in the list, try to get from localStorage
          const localProject = localStorage.getItem(`previewProject_${projectId}`);
          if (localProject) {
            setProject(JSON.parse(localProject));
          } else {
            setProject(null);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, getProjectById]);
  
  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    const updated = updateProjectInList(projectId, updates);
    if (updated) {
      setProject(updated);
    }
    return updated;
  };
  
  const addVersion = (projectId: string, version: VersionItem) => {
    const addedVersion = addVersionToProject(projectId, version);
    if (addedVersion && project) {
      const updatedVersionsList = [...(project.versionsList || []), addedVersion];
      setProject({
        ...project,
        versionsList: updatedVersionsList,
        versions: updatedVersionsList.length
      });
    }
    return addedVersion;
  };
  
  const deleteVersion = (projectId: string, versionId: string) => {
    const success = deleteVersionFromProject(projectId, versionId);
    if (success && project && project.versionsList) {
      const updatedVersionsList = project.versionsList.filter(v => v.id !== versionId);
      setProject({
        ...project,
        versionsList: updatedVersionsList,
        versions: updatedVersionsList.length
      });
    }
    return success;
  };
  
  const extendDeadline = (projectId: string) => {
    const success = extendProjectDeadline(projectId);
    if (success && project) {
      const currentExpiration = new Date(project.expirationDate);
      const newExpiration = new Date(currentExpiration);
      newExpiration.setDate(currentExpiration.getDate() + 7);
      
      setProject({
        ...project,
        expirationDate: newExpiration.toISOString()
      });
    }
    return success;
  };
  
  return {
    project,
    isLoading,
    updateProject,
    addVersion,
    deleteVersion,
    extendDeadline
  };
};
