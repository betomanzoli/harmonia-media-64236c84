
import React, { useState, useEffect } from 'react';
import type { ChatbotConfig } from './types';

const ChatbotButton: React.FC = () => {
  const [isChatbotLoaded, setIsChatbotLoaded] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Add event listener to know when the harmonIA chatbot is loaded
      window.addEventListener('harmonIAChatbotLoaded', () => {
        setIsChatbotLoaded(true);
      });

      // Load chatbot script
      const script = document.createElement('script');
      script.src = '/widget/chatbot.js';
      script.async = true;
      script.onload = () => {
        // Initialize the chatbot when script is loaded
        if (window.harmonIAChatbot) {
          const config: ChatbotConfig = {
            primaryColor: '#00c853',
            widgetTitle: 'Assistente harmonIA',
            position: 'right',
            welcomeMessage: 'Olá! Como posso ajudar hoje?'
          };
          
          window.harmonIAChatbot.init(config);
          
          // Dispatch event that chatbot is loaded
          window.dispatchEvent(new Event('harmonIAChatbotLoaded'));
        }
      };
      document.body.appendChild(script);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('harmonIAChatbotLoaded', () => {
          setIsChatbotLoaded(false);
        });
      }
    };
  }, []);

  // The chatbot UI is created by the script, so we don't need to render anything here
  return null;
};

export default ChatbotButton;
