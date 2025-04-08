
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface OrderNotFoundProps {
  onChatAssistant: () => void;
}

const OrderNotFound: React.FC<OrderNotFoundProps> = ({ onChatAssistant }) => {
  return (
    <div className="text-center py-10">
      <h3 className="text-xl font-semibold mb-4">Não encontrou seu pedido?</h3>
      <p className="text-gray-400 mb-6 max-w-lg mx-auto">
        Se você está tendo dificuldades para localizar seu pedido ou precisa de assistência adicional,
        entre em contato com nossa equipe de suporte via WhatsApp.
      </p>
      <Button 
        className="bg-green-600 hover:bg-green-700 flex items-center"
        onClick={onChatAssistant}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Falar com o Suporte via WhatsApp
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default OrderNotFound;
