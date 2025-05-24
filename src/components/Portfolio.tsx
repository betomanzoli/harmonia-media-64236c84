
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Portfolio: React.FC = () => {
  const portfolioItems = [
    {
      title: "Memórias de Verão",
      description: "Trilha sonora para vídeo de casamento na praia",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      audioUrl: "#"
    },
    {
      title: "Entre Montanhas",
      description: "Composição para documentário sobre natureza",
      image: "https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      audioUrl: "#"
    },
    {
      title: "Primeiro Sorriso",
      description: "Música para vídeo de família com recém-nascido",
      image: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      audioUrl: "#"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Nosso Portfólio
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Explore algumas das músicas que já criamos para nossos clientes
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full">Ouvir amostra</Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
            <Link to="/portfolio">Ver mais exemplos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
