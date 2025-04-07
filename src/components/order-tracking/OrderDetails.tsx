
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { OrderData } from './types';

type OrderDetailsProps = OrderData;

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  clientName,
  packageType,
  orderDate,
  currentStep,
  status,
  expectedDelivery,
  progress,
  previewLink
}) => {
  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluído':
        return 'bg-green-500';
      case 'em andamento':
        return 'bg-blue-500';
      case 'aguardando aprovação':
        return 'bg-yellow-500';
      case 'esperando feedback':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">{orderId}</h2>
          <p className="text-gray-500">Cliente: {clientName}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Badge variant="outline" className="font-normal">{packageType}</Badge>
          <Badge variant="outline" className="font-normal">Pedido em: {orderDate}</Badge>
          <Badge className={`${getStatusColor(status)} text-white`}>{status}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Clock className="text-harmonia-green h-5 w-5" />
        <span>
          Previsão de entrega: <span className="font-bold">{expectedDelivery}</span>
        </span>
      </div>

      {/* Timeline de progresso */}
      <div className="space-y-6 mb-8">
        {progress.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.status === 'completed' 
                  ? 'bg-harmonia-green text-white' 
                  : item.status === 'current'
                    ? 'bg-harmonia-green/20 text-harmonia-green border-2 border-harmonia-green'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              {index < progress.length - 1 && (
                <div className={`w-0.5 h-full my-1 ${
                  item.status === 'completed' ? 'bg-harmonia-green' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-medium ${
                    item.status === 'current' ? 'text-harmonia-green' : ''
                  }`}>{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                {item.date && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações disponíveis */}
      <div className="flex flex-wrap gap-3 justify-end">
        {previewLink && (
          <Button 
            variant="outline" 
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to={previewLink} className="flex items-center gap-2">
              Ouvir Prévias
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={() => window.open('https://wa.me/5511920585072?text=Olá,%20gostaria%20de%20obter%20mais%20informações%20sobre%20meu%20pedido%20' + orderId, '_blank')}
        >
          Entrar em Contato
        </Button>
      </div>
    </Card>
  );
};

export default OrderDetails;
