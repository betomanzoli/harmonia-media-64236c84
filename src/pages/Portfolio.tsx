
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Portfolio from '@/components/Portfolio';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    const phoneNumber = siteConfig.contact.whatsapp;
    const message = "Olá! Gostaria de conhecer mais sobre suas músicas personalizadas.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nosso Portfólio</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore algumas das histórias que transformamos em música. Cada composição é única e feita especificamente 
              para atender aos desejos e necessidades de nossos clientes.
            </p>
            
            <div className="flex flex-col gap-4 justify-center mt-6">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto"
              >
                <Phone className="w-4 h-4" />
                Fale conosco pelo WhatsApp para exemplos
              </Button>
              
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-start mt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">Promocionais</h3>
                  <iframe 
                    style={{ border: 0, width: '400px', height: '472px' }} 
                    src="https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=large/bgcol=ffffff/linkcol=2ebd35/artwork=small/transparent=true/" 
                    seamless
                    title="Promocionais by harmonIA"
                  >
                    <a href="https://harmonia-media.bandcamp.com/album/promocionais">Promocionais by harmonIA</a>
                  </iframe>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">Mix de Estilos</h3>
                  <iframe 
                    style={{ border: 0, width: '400px', height: '472px' }} 
                    src="https://bandcamp.com/EmbeddedPlayer/album=3897753197/size=large/bgcol=ffffff/linkcol=2ebd35/artwork=small/transparent=true/" 
                    seamless
                    title="Portifólio (Mix de Estilos) by harmonIA"
                  >
                    <a href="https://harmonia-media.bandcamp.com/album/portif-lio-mix-de-estilos">Portifólio (Mix de Estilos) by harmonIA</a>
                  </iframe>
                </div>
              </div>
            </div>
          </div>

          <Portfolio />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
