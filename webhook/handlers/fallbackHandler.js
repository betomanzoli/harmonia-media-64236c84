
/**
 * Fallback intent handler for the chatbot
 */

const handleFallbackIntent = (req, res) => {
  const response = {
    fulfillmentText: "Desculpe, não entendi completamente. Como posso ajudar com sua música personalizada?",
    fulfillmentMessages: [
      {
        text: {
          text: ["Desculpe, não entendi completamente. Posso ajudar você com alguma destas opções:"]
        }
      },
      {
        quickReplies: {
          title: "Como posso ajudar?",
          quickReplies: [
            "Ver pacotes",
            "Ouvir amostras",
            "Iniciar projeto",
            "Falar com atendente"
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleFallbackIntent;
