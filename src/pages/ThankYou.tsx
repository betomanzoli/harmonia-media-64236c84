
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface QualificationData {
  name: string;
  email: string;
  phone: string;
  referralSource: string;
  purpose: string[];
  otherPurpose?: string;
  timeline: string;
  description: string;
  budget: string;
  features: string[];
}

// Function to determine recommended package based on form data
const getRecommendedPackage = (data: QualificationData): 'essencial' | 'profissional' | 'premium' => {
  // Logic to determine the recommended package
  
  // If user selected premium features
  if (
    data.features.includes('legal-registration') || 
    data.features.includes('full-rights') ||
    data.budget === 'above-500'
  ) {
    return 'premium';
  }
  
  // If user selected professional features
  if (
    data.features.includes('commercial-use') ||
    data.purpose.includes('professional-use') ||
    data.purpose.includes('corporate-use') ||
    data.budget === '200-500'
  ) {
    return 'profissional';
  }
  
  // Default to essencial
  return 'essencial';
};

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<QualificationData | null>(null);
  const [recommendedPackage, setRecommendedPackage] = useState<'essencial' | 'profissional' | 'premium'>('essencial');
  
  useEffect(() => {
    // Retrieve form data from localStorage
    const savedData = localStorage.getItem('qualificationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as QualificationData;
      setUserData(parsedData);
      setRecommendedPackage(getRecommendedPackage(parsedData));
    }
  }, []);
  
  // Package details
  const packages = {
    essencial: {
      title: 'Pacote Essencial',
      subtitle: 'Ideal para uso pessoal',
      price: 'A partir de R$199',
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
      price: 'A partir de R$399',
      features: [
        'Composição musical personalizada',
        'Até três revisões gratuitas',
        'Licença para uso em conteúdo digital próprio',
        'Três versões para escolha',
        'Entrega em até 5 dias',
        'Suporte prioritário'
      ],
      highlight: userData?.budget === '200-500' || 
                userData?.features.includes('commercial-use') || 
                userData?.purpose.includes('professional-use')
    },
    premium: {
      title: 'Pacote Premium',
      subtitle: 'Total controle e propriedade sobre a obra',
      price: 'A partir de R$699',
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
                userData?.features.includes('legal-registration') || 
                userData?.features.includes('full-rights')
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-harmonia-green/20 mb-6">
            <CheckCircle2 className="w-8 h-8 text-harmonia-green" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Obrigado, {userData?.name?.split(' ')[0] || 'amigo(a)'}!</h1>
          <p className="text-xl text-gray-300 mb-2">Recebemos sua solicitação com sucesso.</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nossa equipe entrará em contato com você em breve para discutir os próximos passos.
            Enquanto isso, confira abaixo nossa recomendação personalizada para você.
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Pacote Recomendado para Você</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(packages).map(([key, pkg]) => {
              const isRecommended = key === recommendedPackage;
              return (
                <Card 
                  key={key}
                  className={`p-6 relative overflow-hidden border ${
                    isRecommended ? 'border-harmonia-green' : 'border-border'
                  } ${pkg.highlight ? 'ring-2 ring-harmonia-green/50' : ''}`}
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0 bg-harmonia-green text-black text-xs font-bold px-3 py-1">
                      Recomendado
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <Package className="w-8 h-8 text-harmonia-green mb-2" />
                    <h3 className="text-xl font-bold">{pkg.title}</h3>
                    <p className="text-sm text-gray-400">{pkg.subtitle}</p>
                  </div>
                  
                  <div className="text-xl font-bold mb-4">{pkg.price}</div>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-harmonia-green mr-2">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      isRecommended 
                        ? 'bg-harmonia-green hover:bg-harmonia-green/90' 
                        : 'bg-card hover:bg-card/90 border border-border'
                    }`}
                    onClick={() => navigate(siteConfig.urls.packages)}
                  >
                    Ver detalhes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Quer conhecer mais sobre nossos pacotes e como podemos atender sua necessidade específica?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(siteConfig.urls.packages)}
            >
              Ver todos os pacotes
            </Button>
            <Button 
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              Falar com um consultor
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
