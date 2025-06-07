
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Portfolio from '@/components/Portfolio';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, ExternalLink, MessageCircle } from 'lucide-react';
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

  const handlePurchaseContact = () => {
    const phoneNumber = siteConfig.contact.whatsapp;
    const message = "Olá! Me interessei por uma música do portfólio. Gostaria de saber sobre formas de pagamento alternativas (PIX, transferência, etc).";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBandcampVisit = () => {
    window.open('https://harmonia-media.bandcamp.com/', '_blank');
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
              
              {/* Seção de interesse em músicas */}
              <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                <h2 className="text-xl font-bold mb-4">Se interessou por uma música?</h2>
                <p className="text-gray-400 mb-4">
                  Entre em contato conosco! Oferecemos opções de pagamento alternativas como PIX e transferência bancária, 
                  além do Bandcamp que aceita cartões internacionais.
                </p>
                <Button 
                  onClick={handlePurchaseContact}
                  className="bg-harmonia-green hover:bg-harmonia-green/90 text-black flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Quero comprar uma música
                </Button>
              </div>
              
              {/* Músicas à Venda */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Músicas à Venda</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Diversos (Músicas à VENDA)</h3>
                    <iframe 
                      style={{ border: 0, width: '350px', height: '350px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=2246667846/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Diversos (Músicas à VENDA) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/diversos-m-sicas-venda">Diversos (Músicas à VENDA) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Músicas em Temas (À VENDA)</h3>
                    <iframe 
                      style={{ border: 0, width: '350px', height: '350px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=2818510847/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Músicas em Temas (À VENDA) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/m-sicas-em-temas-venda">Músicas em Temas (À VENDA) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Mix de Estilos 01 (Músicas à VENDA)</h3>
                    <iframe 
                      style={{ border: 0, width: '350px', height: '350px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=3897753197/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Mix de Estilos 01 (Músicas à VENDA) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/mix-de-estilos-01-m-sicas-venda">Mix de Estilos 01 (Músicas à VENDA) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Mix de Estilos 02 (Músicas à VENDA)</h3>
                    <iframe 
                      style={{ border: 0, width: '350px', height: '350px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=1726603412/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Mix de Estilos 02 (Músicas à VENDA) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/mix-de-estilos-02-m-sicas-venda">Mix de Estilos 02 (Músicas à VENDA) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Mix de Estilos 03 (Músicas À VENDA)</h3>
                    <iframe 
                      style={{ border: 0, width: '350px', height: '350px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=1687402368/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Mix de Estilos 03 (Músicas À VENDA) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/mix-de-estilos-03-m-sicas-venda">Mix de Estilos 03 (Músicas À VENDA) by harmonIA</a>
                    </iframe>
                  </div>
                </div>
              </div>

              {/* Promocionais */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Promocionais</h2>
                <div className="flex flex-wrap gap-6 justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Promocionais (Estilos 01)</h3>
                    <iframe 
                      style={{ border: 0, width: '170px', height: '170px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=3450186390/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Promocionais (Estilos 01) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/promocionais-estilos-01">Promocionais (Estilos 01) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Promocionais (Estilos 02)</h3>
                    <iframe 
                      style={{ border: 0, width: '170px', height: '170px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=3158747959/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Promocionais (Estilos 02) by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/promocionais-estilos-02">Promocionais (Estilos 02) by harmonIA</a>
                    </iframe>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">Promocionais - harmonIA</h3>
                    <iframe 
                      style={{ border: 0, width: '170px', height: '170px' }} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=large/bgcol=ffffff/linkcol=2ebd35/minimal=true/transparent=true/" 
                      seamless
                      title="Promocionais - harmonIA by harmonIA"
                    >
                      <a href="https://harmonia-media.bandcamp.com/album/promocionais-harmonia">Promocionais - harmonIA by harmonIA</a>
                    </iframe>
                  </div>
                </div>
              </div>

              {/* Botão para o Bandcamp */}
              <div className="mt-8">
                <Button 
                  onClick={handleBandcampVisit}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visite nosso Bandcamp
                </Button>
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
