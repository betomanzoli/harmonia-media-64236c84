
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AudioSample } from '@/types/audio';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const useAudioSamples = () => {
  const { toast } = useToast();
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    localStorage.getItem('zapierWebhookUrl') || ''
  );

  useEffect(() => {
    fetchAudioSamples();
  }, []);

  const fetchAudioSamples = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se a tabela existe
      const { data: tableExists } = await supabase
        .from('audio_samples')
        .select('count')
        .limit(1);
      
      if (tableExists !== null) {
        // Tabela existe, buscar dados
        const { data, error } = await supabase
          .from('audio_samples')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setAudioSamples(data);
        } else {
          // Se não houver dados, inicializar com dados de exemplo
          initializeAudioSamples();
        }
      } else {
        // Se tabela não existe, usar localStorage temporariamente
        const savedData = localStorage.getItem('audioSamples');
        if (savedData) {
          setAudioSamples(JSON.parse(savedData));
        } else {
          // Inicializar com dados de exemplo
          initializeAudioSamples();
        }
      }
    } catch (error) {
      console.error('Erro ao buscar amostras de áudio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as amostras de áudio.",
        variant: "destructive",
      });
      
      // Fallback para localStorage
      const savedData = localStorage.getItem('audioSamples');
      if (savedData) {
        setAudioSamples(JSON.parse(savedData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAudioSamples = async () => {
    const sampleData: AudioSample[] = [
      {
        id: uuidv4(),
        title: "Música Romântica",
        style: "MPB",
        mood: "Romântico",
        occasion: "Casamento",
        audio_url: "https://example.com/audio/musica-romantica.mp3",
        preview_duration: "15s",
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: "Celebração Familiar",
        style: "Pop",
        mood: "Alegria",
        occasion: "Aniversário",
        audio_url: "https://example.com/audio/celebracao-familiar.mp3",
        preview_duration: "15s",
        created_at: new Date().toISOString()
      }
    ];
    
    try {
      // Tentar salvar no Supabase
      const { error } = await supabase
        .from('audio_samples')
        .insert(sampleData);
        
      if (error) throw error;
      
      setAudioSamples(sampleData);
    } catch (error) {
      console.error('Erro ao inicializar amostras de áudio:', error);
      // Fallback para localStorage
      localStorage.setItem('audioSamples', JSON.stringify(sampleData));
      setAudioSamples(sampleData);
    }
  };

  const saveWebhookUrl = () => {
    localStorage.setItem('zapierWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddSample = async (newSample: Omit<AudioSample, 'id' | 'created_at'>) => {
    const sampleWithId = {
      ...newSample,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    try {
      // Tentar salvar no Supabase
      const { error } = await supabase
        .from('audio_samples')
        .insert(sampleWithId);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setAudioSamples(prev => [sampleWithId, ...prev]);
      
      toast({
        title: "Amostra adicionada",
        description: `A amostra "${newSample.title}" foi adicionada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar amostra de áudio:', error);
      
      // Fallback para localStorage
      const updatedSamples = [sampleWithId, ...audioSamples];
      localStorage.setItem('audioSamples', JSON.stringify(updatedSamples));
      setAudioSamples(updatedSamples);
      
      toast({
        title: "Amostra adicionada localmente",
        description: `A amostra foi salva localmente devido a um erro na conexão com o servidor.`,
      });
    }
  };

  const getApiUrl = () => {
    return `${window.location.origin}/api/audio-samples`;
  };

  const getJsonData = () => {
    return JSON.stringify(audioSamples, null, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Os dados foram copiados para a área de transferência.",
    });
  };

  return {
    audioSamples,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddSample,
    getApiUrl,
    getJsonData,
    copyToClipboard
  };
};
