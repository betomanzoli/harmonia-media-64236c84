
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    // Here you would typically open your chatbot UI
    console.log('Chatbot toggled:', !isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={toggleChatbot}
        className="w-12 h-12 rounded-full bg-harmonia-green hover:bg-harmonia-green/80 shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default ChatbotButton;
