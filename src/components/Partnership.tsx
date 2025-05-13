
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Parcerias e Colaborações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-4">
              <Handshake className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Trabalho Colaborativo</h3>
            <p className="text-gray-600 text-center mb-4">
              Conectamos artistas, produtores e profissionais para criar projetos musicais excepcionais.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Benefícios Mútuos</h3>
            <p className="text-gray-600 text-center mb-4">
              Criamos relações que trazem vantagens para todos os envolvidos, impulsionando o crescimento mútuo.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Rede de Contatos</h3>
            <p className="text-gray-600 text-center mb-4">
              Acesse nossa rede de profissionais e parceiros da indústria musical para expandir suas oportunidades.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-blue-600 hover:bg-blue-700">Entre em contato para parcerias</Button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
