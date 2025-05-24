
export type PackageId = 'essencial' | 'premium' | 'profissional';

export interface PackageDetails {
  id: PackageId;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

// Add PackageInfo interface that was referenced but missing
export interface PackageInfo {
  id: PackageId;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

// Export both getPackageDetails function and packageData object
export const getPackageDetails = (packageId: PackageId): PackageDetails => {
  switch (packageId) {
    case 'essencial':
      return {
        id: 'essencial',
        name: 'Pacote Essencial',
        price: 219,
        description: 'Ideal para presentes emocionais rápidos',
        features: [
          'Composição musical única',
          'Uma revisão gratuita',
          'Uso exclusivamente pessoal',
          'Entrega digital em até 7 dias',
          'Suporte por e-mail',
          'Arquivo digital em alta qualidade (MP3/WAV)',
          'Certificado digital de autoria'
        ]
      };
    
    case 'premium':
      return {
        id: 'premium',
        name: 'Pacote Premium',
        price: 969,
        description: 'Melhor opção para empresas e projetos corporativos',
        features: [
          'Composição totalmente personalizada',
          'Revisões ilimitadas (até aprovação)',
          'Cessão total dos direitos autorais',
          'Cinco versões para escolha',
          'Registro na Biblioteca Nacional',
          'Certificado blockchain',
          'Consultoria de 30 minutos',
          'Entrega prioritária',
          'Suporte VIP por WhatsApp',
          'Partitura em formato MusicXML'
        ]
      };
    
    case 'profissional':
      return {
        id: 'profissional',
        name: 'Pacote Profissional',
        price: 479,
        description: 'Perfeito para criadores de conteúdo e pequenos negócios',
        popular: true,
        features: [
          'Composição musical personalizada',
          'Até três revisões gratuitas',
          'Licença para uso em conteúdo digital próprio',
          'Três versões para escolha',
          'Entrega em até 5 dias',
          'Suporte prioritário',
          'Masterização básica IA',
          'Stems separados (vocais + instrumentação)'
        ]
      };
  }
};

// Add packageData object for direct access to all packages
export const packageData: Record<PackageId, PackageInfo> = {
  essencial: {
    id: 'essencial',
    name: 'Pacote Essencial',
    price: 'R$ 219,00',
    description: 'Ideal para presentes emocionais rápidos.',
    features: [
      'Composição musical única',
      'Uma revisão gratuita',
      'Uso exclusivamente pessoal',
      'Entrega digital em até 7 dias',
      'Suporte por e-mail',
      'Arquivo digital em alta qualidade (MP3/WAV)',
      'Certificado digital de autoria'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Pacote Premium',
    price: 'R$ 969,00',
    description: 'Melhor opção para empresas e projetos corporativos.',
    features: [
      'Composição totalmente personalizada',
      'Revisões ilimitadas (até aprovação)',
      'Cessão total dos direitos autorais',
      'Cinco versões para escolha',
      'Registro na Biblioteca Nacional',
      'Certificado blockchain',
      'Consultoria de 30 minutos',
      'Entrega prioritária',
      'Suporte VIP por WhatsApp',
      'Partitura em formato MusicXML'
    ]
  },
  profissional: {
    id: 'profissional',
    name: 'Pacote Profissional',
    price: 'R$ 479,00',
    description: 'Perfeito para criadores de conteúdo e pequenos negócios.',
    popular: true,
    features: [
      'Composição musical personalizada',
      'Até três revisões gratuitas',
      'Licença para uso em conteúdo digital próprio',
      'Três versões para escolha',
      'Entrega em até 5 dias',
      'Suporte prioritário',
      'Masterização básica IA',
      'Stems separados (vocais + instrumentação)'
    ]
  }
};
