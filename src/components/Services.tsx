
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Músicas para Eventos',
      description: 'Composições únicas para casamentos, aniversários e momentos especiais.',
      icon: '🎵'
    },
    {
      title: 'Trilhas para Vídeos',
      description: 'Música personalizada para seus conteúdos digitais e apresentações.',
      icon: '🎬'
    },
    {
      title: 'Projetos Pessoais',
      description: 'Transforme sua história ou poema em uma canção inesquecível.',
      icon: '❤️'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          O que oferecemos
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Criamos música personalizada para diversas finalidades, sempre respeitando sua visão e emoções
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-card p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
            <Link to="/pacotes">Ver nossos pacotes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
