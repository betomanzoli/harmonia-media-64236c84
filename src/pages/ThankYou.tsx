
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { QualificationData } from '@/types/qualification';
import { getRecommendedPackage } from '@/utils/packageRecommendation';
import PackageRecommendations from '@/components/thankyou/PackageRecommendations';

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
        
        <PackageRecommendations 
          userData={userData} 
          recommendedPackage={recommendedPackage} 
        />
        
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
              onClick={() => window.open(`https://wa.me/${siteConfig.contact.whatsapp}`, '_blank')}
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
