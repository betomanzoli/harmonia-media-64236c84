
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, ArrowUp } from 'lucide-react';

const Hero: React.FC = () => {
  const handleCreateMusic = () => {
    // Scroll to the briefing form
    const briefingSection = document.getElementById('briefing');
    if (briefingSection) {
      briefingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowItWorks = () => {
    // Scroll to the process section
    const processSection = document.getElementById('processo');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="pt-32 pb-20 px-6 md:px-10 max-w-7xl mx-auto relative">
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Música feita por{" "}
          <span className="gradient-text block">humanos + IA</span>
          <span className="text-white">perfeita para você.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          A harmon<span className="text-harmonia-green font-semibold">IA</span> combina inteligência artificial e talento humano para criar músicas personalizadas 
          perfeitas para qualquer ocasião, entregando composições únicas em poucos dias.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleCreateMusic}
            className="bg-harmonia-green hover:bg-harmonia-green/90 text-white h-12 px-6 rounded-md"
          >
            Criar Minha Música
          </Button>
          <Button 
            onClick={handleHowItWorks}
            variant="outline" 
            className="flex items-center gap-2 h-12 px-6 rounded-md"
          >
            <Play className="w-4 h-4" /> Como Funciona
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-3xl font-bold text-harmonia-green">100+</p>
            <p className="text-sm text-gray-400">Músicas Registradas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-harmonia-green">48h</p>
            <p className="text-sm text-gray-400">Tempo Médio de Entrega</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-harmonia-green">4.9/5</p>
            <p className="text-sm text-gray-400">Avaliação dos Clientes</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-harmonia-green hover:bg-harmonia-green/90 text-white p-3 rounded-full shadow-lg z-50"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </section>
  );
};

export default Hero;
