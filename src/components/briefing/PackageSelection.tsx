
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface PackageSelectionProps {
  selectedPackage?: 'essencial' | 'profissional' | 'premium';
  onPackageSelect?: (packageType: 'essencial' | 'profissional' | 'premium') => void | Promise<void>;
  isSubmitting?: boolean;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  selectedPackage = 'essencial',
  onPackageSelect,
  isSubmitting = false
}) => {
  const packages = [
    {
      id: 'essencial' as const,
      name: 'Essencial',
      price: 'R$ 299',
      description: 'Ideal para eventos pequenos e uso pessoal',
      features: [
        'Música personalizada até 3 minutos',
        '2 revisões incluídas',
        'Entrega em até 7 dias',
        'Formato MP3'
      ]
    },
    {
      id: 'profissional' as const,
      name: 'Profissional',
      price: 'R$ 599',
      description: 'Perfeito para uso comercial e profissional',
      features: [
        'Música personalizada até 5 minutos',
        '4 revisões incluídas',
        'Entrega em até 5 dias',
        'Múltiplos formatos',
        'Mixagem profissional'
      ],
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 'R$ 999',
      description: 'Solução completa para projetos especiais',
      features: [
        'Música personalizada sem limite de tempo',
        'Revisões ilimitadas',
        'Entrega em até 3 dias',
        'Todos os formatos disponíveis',
        'Masterização profissional',
        'Sessão de feedback ao vivo'
      ]
    }
  ];

  const handleSelect = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    if (onPackageSelect) {
      await onPackageSelect(packageType);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`relative cursor-pointer transition-all hover:shadow-lg ${
            selectedPackage === pkg.id ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => handleSelect(pkg.id)}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-500 text-white">Mais Popular</Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{pkg.name}</CardTitle>
            <div className="text-3xl font-bold text-green-600">{pkg.price}</div>
            <p className="text-gray-600 text-sm">{pkg.description}</p>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              variant={selectedPackage === pkg.id ? "default" : "outline"}
              className="w-full"
              disabled={isSubmitting}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(pkg.id);
              }}
            >
              {selectedPackage === pkg.id ? 'Selecionado' : 'Selecionar'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PackageSelection;
