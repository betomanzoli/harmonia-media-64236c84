
/**
 * Briefing intent handler for the chatbot
 */

const handleStartBriefingIntent = (req, res) => {
  const response = {
    fulfillmentText: "Ótimo! Vamos começar seu briefing para criar sua música personalizada.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Ótimo! Vamos começar a criar sua música personalizada. Você pode escolher como deseja prosseguir:"]
        }
      },
      {
        card: {
          title: "Formulário de Briefing",
          subtitle: "Método completo e detalhado",
          buttons: [
            {
              text: "Iniciar Briefing",
              postback: "https://harmonia.media/briefing"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Como prefere continuar?",
          quickReplies: [
            "Briefing guiado por chat",
            "Ver exemplos primeiro",
            "Falar com consultor"
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleStartBriefingIntent;
