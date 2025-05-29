
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

export const mockProjectsData: ProjectItem[] = [
  {
    id: 'P0001',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    packageType: 'essencial',
    createdAt: '20/01/2024',
    status: 'waiting',
    versions: 1,
    previewUrl: '/client-preview/abc123',
    expirationDate: '20/02/2024',
    lastActivityDate: '20/01/2024',
    description: 'Música personalizada para aniversário',
    versionsList: [
      {
        id: 'v1',
        name: 'Versão 1',
        description: 'Primeira versão do projeto',
        audioUrl: 'https://example.com/audio1.mp3',
        recommended: true,
        dateAdded: '20/01/2024',
        final: false
      }
    ]
  },
  {
    id: 'P0002',
    clientName: 'Maria Santos',
    clientEmail: 'maria@email.com',
    packageType: 'profissional',
    createdAt: '18/01/2024',
    status: 'feedback',
    versions: 2,
    previewUrl: '/client-preview/def456',
    expirationDate: '18/02/2024',
    lastActivityDate: '22/01/2024',
    description: 'Trilha sonora para casamento',
    feedback: 'Gostaria de uma versão mais romântica',
    versionsList: [
      {
        id: 'v1',
        name: 'Versão 1',
        description: 'Versão inicial',
        audioUrl: 'https://example.com/audio2.mp3',
        recommended: false,
        dateAdded: '18/01/2024',
        final: false
      },
      {
        id: 'v2',
        name: 'Versão 2',
        description: 'Versão com ajustes',
        audioUrl: 'https://example.com/audio3.mp3',
        recommended: true,
        dateAdded: '22/01/2024',
        final: false
      }
    ]
  }
];
