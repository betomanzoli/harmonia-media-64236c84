
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface OrderNotificationProps {
  orderId: string;
  previewLink: string | null;
  pendingAction: 'feedback' | null;
  onClose: () => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({ 
  orderId, 
  previewLink, 
  pendingAction,
  onClose 
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (previewLink) {
      navigate(previewLink);
    } else {
      // Fallback to preview by ID if direct link is not available
      navigate(`/preview/${orderId}`);
    }
  };
  
  return (
    <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200">
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-1 mr-2" />
        <div className="flex-grow">
          <AlertTitle className="text-amber-800">Ação pendente</AlertTitle>
          <AlertDescription className="text-amber-700">
            {pendingAction === 'feedback' ? (
              <span>
                Seu pedido <strong>{orderId}</strong> está aguardando seu feedback sobre as prévias enviadas.
              </span>
            ) : (
              <span>
                Existe uma ação pendente para seu pedido <strong>{orderId}</strong>.
              </span>
            )}
          </AlertDescription>
          
          <Button 
            onClick={handleAction}
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
          >
            Ver prévias
          </Button>
        </div>
        
        <button 
          onClick={onClose}
          className="text-amber-600 hover:text-amber-800"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
};

export default OrderNotification;
