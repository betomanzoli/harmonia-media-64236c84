
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section id="parceria" className="bg-gray-50 py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="text-3xl font-bold mb-4">Seja nosso parceiro</h2>
              <p className="text-gray-500 mb-6">
                Você é músico, produtor ou trabalha com eventos? Junte-se à nossa rede de parceiros e ofereça músicas personalizadas aos seus clientes.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-harmonia-green/10 p-3 rounded-full">
                    <Handshake className="w-6 h-6 text-harmonia-green" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Complemento perfeito</h3>
                    <p className="text-gray-500">
                      Agregue mais valor ao seu negócio oferecendo músicas personalizadas como um serviço adicional.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-harmonia-green/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-harmonia-green" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Comissões atrativas</h3>
                    <p className="text-gray-500">
                      Receba comissões por cada cliente indicado que contratar nossos serviços.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-harmonia-green/10 p-3 rounded-full">
                    <Users className="w-6 h-6 text-harmonia-green" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Rede exclusiva</h3>
                    <p className="text-gray-500">
                      Faça parte de uma rede seleta de profissionais e tenha acesso a conteúdos e benefícios exclusivos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-8 py-2 rounded-md h-auto" asChild>
                  <a href="/contato?assunto=parceria">Quero ser parceiro</a>
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Benefícios para parceiros</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Comissão de 15% por indicação
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Divulgação em nosso site
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Materiais promocionais exclusivos
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Acesso prioritário a lançamentos
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Descontos em projetos próprios
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Suporte prioritário
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  "A parceria com a harmonIA expandiu nossos serviços e fidelizou ainda mais nossos clientes. Uma experiência incrível!"
                </p>
                <p className="text-xs text-blue-500 mt-2">— Carlos Mendes, Cerimonialista</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
