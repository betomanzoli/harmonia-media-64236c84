
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Parcerias e Colaborações</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos abertos a parcerias com produtores, compositores e empresas que queiram inovar no mercado musical.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <Handshake className="w-12 h-12 mx-auto mb-4 text-harmonia-green" />
            <h3 className="text-xl font-semibold mb-3">Parcerias Criativas</h3>
            <p className="text-gray-600">
              Colabore com nossos compositores e produtores em projetos inovadores que unem tecnologia e criatividade musical.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-harmonia-green" />
            <h3 className="text-xl font-semibold mb-3">Programa de Afiliados</h3>
            <p className="text-gray-600">
              Indique nossos serviços e ganhe comissões por cada cliente que realizar um projeto conosco.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-harmonia-green" />
            <h3 className="text-xl font-semibold mb-3">Parcerias Corporativas</h3>
            <p className="text-gray-600">
              Soluções personalizadas para empresas que desejam utilizar música em suas estratégias de comunicação e marketing.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-8 py-6 rounded-md text-lg"
            onClick={() => window.location.href = '/contato'}
          >
            Fale com nossa equipe sobre parcerias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
