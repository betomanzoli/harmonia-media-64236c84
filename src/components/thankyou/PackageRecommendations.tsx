
import React from 'react';
import PackageCard from './PackageCard';
import { QualificationData } from '@/types/qualification';
import { siteConfig } from '@/config/site';

export interface PackageInfo {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  highlight: boolean;
}

interface PackageRecommendationsProps {
  userData: QualificationData | null;
  recommendedPackage: 'essencial' | 'profissional' | 'premium';
}

const PackageRecommendations: React.FC<PackageRecommendationsProps> = ({ 
  userData, 
  recommendedPackage 
}) => {
  // Package details
  const packages: Record<string, PackageInfo> = {
    essencial: {
      title: 'Pacote Essencial',
      subtitle: 'Ideal para uso pessoal',
      price: `A partir de R$${siteConfig.pricing.basePrice}`,
      features: [
        'Composição musical única',
        'Uma revisão gratuita',
        'Uso exclusivamente pessoal',
        'Entrega digital em até 7 dias',
        'Suporte por e-mail'
      ],
      highlight: userData?.budget === 'under-200' || userData?.purpose.includes('personal-gift')
    },
    profissional: {
      title: 'Pacote Profissional',
      subtitle: 'Para uso em projetos pessoais e profissionais',
      price: `A partir de R$${siteConfig.pricing.professionalPrice}`,
      features: [
        'Composição musical personalizada',
        'Até três revisões gratuitas',
        'Licença para uso em conteúdo digital próprio',
        'Três versões para escolha',
        'Entrega em até 5 dias',
        'Suporte prioritário'
      ],
      highlight: userData?.budget === '200-500' || 
                userData?.features?.includes('commercial-use') || 
                userData?.purpose.includes('professional-use')
    },
    premium: {
      title: 'Pacote Premium',
      subtitle: 'Total controle e propriedade sobre a obra',
      price: `A partir de R$${siteConfig.pricing.premiumPrice}`,
      features: [
        'Composição totalmente personalizada',
        'Revisões ilimitadas (até aprovação)',
        'Cessão total dos direitos autorais',
        'Cinco versões para escolha',
        'Registro na Biblioteca Nacional',
        'Certificado blockchain',
        'Consultoria de 30 minutos',
        'Entrega prioritária',
        'Suporte VIP por WhatsApp'
      ],
      highlight: userData?.budget === 'above-500' || 
                userData?.features?.includes('legal-registration') || 
                userData?.features?.includes('full-rights')
    }
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Pacote Recomendado para Você</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(packages).map(([key, pkg]) => {
          const isRecommended = key === recommendedPackage;
          return (
            <PackageCard
              key={key}
              title={pkg.title}
              subtitle={pkg.subtitle}
              price={pkg.price}
              features={pkg.features}
              isRecommended={isRecommended}
              isHighlighted={pkg.highlight}
              packageType={key}
              packageUrl="/pacotes"
            />
          );
        })}
      </div>
    </div>
  );
};

export default PackageRecommendations;
