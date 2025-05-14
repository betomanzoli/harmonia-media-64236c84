
import { useState, useCallback } from 'react';
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
    
    return id;
  }, [briefings]);

  const updateBriefingStatus = useCallback((id: string, status: Briefing['status']) => {
    setBriefings(prev => 
      prev.map(briefing => 
        briefing.id === id ? { ...briefing, status } : briefing
      )
    );
  }, []);

  const deleteBriefing = useCallback((id: string) => {
    setBriefings(prev => prev.filter(briefing => briefing.id !== id));
  }, []);

  const createProjectFromBriefing = useCallback((briefing: Briefing) => {
    // In a real implementation, this would create a project in the database
    // For now, we just mark the briefing as having a project created
    setBriefings(prev => 
      prev.map(b => 
        b.id === briefing.id ? { ...b, projectCreated: true } : b
      )
    );
    
    // Return a fake project ID (in a real implementation, this would be the actual project ID)
    return `P${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
  }, []);

  return {
    briefings,
    addBriefing,
    updateBriefingStatus,
    deleteBriefing,
    createProjectFromBriefing
  };
};
