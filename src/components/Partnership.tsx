
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Parcerias</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Handshake className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Colaboração</h3>
            <p className="text-muted-foreground mb-6">Trabalhamos em conjunto com profissionais criativos para oferecer soluções musicais completas.</p>
            <Button variant="outline" className="mt-auto">Saiba Mais</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Programa de Afiliados</h3>
            <p className="text-muted-foreground mb-6">Indique clientes e ganhe comissões por cada projeto concretizado através da sua indicação.</p>
            <Button variant="outline" className="mt-auto">Participar</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Descontos para Empresas</h3>
            <p className="text-muted-foreground mb-6">Pacotes especiais para empresas que necessitam de músicas personalizadas com frequência.</p>
            <Button variant="outline" className="mt-auto">Consultar</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
