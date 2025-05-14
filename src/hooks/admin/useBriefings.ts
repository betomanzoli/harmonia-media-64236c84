
import { useState, useCallback, useEffect } from 'react';
import { createId } from '@paralleldrive/cuid2';

export interface Briefing {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'approved';
  description?: string;
  projectCreated: boolean;
  formData?: any;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType?: string;
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([
    {
      id: 'B001',
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone: '+5511999999999',
      packageType: 'Premium',
      createdAt: '10/04/2025',
      status: 'pending',
      description: 'Música para casamento',
      projectCreated: false
    },
    {
      id: 'B002',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@exemplo.com',
      phone: '+5521987654321',
      packageType: 'Essencial',
      createdAt: '08/04/2025',
      status: 'completed',
      description: 'Música de aniversário',
      projectCreated: true
    },
    {
      id: 'B003',
      name: 'Carlos Santos',
      email: 'carlos.santos@exemplo.com',
      phone: '+5531912345678',
      packageType: 'Profissional',
      createdAt: '05/04/2025',
      status: 'approved',
      description: 'Trilha sonora para vídeo',
      projectCreated: true
    }
  ]);

  const addBriefing = useCallback((briefing: Omit<Briefing, 'id'>) => {
    const id = `B${String(briefings.length + 1).padStart(3, '0')}`;
    const newBriefing = { ...briefing, id };
    
    setBriefings(prev => [...prev, newBriefing as Briefing]);
    
    // Save to localStorage for persistence
    const allBriefings = [...briefings, newBriefing as Briefing];
    localStorage.setItem('harmonIA_briefings', JSON.stringify(allBriefings));
    
    // Add client information if doesn't exist
    const storedClients = localStorage.getItem('harmonIA_clients') || '[]';
    const clients: Client[] = JSON.parse(storedClients);
    
    // Check if client exists
    const existingClient = clients.find(client => client.email === briefing.email);
    
    if (!existingClient) {
      // Add new client
      const newClient: Client = {
        id: `client${clients.length + 1}`,
        name: briefing.name,
        email: briefing.email,
        phone: briefing.phone,
        packageType: briefing.packageType
      };
      
      const updatedClients = [...clients, newClient];
      localStorage.setItem('harmonIA_clients', JSON.stringify(updatedClients));
    }
    
    return id;
  }, [briefings]);

  const updateBriefingStatus = useCallback((id: string, status: Briefing['status']) => {
    setBriefings(prev => 
      prev.map(briefing => 
        briefing.id === id ? { ...briefing, status } : briefing
      )
    );
    
    // Save to localStorage for persistence
    const updatedBriefings = briefings.map(briefing => 
      briefing.id === id ? { ...briefing, status } : briefing
    );
    localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
  }, [briefings]);

  const updateBriefing = useCallback((id: string, updates: Partial<Briefing>) => {
    setBriefings(prev => 
      prev.map(briefing => 
        briefing.id === id ? { ...briefing, ...updates } : briefing
      )
    );
    
    // Save to localStorage for persistence
    const updatedBriefings = briefings.map(briefing => 
      briefing.id === id ? { ...briefing, ...updates } : briefing
    );
    localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
  }, [briefings]);

  const deleteBriefing = useCallback((id: string) => {
    setBriefings(prev => prev.filter(briefing => briefing.id !== id));
    
    // Save to localStorage for persistence
    const updatedBriefings = briefings.filter(briefing => briefing.id !== id);
    localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
  }, [briefings]);

  const createProjectFromBriefing = useCallback((briefing: Briefing) => {
    // In a real implementation, this would create a project in the database
    // For now, we just mark the briefing as having a project created
    setBriefings(prev => 
      prev.map(b => 
        b.id === briefing.id ? { ...b, projectCreated: true } : b
      )
    );
    
    // Save updated briefings
    const updatedBriefings = briefings.map(b => 
      b.id === briefing.id ? { ...b, projectCreated: true } : b
    );
    localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
    
    // Create a project in localStorage
    const storedProjects = localStorage.getItem('harmonIA_projects') || '[]';
    const projects = JSON.parse(storedProjects);
    
    const projectId = `P${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
    const newProject = {
      id: projectId,
      title: briefing.description || `Projeto para ${briefing.name}`,
      clientName: briefing.name,
      status: 'em_andamento',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      packageType: briefing.packageType
    };
    
    const updatedProjects = [...projects, newProject];
    localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
    
    // Also create a preview project
    const storedPreviewProjects = localStorage.getItem('harmonIA_preview_projects') || '[]';
    const previewProjects = JSON.parse(storedPreviewProjects);
    
    const previewId = projectId;
    const newPreviewProject = {
      id: previewId,
      clientName: briefing.name,
      clientEmail: briefing.email,
      clientPhone: briefing.phone,
      packageType: briefing.packageType,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'waiting',
      versions: 0,
      previewUrl: `/preview/${createId()}`,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      briefingId: briefing.id,
      versionsList: []
    };
    
    const updatedPreviewProjects = [...previewProjects, newPreviewProject];
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(updatedPreviewProjects));
    
    return projectId;
  }, [briefings]);

  // Load briefings from localStorage on init
  useEffect(() => {
    const loadBriefings = () => {
      const storedBriefings = localStorage.getItem('harmonIA_briefings');
      if (storedBriefings) {
        setBriefings(JSON.parse(storedBriefings));
      } else {
        // Save initial briefings
        localStorage.setItem('harmonIA_briefings', JSON.stringify(briefings));
      }
    };
    
    loadBriefings();
  }, []);

  return {
    briefings,
    addBriefing,
    updateBriefingStatus,
    updateBriefing,
    deleteBriefing,
    createProjectFromBriefing
  };
};
