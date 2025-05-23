import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Heart, Star, Check } from 'lucide-react';

interface PackageSelectionProps {
  onPackageSelect: (packageType: 'essencial' | 'profissional' | 'premium') => void;
  clientName?: string;
  isLoading?: boolean;
  selectedPackage?: string;
}

// ✅ CONFIGURAÇÃO DOS PACOTES COM VALORES CORRETOS
const PACKAGES_CONFIG = {
  essencial: {
    name: 'Essencial',
    price: 219,
    originalPrice: 219,
    badge: 'Ideal para presentear',
    description: 'Perfeito para presentes e uso pessoal',
    features: [
      '1 composição musical completa',
      '1 revisão incluída',
      'Arquivo digital alta qualidade (MP3/WAV)',
      'Entrega em até 72 horas úteis',
      'Certificado digital de autoria',
      'Uso pessoal e não-comercial'
    ],
    icon: Heart,
    color: 'blue',
    highlighted: false
  },
  profissional: {
    name: 'Profissional',
    price: 479,
    originalPrice: 479,
    badge: 'Mais Popular',
    description: 'Ideal para criadores de conteúdo e uso comercial',
    features: [
      '3 propostas em estilos diferentes',
      '2 revisões incluídas',
      'Masterização básica',
      'Stems separados básicos (voz + instrumentação)',
      'Entrega em até 5 dias úteis',
      'Certificado digital com verificação hash',
      'Uso comercial em plataformas digitais'
    ],
    icon: Music,
    color: 'green',
    highlighted: true
  },
  premium: {
    name: 'Premium',
    price: 969,
    originalPrice: 969,
    badge: 'Direitos completos',
    description: 'Máxima qualidade com direitos autorais transferidos',
    features: [
      '5 propostas de conceito/estilo',
      '3 revisões completas',
      'Registro da letra na Biblioteca Nacional',
      'Masterização profissional com ajustes manuais',
      'Stems completos separados',
      'Entrega em até 7 dias úteis',
      'Cessão total de direitos autorais',
      'Registro em blockchain'
    ],
    icon: Star,
    color: 'purple',
    highlighted: false
  }
};

const PackageSelection: React.FC<PackageSelectionProps> = ({
  onPackageSelect,
  clientName,
  isLoading = false,
  selectedPackage
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          {clientName ? `Perfeito, ${clientName}! 🎵` : 'Escolha seu pacote 🎵'}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Selecione o pacote ideal para sua música personalizada. 
          Cada pacote foi cuidadosamente criado para diferentes necessidades e orçamentos.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Object.entries(PACKAGES_CONFIG).map(([key, pkg]) => {
          const IconComponent = pkg.icon;
          const isSelected = selectedPackage === key;
          const isPopular = pkg.highlighted;

          return (
            <Card 
              key={key}
              className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                isPopular 
                  ? 'border-2 border-harmonia-green shadow-xl ring-2 ring-harmonia-green/20' 
                  : 'border border-gray-200 hover:border-gray-300 hover:shadow-lg'
              } ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
              }`}
              onClick={() => !isLoading && onPackageSelect(key as 'essencial' | 'profissional' | 'premium')}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-harmonia-green text-white px-6 py-2 text-sm font-semibold shadow-lg">
                    ⭐ {pkg.badge}
                  </Badge>
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-blue-500 text-white rounded-full p-2">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                {/* Icon */}
                <div className="mx-auto mb-4 p-4 bg-gray-50 rounded-full w-fit">
                  <IconComponent className={`w-8 h-8 ${
                    isPopular ? 'text-harmonia-green' : 'text-gray-600'
                  }`} />
                </div>

                {/* Package Name */}
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>

                {/* Price */}
                <div className="mb-2">
                  <div className="text-4xl font-bold text-harmonia-green">
                    R$ {pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Valor único, sem mensalidades
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {pkg.description}
                </p>

                {/* Badge */}
                <Badge 
                  variant="outline" 
                  className={`mx-auto w-fit ${
                    isPopular ? 'border-harmonia-green text-harmonia-green' : ''
                  }`}
                >
                  {pkg.badge}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">O que inclui:</h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-500 mr-3 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span className="text-gray-700 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    !isLoading && onPackageSelect(key as 'essencial' | 'profissional' | 'premium');
                  }}
                  disabled={isLoading}
                  className={`w-full py-3 text-base font-semibold transition-all duration-200 ${
                    isPopular 
                      ? 'bg-harmonia-green hover:bg-harmonia-green/90 text-white shadow-lg hover:shadow-xl' 
                      : isSelected
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white hover:shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </div>
                  ) : isSelected ? (
                    `✓ ${pkg.name} Selecionado`
                  ) : (
                    `Escolher ${pkg.name}`
                  )}
                </Button>

                {/* Guarantee */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Pagamento 100% seguro via MercadoPago
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-4 mt-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-blue-800 mb-3">
            💡 Dúvidas sobre qual pacote escolher?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <strong>Essencial:</strong> Ideal para presentes pessoais, aniversários, homenagens familiares
            </div>
            <div>
              <strong>Profissional:</strong> Perfeito para podcasts, canais do YouTube, redes sociais
            </div>
            <div>
              <strong>Premium:</strong> Para empresas, marcas e projetos que precisam de direitos completos
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Satisfação garantida
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Suporte personalizado
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Entrega no prazo
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelection;
