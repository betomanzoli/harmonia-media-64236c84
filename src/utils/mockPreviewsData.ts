
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

export const generateMockPreviews = (): ProjectItem[] => {
  const today = new Date();
  
  // Generate expiration date (30 days from now)
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 30);
  
  // Generate last week date for the activity
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  return [
    {
      id: "P0001",
      clientName: "João Silva",
      clientEmail: "joao.silva@email.com",
      packageType: "Premium",
      createdAt: "10/04/2025",
      status: "waiting",
      versions: 2,
      previewUrl: "/preview/P0001",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: today.toLocaleDateString('pt-BR'),
      versionsList: [
        {
          id: "v1",
          name: "Versão Acústica",
          description: "Versão com violão e voz, arranjo minimalista",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
          dateAdded: "10/04/2025",
          createdAt: new Date("2025-04-10").toISOString(), // Add the required createdAt property
          recommended: false
        },
        {
          id: "v2",
          name: "Versão Completa",
          description: "Versão com banda completa, arranjo final sugerido",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
          dateAdded: "12/04/2025",
          createdAt: new Date("2025-04-12").toISOString(), // Add the required createdAt property
          recommended: true
        }
      ]
    },
    {
      id: "P0002",
      clientName: "Maria Oliveira",
      clientEmail: "maria.oliveira@email.com",
      packageType: "Essencial",
      createdAt: "05/04/2025",
      status: "feedback",
      versions: 1,
      previewUrl: "/preview/P0002",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: lastWeek.toLocaleDateString('pt-BR'),
      versionsList: [
        {
          id: "v1",
          name: "Versão Demo",
          description: "Primeira versão para avaliação",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          dateAdded: "05/04/2025",
          createdAt: new Date("2025-04-05").toISOString(), // Add the required createdAt property
          recommended: true
        }
      ],
      feedback: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem."
    },
    {
      id: "P0003",
      clientName: "Carlos Santos",
      clientEmail: "carlos.santos@email.com",
      packageType: "Profissional",
      createdAt: "01/04/2025",
      status: "approved",
      versions: 3,
      previewUrl: "/preview/P0003",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: "03/04/2025",
      versionsList: [
        {
          id: "v1",
          name: "Versão Inicial",
          description: "Primeiro conceito da música",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
          dateAdded: "01/04/2025",
          createdAt: new Date("2025-04-01").toISOString(), // Add the required createdAt property
          recommended: false
        },
        {
          id: "v2",
          name: "Versão Revisada",
          description: "Ajustes após primeiro feedback",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
          dateAdded: "02/04/2025",
          createdAt: new Date("2025-04-02").toISOString(), // Add the required createdAt property
          recommended: false
        },
        {
          id: "v3",
          name: "Versão Final",
          description: "Versão aprovada pelo cliente",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          dateAdded: "03/04/2025",
          createdAt: new Date("2025-04-03").toISOString(), // Add the required createdAt property
          recommended: true
        }
      ]
    }
  ];
};

// Helper function to populate localStorage with mock data if it doesn't exist
export const initializeMockPreviewData = () => {
  const existingData = localStorage.getItem('harmonIA_preview_projects');
  
  if (!existingData || JSON.parse(existingData).length === 0) {
    const mockData = generateMockPreviews();
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(mockData));
    console.log('Mock preview data initialized');
    return mockData;
  }
  
  return JSON.parse(existingData);
};
