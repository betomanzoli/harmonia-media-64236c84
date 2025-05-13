
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Music, Package, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceExtras from '@/components/ServiceExtras';

const Services: React.FC = () => {
  const handleExtraServiceClick = (serviceId: string) => {
    console.log('Extra service clicked on Services page:', serviceId);
    // Implementação adicional se necessário
  };
  
  const whatsAppUrl = "https://api.whatsapp.com/send?phone=5551999999999&text=Olá!%20Estou%20interessado%20em%20saber%20mais%20sobre%20os%20serviços%20da%20harmonIA.";
  
  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-gray-500 max-w-3xl mx-auto">
              A harmonIA oferece serviços personalizados de composição e produção musical para transformar sua história, emoção ou ideia em uma música única e inesquecível.
            </p>
          </div>
          
          {/* Serviços principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="overflow-hidden">
              <div className="h-2 bg-blue-500"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Música Personalizada</h3>
                <p className="text-gray-600 mb-6">
                  Criamos uma composição musical exclusiva baseada na sua história pessoal ou ocasião especial.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Composição totalmente original</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Letra baseada na sua história</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Versões para escolha</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega rápida</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link to="/pacotes">Ver pacotes</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-2 bg-harmonia-green"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold mb-4">Produção Musical</h3>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Em breve</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Produzimos sua ideia musical com qualidade profissional, dando vida ao seu projeto pessoal ou comercial.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-harmonia-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Gravação profissional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-harmonia-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Arranjos exclusivos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-harmonia-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mixagem e masterização</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-harmonia-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Diferentes formatos de entrega</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saber mais
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-2 bg-purple-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold mb-4">Trilhas para Vídeo</h3>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Em breve</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Criamos trilhas sonoras exclusivas para vídeos, publicidades, apresentações e projetos audiovisuais.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Sincronização perfeita</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Diferentes estilos musicais</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Emoção adequada para cada cena</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Direitos de uso comercial</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saber mais
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Serviços extras */}
          <ServiceExtras onExtraServiceClick={handleExtraServiceClick} />
          
          {/* Serviços adicionais */}
          <div className="mb-16 mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Serviços Complementares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 text-center">
                <Music className="h-8 w-8 mx-auto text-harmonia-green mb-4" />
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="font-bold">Registro de Música</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Registramos sua composição para proteção legal dos direitos autorais.
                </p>
                <Button variant="link" size="sm" className="text-harmonia-green" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saiba mais
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto text-harmonia-green mb-4" />
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="font-bold">Press Kit Musical</h3>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Em breve</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Material completo para divulgação da sua música ou projeto.
                </p>
                <Button variant="link" size="sm" className="text-harmonia-green" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saiba mais
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <Music className="h-8 w-8 mx-auto text-harmonia-green mb-4" />
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="font-bold">Distribuição Digital</h3>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Em breve</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Publicamos sua música nas principais plataformas de streaming.
                </p>
                <Button variant="link" size="sm" className="text-harmonia-green" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saiba mais
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto text-harmonia-green mb-4" />
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="font-bold">Versões Cover</h3>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Em breve</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Produzimos versões exclusivas de músicas conhecidas adaptadas ao seu estilo.
                </p>
                <Button variant="link" size="sm" className="text-harmonia-green" onClick={() => window.open(whatsAppUrl, '_blank')}>
                  Saiba mais
                </Button>
              </Card>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Projeto personalizado?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6">
              Se você tem necessidades específicas ou um projeto musical que não se encaixa em nossos serviços padrão, entre em contato para uma proposta personalizada.
            </p>
            <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white" asChild>
              <Link to="/contato">
                Fale com nossa equipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Services;
