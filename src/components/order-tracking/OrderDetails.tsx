
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Package, ArrowRight } from 'lucide-react';
import { OrderDetailsProps, OrderProgressStep } from './types';
import { useNavigate } from 'react-router-dom';

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const navigate = useNavigate();

  const handleViewPreview = () => {
    if (order.previewLink) {
      navigate(order.previewLink);
    } else {
      navigate(`/preview/${order.orderId}`);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    // Determine badge color based on status
    if (status.toLowerCase().includes('aguardando')) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    if (status.toLowerCase().includes('andamento')) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (status.toLowerCase().includes('concluído')) return "bg-green-100 text-green-800 hover:bg-green-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  const getStepStatusClass = (step: OrderProgressStep) => {
    switch (step.status) {
      case 'completed':
        return "border-green-500 bg-green-50 text-green-700";
      case 'current':
        return "border-blue-500 bg-blue-50 text-blue-700";
      case 'pending':
        return "border-gray-300 bg-gray-50 text-gray-500";
      default:
        return "border-gray-300 bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle className="text-xl font-bold">Pedido {order.orderId}</CardTitle>
              <p className="text-gray-500 mt-1">Cliente: {order.clientName}</p>
            </div>
            <Badge className={getStatusBadgeColor(order.status)} variant="secondary">
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Pacote</p>
                <p className="font-medium">{order.packageType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Data do Pedido</p>
                <p className="font-medium">{order.orderDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Previsão de Entrega</p>
                <p className="font-medium">{order.expectedDelivery}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Progresso do Pedido</h3>
            <div className="space-y-4">
              {order.progress.map((step) => (
                <div key={step.step} className={`p-3 border-l-4 rounded ${getStepStatusClass(step)}`}>
                  <div className="flex justify-between">
                    <h4 className="font-medium">
                      {step.step}. {step.title}
                    </h4>
                    {step.date && <span className="text-sm">{step.date}</span>}
                  </div>
                  <p className="text-sm mt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {order.hasPreview && (
            <div className="mt-6 pt-4 border-t">
              <Button 
                onClick={handleViewPreview}
                className="w-full bg-harmonia-green hover:bg-harmonia-green/90 flex items-center justify-center"
              >
                Ver Prévias da Música
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
