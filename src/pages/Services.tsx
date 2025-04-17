
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import ServiceExtrasGrid from '@/components/services/ServiceExtrasGrid';
import TermsDialog from '@/components/service-card/TermsDialog';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedPackageTitle, setSelectedPackageTitle] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState('');

  const services = [
    {
      title: "Pacote Essencial",
      price: `R$ ${siteConfig.pricing.basePrice}`,
      description: "Ideal para presentes emocionais rápidos.",
      features: [
        "Composição musical personalizada",
        "Uma revisão inclusa",
        "Entrega em até 7 dias úteis",
        "Licença para uso pessoal"
      ],
      paymentLink: packagePaymentLinks['essencial'].standard.url,
      packageId: 'essencial'
    },
    {
      title: "Pacote Profissional",
      price: `R$ ${siteConfig.pricing.professionalPrice}`,
      description: "Perfeito para criadores de conteúdo.",
      features: [
        "Composição musical personalizada",
        "Três versões para escolha",
        "Até três revisões",
        "Entrega em até 10 dias úteis",
        "Licença para uso comercial limitado"
      ],
      paymentLink: packagePaymentLinks['profissional'].standard.url,
      packageId: 'profissional'
    },
    {
      title: "Pacote Premium",
      price: `R$ ${siteConfig.pricing.premiumPrice}`,
      description: "Melhor opção para empresas.",
      features: [
        "Composição musical personalizada premium",
        "Revisões ilimitadas",
        "Registro na Biblioteca Nacional",
        "Entrega em até 15 dias úteis",
        "Licença comercial global"
      ],
      paymentLink: packagePaymentLinks['premium'].standard.url,
      packageId: 'premium'
    },
  ];

  const handlePaymentClick = (title: string, paymentLink: string) => {
    setSelectedPackageTitle(title);
    setSelectedPaymentLink(paymentLink);
    setIsTermsDialogOpen(true);
  };

  const handleAcceptTerms = () => {
    // If terms are accepted, redirect to payment link
    if (selectedPaymentLink) {
      window.open(selectedPaymentLink, '_blank');
    }
    setIsTermsDialogOpen(false);
  };

  const handleExtraServiceClick = (serviceId: string) => {
    // For extra services, navigate directly to payment
    const paymentLink = extraServicePaymentLinks[serviceId]?.url;
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    } else {
      // If it's a custom price service, redirect to contact page
      navigate('/contato');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oferecemos pacotes personalizados para atender às suas necessidades musicais.
              Escolha o pacote que melhor se adapta ao seu projeto.
            </p>
            <p className="text-amber-400 font-medium mt-2">
              *Preços promocionais por tempo limitado!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border border-border hover:border-harmonia-green/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">{service.price}</div>
                    <span className="text-xs text-amber-400 font-medium">Promocional</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full justify-center bg-harmonia-green hover:bg-harmonia-green/90 mt-4"
                    onClick={() => handlePaymentClick(service.title, service.paymentLink)}
                  >
                    Contratar agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Serviços Extras</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-center mb-2">
              Personalize sua experiência com estes serviços adicionais que podem ser contratados durante ou após o projeto.
            </p>
            <p className="text-amber-400 font-medium text-center mb-10">
              *Preços promocionais por tempo limitado!
            </p>
            
            <ServiceExtrasGrid onExtraServiceClick={handleExtraServiceClick} />
          </div>
        </div>
      </main>
      <Footer />

      {/* Contract Terms Dialog */}
      <TermsDialog
        open={isTermsDialogOpen}
        onOpenChange={setIsTermsDialogOpen}
        title={selectedPackageTitle}
        acceptedTerms={acceptedTerms}
        onAcceptedTermsChange={setAcceptedTerms}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};

export default ServicesPage;
