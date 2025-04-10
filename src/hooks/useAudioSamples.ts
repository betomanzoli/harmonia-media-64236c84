
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AudioSample } from '@/types/audio';
import { getMockAudioSamples } from './audio/useMockAudioData';
import { useToast } from './use-toast';

export const useAudioSamples = () => {
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();
  const folderUrl = 'https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i';

  useEffect(() => {
    // Load audio samples from localStorage or mock data
    const loadSamples = () => {
      const savedSamples = localStorage.getItem('audio_samples');
      if (savedSamples) {
        setAudioSamples(JSON.parse(savedSamples));
      } else {
        // Use mock data if no saved samples exist
        setAudioSamples(getMockAudioSamples());
      }
      setIsLoading(false);
    };

    // Load webhook URL from localStorage
    const loadWebhookUrl = () => {
      const savedUrl = localStorage.getItem('audio_webhookUrl');
      if (savedUrl) {
        setWebhookUrl(savedUrl);
      }
    };

    loadSamples();
    loadWebhookUrl();
  }, []);

  // Save samples to local storage when updated
  useEffect(() => {
    if (audioSamples.length > 0) {
      localStorage.setItem('audio_samples', JSON.stringify(audioSamples));
    }
  }, [audioSamples]);

  const saveWebhookUrl = () => {
    localStorage.setItem('audio_webhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL de webhook foi salva com sucesso."
    });
  };

  const handleAddSample = (sample: Omit<AudioSample, "id" | "created_at">) => {
    const newSample: AudioSample = {
      ...sample,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };

    setAudioSamples([...audioSamples, newSample]);
    toast({
      title: "Amostra adicionada",
      description: "A amostra de áudio foi adicionada com sucesso."
    });
  };

  const deleteSample = (id: string) => {
    setAudioSamples(audioSamples.filter(sample => sample.id !== id));
    toast({
      title: "Amostra removida",
      description: "A amostra de áudio foi removida com sucesso."
    });
  };

  const getApiUrl = () => {
    return `${window.location.origin}/api/audio-samples`;
  };

  const getJsonData = () => {
    // Convert to simpler format for API
    const apiData = audioSamples.map(sample => ({
      id: sample.id,
      title: sample.title,
      url: sample.url,
      genre: sample.genre,
      duration: sample.duration
    }));
    
    return JSON.stringify(apiData, null, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "O texto foi copiado para a área de transferência."
    });
  };

  const openFolder = () => {
    if (folderUrl) {
      window.open(folderUrl, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "URL da pasta não configurada.",
        variant: "destructive"
      });
    }
  };

  return {
    audioSamples,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddSample,
    deleteSample,
    getApiUrl,
    getJsonData,
    copyToClipboard,
    folderUrl,
    openFolder
  };
};
