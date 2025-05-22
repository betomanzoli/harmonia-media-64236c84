
import { OrderData } from './types';

export const mockOrderData: OrderData[] = [
  {
    orderId: 'HAR-2025-1001',
    clientName: 'Roberto Silva',
    packageType: 'Premium',
    status: 'Em Andamento',
    currentStep: 3,
    orderDate: '10/05/2025',
    expectedDelivery: '24/05/2025',
    previewLink: '/preview/HAR-2025-1001',
    progress: [
      {
        step: 1,
        status: 'completed',
        title: 'Briefing',
        description: 'Seu briefing foi recebido e aprovado',
        icon: 'FileText',
        date: '10/05/2025'
      },
      {
        step: 2,
        status: 'completed',
        title: 'Análise Musical',
        description: 'Definição do conceito e direção da música',
        icon: 'BookOpen',
        date: '12/05/2025'
      },
      {
        step: 3,
        status: 'current',
        title: 'Composição',
        description: 'Criação da melodia e estrutura musical',
        icon: 'Music',
        date: null
      },
      {
        step: 4,
        status: 'pending',
        title: 'Produção',
        description: 'Arranjo e produção musical',
        icon: 'Settings',
        date: null
      },
      {
        step: 5,
        status: 'pending',
        title: 'Finalização',
        description: 'Mixagem e masterização final',
        icon: 'Check',
        date: null
      }
    ],
    hasPreview: false,
    pendingAction: null
  },
  {
    orderId: 'HAR-2025-1002',
    clientName: 'Ana Oliveira',
    packageType: 'Profissional',
    status: 'Aguardando Avaliação',
    currentStep: 4,
    orderDate: '05/05/2025',
    expectedDelivery: '19/05/2025',
    previewLink: '/preview/HAR-2025-1002',
    progress: [
      {
        step: 1,
        status: 'completed',
        title: 'Briefing',
        description: 'Seu briefing foi recebido e aprovado',
        icon: 'FileText',
        date: '05/05/2025'
      },
      {
        step: 2,
        status: 'completed',
        title: 'Análise Musical',
        description: 'Definição do conceito e direção da música',
        icon: 'BookOpen',
        date: '07/05/2025'
      },
      {
        step: 3,
        status: 'completed',
        title: 'Composição',
        description: 'Criação da melodia e estrutura musical',
        icon: 'Music',
        date: '10/05/2025'
      },
      {
        step: 4,
        status: 'current',
        title: 'Prévias',
        description: 'Versões para sua avaliação estão prontas',
        icon: 'Headphones',
        date: '15/05/2025'
      },
      {
        step: 5,
        status: 'pending',
        title: 'Finalização',
        description: 'Mixagem e masterização final',
        icon: 'Check',
        date: null
      }
    ],
    hasPreview: true,
    pendingAction: 'feedback'
  },
  {
    orderId: 'HAR-2025-1003',
    clientName: 'Carlos Santos',
    packageType: 'Essencial',
    status: 'Concluído',
    currentStep: 5,
    orderDate: '01/05/2025',
    expectedDelivery: '15/05/2025',
    previewLink: '/preview/HAR-2025-1003',
    progress: [
      {
        step: 1,
        status: 'completed',
        title: 'Briefing',
        description: 'Seu briefing foi recebido e aprovado',
        icon: 'FileText',
        date: '01/05/2025'
      },
      {
        step: 2,
        status: 'completed',
        title: 'Análise Musical',
        description: 'Definição do conceito e direção da música',
        icon: 'BookOpen',
        date: '03/05/2025'
      },
      {
        step: 3,
        status: 'completed',
        title: 'Composição',
        description: 'Criação da melodia e estrutura musical',
        icon: 'Music',
        date: '07/05/2025'
      },
      {
        step: 4,
        status: 'completed',
        title: 'Prévias',
        description: 'Versões para sua avaliação foram aprovadas',
        icon: 'Headphones',
        date: '10/05/2025'
      },
      {
        step: 5,
        status: 'completed',
        title: 'Finalização',
        description: 'Entrega final realizada',
        icon: 'Check',
        date: '14/05/2025'
      }
    ],
    hasPreview: true,
    pendingAction: null
  }
];
