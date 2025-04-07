
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

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
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      setIsLoading(true);
      
      // Primeiro, verificar se a tabela existe
      const countResponse = await supabase
        .from('portfolio_items')
        .select('count')
        .limit(1);
      
      if (countResponse?.data !== null) {
        // Tabela existe, buscar dados
        const response = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (response.error) throw response.error;
        
        if (response.data && response.data.length > 0) {
          setPortfolioItems(response.data);
        } else {
          // Se não houver dados, inicializar com dados de exemplo
          initializePortfolioItems();
        }
      } else {
        // Se tabela não existe, usar localStorage temporariamente
        const savedData = localStorage.getItem('portfolioItems');
        if (savedData) {
          setPortfolioItems(JSON.parse(savedData));
        } else {
          // Inicializar com dados de exemplo
          initializePortfolioItems();
        }
      }
    } catch (error) {
      console.error('Erro ao buscar itens do portfólio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens do portfólio.",
        variant: "destructive",
      });
      
      // Fallback para localStorage
      const savedData = localStorage.getItem('portfolioItems');
      if (savedData) {
        setPortfolioItems(JSON.parse(savedData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initializePortfolioItems = async () => {
    const sampleData: PortfolioItem[] = [
      {
        id: uuidv4(),
        title: "Aniversário de 50 Anos",
        subtitle: "Homenagem para pai",
        genre: "MPB",
        type: "vocal",
        audioSrc: "https://example.com/audio/aniversario-50.mp3",
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: "Casamento Maria e João",
        subtitle: "Primeira dança",
        genre: "Pop",
        type: "instrumental",
        audioSrc: "https://example.com/audio/casamento-maria-joao.mp3",
        created_at: new Date().toISOString()
      }
    ];
    
    try {
      // Tentar salvar no Supabase
      const { error } = await supabase
        .from('portfolio_items')
        .insert(sampleData);
        
      if (error) throw error;
      
      setPortfolioItems(sampleData);
    } catch (error) {
      console.error('Erro ao inicializar itens do portfólio:', error);
      // Fallback para localStorage
      localStorage.setItem('portfolioItems', JSON.stringify(sampleData));
      setPortfolioItems(sampleData);
    }
  };

  const saveWebhookUrl = () => {
    localStorage.setItem('portfolioWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddItem = async (newItem: Omit<PortfolioItem, 'id'>) => {
    const itemWithId = {
      ...newItem,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    try {
      // Tentar salvar no Supabase
      const { error } = await supabase
        .from('portfolio_items')
        .insert(itemWithId);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setPortfolioItems(prev => [itemWithId, ...prev]);
      
      toast({
        title: "Item adicionado",
        description: `O item "${newItem.title}" foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar item ao portfólio:', error);
      
      // Fallback para localStorage
      const updatedItems = [itemWithId, ...portfolioItems];
      localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
      setPortfolioItems(updatedItems);
      
      toast({
        title: "Item adicionado localmente",
        description: `O item foi salvo localmente devido a um erro na conexão com o servidor.`,
      });
    }
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
