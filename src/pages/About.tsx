
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 px-6 md:px-10">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sobre a harmonIA</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça nossa história e como transformamos histórias em música utilizando o melhor da 
            inteligência artificial e o talento de músicos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-gray-300 mb-4">
              Transformar momentos e histórias em experiências musicais únicas, através de composições 
              personalizadas que expressam sentimentos e memórias de forma autêntica.
            </p>
            <p className="text-gray-300">
              Acreditamos que cada pessoa merece ter sua própria trilha sonora, que capture a essência 
              de suas histórias mais importantes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Nossa Abordagem</h2>
            <p className="text-gray-300 mb-4">
              Combinamos o melhor da tecnologia de inteligência artificial com o talento de músicos 
              profissionais para criar composições verdadeiramente únicas.
            </p>
            <p className="text-gray-300">
              Nosso processo criativo envolve entender profundamente sua história, emoções e 
              preferências musicais para desenvolver uma peça que ressoe com você.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-background to-gray-900 p-8 rounded-lg border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Como Trabalhamos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="bg-harmonia-green/20 text-harmonia-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Você compartilha sua história</h3>
              <p className="text-gray-400">Conte-nos sua história através do nosso briefing detalhado</p>
            </div>
            <div className="p-4">
              <div className="bg-harmonia-green/20 text-harmonia-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Criamos opções musicais</h3>
              <p className="text-gray-400">Nossa equipe cria várias versões para você escolher</p>
            </div>
            <div className="p-4">
              <div className="bg-harmonia-green/20 text-harmonia-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Entregamos sua música</h3>
              <p className="text-gray-400">Após sua aprovação, entregamos a versão final da sua música</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
