
import { useState, useEffect } from 'react';
import { AudioSample } from '@/types/audio';
import { useToast } from "@/hooks/use-toast";

export const useAudioSamples = () => {
  const { toast } = useToast();
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    localStorage.getItem('zapierWebhookUrl') || ''
  );

  useEffect(() => {
    // In a real implementation, this would fetch from a database
    // For now, we'll use mock data stored in localStorage
    const savedData = localStorage.getItem('audioSamples');
    if (savedData) {
      setAudioSamples(JSON.parse(savedData));
    } else {
      // Initialize with sample data if nothing exists
      const sampleData: AudioSample[] = [
        {
          id: "001",
          title: "Música Romântica",
          style: "MPB",
          mood: "Romântico",
          occasion: "Casamento",
          audio_url: "https://example.com/audio/musica-romantica.mp3",
          preview_duration: "15s"
        },
        {
          id: "002",
          title: "Celebração Familiar",
          style: "Pop",
          mood: "Alegria",
          occasion: "Aniversário",
          audio_url: "https://example.com/audio/celebracao-familiar.mp3",
          preview_duration: "15s"
        }
      ];
      setAudioSamples(sampleData);
      localStorage.setItem('audioSamples', JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveWebhookUrl = () => {
    localStorage.setItem('zapierWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddSample = (newSample: Omit<AudioSample, 'id' | 'created_at'>) => {
    const newId = (audioSamples.length + 1).toString().padStart(3, '0');
    const sampleWithId = {
      ...newSample,
      id: newId,
      created_at: new Date().toISOString()
    };
    
    const updatedSamples = [...audioSamples, sampleWithId];
    setAudioSamples(updatedSamples);
    localStorage.setItem('audioSamples', JSON.stringify(updatedSamples));
    
    toast({
      title: "Amostra adicionada",
      description: `A amostra "${newSample.title}" foi adicionada com sucesso.`,
    });
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
