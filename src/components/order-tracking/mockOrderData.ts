import { OrderData, OrderProgressStatus, OrderProgressStep } from './types';
import { useProjects } from '@/hooks/admin/useProjects';
import { useClients } from '@/hooks/admin/useClients';

// Função para gerar dados de pedidos baseados em dados reais
export const generateOrderData = (projects: any[], clients: any[]): OrderData[] => {
  if (!projects || projects.length === 0) {
    // Fallback com dados genéricos se não houver projetos
    return [
      {
        orderId: "HAR-2025-1001",
        clientName: "Cliente Exemplo",
        packageType: "profissional",
        status: "Em Produção",
        currentStep: 3,
        orderDate: new Date().toLocaleDateString('pt-BR'),
        expectedDelivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        previewLink: "/client-preview/exemplo",
        progress: [
          {
            step: 1,
            title: "Briefing Recebido",
            description: "Seu briefing foi recebido e está sendo analisado pela nossa equipe.",
            date: new Date().toLocaleDateString('pt-BR'),
            status: "completed" as OrderProgressStatus,
            icon: "FileText"
          },
          {
            step: 2,
            title: "Análise Inicial",
            description: "Nossa equipe analisou seu briefing e definiu a abordagem criativa.",
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            status: "completed" as OrderProgressStatus,
            icon: "Package"
          },
          {
            step: 3,
            title: "Composição",
            description: "Nossos compositores estão trabalhando na sua música personalizada.",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            status: "current" as OrderProgressStatus,
            icon: "Music"
          },
          {
            step: 4,
            title: "Produção",
            description: "Fase de arranjo e produção musical da sua composição.",
            date: null,
            status: "pending" as OrderProgressStatus,
            icon: "Settings"
          },
          {
            step: 5,
            title: "Apresentação",
            description: "Prévias da sua música estão prontas para sua avaliação.",
            date: null,
            status: "pending" as OrderProgressStatus,
            icon: "Headphones"
          }
        ]
      }
    ];
  }

  // Gerar dados baseados em projetos reais
  return projects.slice(0, 10).map((project, index) => {
    const createdDate = new Date(project.created_at);
    const expectedDelivery = new Date(createdDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    
    // Determinar status baseado no status do projeto
    let status = "Em Produção";
    let currentStep = 3;
    
    switch (project.status) {
      case 'waiting':
        status = "Aguardando Feedback";
        currentStep = 5;
        break;
      case 'feedback':
        status = "Em Revisão";
        currentStep = 4;
        break;
      case 'approved':
        status = "Concluído";
        currentStep = 5;
        break;
      default:
        status = "Em Produção";
        currentStep = 3;
    }

    return {
      orderId: `HAR-2025-${(1000 + index + 1).toString()}`,
      clientName: project.client_name || "Cliente",
      packageType: project.package_type || "profissional",
      status,
      currentStep,
      orderDate: createdDate.toLocaleDateString('pt-BR'),
      expectedDelivery: expectedDelivery.toLocaleDateString('pt-BR'),
      previewLink: `/client-preview/${project.preview_code}`,
      hasPreview: project.versions && project.versions.length > 0,
      pendingAction: project.status === 'waiting' ? 'feedback' : undefined,
      progress: [
        {
          step: 1,
          title: "Briefing Recebido",
          description: "Seu briefing foi recebido e está sendo analisado pela nossa equipe.",
          date: createdDate.toLocaleDateString('pt-BR'),
          status: "completed" as OrderProgressStatus,
          icon: "FileText"
        },
        {
          step: 2,
          title: "Análise Inicial",
          description: "Nossa equipe analisou seu briefing e definiu a abordagem criativa.",
          date: new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          status: "completed" as OrderProgressStatus,
          icon: "Package"
        },
        {
          step: 3,
          title: "Composição",
          description: currentStep >= 3 ? "Nossos compositores trabalharam na sua música personalizada." : "Nossos compositores estão trabalhando na sua música personalizada.",
          date: currentStep >= 3 ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') : null,
          status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending" as OrderProgressStatus,
          icon: "Music"
        },
        {
          step: 4,
          title: "Produção",
          description: currentStep >= 4 ? "Fase de arranjo e produção musical concluída." : "Fase de arranjo e produção musical da sua composição.",
          date: currentStep >= 4 ? new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') : null,
          status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending" as OrderProgressStatus,
          icon: "Settings"
        },
        {
          step: 5,
          title: "Apresentação",
          description: currentStep >= 5 ? "Prévias da sua música estão prontas para sua avaliação." : "Prévias da sua música estarão prontas em breve.",
          date: currentStep >= 5 ? new Date(createdDate.getTime() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') : null,
          status: currentStep >= 5 ? "current" : "pending" as OrderProgressStatus,
          icon: "Headphones"
        }
      ]
    };
  });
};

// Hook para usar dados de pedidos baseados em dados reais
export const useOrderData = () => {
  const { projects } = useProjects();
  const { clients } = useClients();
  
  return generateOrderData(projects, clients);
};

// Manter compatibilidade com código existente
export const mockOrderData = generateOrderData([], []);
