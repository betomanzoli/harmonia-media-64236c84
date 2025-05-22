
import React from 'react';
import Chatbot from './Chatbot';

const ChatbotButton: React.FC = () => {
  // Make sure the component is only rendered on the client side
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <Chatbot />;
};

export default ChatbotButton;
