
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderDetailsProps } from './types';
import { 
  FileText, 
  Package, 
  CreditCard, 
  MessageSquare, 
  Music, 
  Headphones, 
  FileCheck, 
  Settings,
  Calendar,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
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

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <FileText className="w-5 h-5 text-harmonia-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Número do Pedido</h3>
              <p className="text-lg font-bold">{order.orderId}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <User className="w-5 h-5 text-harmonia-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
              <p className="text-lg font-bold">{order.clientName}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Package className="w-5 h-5 text-harmonia-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pacote</h3>
              <p className="text-lg font-bold">{order.packageType}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-3 ${order.status === 'Atrasado' ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertCircle className={`w-5 h-5 ${order.status === 'Atrasado' ? 'text-red-500' : 'text-harmonia-green'}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className={`text-lg font-bold ${order.status === 'Atrasado' ? 'text-red-500' : ''}`}>{order.status}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Calendar className="w-5 h-5 text-harmonia-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data do Pedido</h3>
              <p className="text-lg font-bold">{order.orderDate}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Clock className="w-5 h-5 text-harmonia-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Previsão de Entrega</h3>
              <p className="text-lg font-bold">{order.expectedDelivery}</p>
            </div>
          </div>
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
                    {isCurrent && (
                      <div className="mt-3">
                        {step.title === "Apresentação" && order.previewLink && (
                          <Link to={order.previewLink}>
                            <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                              Ver e Avaliar Prévias
                            </Button>
                          </Link>
                        )}
                        
                        {step.title === "Finalização" && order.previewLink && (
                          <Link to={order.previewLink}>
                            <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                              Aprovar Versão Final
                            </Button>
                          </Link>
                        )}
                        
                        {(step.title !== "Apresentação" && step.title !== "Finalização") && (
                          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-700 text-sm">
                            <div className="flex items-center gap-2">
                              <InfoIcon className="w-4 h-4 text-blue-500" />
                              <span>Nossa equipe está trabalhando nesta fase. Você receberá uma notificação quando houver atualizações.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isCompleted && step.title === "Entrega" && (
                      <div className="mt-3">
                        <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800">
                          Baixar Arquivos Finais
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para ícone de Informação
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default OrderDetails;
