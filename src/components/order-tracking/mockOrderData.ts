
import React from 'react';
import { OrderData } from './types';
import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';

// Mock data (this would normally be fetched from an API)
export const MOCK_ORDERS: Record<string, OrderData> = {
  'HAR2025001': {
    orderId: 'HAR-2025-0001',
    clientName: 'João Silva',
    packageType: 'Profissional',
    orderDate: '05/04/2025',
    currentStep: 5,
    status: 'Aguardando Aprovação',
    expectedDelivery: '20/04/2025',
    previewLink: '/previews/preview123',
    progress: [
      {
        step: 1,
        status: 'completed' as const,
        title: 'Qualificação Inicial',
        description: 'Formulário preenchido e necessidades identificadas',
        icon: React.createElement(FileText),
        date: '05/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Profissional selecionado',
        icon: React.createElement(Package),
        date: '05/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: React.createElement(CreditCard),
        date: '05/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: React.createElement(MessageSquare),
        date: '06/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: React.createElement(Music),
        date: '08/04/2025'
      },
      {
        step: 6,
        status: 'current' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimorando a composição',
        icon: React.createElement(Headphones),
        date: '10/04/2025'
      },
      {
        step: 7,
        status: 'pending' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: React.createElement(FileCheck)
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: React.createElement(Settings)
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: React.createElement(Music)
      }
    ]
  },
  'HAR2025002': {
    orderId: 'HAR-2025-0002',
    clientName: 'Maria Oliveira',
    packageType: 'Premium',
    orderDate: '03/04/2025',
    currentStep: 7,
    status: 'Esperando Feedback',
    expectedDelivery: '18/04/2025',
    previewLink: '/previews/preview456',
    progress: [
      {
        step: 1,
        status: 'completed' as const,
        title: 'Qualificação Inicial',
        description: 'Formulário preenchido e necessidades identificadas',
        icon: React.createElement(FileText),
        date: '03/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Premium selecionado',
        icon: React.createElement(Package),
        date: '03/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: React.createElement(CreditCard),
        date: '03/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: React.createElement(MessageSquare),
        date: '04/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: React.createElement(Music),
        date: '05/04/2025'
      },
      {
        step: 6,
        status: 'completed' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimoraram a composição',
        icon: React.createElement(Headphones),
        date: '07/04/2025'
      },
      {
        step: 7,
        status: 'current' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: React.createElement(FileCheck),
        date: '08/04/2025'
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: React.createElement(Settings)
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: React.createElement(Music)
      }
    ]
  }
};
