
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { notificationService } from '@/services/notificationService';

// Define types for preview data
export type PreviewStatus = 'waiting' | 'feedback' | 'approved';

export type Preview = {
  id: string;
  title: string;
  audioUrl: string;
  description?: string;
  tags?: string[];
  date: string;
};

export type ProjectData = {
  id: string;
  projectTitle: string;
  clientName: string;
  clientEmail?: string;
  briefDescription?: string;
  status: PreviewStatus;
  previews: Preview[];
  createdAt: string;
  updatedAt: string;
};

// Mock data
const mockProjects: Record<string, ProjectData> = {
  'P0001': {
    id: 'P0001',
    projectTitle: 'Podcast Intro - Tech Talk',
    clientName: 'Carlos Silva',
    clientEmail: 'carlos@example.com',
    briefDescription: 'Música para introdução de podcast sobre tecnologia',
    status: 'waiting',
    previews: [
      {
        id: 'v1',
        title: 'Versão 1 - Energética',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        description: 'Versão mais energética com bateria proeminente',
        tags: ['energética', 'moderna'],
        date: '2023-05-15'
      },
      {
        id: 'v2',
        title: 'Versão 2 - Minimalista',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        description: 'Abordagem mais minimalista com foco em sintetizadores',
        tags: ['minimalista', 'futurista'],
        date: '2023-05-15'
      },
      {
        id: 'v3',
        title: 'Versão 3 - Híbrida',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        description: 'Combinação de elementos orgânicos e eletrônicos',
        tags: ['híbrida', 'equilibrada'],
        date: '2023-05-15'
      }
    ],
    createdAt: '2023-05-10',
    updatedAt: '2023-05-15'
  },
  'P0002': {
    id: 'P0002',
    projectTitle: 'Vídeo Institucional - Eco Solutions',
    clientName: 'Maria Oliveira',
    clientEmail: 'maria@ecosolutions.com',
    briefDescription: 'Música para vídeo institucional de empresa de soluções sustentáveis',
    status: 'feedback',
    previews: [
      {
        id: 'v1',
        title: 'Versão Inspiradora',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        description: 'Tom inspirador com crescendo e cordas',
        tags: ['inspiradora', 'cordas'],
        date: '2023-06-20'
      },
      {
        id: 'v2',
        title: 'Versão Orgânica',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        description: 'Foco em instrumentos acústicos e orgânicos',
        tags: ['orgânica', 'acústica'],
        date: '2023-06-20'
      }
    ],
    createdAt: '2023-06-15',
    updatedAt: '2023-06-20'
  },
  'P0003': {
    id: 'P0003',
    projectTitle: 'Campanha Publicitária - Novo Produto',
    clientName: 'João Mendes',
    clientEmail: 'joao@agencia.com',
    briefDescription: 'Trilha para campanha de lançamento de produto inovador',
    status: 'waiting',
    previews: [
      {
        id: 'v1',
        title: 'Versão Impactante',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        description: 'Abordagem impactante com percussão marcante',
        tags: ['impactante', 'moderna'],
        date: '2023-07-05'
      },
      {
        id: 'v2',
        title: 'Versão Emocional',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        description: 'Tom mais emocional com piano e cordas',
        tags: ['emocional', 'suave'],
        date: '2023-07-05'
      }
    ],
    createdAt: '2023-07-01',
    updatedAt: '2023-07-05'
  }
};

// Types for notification service
type NotificationType = 
  | 'preview_viewed' 
  | 'feedback_received' 
  | 'preview_approved'
  | 'preview_access_attempt'  // Add this type to fix the error
  | 'preview_shared';

export const usePreviewData = (previewId?: string) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!previewId) {
      setIsLoading(false);
      return;
    }

    // Simulate API call to fetch project data
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching preview data for ID: ${previewId}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if the preview exists in our mock data
        const project = mockProjects[previewId];
        
        if (project) {
          console.log(`Preview found:`, project);
          setProjectData(project);
          
          // Notify that the preview was viewed
          notificationService.notify('preview_viewed', {
            projectId: previewId,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log(`Preview not found for ID: ${previewId}`);
          setProjectData(null);
          
          // Notify about failed access attempt
          notificationService.notify('preview_access_attempt', {
            attemptedId: previewId,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error fetching preview data:`, error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [previewId]);

  return { projectData, setProjectData, isLoading };
};

export default usePreviewData;
