
import { useState, useEffect } from 'react';

interface Briefing {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  packageType: string; // 'essencial', 'profissional', 'premium'
  description: string;
  musicStyle?: string;
  references?: string[];
  createdAt: string;
  projectCreated: boolean;
  status: 'pending' | 'completed' | 'approved';
  notes?: string;
}

export function useBriefings() {
  const [briefings, setBriefings] = useState<Briefing[]>([
    {
      id: 'brief_001',
      name: 'João Silva',
      email: 'joao@example.com',
      phoneNumber: '(11) 99999-9999',
      packageType: 'Premium',
      description: 'Música para casamento com temática romântica',
      musicStyle: 'Pop/Romântico',
      references: ['A Thousand Years - Christina Perri', 'Perfect - Ed Sheeran'],
      createdAt: '15/05/2023',
      projectCreated: false,
      status: 'pending'
    },
    {
      id: 'brief_002',
      name: 'Maria Santos',
      email: 'maria@example.com',
      phoneNumber: '(21) 98888-8888',
      packageType: 'Essencial',
      description: 'Música para vídeo institucional de empresa de tecnologia',
      musicStyle: 'Eletrônica/Corporativa',
      createdAt: '20/05/2023',
      projectCreated: true,
      status: 'completed'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // If data was fetched from API, we would set it here
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao carregar briefings');
      setIsLoading(false);
    }
  };

  const addBriefing = (briefingData: Partial<Briefing>) => {
    const newBriefing: Briefing = {
      id: `brief_${Date.now()}`,
      name: briefingData.name || '',
      email: briefingData.email || '',
      phoneNumber: briefingData.phoneNumber,
      packageType: briefingData.packageType || 'Essencial',
      description: briefingData.description || '',
      musicStyle: briefingData.musicStyle,
      references: briefingData.references,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      projectCreated: false,
      status: 'pending',
      notes: briefingData.notes
    };

    setBriefings([...briefings, newBriefing]);
    return newBriefing;
  };

  const updateBriefing = (id: string, updatedData: Partial<Briefing>) => {
    setBriefings(
      briefings.map(briefing => 
        briefing.id === id ? { ...briefing, ...updatedData } : briefing
      )
    );
  };

  const updateBriefingStatus = (id: string, status: 'pending' | 'completed' | 'approved') => {
    updateBriefing(id, { status });
  };

  const deleteBriefing = (id: string) => {
    setBriefings(briefings.filter(briefing => briefing.id !== id));
  };

  const createProjectFromBriefing = (briefing: Briefing) => {
    // Mark briefing as having a project
    updateBriefing(briefing.id, { projectCreated: true });
    
    // In a real app, this would create a project in the database
    // and return the project ID
    return `proj_${Date.now()}`;
  };

  useEffect(() => {
    fetchBriefings();
  }, []);

  return {
    briefings,
    isLoading,
    error,
    addBriefing,
    updateBriefing,
    updateBriefingStatus,
    deleteBriefing,
    createProjectFromBriefing,
    fetchBriefings
  };
}
