
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import { openChatAssistant } from '@/components/order-tracking/ChatbotHelper';

// Componente de botão de ajuda do chatbot
const ChatbotHelper: React.FC = () => {
  return (
    <div className="text-center mt-6">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border-gray-300"
        onClick={() => openChatAssistant()}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Precisa de ajuda? Fale com nossa assistente</span>
      </Button>
    </div>
  );
};

export default ChatbotHelper;
