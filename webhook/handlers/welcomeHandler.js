
/**
 * Welcome intent handler for the chatbot
 */

const handleWelcomeIntent = (req, res) => {
  const response = {
    fulfillmentText: "Olá! Sou o assistente virtual da harmonIA. Como posso ajudar com sua música personalizada hoje?",
    fulfillmentMessages: [
      {
        text: {
          text: ["Olá! Sou o assistente virtual da harmonIA. Como posso ajudar com sua música personalizada hoje?"]
        }
      },
      {
        quickReplies: {
          title: "Escolha uma opção:",
          quickReplies: [
            "Ver pacotes",
            "Ouvir amostras",
            "Iniciar briefing"
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleWelcomeIntent;
