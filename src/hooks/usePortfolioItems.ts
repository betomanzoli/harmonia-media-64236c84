
import { useState, useEffect } from 'react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export function usePortfolioItems() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        setPortfolioItems(JSON.parse(savedItems));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddItem = (newItem: Omit<PortfolioItem, 'id' | 'createdAt'> & { persistData?: boolean, id?: string }) => {
    const { persistData, ...itemData } = newItem;
    
    const id = itemData.id || `item-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    
    const item: PortfolioItem = {
      ...itemData as any,
      id,
      createdAt
    };
    
    setPortfolioItems(prev => {
      const updatedItems = [...prev, item];
      if (persistData) {
        localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
      }
      return updatedItems;
    });
    
    return id;
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => {
      const updatedItems = prev.filter(item => item.id !== id);
      localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  return {
    portfolioItems,
    handleAddItem,
    deletePortfolioItem,
    updatePortfolioItem,
    isLoading
  };
}
