import { useState, useEffect } from 'react';
import { AudioSample } from '@/types/audio';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { manageWebhookUrls } from '@/services/googleDriveService';
import { mockAudioSamples } from './audio/useMockAudioData';
import { useAudioOperations } from './audio/useAudioOperations';
import { useAudioUtils } from './audio/useAudioUtils';
import { useWebhookManager } from './audio/useWebhookManager';

export function useAudioSamples() {
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [folderUrl, setFolderUrl] = useState('');

  // Get helper hooks
  const { addAudioSample, deleteAudioSample, searchAudioSamples } = useAudioOperations(isOfflineMode);
  const { webhookUrl, setWebhookUrl, saveWebhookUrl } = useWebhookManager();
  const { getApiUrl, getJsonData, copyToClipboard, openFolder } = useAudioUtils();

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
        const { data, error } = await supabase
          .from('audio_samples')
          .select('*');
          
        if (error) throw new Error(error.message);
        
        setAudioSamples(data || []);
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

  // Create specific JSON data for current audioSamples
  const getJsonDataForCurrentSamples = () => {
    return getJsonData(audioSamples);
  };

  // For backward compatibility with existing code
  const handleAddSample = async (newSample: Omit<AudioSample, 'id' | 'created_at'>) => {
    const result = await addAudioSample(newSample);
    if (result.success) {
      await fetchAudioSamples();
    }
    return result;
  };

  const deleteSample = async (id: string) => {
    const result = await deleteAudioSample(id);
    if (result.success) {
      setAudioSamples(prevSamples => prevSamples.filter(sample => sample.id !== id));
    }
    return result;
  };

  // Wrapper for search that updates the state
  const handleSearchAudioSamples = async (query: string, category?: string) => {
    setIsLoading(true);
    const result = await searchAudioSamples(query, category);
    if (result.data) {
      setAudioSamples(result.data);
    }
    setIsLoading(false);
    return result;
  };

  // Open the current folder
  const handleOpenFolder = () => {
    openFolder(folderUrl);
  };

  return {
    audioSamples,
    isLoading,
    error,
    isOfflineMode,
    storageUrl,
    fetchAudioSamples,
    addAudioSample,
    deleteAudioSample,
    searchAudioSamples: handleSearchAudioSamples,
    // Additional properties needed by AudioDatabase.tsx
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddSample,
    deleteSample,
    getApiUrl,
    getJsonData: getJsonDataForCurrentSamples,
    copyToClipboard,
    folderUrl,
    openFolder: handleOpenFolder
  };
}
