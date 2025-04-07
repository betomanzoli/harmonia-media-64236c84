
import { siteConfig } from '@/config/site';

export interface PackageInfo {
  name: string;
  price: string;
  features: string[];
}

export type PackageId = 'essencial' | 'profissional' | 'premium';

export const packageData: Record<PackageId, PackageInfo> = {
  'essencial': {
    name: 'Pacote Essencial',
    price: `R$ ${siteConfig.pricing.basePrice},00`,
    features: [
      'Composição musical personalizada',
      'Uma revisão gratuita',
      'Entrega em até 7 dias úteis',
      'Licença para uso pessoal'
    ]
  },
  'profissional': {
    name: 'Pacote Profissional',
    price: `R$ ${siteConfig.pricing.professionalPrice},00`,
    features: [
      'Composição musical personalizada premium',
      'Até três revisões gratuitas',
      'Mixagem e masterização profissionais',
      'Entrega em até 5 dias úteis',
      'Licença para uso comercial limitado'
    ]
  },
  'premium': {
    name: 'Pacote Premium',
    price: `R$ ${siteConfig.pricing.premiumPrice},00`,
    features: [
      'Composição musical personalizada de alto nível',
      'Revisões ilimitadas',
      'Mixagem e masterização avançadas',
      'Versões alternativas da música',
      'Entrega expressa em até 3 dias úteis',
      'Licença para uso comercial global'
    ]
  }
};
