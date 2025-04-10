
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_FOLDERS } from '@/services/googleDriveService';

interface DriveAudioFile {
  id: string;
  name: string;
  category?: string;
  type?: string;
  previewUrl?: string;
}

// Falsos IDs de arquivo no Google Drive para demonstração
const DEMO_AUDIO_FILES: DriveAudioFile[] = [
  { 
    id: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl', 
    name: 'Piano Suave - Prévia', 
    category: 'Piano',
    type: 'preview' 
  },
  { 
    id: '1A3BYgCu3KpqK9A5oELuUbw3k8QlWNLlf', 
    name: 'Violino Emocional', 
    category: 'Cordas',
    type: 'full' 
  },
  { 
    id: '1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW', 
    name: 'Violão Acústico', 
    category: 'Violão',
    type: 'preview' 
  },
  { 
    id: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a', 
    name: 'Tema Orquestral', 
    category: 'Orquestra',
    type: 'full' 
  }
];

export function useGoogleDriveAudio() {
  const [audioFiles, setAudioFiles] = useState<DriveAudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Carregar arquivos de áudio do Google Drive
  useEffect(() => {
    const fetchAudioFiles = async () => {
      setIsLoading(true);
      try {
        // Em uma implementação real, você faria uma chamada para a API do Google Drive
        // Aqui, estamos usando dados fictícios para demonstração
        setTimeout(() => {
          setAudioFiles(DEMO_AUDIO_FILES);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        toast({
          title: "Erro ao carregar arquivos",
          description: "Não foi possível obter os arquivos de áudio do Google Drive.",
          variant: "destructive",
        });
      }
    };

    fetchAudioFiles();
  }, [toast]);

  // Filtrar arquivos por categoria
  const filterByCategory = (category: string) => {
    return audioFiles.filter(file => file.category === category);
  };

  // Filtrar arquivos por tipo (prévia ou completo)
  const filterByType = (type: 'preview' | 'full') => {
    return audioFiles.filter(file => file.type === type);
  };

  // Obter arquivo por ID
  const getFileById = (id: string) => {
    return audioFiles.find(file => file.id === id);
  };

  // Obter URL de visualização do Google Drive
  const getViewUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/view`;
  };

  // Obter URL de download direto do Google Drive
  const getDownloadUrl = (fileId: string) => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  return {
    audioFiles,
    isLoading,
    error,
    filterByCategory,
    filterByType,
    getFileById,
    getViewUrl,
    getDownloadUrl,
    audioFolderUrl: STORAGE_FOLDERS.audio
  };
}
