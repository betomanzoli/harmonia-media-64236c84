
import React from 'react';
import { BellRing, Bell, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

interface OrderNotificationProps {
  orderId: string;
  hasPreview: boolean;
  previewLink?: string;
  pendingAction?: 'feedback' | 'approval' | null;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({
  orderId,
  hasPreview,
  previewLink,
  pendingAction
}) => {
  const navigate = useNavigate();
  
  const handleDismiss = () => {
    toast({
      title: "Notificação dispensada",
      description: "Você pode ver outras atualizações na página de acompanhamento do pedido."
    });
  };
  
  const getNotificationMessage = () => {
    if (pendingAction === 'feedback') {
      return {
        title: "Feedback Necessário",
        description: "Novas prévias musicais estão disponíveis para seu feedback."
      };
    } else if (pendingAction === 'approval') {
      return {
        title: "Aprovação Pendente",
        description: "A versão revisada está disponível para sua aprovação."
      };
    } else if (hasPreview) {
      return {
        title: "Nova Prévia Disponível",
        description: "Uma nova prévia musical foi adicionada ao seu projeto."
      };
    }
    
    return {
      title: "Atualização do Pedido",
      description: "Seu pedido foi atualizado com novas informações."
    };
  };
  
  const notification = getNotificationMessage();
  
  return (
    <Card className="p-4 mb-6 border-l-4 border-l-harmonia-green animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-harmonia-green/20 p-2 rounded-full">
          <BellRing className="h-5 w-5 text-harmonia-green" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-harmonia-green">{notification.title}</h3>
          <p className="text-sm text-gray-400 mb-3">{notification.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {hasPreview && previewLink && (
              <Button 
                size="sm" 
                className="bg-harmonia-green hover:bg-harmonia-green/90"
                onClick={() => navigate(previewLink)}
              >
                {pendingAction ? 'Responder Agora' : 'Ver Prévia'}
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3 mr-1" />
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderNotification;
