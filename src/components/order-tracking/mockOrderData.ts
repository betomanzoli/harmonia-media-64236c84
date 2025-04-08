
import { OrderData, OrderProgressStatus, OrderProgressStep } from './types';

export const mockOrderData: OrderData[] = [
  {
    orderId: "HAR-2025-1001",
    clientName: "João Silva",
    packageType: "profissional",
    status: "Em Produção",
    currentStep: 3,
    orderDate: "01/03/2025",
    expectedDelivery: "20/05/2025",
    previewLink: "/previews/HAR-2025-1001",
    progress: [
      {
        step: 1,
        title: "Briefing Recebido",
        description: "Seu briefing foi recebido e está sendo analisado pela nossa equipe.",
        date: "01/03/2025",
        status: "completed" as OrderProgressStatus,
        icon: "FileText"
      },
      {
        step: 2,
        title: "Análise Inicial",
        description: "Nossa equipe analisou seu briefing e definiu a abordagem criativa.",
        date: "05/03/2025",
        status: "completed" as OrderProgressStatus,
        icon: "Package"
      },
      {
        step: 3,
        title: "Composição",
        description: "Nossos compositores estão trabalhando na sua música personalizada.",
        date: "10/03/2025",
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
  },
  {
    orderId: "HAR-2025-1002",
    clientName: "Maria Oliveira",
    packageType: "premium",
    status: "Aguardando Feedback",
    currentStep: 5,
    orderDate: "15/02/2025",
    expectedDelivery: "15/05/2025",
    previewLink: "/previews/HAR-2025-1002",
    hasPreview: true,
    pendingAction: "feedback",
    progress: [
      {
        step: 1,
        title: "Briefing Recebido",
        description: "Seu briefing foi recebido e está sendo analisado pela nossa equipe.",
        date: "15/02/2025",
        status: "completed" as OrderProgressStatus,
        icon: "FileText"
      },
      {
        step: 2,
        title: "Análise Inicial",
        description: "Nossa equipe analisou seu briefing e definiu a abordagem criativa.",
        date: "18/02/2025",
        status: "completed" as OrderProgressStatus,
        icon: "Package"
      },
      {
        step: 3,
        title: "Composição",
        description: "Nossos compositores trabalharam na sua música personalizada.",
        date: "25/02/2025",
        status: "completed" as OrderProgressStatus,
        icon: "Music"
      },
      {
        step: 4,
        title: "Produção",
        description: "Fase de arranjo e produção musical da sua composição.",
        date: "05/03/2025",
        status: "completed" as OrderProgressStatus,
        icon: "Settings"
      },
      {
        step: 5,
        title: "Apresentação",
        description: "Prévias da sua música estão prontas para sua avaliação.",
        date: "10/03/2025",
        status: "current" as OrderProgressStatus,
        icon: "Headphones"
      }
    ]
  }
];
