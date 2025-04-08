
import { useState, useEffect } from 'react';
import { AudioSample } from '@/types/audio';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { manageWebhookUrls } from '@/services/googleDriveService';

// Mock audio samples for offline development
const mockAudioSamples: AudioSample[] = [
  {
    id: '1',
    title: 'Guitar Melody',
    style: 'Acoustic',
    mood: 'Calm',
    occasion: 'Relaxation',
    audio_url: 'https://example.com/samples/guitar-melody.mp3',
    preview_duration: '0:45',
    description: 'Acoustic guitar melody in G major',
    url: 'https://example.com/samples/guitar-melody.mp3',
    duration: 45,
    category: 'Acoustic',
    tags: ['guitar', 'melody', 'acoustic'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Piano Ballad',
    style: 'Classical',
    mood: 'Emotional',
    occasion: 'Reflection',
    audio_url: 'https://example.com/samples/piano-ballad.mp3',
    preview_duration: '2:00',
    description: 'Emotional piano ballad in C minor',
    url: 'https://example.com/samples/piano-ballad.mp3',
    duration: 120,
    category: 'Classical',
    tags: ['piano', 'ballad', 'emotional'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Electronic Beat',
    style: 'Electronic',
    mood: 'Energetic',
    occasion: 'Party',
    audio_url: 'https://example.com/samples/electronic-beat.mp3',
    preview_duration: '1:00',
    description: 'Modern electronic beat at 120 BPM',
    url: 'https://example.com/samples/electronic-beat.mp3',
    duration: 60,
    category: 'Electronic',
    tags: ['electronic', 'beat', 'modern'],
    created_at: new Date().toISOString()
  }
];

export function useAudioSamples() {
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [folderUrl, setFolderUrl] = useState('');

  useEffect(() => {
    const offlineMode = sessionStorage.getItem('offline-admin-mode');
    setIsOfflineMode(offlineMode === 'true');
    
    // Get audio database storage URL
    const dbStorageUrl = manageWebhookUrls.get('audio_database_storage');
    setStorageUrl(dbStorageUrl || null);
    
    // Set folder URL from Google Drive service
    const audioFolderUrl = "https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg";
    setFolderUrl(audioFolderUrl);
    
    fetchAudioSamples();
    
    // Listen for offline mode changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offline-admin-mode') {
        setIsOfflineMode(event.newValue === 'true');
        fetchAudioSamples();
      } else if (event.key === 'audio_database_storage_webhookUrl') {
        const newUrl = manageWebhookUrls.get('audio_database_storage');
        setStorageUrl(newUrl || null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchAudioSamples = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if in offline mode
      const offlineMode = sessionStorage.getItem('offline-admin-mode');
      if (offlineMode === 'true') {
        // Use mock data in offline mode
        setAudioSamples(mockAudioSamples);
        setIsLoading(false);
        return;
      }

      // Otherwise, try to fetch from Supabase
      try {
        // Fixed Supabase query chain
        const response = await supabase
          .from('audio_samples')
          .select('*');
          
        if (response.error) throw new Error(response.error.message);
        
        setAudioSamples(response.data || []);
      } catch (dbError) {
        console.error('Database error:', dbError);
        
        // Fallback to mock data if database fetch fails
        toast({
          title: "Erro ao conectar ao banco de dados",
          description: "Usando dados de demonstração locais.",
          variant: "destructive",
        });
        
        setAudioSamples(mockAudioSamples);
        
        // Store offline mode in session storage
        sessionStorage.setItem('offline-admin-mode', 'true');
        setIsOfflineMode(true);
      }
    } catch (e) {
      setError(e as Error);
      
      // Fallback to mock data on error
      setAudioSamples(mockAudioSamples);
    } finally {
      setIsLoading(false);
    }
  };

  const addAudioSample = async (newSample: Omit<AudioSample, 'id' | 'created_at'>) => {
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        const mockId = Date.now().toString();
        const sampleWithId: AudioSample = {
          ...newSample,
          id: mockId,
          created_at: new Date().toISOString()
        };
        
        setAudioSamples(prevSamples => [sampleWithId, ...prevSamples]);
        
        toast({
          title: "Amostra de áudio adicionada",
          description: "Amostra adicionada em modo offline.",
        });
        
        return { success: true, data: sampleWithId };
      }

      // Add to Supabase
      const response = await supabase
        .from('audio_samples')
        .insert([{ ...newSample, created_at: new Date().toISOString() }]);
        
      if (response.error) throw new Error(response.error.message);
      
      // Fetch the updated samples
      fetchAudioSamples();
      
      toast({
        title: "Amostra de áudio adicionada",
        description: "Amostra adicionada com sucesso ao banco de dados.",
      });
      
      return { success: true, data: newSample };
    } catch (e) {
      const error = e as Error;
      
      toast({
        title: "Erro ao adicionar amostra",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };

  const deleteAudioSample = async (id: string) => {
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        setAudioSamples(prevSamples => prevSamples.filter(sample => sample.id !== id));
        
        toast({
          title: "Amostra removida",
          description: "Amostra removida em modo offline.",
        });
        
        return { success: true };
      }

      // Delete from Supabase
      const response = await supabase
        .from('audio_samples')
        .delete()
        .eq('id', id);

      if (response.error) throw new Error(response.error.message);
      
      setAudioSamples(prevSamples => prevSamples.filter(sample => sample.id !== id));
      
      toast({
        title: "Amostra removida",
        description: "Amostra removida com sucesso do banco de dados.",
      });
      
      return { success: true };
    } catch (e) {
      const error = e as Error;
      
      toast({
        title: "Erro ao remover amostra",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };

  const searchAudioSamples = async (query: string, category?: string) => {
    setIsLoading(true);
    
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        const filteredSamples = mockAudioSamples.filter(sample => {
          const matchesQuery = sample.title.toLowerCase().includes(query.toLowerCase()) || 
                            (sample.description && sample.description.toLowerCase().includes(query.toLowerCase())) ||
                            (sample.tags && sample.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
          
          const matchesCategory = !category || sample.category === category;
          
          return matchesQuery && matchesCategory;
        });
        
        setAudioSamples(filteredSamples);
        setIsLoading(false);
        return { success: true, data: filteredSamples };
      }

      // Search from Supabase with fixed query chain
      let response = await supabase
        .from('audio_samples')
        .select('*');
      
      if (response.error) throw new Error(response.error.message);
      
      // Filter data manually in JavaScript
      let data = response.data || [];
      
      if (query) {
        data = data.filter((item: AudioSample) => 
          item.title.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (category) {
        data = data.filter((item: AudioSample) => 
          item.style === category || item.mood === category || item.occasion === category
        );
      }
      
      setAudioSamples(data);
      return { success: true, data };
    } catch (e) {
      const error = e as Error;
      setError(error);
      
      // Fallback to filtered mock data
      const filteredSamples = mockAudioSamples.filter(sample => {
        const matchesQuery = sample.title.toLowerCase().includes(query.toLowerCase()) || 
                          (sample.description && sample.description.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = !category || sample.category === category;
        
        return matchesQuery && matchesCategory;
      });
      
      setAudioSamples(filteredSamples);
      
      return { success: false, error, data: filteredSamples };
    } finally {
      setIsLoading(false);
    }
  };

  // API URL generation function
  const getApiUrl = () => {
    return `https://api.harmonia.ai/audio-samples?key=demo123`;
  };

  // JSON data generation
  const getJsonData = () => {
    return JSON.stringify(audioSamples, null, 2);
  };

  // Copy to clipboard utility
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  // Webhook URL management
  const saveWebhookUrl = () => {
    manageWebhookUrls.save('audio_database_storage', webhookUrl);
    toast({
      title: "URL do webhook salva",
      description: "A URL do webhook foi configurada com sucesso.",
    });
  };

  // Function to open storage folder
  const openFolder = () => {
    window.open(folderUrl, '_blank');
  };

  // For backward compatibility with existing code
  const handleAddSample = addAudioSample;
  const deleteSample = deleteAudioSample;

  return {
    audioSamples,
    isLoading,
    error,
    isOfflineMode,
    storageUrl,
    fetchAudioSamples,
    addAudioSample,
    deleteAudioSample,
    searchAudioSamples,
    // Additional properties needed by AudioDatabase.tsx
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
