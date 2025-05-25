
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
      client_name: "João Silva",
      client_email: "joao.silva@email.com",
      package_type: "Premium",
      created_at: "10/04/2025",
      status: "waiting",
      versions: 2,
      preview_url: "/preview/P0001",
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: today.toLocaleDateString('pt-BR'),
      versions_list: [
        {
          id: "v1",
          name: "Versão Acústica",
          description: "Versão com violão e voz, arranjo minimalista",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
          dateAdded: "10/04/2025",
          recommended: false
        },
        {
          id: "v2",
          name: "Versão Completa",
          description: "Versão com banda completa, arranjo final sugerido",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
          dateAdded: "12/04/2025",
          recommended: true
        }
      ]
    },
    {
      id: "P0002",
      client_name: "Maria Oliveira",
      client_email: "maria.oliveira@email.com",
      package_type: "Essencial",
      created_at: "05/04/2025",
      status: "feedback",
      versions: 1,
      preview_url: "/preview/P0002",
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: lastWeek.toLocaleDateString('pt-BR'),
      versions_list: [
        {
          id: "v1",
          name: "Versão Demo",
          description: "Primeira versão para avaliação",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          dateAdded: "05/04/2025",
          recommended: true
        }
      ],
      feedback: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem."
    },
    {
      id: "P0003",
      client_name: "Carlos Santos",
      client_email: "carlos.santos@email.com",
      package_type: "Profissional",
      created_at: "01/04/2025",
      status: "approved",
      versions: 3,
      preview_url: "/preview/P0003",
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: "03/04/2025",
      versions_list: [
        {
          id: "v1",
          name: "Versão Inicial",
          description: "Primeiro conceito da música",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
          dateAdded: "01/04/2025",
          recommended: false
        },
        {
          id: "v2",
          name: "Versão Revisada",
          description: "Ajustes após primeiro feedback",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
          dateAdded: "02/04/2025",
          recommended: false
        },
        {
          id: "v3",
          name: "Versão Final",
          description: "Versão aprovada pelo cliente",
          audioUrl: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          dateAdded: "03/04/2025",
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
