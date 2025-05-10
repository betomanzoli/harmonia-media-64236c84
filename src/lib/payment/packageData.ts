
export type PackageId = 'essencial' | 'premium' | 'profissional';

export interface PackageDetails {
  id: PackageId;
  name: string;
  price: number | string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const packageData: Record<PackageId, PackageDetails> = {
  essencial: {
    id: 'essencial',
    name: 'Pacote Essencial',
    price: 219,
    description: 'Ideal para presentes emocionais rápidos.',
    features: [
      "Composição musical única",
      "Uma revisão gratuita",
      "Uso exclusivamente pessoal",
      "Entrega digital em até 7 dias",
      "Suporte por e-mail",
      "Arquivo digital em alta qualidade (MP3/WAV)",
      "Certificado digital de autoria"
    ]
  },
  profissional: {
    id: 'profissional',
    name: 'Pacote Profissional',
    price: 479,
    description: 'Perfeito para criadores de conteúdo e pequenos negócios.',
    features: [
      "Composição musical personalizada",
      "Até três revisões gratuitas",
      "Licença para uso em conteúdo digital próprio",
      "Três versões para escolha",
      "Entrega em até 5 dias",
      "Suporte prioritário",
      "Masterização básica IA",
      "Stems separados (vocais + instrumentação)"
    ],
    recommended: true
  },
  premium: {
    id: 'premium',
    name: 'Pacote Premium',
    price: 969,
    description: 'Melhor opção para empresas e projetos corporativos.',
    features: [
      "Composição totalmente personalizada",
      "Revisões ilimitadas (até aprovação)",
      "Cessão total dos direitos autorais",
      "Cinco versões para escolha",
      "Registro na Biblioteca Nacional",
      "Certificado blockchain",
      "Consultoria de 30 minutos",
      "Entrega prioritária",
      "Suporte VIP por WhatsApp",
      "Partitura em formato MusicXML"
    ]
  }
};

export const extraServices = [
  {
    id: 'recording',
    name: 'Gravação Profissional',
    price: 249,
    description: 'Gravação com cantores profissionais em estúdio.',
    paymentLink: 'https://mpago.la/1Fyqdcw'
  },
  {
    id: 'mastering',
    name: 'Masterização Premium',
    price: 129,
    description: 'Masterização profissional para qualidade de estúdio.',
    paymentLink: 'https://mpago.la/21iE6Zp'
  },
  {
    id: 'express',
    name: 'Entrega Expressa',
    price: 99,
    description: 'Receba sua música em apenas 48 horas.',
    paymentLink: 'https://mpago.la/113Dotr'
  },
  {
    id: 'video',
    name: 'Visualizador de Áudio',
    price: 149,
    description: 'Video simples com letra da música para compartilhar.',
    paymentLink: 'https://mpago.la/2bJ7gs5'
  },
  {
    id: 'copyright',
    name: 'Registro de Direitos Autorais',
    price: 79,
    description: 'Registro oficial da composição na Biblioteca Nacional.',
    paymentLink: 'https://mpago.la/23WDA5a'
  },
  {
    id: 'musicsheet',
    name: 'Partitura Completa',
    price: 499,
    description: 'Partitura completa da música para todos os instrumentos.',
    paymentLink: 'https://mpago.la/2grZyHu'
  },
  {
    id: 'mvp',
    name: 'Videoclipe Profissional',
    price: 1499,
    description: 'Produção completa de videoclipe para sua música.',
    paymentLink: 'https://mpago.li/1gjwJZY'
  }
];
