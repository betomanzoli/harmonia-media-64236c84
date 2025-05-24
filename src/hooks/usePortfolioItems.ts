
import { useState } from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  musicStyle: string;
  projectType: string;
  featured: boolean;
}

export function usePortfolioItems() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 'port-001',
      title: 'Música para Casamento - João e Maria',
      description: 'Composição romântica personalizada para cerimônia de casamento.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      audioUrl: 'https://example.com/audio/casamento-joao-maria.mp3',
      musicStyle: 'Pop/Romântico',
      projectType: 'Eventos',
      featured: true
    },
    {
      id: 'port-002',
      title: 'Trilha para Vídeo Institucional - TechCorp',
      description: 'Música corporativa para vídeo de apresentação empresarial.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      audioUrl: 'https://example.com/audio/techcorp-institucional.mp3',
      musicStyle: 'Corporativo/Eletrônico',
      projectType: 'Vídeos',
      featured: false
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = (item: Partial<PortfolioItem> & { persistData?: boolean }) => {
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: item.title || 'Item sem título',
      description: item.description || '',
      imageUrl: item.imageUrl || 'https://via.placeholder.com/300',
      audioUrl: item.audioUrl || '',
      musicStyle: item.musicStyle || '',
      projectType: item.projectType || 'Outros',
      featured: item.featured || false
    };

    setPortfolioItems(prev => [...prev, newItem]);
    return newItem.id;
  };

  const updatePortfolioItem = (id: string, updatedItem: Partial<PortfolioItem>) => {
    setPortfolioItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    portfolioItems,
    isLoading,
    handleAddItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
}
