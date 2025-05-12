
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-900 to-purple-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Parceria para Produtores e Artistas</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <div className="mb-4 bg-purple-700 p-3 rounded-full inline-block">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Colaboração Flexível</h3>
            <p className="text-gray-200">Colabore em projetos específicos ou estabeleça uma parceria contínua de acordo com sua disponibilidade e interesses.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <div className="mb-4 bg-purple-700 p-3 rounded-full inline-block">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Remuneração Competitiva</h3>
            <p className="text-gray-200">Estrutura transparente de comissões e oportunidades para gerar receita recorrente com sua expertise.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <div className="mb-4 bg-purple-700 p-3 rounded-full inline-block">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comunidade Criativa</h3>
            <p className="text-gray-200">Faça parte de uma rede de profissionais e expanda sua presença no mercado através de nossas plataformas.</p>
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
            Torne-se um Parceiro
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
