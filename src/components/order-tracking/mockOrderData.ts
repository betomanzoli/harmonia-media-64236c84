
import { OrderData } from './types';
import React from 'react';
import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';

// Função auxiliar para criar elementos de ícone de forma segura
const iconMap = {
  fileText: 'FileText',
  package: 'Package',
  creditCard: 'CreditCard',
  messageSquare: 'MessageSquare',
  music: 'Music',
  headphones: 'Headphones',
  fileCheck: 'FileCheck',
  settings: 'Settings'
};

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
        icon: iconMap.fileText,
        date: '05/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Profissional selecionado',
        icon: iconMap.package,
        date: '05/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: iconMap.creditCard,
        date: '05/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: iconMap.messageSquare,
        date: '06/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: iconMap.music,
        date: '08/04/2025'
      },
      {
        step: 6,
        status: 'current' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimorando a composição',
        icon: iconMap.headphones,
        date: '10/04/2025'
      },
      {
        step: 7,
        status: 'pending' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: iconMap.fileCheck
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: iconMap.settings
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: iconMap.music
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
        icon: iconMap.fileText,
        date: '03/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Premium selecionado',
        icon: iconMap.package,
        date: '03/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: iconMap.creditCard,
        date: '03/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: iconMap.messageSquare,
        date: '04/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: iconMap.music,
        date: '05/04/2025'
      },
      {
        step: 6,
        status: 'completed' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimoraram a composição',
        icon: iconMap.headphones,
        date: '07/04/2025'
      },
      {
        step: 7,
        status: 'current' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: iconMap.fileCheck,
        date: '08/04/2025'
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: iconMap.settings
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: iconMap.music
      }
    ]
  }
};
