
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block p-3 rounded-full bg-harmonia-green/20 mb-4">
          <Handshake className="w-8 h-8 text-harmonia-green" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Parcerias e Colaborações</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Interessado em estabelecer uma parceria com a harmonIA? 
          Estamos abertos a colaborações com artistas, produtores, empresas e agências.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-slate-800 p-6 rounded-lg">
            <DollarSign className="w-10 h-10 text-harmonia-green mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Programa de Afiliados</h3>
            <p className="text-gray-400 mb-4">
              Ganhe comissões indicando clientes para a harmonIA.
            </p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <Users className="w-10 h-10 text-harmonia-green mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Colaborações Criativas</h3>
            <p className="text-gray-400 mb-4">
              Trabalhe conosco em projetos especiais de música com IA.
            </p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <Handshake className="w-10 h-10 text-harmonia-green mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Parcerias Empresariais</h3>
            <p className="text-gray-400 mb-4">
              Soluções corporativas e integrações para o seu negócio.
            </p>
          </div>
        </div>
        
        <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
          Entre em contato para parcerias
        </Button>
      </div>
    </section>
  );
};

export default Partnership;
