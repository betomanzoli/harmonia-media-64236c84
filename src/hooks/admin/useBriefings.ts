
import { useState, useEffect } from 'react';

export interface Briefing {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  packageType: string;
  description: string;
  references?: string[];
  musicStyle?: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'approved';
  notes?: string;
}

export function useBriefings() {
  const [briefings, setBriefings] = useState<Briefing[]>([
    {
      id: 'BR001',
      name: 'João Silva',
      email: 'joao@example.com',
      phoneNumber: '(11) 99999-9999',
      packageType: 'Profissional',
      description: 'Música para aniversário de casamento de 10 anos com estilo romântico.',
      references: ['Música 1 - Artista X', 'Música 2 - Artista Y'],
      musicStyle: 'Romântico',
      createdAt: '10/05/2023',
      status: 'pending'
    },
    {
      id: 'BR002',
      name: 'Maria Santos',
      email: 'maria@example.com',
      packageType: 'Premium',
      description: 'Composição para vídeo institucional de empresa de tecnologia.',
      references: ['Música corporativa exemplo'],
      musicStyle: 'Corporativo',
      createdAt: '15/05/2023',
      status: 'completed',
      notes: 'Cliente solicitou estilo mais moderno'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const loadBriefings = () => {
    setIsLoading(true);
    // In a real app, this would be an API call to load briefings
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const createBriefing = (newBriefing: Omit<Briefing, 'id' | 'createdAt' | 'status'>) => {
    const briefing: Briefing = {
      ...newBriefing,
      id: `BR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toLocaleDateString(),
      status: 'pending'
    };
    setBriefings([briefing, ...briefings]);
    return briefing;
  };

  const updateBriefing = (id: string, updates: Partial<Briefing>) => {
    setBriefings(briefings.map(briefing => 
      briefing.id === id ? { ...briefing, ...updates } : briefing
    ));
  };

  const deleteBriefing = (id: string) => {
    setBriefings(briefings.filter(briefing => briefing.id !== id));
  };

  useEffect(() => {
    loadBriefings();
  }, []);

  return {
    briefings,
    isLoading,
    loadBriefings,
    createBriefing,
    updateBriefing,
    deleteBriefing
  };
}
