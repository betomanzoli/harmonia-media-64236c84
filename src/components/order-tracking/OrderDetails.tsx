
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderData } from './types';
import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mapeamento de strings de ícones para componentes de ícones reais
const iconComponents: Record<string, React.ElementType> = {
  'FileText': FileText,
  'Package': Package,
  'CreditCard': CreditCard,
  'MessageSquare': MessageSquare,
  'Music': Music,
  'Headphones': Headphones,
  'FileCheck': FileCheck,
  'Settings': Settings
};

interface OrderDetailsProps {
  order: OrderData;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Número do Pedido</h3>
          <p className="text-lg font-bold">{order.orderId}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
          <p className="text-lg font-bold">{order.clientName}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Pacote</h3>
          <p className="text-lg font-bold">{order.packageType}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="text-lg font-bold">{order.status}</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Acompanhamento do Processo</h2>
        <div className="space-y-8">
          {order.progress.map((step, index) => {
            // Determinar o ícone a ser usado
            const IconComponent = iconComponents[step.icon] || Music;
            
            // Definir as cores e estilos com base no status
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            
            const circleColorClasses = cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              {
                "bg-harmonia-green text-white": isCompleted,
                "bg-amber-500 text-white": isCurrent,
                "bg-gray-200 text-gray-500": !isCompleted && !isCurrent
              }
            );
            
            const lineClasses = cn(
              "absolute h-full w-0.5 left-5 -ml-px top-10 transform",
              {
                "bg-harmonia-green": isCompleted,
                "bg-gray-200": !isCompleted
              }
            );
            
            return (
              <div key={step.step} className="relative">
                {index < order.progress.length - 1 && (
                  <div className={lineClasses}></div>
                )}
                <div className="flex items-start">
                  <div className={circleColorClasses}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={cn(
                        "font-medium",
                        {
                          "text-harmonia-green": isCompleted,
                          "text-amber-500": isCurrent,
                          "text-gray-500": !isCompleted && !isCurrent
                        }
                      )}>
                        {step.title}
                      </h3>
                      {step.date && (
                        <span className="text-sm text-gray-500">{step.date}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                    
                    {/* Botões de ação baseados no status */}
                    {isCurrent && step.title === "Apresentação" && order.previewLink && (
                      <div className="mt-2">
                        <Link to={order.previewLink}>
                          <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                            Ver Prévias
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-center text-gray-600">
          Previsão de entrega final: <span className="font-medium">{order.expectedDelivery}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
