
import { siteConfig } from '@/config/site';

/**
 * Helper functions to interact with the harmonIA chatbot
 */
export const openChatAssistant = () => {
  if (window.harmonIAChatbot) {
    if (typeof window.harmonIAChatbot.toggleChat === 'function') {
      window.harmonIAChatbot.toggleChat();
      
      setTimeout(() => {
        if (typeof window.harmonIAChatbot.addUserMessage === 'function' && 
            typeof window.harmonIAChatbot.addBotMessage === 'function') {
          window.harmonIAChatbot.addUserMessage("Preciso de ajuda para localizar meu pedido");
          
          setTimeout(() => {
            window.harmonIAChatbot.addBotMessage(
              "Posso ajudar você a localizar seu pedido. Você tem o código do pedido?",
              ["Sim, tenho o código", "Não tenho o código", "Preciso de outro tipo de ajuda"]
            );
          }, 500);
        }
      }, 300);
    }
  } else {
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá,%20preciso%20de%20ajuda%20para%20localizar%20meu%20pedido`, '_blank');
  }
};

// Add default export to fix import issue
const ChatbotHelper = { openChatAssistant };
export default ChatbotHelper;
