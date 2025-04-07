
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from 'lucide-react';

const InvoicesGuide: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-harmonia-green hover:bg-harmonia-green/10 p-1 rounded-full">
          <HelpCircle className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Guia de Notas Fiscais</h3>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Visão Geral</h4>
            <p className="text-sm text-gray-400">
              Esta página permite gerenciar todo o ciclo de emissão de notas fiscais para os pedidos processados na plataforma.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Funcionalidades</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• <span className="font-medium text-foreground">Busca e Filtros:</span> Localize notas fiscais por cliente, pedido ou número da NF.</li>
              <li>• <span className="font-medium text-foreground">Ações em Lote:</span> Selecione múltiplas notas para gerar ou enviar em uma única operação.</li>
              <li>• <span className="font-medium text-foreground">Geração de NF:</span> Emita notas fiscais para pedidos pendentes.</li>
              <li>• <span className="font-medium text-foreground">Envio por Email:</span> Envie notas fiscais diretamente para os clientes.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Status das Notas</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• <span className="text-yellow-500">Pendente:</span> Aguardando geração de nota fiscal.</li>
              <li>• <span className="text-blue-500">Gerada:</span> Nota fiscal emitida, aguardando envio.</li>
              <li>• <span className="text-green-500">Enviada:</span> Nota fiscal enviada ao cliente.</li>
              <li>• <span className="text-red-500">Cancelada:</span> Nota fiscal cancelada.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-harmonia-green mb-1">Integrações</h4>
            <p className="text-sm text-gray-400">
              O sistema pode ser integrado com sistemas de emissão de NF-e como NFe.io, Nuvem Fiscal ou diretamente com sistemas governamentais.
            </p>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-gray-500">
              Para mais informações, consulte a documentação completa no manual administrativo.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InvoicesGuide;
