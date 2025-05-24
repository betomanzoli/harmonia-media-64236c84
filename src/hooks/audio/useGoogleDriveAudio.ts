
import { useState, useEffect } from 'react';
import { STORAGE_FOLDERS } from '@/services/googleDriveService';

interface GoogleDriveAudio {
  id: string;
  name: string;
  category?: string;
  type: 'full' | 'preview';
}

export const useGoogleDriveAudio = (projectId?: string) => {
  const [audioFiles, setAudioFiles] = useState<GoogleDriveAudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pasta base no Google Drive para prévias
  const audioFolderUrl = `https://drive.google.com/drive/folders/${STORAGE_FOLDERS.PREVIEWS_BASE}`;
  
  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setIsLoading(true);
        
        // Simula a busca de arquivos de áudio do Google Drive
        // Em uma implementação real, isso usaria a API do Google Drive
        
        setTimeout(() => {
          // Dados de exemplo para a demonstração
          const mockFiles: GoogleDriveAudio[] = [
            { id: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl', name: 'Prévia Violão e Piano', category: 'Piano', type: 'preview' },
            { id: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a', name: 'Arranjo Orquestral', category: 'Orquestra', type: 'preview' },
            { id: '1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW', name: 'Versão Cordas', category: 'Cordas', type: 'preview' },
            { id: '1C7KkXjkMqNPM70KEBsmlCUHoKEKS9pDx', name: 'Versão Minimalista', category: 'Piano', type: 'preview' },
          ];
          
          setAudioFiles(mockFiles);
          setIsLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error('Erro ao buscar arquivos de áudio:', err);
        setError('Falha ao carregar arquivos de áudio. Por favor, tente novamente.');
        setIsLoading(false);
      }
    };
    
    fetchAudioFiles();
  }, [projectId]);
  
  // Função para obter URL de visualização do Google Drive
  const getViewUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/view`;
  };
  
  // Função para obter URL de download do Google Drive
  const getDownloadUrl = (fileId: string) => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };
  
  // Função para obter URL de stream do Google Drive
  const getStreamUrl = (fileId: string) => {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };
  
  // Em uma implementação real, esta função buscaria mais arquivos ou filtraria por categoria
  const searchFiles = (query: string) => {
    return audioFiles.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) || 
      file.category?.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return {
    audioFiles,
    isLoading,
    error,
    getViewUrl,
    getDownloadUrl,
    getStreamUrl,
    searchFiles,
    audioFolderUrl
  };
};
