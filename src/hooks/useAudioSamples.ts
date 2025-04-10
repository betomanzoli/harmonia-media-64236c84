
import { useState, useEffect } from 'react';
import { AudioSample } from '@/types/audio';
import { useToast } from '@/hooks/use-toast';

// Mock data for audio samples
const mockAudioSamples = [
  { id: '1', title: 'Piano Solo', genre: 'Classical', url: '/samples/piano-solo.mp3', duration: '2:45' },
  { id: '2', title: 'Guitar Riff', genre: 'Rock', url: '/samples/guitar-riff.mp3', duration: '1:30' },
  { id: '3', title: 'Electronic Beat', genre: 'Electronic', url: '/samples/electronic-beat.mp3', duration: '3:15' },
  { id: '4', title: 'Violin Concerto', genre: 'Classical', url: '/samples/violin-concerto.mp3', duration: '4:20' },
  { id: '5', title: 'Jazz Ensemble', genre: 'Jazz', url: '/samples/jazz-ensemble.mp3', duration: '5:10' },
];

export function useAudioSamples() {
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [folderUrl, setFolderUrl] = useState('https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAudioSamples(mockAudioSamples as any);
      setIsLoading(false);
    }, 1000);
    
    // Check offline mode
    const offlineMode = sessionStorage.getItem('offline-admin-mode') === 'true';
    setIsOfflineMode(offlineMode);
    
    // Get webhook URL from local storage if available
    const savedWebhookUrl = localStorage.getItem('audio_webhookUrl');
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
  }, []);

  // Function to handle adding a new audio sample
  const handleAddSample = (newSample: AudioSample) => {
    setAudioSamples((prevSamples) => [...prevSamples, { ...newSample, id: String(prevSamples.length + 1) }]);
    toast({
      title: "Amostra adicionada",
      description: "A nova amostra de áudio foi adicionada com sucesso."
    });
  };

  // Function to delete an audio sample
  const deleteSample = (id: string) => {
    setAudioSamples((prevSamples) => prevSamples.filter(sample => sample.id !== id));
    toast({
      title: "Amostra excluída",
      description: "A amostra de áudio foi excluída com sucesso."
    });
  };

  // Function to save webhook URL
  const saveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('audio_webhookUrl', url);
    toast({
      title: "Webhook configurado",
      description: "A URL do webhook foi salva com sucesso."
    });
  };

  // Function to get API URL
  const getApiUrl = () => {
    return `${window.location.origin}/api/audio-samples`;
  };

  // Function to get JSON data
  const getJsonData = () => {
    return JSON.stringify(audioSamples, null, 2);
  };

  // Function to copy content to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado para a área de transferência",
      description: "O conteúdo foi copiado para a área de transferência."
    });
  };

  // Function to open folder in Google Drive
  const openFolder = () => {
    window.open(folderUrl, '_blank');
  };

  return {
    audioSamples,
    isLoading,
    error,
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
}

export default useAudioSamples;
