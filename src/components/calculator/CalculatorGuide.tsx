
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, CalculatorIcon } from 'lucide-react';

const CalculatorGuide: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-harmonia-green hover:bg-harmonia-green/10 p-1 rounded-full">
          <HelpCircle className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="text-harmonia-green h-5 w-5" />
            <h3 className="font-bold text-lg">Guia da Calculadora</h3>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Como funciona</h4>
            <p className="text-sm text-gray-400">
              Esta calculadora permite que você personalize seu pedido musical e veja o preço em tempo real.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Pacotes</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• <span className="font-medium text-foreground">Essencial:</span> Ideal para presentes pessoais</li>
              <li>• <span className="font-medium text-foreground">Profissional:</span> Para criadores de conteúdo</li>
              <li>• <span className="font-medium text-foreground">Premium:</span> Para empresas e uso comercial</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Serviços extras</h4>
            <p className="text-sm text-gray-400">
              Adicione serviços complementares como registro, masterização premium ou serviços de composição humana.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Alguns extras já estão incluídos em pacotes específicos (destacados em verde).
            </p>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-gray-500">
              Para mais informações sobre os pacotes, consulte nossa página de serviços ou entre em contato.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalculatorGuide;
