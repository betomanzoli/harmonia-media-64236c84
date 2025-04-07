
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from 'lucide-react';

interface OrderNotFoundProps {
  onChatAssistant: () => void;
}

const OrderNotFound: React.FC<OrderNotFoundProps> = ({ onChatAssistant }) => {
  return (
    <div className="text-center py-10">
      <h3 className="text-xl font-semibold mb-4">Não encontrou seu pedido?</h3>
      <p className="text-gray-400 mb-6 max-w-lg mx-auto">
        Se você está tendo dificuldades para localizar seu pedido ou precisa de assistência adicional,
        entre em contato com nossa equipe de suporte.
      </p>
      <Button 
        className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center"
        onClick={onChatAssistant}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Falar com o Assistente
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default OrderNotFound;
