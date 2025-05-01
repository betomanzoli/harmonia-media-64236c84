
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
        description: 'Ideal para ocasiões especiais',
        features: [
          'Composição personalizada',
          '1 versão + ajustes',
          'Entrega em até 10 dias',
          'Arquivo digital em alta qualidade'
        ]
      };
    
    case 'premium':
      return {
        id: 'premium',
        name: 'Pacote Premium',
        price: 969,
        description: 'Perfeito para momentos especiais',
        popular: true,
        features: [
          'Tudo do pacote Essencial',
          'Até 3 versões da música',
          'Entrega em até 7 dias',
          'Mixagem e masterização profissional'
        ]
      };
    
    case 'profissional':
      return {
        id: 'profissional',
        name: 'Pacote Profissional',
        price: 479,
        description: 'Para projetos exclusivos',
        features: [
          'Tudo do pacote Essencial',
          'Arranjo com músicos profissionais',
          'Acompanhamento prioritário',
          'Direitos comerciais da música'
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
    description: 'Ideal para ocasiões especiais',
    features: [
      'Composição personalizada',
      '1 versão + ajustes',
      'Entrega em até 10 dias',
      'Arquivo digital em alta qualidade'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Pacote Premium',
    price: 'R$ 969,00',
    description: 'Perfeito para momentos especiais',
    popular: true,
    features: [
      'Tudo do pacote Essencial',
      'Até 3 versões da música',
      'Entrega em até 7 dias',
      'Mixagem e masterização profissional'
    ]
  },
  profissional: {
    id: 'profissional',
    name: 'Pacote Profissional',
    price: 'R$ 479,00',
    description: 'Para projetos exclusivos',
    features: [
      'Tudo do pacote Essencial',
      'Arranjo com músicos profissionais',
      'Acompanhamento prioritário',
      'Direitos comerciais da música'
    ]
  }
};
