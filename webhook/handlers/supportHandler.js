
/**
 * Support and agent intent handler for the chatbot
 */

const handleTalkToAgentIntent = (req, res) => {
  const response = {
    fulfillmentText: "Entendo que você prefere falar com um atendente humano. Vou transferir você para nossa equipe de atendimento.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Sem problema! Vou conectar você com nossa equipe de atendimento humano para melhor assistência."]
        }
      },
      {
        card: {
          title: "Atendimento Personalizado",
          subtitle: "Fale com nossa equipe",
          buttons: [
            {
              text: "WhatsApp",
              postback: "https://wa.me/5511999999999"
            },
            {
              text: "E-mail",
              postback: "mailto:contato@harmonia.media"
            }
          ]
        }
      }
    ]
  };
  
  return response;
};

module.exports = handleTalkToAgentIntent;
