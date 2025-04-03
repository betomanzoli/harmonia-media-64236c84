
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  type: string;
  audioSrc: string;
  created_at?: string;
}

export function usePortfolioItems() {
  const { toast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    localStorage.getItem('portfolioWebhookUrl') || ''
  );

  useEffect(() => {
    // In a real implementation, this would fetch from a database
    // For now, we'll use mock data stored in localStorage
    const savedData = localStorage.getItem('portfolioItems');
    if (savedData) {
      setPortfolioItems(JSON.parse(savedData));
    } else {
      // Initialize with sample data if nothing exists
      const sampleData: PortfolioItem[] = [
        {
          id: "001",
          title: "Aniversário de 50 Anos",
          subtitle: "Homenagem para pai",
          genre: "MPB",
          type: "vocal",
          audioSrc: "https://example.com/audio/aniversario-50.mp3",
        },
        {
          id: "002",
          title: "Casamento Maria e João",
          subtitle: "Primeira dança",
          genre: "Pop",
          type: "instrumental",
          audioSrc: "https://example.com/audio/casamento-maria-joao.mp3",
        }
      ];
      setPortfolioItems(sampleData);
      localStorage.setItem('portfolioItems', JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveWebhookUrl = () => {
    localStorage.setItem('portfolioWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const newId = (portfolioItems.length + 1).toString().padStart(3, '0');
    const itemWithId = {
      ...newItem,
      id: newId,
      created_at: new Date().toISOString()
    };
    
    const updatedItems = [...portfolioItems, itemWithId];
    setPortfolioItems(updatedItems);
    localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
    
    toast({
      title: "Item adicionado",
      description: `O item "${newItem.title}" foi adicionado com sucesso.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Os dados foram copiados para a área de transferência.",
    });
  };

  return {
    portfolioItems,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddItem,
    copyToClipboard
  };
}
