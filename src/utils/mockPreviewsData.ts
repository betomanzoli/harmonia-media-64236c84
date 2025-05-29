
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
    previewUrl: '',
    expirationDate: '20/02/2024',
    lastActivityDate: '20/01/2024',
    description: 'Música personalizada para aniversário',
    versionsList: []
  }
];
