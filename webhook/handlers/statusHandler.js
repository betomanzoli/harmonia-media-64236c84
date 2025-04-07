
/**
 * Order status intent handler for the chatbot
 */

const handleCheckStatusIntent = (req, res) => {
  const response = {
    fulfillmentText: "Para verificar o status do seu pedido, você pode acessar nossa página de acompanhamento.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Para verificar o status atual do seu projeto musical:"]
        }
      },
      {
        card: {
          title: "Acompanhar Pedido",
          subtitle: "Verificar progresso do projeto",
          buttons: [
            {
              text: "Verificar Status",
              postback: "https://harmonia.media/acompanhar-pedido"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Precisa de ajuda?",
          quickReplies: [
            "Perdi meu código",
            "Falar com suporte"
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleCheckStatusIntent;
