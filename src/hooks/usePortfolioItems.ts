
import { useState } from 'react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  clientName: string;
  date: string;
  views?: number; // Added views property
  featured?: boolean;
}

export const usePortfolioItems = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'Tema Comercial para Marca Premium',
      category: 'Publicidade',
      description: 'Música original para campanha de marca de luxo, com elementos orquestrais e modernos.',
      imageUrl: '/images/portfolio/portfolio-1.jpg',
      audioUrl: '/audio/example-track-1.mp3',
      clientName: 'Brand Premium',
      date: '2024-03-15',
      views: 156,
      featured: true
    },
    {
      id: '2',
      title: 'Soundtrack para Documentário',
      category: 'Audiovisual',
      description: 'Composição ambiental para documentário sobre natureza selvagem.',
      imageUrl: '/images/portfolio/portfolio-2.jpg',
      audioUrl: '/audio/example-track-2.mp3',
      clientName: 'Nature Films',
      date: '2024-02-28',
      views: 98
    },
    {
      id: '3',
      title: 'Jingle para Lançamento de Produto',
      category: 'Publicidade',
      description: 'Jingle memorável criado para o lançamento de um novo produto de tecnologia.',
      imageUrl: '/images/portfolio/portfolio-3.jpg',
      audioUrl: '/audio/example-track-3.mp3',
      clientName: 'TechCorp',
      date: '2024-01-20',
      views: 213,
      featured: true
    },
    {
      id: '4',
      title: 'Música para Podcast Corporativo',
      category: 'Podcasts',
      description: 'Vinheta e tema musical para podcast de negócios e empreendedorismo.',
      imageUrl: '/images/portfolio/portfolio-4.jpg',
      audioUrl: '/audio/example-track-4.mp3',
      clientName: 'Business Insights',
      date: '2023-12-05',
      views: 87
    }
  ]);

  const addPortfolioItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const id = (portfolioItems.length + 1).toString();
    setPortfolioItems([...portfolioItems, { ...newItem, id, views: 0 }]);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(
      portfolioItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  };

  return {
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
