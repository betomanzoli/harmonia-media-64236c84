
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface ServiceExtrasProps {
  onExtraServiceClick: (serviceId: string) => void;
}

const ServiceExtras: React.FC<ServiceExtrasProps> = ({ onExtraServiceClick }) => {
  const extraServices = [
    {
      id: 'mixing',
      title: 'Mixagem Profissional',
      description: 'Aprimore a qualidade sonora da sua música com uma mixagem profissional.',
      price: 'A partir de R$297'
    },
    {
      id: 'mastering',
      title: 'Masterização',
      description: 'Dê o acabamento final e maximize a qualidade da sua música.',
      price: 'A partir de R$197'
    },
    {
      id: 'video',
      title: 'Lyric Video',
      description: 'Visualize sua música com um vídeo de letras criativo e profissional.',
      price: 'A partir de R$397'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Serviços Complementares
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Maximize o potencial da sua música com nossos serviços adicionais
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {extraServices.map((service) => (
            <div key={service.id} className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-2">{service.description}</p>
              <p className="text-harmonia-green font-bold mb-4">{service.price}</p>
              <Button 
                className="w-full bg-secondary hover:bg-secondary/80 text-white"
                onClick={() => onExtraServiceClick(service.id)}
              >
                Saiba mais
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link to="/contato">Fale com nossa equipe</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceExtras;
