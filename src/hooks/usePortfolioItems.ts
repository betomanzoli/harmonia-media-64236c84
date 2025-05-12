
import { useState, useEffect } from 'react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  clientName: string;
  date: string;
  views?: number;
  featured?: boolean;
  // Add the missing properties that are being referenced in other components
  subtitle?: string;
  genre?: string;
  type?: string;
  audioSrc?: string;
  portfolioType?: 'example' | 'comparison' | 'stem';
  instrumentType?: string;
  comparisonDescription?: string;
  persistData?: boolean;
}

export const usePortfolioItems = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar itens do localStorage na inicialização
  useEffect(() => {
    setIsLoading(true);
    
    // Itens padrão do sistema
    const defaultItems: PortfolioItem[] = [
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
        featured: true,
        subtitle: 'Música para Campanha',
        genre: 'Orquestral/Moderno',
        type: 'instrumental',
        audioSrc: '/audio/example-track-1.mp3',
        portfolioType: 'example'
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
        views: 98,
        subtitle: 'Música para Documentário',
        genre: 'Ambiental',
        type: 'instrumental',
        audioSrc: '/audio/example-track-2.mp3',
        portfolioType: 'example'
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
        featured: true,
        subtitle: 'Jingle Promocional',
        genre: 'Pop/Eletrônico',
        type: 'vocal',
        audioSrc: '/audio/example-track-3.mp3',
        portfolioType: 'example'
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
        views: 87,
        subtitle: 'Tema para Podcast',
        genre: 'Corporativo',
        type: 'instrumental',
        audioSrc: '/audio/example-track-4.mp3',
        portfolioType: 'example'
      }
    ];
    
    try {
      // Carregar itens salvos pelo usuário do localStorage
      const savedItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
      console.log('Carregados', savedItems.length, 'itens do localStorage');
      
      // Combinar itens padrão com itens salvos
      const combinedItems = [...defaultItems, ...savedItems.map((item: any, index: number) => ({
        ...item,
        id: `saved-${index + 1}` // Garantir IDs únicos para itens salvos
      }))];
      
      setPortfolioItems(combinedItems);
    } catch (error) {
      console.error('Erro ao carregar itens do portfólio:', error);
      setPortfolioItems(defaultItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPortfolioItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const id = `new-${Date.now()}`;
    const itemWithId = { ...newItem, id, views: 0 };
    
    setPortfolioItems(prev => [...prev, itemWithId]);
    
    // Se o item deve ser persistido, salvar no localStorage
    if (newItem.persistData) {
      const savedItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
      localStorage.setItem('portfolio-items', JSON.stringify([...savedItems, itemWithId]));
    }
    
    return id;
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(
      portfolioItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    
    // Atualizar também no localStorage se for um item persistido
    if (id.startsWith('saved-') || id.startsWith('new-')) {
      const savedItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
      const updatedItems = savedItems.map((item: any) => 
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem('portfolio-items', JSON.stringify(updatedItems));
    }
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    
    // Remover também do localStorage se for um item persistido
    if (id.startsWith('saved-') || id.startsWith('new-')) {
      const savedItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
      const filteredItems = savedItems.filter((item: any) => item.id !== id);
      localStorage.setItem('portfolio-items', JSON.stringify(filteredItems));
    }
  };
  
  // Alias para addPortfolioItem para manter compatibilidade
  const handleAddItem = addPortfolioItem;

  return {
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    isLoading,
    handleAddItem
  };
};
