
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Música feita por{" "}
          <span className="gradient-text block">humanos + IA</span>
          <span className="text-white">perfeita para você.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          Composições musicais personalizadas, potencializadas por inteligência artificial e finalizadas por músicos profissionais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white h-12 px-6 rounded-md">
            Criar Minha Música
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-12 px-6 rounded-md">
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
    </section>
  );
};

export default Hero;
