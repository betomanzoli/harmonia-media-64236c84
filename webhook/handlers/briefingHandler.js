
/**
 * Briefing intent handler for the chatbot
 */

const handleStartBriefingIntent = (req, res) => {
  const response = {
    fulfillmentText: "Para criar sua música personalizada, primeiro você precisa escolher um de nossos pacotes.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Para criar sua música personalizada, primeiro você precisa escolher um de nossos pacotes. Após a confirmação do pagamento, você terá acesso ao formulário de briefing."]
        }
      },
      {
        card: {
          title: "Pacotes de Música Personalizada",
          subtitle: "Escolha o pacote ideal para sua necessidade",
          buttons: [
            {
              text: "Ver Pacotes",
              postback: "https://harmonia.media/pacotes"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Como prefere continuar?",
          quickReplies: [
            "Detalhes dos pacotes",
            "Ver exemplos",
            "Falar com consultor"
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleStartBriefingIntent;
