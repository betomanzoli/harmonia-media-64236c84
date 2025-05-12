
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section id="parceiro" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Ganhe com HarmonIA!</h2>
          <p className="text-gray-400 mb-8">
            Seja um afiliado ou parceiro estratégico da HarmonIA e receba comissões por cada cliente indicado! 
            Ideal para cerimonialistas, educadores musicais e influenciadores digitais.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="bg-harmonia-green/10 p-3 rounded-lg">
                <Handshake className="w-6 h-6 text-harmonia-green" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Parceria Estratégica</h3>
                <p className="text-gray-400 text-sm">
                  Oferecemos condições especiais para parceiros que integram nossos serviços em seu portfólio.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-harmonia-green/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-harmonia-green" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Programa de Afiliados</h3>
                <p className="text-gray-400 text-sm">
                  Ganhe até 20% de comissão por cada venda realizada através do seu link personalizado.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-harmonia-green/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-harmonia-green" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Indicação de Clientes</h3>
                <p className="text-gray-400 text-sm">
                  Sistema simples de rastreamento de indicações com dashboard exclusivo para acompanhar seus ganhos.
                </p>
              </div>
            </div>
          </div>
          
          <Button className="bg-harmonia-green hover:bg-harmonia-green/90 h-12 px-6">
            Tornar-se Parceiro
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-6">Preencha para saber mais</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome completo</label>
              <input
                id="name"
                type="text"
                className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="business" className="block text-sm font-medium mb-1">Área de atuação</label>
              <select
                id="business"
                className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
              >
                <option value="">Selecione sua área</option>
                <option value="cerimonialista">Cerimonialista</option>
                <option value="educador">Educador Musical</option>
                <option value="influencer">Influenciador Digital</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
              <textarea
                id="message"
                rows={4}
                className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
                placeholder="Conte-nos como podemos colaborar..."
              ></textarea>
            </div>
            <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
