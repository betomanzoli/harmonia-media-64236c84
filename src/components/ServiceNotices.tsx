
import React from 'react';
import { Card } from "@/components/ui/card";
import { Info, AlertCircle } from 'lucide-react';

const ServiceNotices: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Informações Importantes</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2">
          Detalhes importantes sobre nossos serviços e política de atendimento
        </p>
      </div>
      
      <Card className="bg-gray-50 p-6 rounded-lg border-none">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Sobre Nossos Serviços</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>Os prazos começam a contar após a aprovação do briefing.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>Alterações adicionais podem ter custo extra, dependendo da complexidade.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>Para projetos com necessidades específicas, entre em contato para um orçamento personalizado.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>O envio do briefing é obrigatório para início do projeto. Sem ele, o prazo não começa a contar.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>Após a entrega final, você tem até 30 dias para solicitar pequenos ajustes sem custo adicional.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceNotices;
