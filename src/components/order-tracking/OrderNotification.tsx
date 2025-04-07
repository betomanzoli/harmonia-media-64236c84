
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderNotificationProps {
  orderId: string;
  hasPreview: boolean;
  previewLink: string | null;
  pendingAction: 'feedback' | null;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({ 
  orderId, 
  hasPreview, 
  previewLink, 
  pendingAction 
}) => {
  return (
    <Card className={`mb-8 p-6 border-l-4 ${pendingAction ? 'border-l-amber-500' : 'border-l-harmonia-green'}`}>
      <div className="flex items-start gap-3">
        {pendingAction ? (
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
        ) : (
          <Clock className="w-6 h-6 text-harmonia-green flex-shrink-0 mt-1" />
        )}
        
        <div className="flex-grow">
          <h3 className="font-bold text-lg mb-2">
            {pendingAction 
              ? "Ação necessária: Sua avaliação é importante" 
              : "Atualização do seu projeto musical"}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {pendingAction 
              ? "Temos novidades em seu projeto! Prévias musicais estão disponíveis para sua avaliação. Por favor, ouça cada versão e compartilhe sua opinião para que possamos ajustar conforme suas preferências."
              : "Fizemos progresso em sua música personalizada! Confira as atualizações e próximos passos abaixo."}
          </p>
          
          {hasPreview && previewLink && (
            <Link to={previewLink}>
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                {pendingAction 
                  ? "Avaliar prévias musicais" 
                  : "Ver prévias disponíveis"}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderNotification;
