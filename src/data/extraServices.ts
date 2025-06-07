
import { Music2, FileText, Volume2, Clock, FileMusic, UserCheck, Headphones, Archive, Edit, Users, Shuffle } from 'lucide-react';

export const extraServicesData = [
  {
    id: 'Multiestilo',
    title: 'Multiestilo',
    price: 59,
    description: 'Crie a mesma letra em estilos diferentes para diferentes ocasiões.',
    features: [
      'Prazo: Até 3 dias úteis após a solicitação',
      '3 versões do mesmo texto em novo estilo musical',
      'Disponível para todos os pacotes'
    ],
    icon: Shuffle
  },
  {
    id: 'Multiestilo+',
    title: 'Multiestilo+',
    price: 79,
    description: 'Versão premium com mais opções e maior personalização musical.',
    features: [
      'Prazo: Até 3 dias úteis após a solicitação',
      '5 versões do mesmo texto em novo estilo musical',
      'Disponível para todos os pacotes'
    ],
    icon: Users
  },
  {
    id: 'Revisão Extra',
    title: 'Revisão Extra',
    price: 59,
    description: 'Solicite ajustes extras na letra ou melodia da sua música.',
    features: [
      'Alterações na letra ou melodia',
      'Prazo: Até 2 dias úteis',
      'Disponível por até 90 dias após a entrega'
    ],
    icon: Edit
  },
  {
    id: 'Registro na BN (Letra)',
    title: 'Registro na BN (Letra)',
    price: 99,
    description: 'Proteja legalmente a letra da sua música com registro na Biblioteca Nacional.',
    features: [
      'Registro oficial da letra',
      'Certificado de autoria',
      'Proteção legal garantida'
    ],
    icon: FileText
  },
  {
    id: 'Registro UBC',
    title: 'Registro UBC',
    price: 249,
    description: 'Registro completo na UBC (letra, melodia, arranjo) com código ISWC.',
    features: [
      'Registro completo da obra',
      'Código ISWC para direitos autorais',
      'Habilitação para royalties'
    ],
    icon: UserCheck
  },
  {
    id: 'Masterização Premium',
    title: 'Masterização Premium',
    price: 129,
    description: 'Melhore a qualidade sonora com masterização avançada.',
    features: [
      'Masterização profissional',
      'Formato WAV 24-bit',
      'Otimização para streaming'
    ],
    icon: Volume2
  },
  {
    id: 'Stems Separados',
    title: 'Stems Separados',
    price: 129,
    description: 'Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade.',
    features: [
      'Vocal principal isolado',
      'Instrumentos separados',
      'Maior controle de mixagem'
    ],
    icon: Music2
  },
  {
    id: 'Entrega Expressa',
    title: 'Entrega Expressa',
    price: 149,
    description: 'Priorize seu projeto e receba sua música finalizada em até 48 horas.',
    features: [
      'Entrega prioritária',
      'Prazo: 48 horas',
      'Suporte dedicado'
    ],
    icon: Clock
  },
  {
    id: 'Partituras MusicXML/PDF',
    title: 'Partituras MusicXML/PDF',
    price: 129,
    description: 'Receba a partitura completa da sua música para músicos e bandas.',
    features: [
      'Partitura em PDF e MusicXML',
      'Notação musical completa',
      'Compatível com softwares musicais'
    ],
    icon: FileMusic
  },
  {
    id: 'Composição sem IA (letra)',
    title: 'Composição sem IA (letra)',
    price: 499,
    description: 'Composição 100% humana da letra da sua música.',
    features: [
      'Letra criada por letrista profissional',
      '100% composição humana',
      'Processo criativo personalizado'
    ],
    icon: Edit
  },
  {
    id: 'Composição sem IA (letra + melodia)',
    title: 'Composição sem IA (letra + melodia)',
    price: 1499,
    description: 'Composição 100% humana da letra e melodia, incluindo partitura completa.',
    features: [
      'Letra e melodia por compositores',
      'Partitura completa incluída',
      'Processo totalmente artesanal'
    ],
    icon: Music2
  },
  {
    id: 'Composição sem IA (letra + melodia + gravação)',
    title: 'Composição sem IA (completa)',
    price: 'Consultar',
    description: 'Composição 100% humana com letra, melodia e gravação profissional.',
    features: [
      'Composição e gravação humana',
      'Músicos profissionais',
      'Orçamento personalizado'
    ],
    icon: Headphones
  }
];
