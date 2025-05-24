
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sua história merece uma <span className="gradient-text">música única</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10">
            Transformamos suas memórias e emoções em composições originais, 
            criadas por músicos profissionais com o auxílio da inteligência artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-8 py-6 text-lg"
              asChild
            >
              <Link to="/briefing">Criar minha música</Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10 px-8 py-6 text-lg"
              asChild
            >
              <Link to="/portfolio">Ver exemplos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
