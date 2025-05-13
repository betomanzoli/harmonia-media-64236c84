
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-background to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Parcerias Estratégicas</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estamos abertos a parcerias com produtores, estúdios e criadores de conteúdo para expandir 
            nossas possibilidades musicais e criativas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/30 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Handshake className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Colaborações Criativas</h3>
            <p className="text-gray-400 mb-4">
              Trabalhamos com profissionais da indústria para criar soluções musicais inovadoras.
            </p>
            <Button variant="outline" className="mt-auto">Saiba Mais</Button>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Programa de Afiliados</h3>
            <p className="text-gray-400 mb-4">
              Ganhe comissões por indicar clientes que contratem nossos serviços de composição musical.
            </p>
            <Button variant="outline" className="mt-auto">Participar</Button>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Para Produtores</h3>
            <p className="text-gray-400 mb-4">
              Junte-se à nossa rede de produtores e compositores e amplie seu alcance profissional.
            </p>
            <Button variant="outline" className="mt-auto">Cadastrar</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
