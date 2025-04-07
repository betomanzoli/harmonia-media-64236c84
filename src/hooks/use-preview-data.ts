
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}

export interface PreviewProjectData {
  projectId: string;
  clientName: string;
  packageType: string;
  creationDate: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: MusicPreview[];
}

// Simulando dados para desenvolvimento
const MOCK_DATA: Record<string, PreviewProjectData> = {
  'HAR-2025-0001': {
    projectId: 'HAR-2025-0001',
    clientName: 'João Silva',
    packageType: 'Profissional',
    creationDate: '05/04/2025',
    status: 'waiting',
    versions: [
      {
        id: 'v1',
        title: 'Versão Acústica',
        description: 'Esta versão apresenta uma abordagem mais acústica, com violão e piano como instrumentos principais. A melodia é suave e a progressão harmônica segue um padrão mais tradicional do pop contemporâneo.',
        audioUrl: '/samples/preview1.mp3',
        recommended: true
      },
      {
        id: 'v2',
        title: 'Versão Eletrônica',
        description: 'Esta versão incorpora elementos eletrônicos com sintetizadores e batidas programadas. Mantém a mesma estrutura melódica da versão 1, mas com uma produção mais moderna e dançante.',
        audioUrl: '/samples/preview2.mp3'
      },
      {
        id: 'v3',
        title: 'Versão Orquestral',
        description: 'Esta versão apresenta arranjos orquestrais com cordas e metais, criando uma atmosfera mais cinematográfica. A estrutura da música é mais elaborada, com introdução e ponte expandidas.',
        audioUrl: '/samples/preview3.mp3'
      }
    ]
  },
  'HAR-2025-0002': {
    projectId: 'HAR-2025-0002',
    clientName: 'Maria Oliveira',
    packageType: 'Premium',
    creationDate: '06/04/2025',
    status: 'feedback',
    versions: [
      {
        id: 'v1',
        title: 'Versão Pop',
        description: 'Versão pop contemporânea com elementos de piano e bateria eletrônica.',
        audioUrl: '/samples/preview4.mp3'
      },
      {
        id: 'v2',
        title: 'Versão Minimalista',
        description: 'Versão minimalista com piano solo e leves elementos ambientes.',
        audioUrl: '/samples/preview5.mp3',
        recommended: true
      }
    ]
  }
};

export const usePreviewData = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<PreviewProjectData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Em produção, aqui seria uma chamada à API
    if (projectId && MOCK_DATA[projectId]) {
      setProjectData(MOCK_DATA[projectId]);
    } else {
      toast({
        title: "Projeto não encontrado",
        description: "O código de projeto fornecido não é válido.",
        variant: "destructive"
      });
    }
  }, [projectId, toast]);

  return { projectData, setProjectData };
};
