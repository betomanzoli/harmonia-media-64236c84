
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Music } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ServiceCard: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const getServiceInfo = (id: string) => {
    switch (id) {
      case 'essencial':
        return {
          name: 'Pacote Essencial',
          price: 'R$ 297',
          description: 'Produção musical personalizada com IA'
        };
      case 'premium':
        return {
          name: 'Pacote Premium',
          price: 'R$ 597',
          description: 'Produção avançada com múltiplas versões'
        };
      case 'profissional':
        return {
          name: 'Pacote Profissional',
          price: 'R$ 997',
          description: 'Produção completa para uso comercial'
        };
      default:
        return {
          name: 'Serviço',
          price: 'Consulte',
          description: 'Serviço de produção musical'
        };
    }
  };

  const service = getServiceInfo(serviceId || '');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <Card>
            <CardHeader className="text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-3xl font-bold">{service.name}</CardTitle>
              <p className="text-xl text-green-600 font-semibold">{service.price}</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="space-y-4">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link to="/qualificacao">Contratar Agora</Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/portfolio">Ver Portfolio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCard;
