
import { ProjectItem } from '@/types/project.types';

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
      client_phone: "(11) 99999-9999", // Add client phone
      project_title: "Música Personalizada - João Silva",
      package_type: "Premium",
      created_at: "10/04/2025",
      status: "waiting",
      versions: 2,
      previews: [], // Use previews instead of previewUrl
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: today.toLocaleDateString('pt-BR'),
      versionsList: [
        {
          id: "v1",
          name: "Versão Acústica",
          title: "Versão Acústica",
          description: "Versão com violão e voz, arranjo minimalista",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
          created_at: new Date("2025-04-10").toISOString(),
          recommended: false,
          file_id: "audio1",
          final_version_url: "",
          stems_url: ""
        },
        {
          id: "v2",
          name: "Versão Completa",
          title: "Versão Completa",
          description: "Versão com banda completa, arranjo final sugerido",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
          created_at: new Date("2025-04-12").toISOString(),
          recommended: true,
          file_id: "audio2",
          final_version_url: "",
          stems_url: ""
        }
      ],
      feedback_history: [],
      history: [],
      
      // Add camelCase aliases
      clientName: "João Silva",
      clientEmail: "joao.silva@email.com",
      clientPhone: "(11) 99999-9999",
      projectTitle: "Música Personalizada - João Silva",
      packageType: "Premium",
      createdAt: "10/04/2025",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: today.toLocaleDateString('pt-BR')
    },
    {
      id: "P0002",
      client_name: "Maria Oliveira",
      client_email: "maria.oliveira@email.com",
      client_phone: "(11) 98888-8888", // Add client phone
      project_title: "Música Personalizada - Maria Oliveira",
      package_type: "Essencial",
      created_at: "05/04/2025",
      status: "feedback",
      versions: 1,
      previews: [], // Use previews instead of previewUrl
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: lastWeek.toLocaleDateString('pt-BR'),
      versionsList: [
        {
          id: "v1",
          name: "Versão Demo",
          title: "Versão Demo",
          description: "Primeira versão para avaliação",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          created_at: new Date("2025-04-05").toISOString(),
          recommended: true,
          file_id: "audio3",
          final_version_url: "",
          stems_url: ""
        }
      ],
      feedback_history: [
        {
          id: "fb1",
          project_id: "P0002",
          comment: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem.",
          content: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem.",
          created_at: new Date().toISOString(),
          status: "pending"
        }
      ],
      history: [],
      
      // Add camelCase aliases
      clientName: "Maria Oliveira",
      clientEmail: "maria.oliveira@email.com",
      clientPhone: "(11) 98888-8888",
      projectTitle: "Música Personalizada - Maria Oliveira",
      packageType: "Essencial",
      createdAt: "05/04/2025",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: lastWeek.toLocaleDateString('pt-BR'),
      feedbackHistory: [
        {
          id: "fb1",
          project_id: "P0002",
          comment: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem.",
          content: "Gostei muito da melodia, mas gostaria que o ritmo fosse um pouco mais rápido e que os vocais estivessem mais presentes na mixagem.",
          created_at: new Date().toISOString(),
          status: "pending"
        }
      ]
    },
    {
      id: "P0003",
      client_name: "Carlos Santos",
      client_email: "carlos.santos@email.com",
      client_phone: "(11) 97777-7777", // Add client phone
      project_title: "Música Personalizada - Carlos Santos",
      package_type: "Profissional",
      created_at: "01/04/2025",
      status: "approved",
      versions: 3,
      previews: [], // Use previews instead of previewUrl
      expiration_date: expirationDate.toLocaleDateString('pt-BR'),
      last_activity_date: "03/04/2025",
      versionsList: [
        {
          id: "v1",
          name: "Versão Inicial",
          title: "Versão Inicial",
          description: "Primeiro conceito da música",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
          created_at: new Date("2025-04-01").toISOString(),
          recommended: false,
          file_id: "audio4",
          final_version_url: "",
          stems_url: ""
        },
        {
          id: "v2",
          name: "Versão Revisada",
          title: "Versão Revisada",
          description: "Ajustes após primeiro feedback",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
          created_at: new Date("2025-04-02").toISOString(),
          recommended: false,
          file_id: "audio5",
          final_version_url: "",
          stems_url: ""
        },
        {
          id: "v3",
          name: "Versão Final",
          title: "Versão Final",
          description: "Versão aprovada pelo cliente",
          audio_url: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
          created_at: new Date("2025-04-03").toISOString(),
          recommended: true,
          file_id: "audio6",
          final_version_url: "https://example.com/final/P0003-final.mp3",
          stems_url: "https://example.com/stems/P0003-stems.zip"
        }
      ],
      feedback_history: [],
      history: [],
      
      // Add camelCase aliases
      clientName: "Carlos Santos",
      clientEmail: "carlos.santos@email.com",
      clientPhone: "(11) 97777-7777",
      projectTitle: "Música Personalizada - Carlos Santos",
      packageType: "Profissional",
      createdAt: "01/04/2025",
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: "03/04/2025"
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
