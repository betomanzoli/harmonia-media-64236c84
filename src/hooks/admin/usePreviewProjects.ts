
import { useState, useEffect } from 'react';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientId?: string;
  packageType: string;
  createdAt: string;
  status: string;
  versions: number;
  previewUrl: string;
  expirationDate: string;
  lastActivityDate?: string;
  history?: any[];
  feedback?: string;
  versionsList?: any[];
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar projetos do localStorage ao inicializar
  useEffect(() => {
    setIsLoading(true);
    
    // Exemplos de projetos padrão
    const defaultProjects: ProjectItem[] = [
      {
        id: 'HAR-2025-0001',
        clientName: 'João Silva',
        clientEmail: 'joao.silva@email.com',
        clientId: 'CLIENT-001',
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
        clientId: 'CLIENT-002',
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
        clientId: 'CLIENT-003',
        packageType: 'Essencial',
        createdAt: '07/04/2025',
        status: 'approved',
        versions: 2,
        previewUrl: '/preview/HAR-2025-0003',
        expirationDate: '14/04/2025',
        lastActivityDate: '09/04/2025'
      }
    ];
    
    try {
      // Carregar projetos salvos
      const savedProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
      console.log('Carregados', savedProjects.length, 'projetos do localStorage');
      
      // Combinar projetos padrão com os salvos
      const allProjects = [...defaultProjects, ...savedProjects];
      setProjects(allProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos de prévia:', error);
      setProjects(defaultProjects);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    // Gerar ID com base na data e número de projetos (garantindo sequência)
    const year = new Date().getFullYear();
    const projectNumber = (projects.length + 1).toString().padStart(4, '0');
    const newId = `HAR-${year}-${projectNumber}`;
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    
    const newProject = {
      ...project,
      id: newId,
      previewUrl: `/preview/${newId}`,
      history: [
        { action: 'Projeto criado', timestamp }
      ],
      versionsList: Array.from({ length: project.versions }, (_, i) => ({
        id: `v${i+1}`,
        name: `Versão ${i+1}`,
        url: '#',
        dateAdded: now.toLocaleDateString('pt-BR')
      }))
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    
    // Salvar no localStorage
    const savedProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
    localStorage.setItem('preview-projects', JSON.stringify([...savedProjects, newProject]));
    
    console.log('Projeto adicionado com sucesso:', newId);
    return newId;
  };

  const updateProject = (projectId: string, updates: Partial<ProjectItem>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    
    setProjects(updatedProjects);
    
    // Atualizar no localStorage
    const savedProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
    const updatedSaved = savedProjects.map((proj: any) => 
      proj.id === projectId ? { ...proj, ...updates } : proj
    );
    localStorage.setItem('preview-projects', JSON.stringify(updatedSaved));
  };

  const deleteProject = (projectId: string) => {
    const filteredProjects = projects.filter(project => project.id !== projectId);
    setProjects(filteredProjects);
    
    // Atualizar no localStorage
    const savedProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
    const filteredSaved = savedProjects.filter((proj: any) => proj.id !== projectId);
    localStorage.setItem('preview-projects', JSON.stringify(filteredSaved));
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
    getProjectById,
    isLoading
  };
};
