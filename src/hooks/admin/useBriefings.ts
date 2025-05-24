
import { useState, useEffect, useCallback } from 'react';

export interface Briefing {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  packageType: string;
  description: string;
  musicStyle?: string;
  references?: string[];
  status: 'pending' | 'completed' | 'approved';
  notes?: string;
  createdAt: string;
  projectCreated?: boolean;
}

export function useBriefings() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBriefings = useCallback(() => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      const savedBriefings = localStorage.getItem('briefings');
      if (savedBriefings) {
        setBriefings(JSON.parse(savedBriefings));
      } else {
        // Mock data if none exists
        const mockBriefings: Briefing[] = [
          {
            id: 'bf-' + Math.random().toString(36).substring(2, 10),
            name: 'João Silva',
            email: 'joao@example.com',
            phoneNumber: '(11) 99999-9999',
            packageType: 'Premium',
            description: 'Música para casamento com estilo romântico',
            musicStyle: 'Pop Romântico',
            references: ['https://youtube.com/example1', 'https://youtube.com/example2'],
            status: 'pending',
            createdAt: '2023-05-15',
            projectCreated: false
          },
          {
            id: 'bf-' + Math.random().toString(36).substring(2, 10),
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phoneNumber: '(21) 98888-8888',
            packageType: 'Essencial',
            description: 'Jingle para comercial de TV',
            musicStyle: 'Animado',
            status: 'completed',
            notes: 'Cliente solicitou entrega urgente',
            createdAt: '2023-05-10',
            projectCreated: true
          }
        ];
        setBriefings(mockBriefings);
        localStorage.setItem('briefings', JSON.stringify(mockBriefings));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    loadBriefings();
  }, [loadBriefings]);

  const createBriefing = (newBriefing: Omit<Briefing, 'id' | 'status' | 'createdAt'>) => {
    const briefing: Briefing = {
      ...newBriefing,
      id: 'bf-' + Math.random().toString(36).substring(2, 10),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      projectCreated: false
    };
    
    setBriefings(prev => {
      const updatedBriefings = [...prev, briefing];
      localStorage.setItem('briefings', JSON.stringify(updatedBriefings));
      return updatedBriefings;
    });
    
    return briefing;
  };

  const updateBriefing = (id: string, updates: Partial<Briefing>) => {
    setBriefings(prev => {
      const updatedBriefings = prev.map(briefing => 
        briefing.id === id ? { ...briefing, ...updates } : briefing
      );
      localStorage.setItem('briefings', JSON.stringify(updatedBriefings));
      return updatedBriefings;
    });
  };

  const deleteBriefing = (id: string) => {
    setBriefings(prev => {
      const updatedBriefings = prev.filter(briefing => briefing.id !== id);
      localStorage.setItem('briefings', JSON.stringify(updatedBriefings));
      return updatedBriefings;
    });
  };

  const updateBriefingStatus = (id: string, status: Briefing['status']) => {
    updateBriefing(id, { status });
  };

  const createProjectFromBriefing = (briefing: Briefing) => {
    // Mark briefing as having a project
    updateBriefing(briefing.id, { projectCreated: true });
    
    // In a real app, this would create a project in another system/table
    // For now, we just return a mock project ID
    const projectId = 'prj-' + Math.random().toString(36).substring(2, 8);
    console.log(`Created project ${projectId} from briefing ${briefing.id}`);
    
    return projectId;
  };

  return {
    briefings,
    isLoading,
    loadBriefings,
    createBriefing,
    updateBriefing,
    deleteBriefing,
    updateBriefingStatus,
    createProjectFromBriefing,
    fetchBriefings: loadBriefings,
    error: null,
    addBriefing: createBriefing
  };
}
